from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    Query,
    WebSocket,
    WebSocketDisconnect,
)
from sqlalchemy.orm import Session, joinedload
from typing import List
from uuid import UUID
from sqlalchemy import text
from datetime import date, datetime
import json

from server.database import get_db
from server.models.reservation import Reservation
from server.models.user import User
from server.models.theater import Theater
from server.schemas.reservation import ReservationResponse, ReservationCreate, CheckoutSummaryResponse
from server.models.payment import Payment
from server.security import verify_access_token
from server.websocket_manager import manager
from server.routes.user.public import get_current_user
router = APIRouter(prefix="/reservations", tags=["Reservations"])


# 공통 유틸: 현재 예약된 좌석 목록
def get_reserved_seats(
    db: Session,
    theater_id: UUID,
    viewed_at: date,
    show_time: str,
) -> list[str]:
    """
    상영관 + 날짜 + 상영시간 기준으로
    status in ('pending', 'confirmed') 인 모든 좌석을 flatten 해서 반환
    """
    reservations = (
        db.query(Reservation)
        .filter(
            Reservation.theater_id == theater_id,
            Reservation.viewed_at == viewed_at,
            Reservation.show_time == show_time,
            Reservation.status.in_(["pending", "confirmed"]),
        )
        .all()
    )

    seats: set[str] = set()
    for r in reservations:
        for s in r.seat_number:  # ARRAY(Text)
            seats.add(s)

    return list(seats)


# 공통 유틸: WebSocket 브로드캐스트
async def broadcast_reserved_seats(
    db: Session,
    theater_id: UUID,
    viewed_at_raw,
    show_time: str,
) -> None:
    """
    reservations 테이블 기준으로 현재 좌석 상태 계산해서
    해당 room의 모든 클라이언트에게 push.
    """
    if isinstance(viewed_at_raw, datetime):
        viewed_at = viewed_at_raw.date()
    else:
        # 이미 date 타입이라고 가정
        viewed_at = viewed_at_raw

    seats = get_reserved_seats(
        db=db,
        theater_id=theater_id,
        viewed_at=viewed_at,
        show_time=show_time,
    )

    room_key = f"{theater_id}:{viewed_at}:{show_time}"
    message = json.dumps({"type": "reserved_seats", "seats": seats})
    await manager.broadcast(room_key, message)


# WebSocket 엔드포인트
@router.websocket("/ws")
async def reservations_ws(
    websocket: WebSocket,
    theater_id: str,
    viewed_at: str,
    show_time: str,
    db: Session = Depends(get_db),
) -> None:
    """
    클라이언트 접속 예:
      ws://localhost:8000/reservations/ws?theater_id=...&viewed_at=2025-11-15&show_time=19:00

    - 접속 시: 현재 좌석 상태 한 번 보내줌
    - 이후: create/cancel 시 broadcast_reserved_seats 로 업데이트 push
    """
    theater_uuid = UUID(theater_id)
    viewed_date = date.fromisoformat(viewed_at)
    room_key = f"{theater_id}:{viewed_at}:{show_time}"

    await manager.connect(room_key, websocket)

    # 최초 접속 시 현재 좌석 상태
    seats = get_reserved_seats(
        db=db,
        theater_id=theater_uuid,
        viewed_at=viewed_date,
        show_time=show_time,
    )
    initial_msg = json.dumps({"type": "reserved_seats", "seats": seats})
    await websocket.send_text(initial_msg)

    try:
        # 클라이언트에서 오는 메시지는 사용 안 하고, 연결 유지 용도
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(room_key, websocket)



@router.get("/", response_model=List[ReservationResponse])
def get_all_reservations(db: Session = Depends(get_db)):
    reservations = db.query(Reservation).options(joinedload(Reservation.theater)).all()
    return reservations


@router.get("/me", response_model=List[ReservationResponse])
def get_my_reservations(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("__stage__")
    if not token:
        raise HTTPException(status_code=401, detail="토큰이 없습니다.")

    payload = verify_access_token(token)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="토큰 정보가 올바르지 않습니다.")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="유저를 찾을 수 없습니다.")

    reservations = (
        db.query(Reservation)
        .options(joinedload(Reservation.theater), joinedload(Reservation.qr_session))
        .filter(Reservation.user_id == user.id)
        .all()
    )
    return reservations


