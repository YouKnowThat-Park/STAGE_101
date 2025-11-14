from fastapi import APIRouter, Depends, HTTPException, Request, Query
from sqlalchemy.orm import Session, joinedload
from typing import List
from uuid import UUID
from sqlalchemy import text
from datetime import date

from server.database import get_db
from server.models.reservation import Reservation
from server.models.user import User
from server.schemas.reservation import ReservationResponse, ReservationCreate
from server.models.payment import Payment
from server.security import verify_access_token

router = APIRouter(prefix="/reservations", tags=["Reservations"])

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
    
    # Theater 관계 join
    reservations = (
        db.query(Reservation)
        .options(joinedload(Reservation.theater))
        .filter(Reservation.user_id == user.id)
        .all()
    )
    return reservations

@router.post("/create", response_model=List[ReservationResponse])
def create_reservation(payload: ReservationCreate, db: Session = Depends(get_db)):
    """
    좌석 예약 생성 엔드포인트.
    - 먼저 이미 'confirmed'된 좌석이 있는지 체크
    - 문제 없으면 DB 함수 process_reservation 호출
    - 그 결과로 생성/업데이트 된 예약들을 다시 조회해서 반환
    """

    # 1) 이미 확정된 좌석 있는지 체크 (배열 overlap 사용)
    existing_confirmed = (
        db.query(Reservation)
        .filter(
            Reservation.theater_id == payload.theater_id,
            Reservation.show_time == payload.show_time,
            # seat_number: ARRAY(Text), payload.seat_number: List[str]
            # -> 배열 overlap 연산자 &&
            Reservation.seat_number.op("&&")(payload.seat_number),
            Reservation.status == "confirmed",
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
                    :theater_id,
                    :user_id,
                    :total_price
                );
                """
            ),
            {
                "seat_numbers": payload.seat_number,  # List[str] -> TEXT[] 로 매핑
                "theater_id": str(payload.theater_id),
                "user_id": str(payload.user_id),
                "total_price": payload.total_price,
            },
        )
        db.commit()
    except Exception:
        db.rollback()
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

    return reservations

@router.get("/occupied", response_model=List[str])
def get_occupied_seats(
    theater_id: UUID = Query(...),
    viewed_at: date = Query(...),
    show_time: str = Query(...),
    db: Session = Depends(get_db),    
):
    """ 상영관 + 날짜 + 상영시간 기준으로 
    이미 사용중인 좌석 목록을 반환 (pending + confirmed)
    """
    reservation = (
        db.query(Reservation).filter(
            Reservation.theater_id == theater_id,
            Reservation.viewed_at == viewed_at,
            Reservation.show_time == show_time,
            Reservation.status.in_(["pending", "confirmed"]),
        ).all()
    )
    
    seats: set[str] = set()
    for r in reservation:
        for s in r.seat_number:
            seats.add(s)

    return list(seats)

@router.delete("/delete/{reservation_id}")
def cancel_reservation(reservation_id: UUID, db: Session = Depends(get_db)):
    reservation = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="예약을 찾을 수 없습니다.")
    
    payment = db.query(Payment).filter(Payment.reservation_id == reservation_id).first()
    if payment:
        db.delete(payment)

    db.delete(reservation)
    db.commit()

    return {"message": "예약이 취소 되었습니다."}