@router.post("/create", response_model=List[ReservationResponse])
async def create_reservation(payload: ReservationCreate, db: Session = Depends(get_db)):
    """
    좌석 예약 생성 엔드포인트.
    - 먼저 이미 'confirmed'된 좌석이 있는지 체크
    - 문제 없으면 DB 함수 process_reservation 호출
    - 그 결과로 생성/업데이트 된 예약들을 다시 조회해서 반환
    - 그리고 WebSocket 으로 새 좌석 상태 브로드캐스트
    """

    # 1) 이미 확정된 좌석 있는지 체크 (배열 overlap 사용)
    existing_confirmed = (
        db.query(Reservation)
        .filter(
            Reservation.theater_id == payload.theater_id,
            Reservation.viewed_at == payload.viewed_at,
            Reservation.status.in_(["pending", "confirmed"]),
            Reservation.show_time == payload.show_time,
            Reservation.seat_number.op("&&")(payload.seat_number),
            Reservation.status == "pending",
        )
        .first()
    )
    if existing_confirmed:
        raise HTTPException(status_code=400, detail="이미 확정된 좌석이 포함되어 있습니다.")

    # 2) DB 함수 호출로 예약 처리
    try:
        db.execute(
            text(
                """
                SELECT process_reservation(
                    :seat_numbers,
                    CAST(:theater_id AS uuid),
                    CAST(:user_id AS uuid),
                    CAST(:total_price AS integer),
                    CAST(:viewed_at AS date),
                    CAST(:show_time AS text)
                );
                """
            ),
            {
                "seat_numbers": payload.seat_number,
                "theater_id": str(payload.theater_id),
                "user_id": str(payload.user_id),
                "total_price": payload.total_price,
                "viewed_at": payload.viewed_at,
                "show_time": payload.show_time,
            },
        )
        db.commit()
    except Exception as e:
        db.rollback()
        print("🔥 예약 처리 중 DB 예외 발생:", repr(e))
        raise HTTPException(status_code=500, detail="예약 처리 중 오류가 발생했습니다.")

    # 3) 방금 처리된 예약 목록 다시 조회해서 반환
    reservations = (
        db.query(Reservation)
        .options(joinedload(Reservation.theater))
        .filter(
            Reservation.user_id == payload.user_id,
            Reservation.theater_id == payload.theater_id,
            Reservation.show_time == payload.show_time,
            Reservation.seat_number.op("&&")(payload.seat_number),
        )
        .all()
    )

    # 4) WebSocket으로 좌석 상태 브로드캐스트
    await broadcast_reserved_seats(
        db=db,
        theater_id=payload.theater_id,
        viewed_at_raw=payload.viewed_at,
        show_time=payload.show_time,
    )

    return reservations


@router.get("/occupied", response_model=List[str])
def get_occupied_seats(
    theater_id: UUID = Query(...),
    viewed_at: date = Query(...),
    show_time: str = Query(...),
    db: Session = Depends(get_db),
):
    """
    상영관 + 날짜 + 상영시간 기준으로
    이미 사용중인 좌석 목록을 반환 (pending + confirmed)
    -> 프론트 첫 로딩/디버그 등에 사용
    """
    return get_reserved_seats(
        db=db,
        theater_id=theater_id,
        viewed_at=viewed_at,
        show_time=show_time,
    )


@router.delete("/delete/{reservation_id}")
async def cancel_reservation(reservation_id: UUID, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="예약을 찾을 수 없습니다.")

    # 브로드캐스트에 필요한 정보는 미리 빼놓기
    theater_id = reservation.theater_id
    viewed_at = reservation.viewed_at
    show_time = reservation.show_time

    payment = db.query(Payment).filter(Payment.reservation_id == reservation_id).first()
    if payment:
        db.delete(payment)

    db.delete(reservation)
    db.commit()

    # viewed_at / show_time 이 없으면 브로드캐스트 불가
    if viewed_at and show_time:
        await broadcast_reserved_seats(
            db=db,
            theater_id=theater_id,
            viewed_at_raw=viewed_at,
            show_time=show_time,
        )

    return {"message": "예약이 취소 되었습니다."}

@router.get("/checkout-summary", response_model=CheckoutSummaryResponse)
def get_checkout_summary(
    theater_id: UUID = Query(..., description="극장 ID"),
    seats: str =Query(..., description="콤마로 구분된 좌석 목록"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    seat_list: List[str] = [s.strip() for s in seats.split(",") if s.strip()]

    if not seat_list:
        raise HTTPException(status_code=400, detail="좌석 목록이 비어 있습니다.")
    
    user_id = current_user["id"]
    
    query = ( db.query(Reservation).join(Theater, Theater.id == Reservation.theater_id).filter(Reservation.user_id == user_id,
            Reservation.theater_id == theater_id,
            Reservation.status == "pending",
            Reservation.seat_number.op("&&")(seat_list),))
    
    reservations: List[Reservation] = query.all()

    if not reservations:
        raise HTTPException(status_code=404, detail="해당 조건의 예약을 찾을 수 없습니다.")
    
    total_price = sum(r.total_price for r in reservations)

    return {"reservations":reservations, "total_price":total_price}