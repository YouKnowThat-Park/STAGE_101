from datetime import datetime
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import secrets

from server.database import get_db
from server.models.qr_session import QrSession
from server.models.reservation import Reservation
from server.models.theater import Theater
from server.schemas.qr_session import QrSessionCreate, QrSessionResponse, QrDetailResponse
from .user import get_current_user

router = APIRouter(prefix="/qr-sessions", tags=["QR Sessions"])


@router.post("/", response_model=QrSessionResponse)
def create_qr_session(
    payload: QrSessionCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    결제 완료 후 QR 세션 생성.
    - 같은 예약에 대해 이미 QR 세션이 있으면 그걸 그대로 반환 (만료 개념 없음).
    """
    user_id = UUID(str(current_user["id"]))

    if payload.user_id != user_id:
        raise HTTPException(status_code=403, detail="다른 사용자의 QR 세션은 생성할 수 없습니다.")

    # 예약 존재 + 소유자 확인
    reservation = (
        db.query(Reservation)
        .filter(Reservation.id == payload.reservation_id)
        .first()
    )
    if not reservation:
        raise HTTPException(status_code=404, detail="예약을 찾을 수 없습니다.")
    if reservation.user_id != payload.user_id:
        raise HTTPException(status_code=403, detail="해당 예약의 소유자가 아닙니다.")

    # 이미 존재하는 QR 세션이 있으면 재사용 (최신 것 하나)
    existing = (
        db.query(QrSession)
        .filter(QrSession.reservation_id == payload.reservation_id)
        .order_by(QrSession.created_at.desc())
        .first()
    )

    if existing:
        return existing

    now = datetime.utcnow()
    qr_token = secrets.token_urlsafe(32)

    qr = QrSession(
        user_id=payload.user_id,
        theater_id=payload.theater_id,
        reservation_id=payload.reservation_id,
        qr_token=qr_token,
        created_at=now,
        expires_at=None,  # 일단 사용 보류
    )

    db.add(qr)
    db.commit()
    db.refresh(qr)

    return qr


@router.get("/by-reservation/{reservation_id}", response_model=QrDetailResponse)
def get_qr_by_reservation(
    reservation_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """
    마이페이지 / QR 페이지에서 예약 기준으로 QR + 공연 정보 조회.
    - 현재 로그인 유저 소유의 예약만 조회 가능.
    - 가장 최근 QR 세션을 기준으로:
      - qr_token
      - theater_id, theater_name, main_img
      - viewed_at, show_time
      를 한 번에 내려준다.
    """
    user_id = UUID(str(current_user["id"]))

    row = (
        db.query(QrSession, Reservation, Theater)
        .join(Reservation, Reservation.id == QrSession.reservation_id)
        .join(Theater, Theater.id == QrSession.theater_id)
        .filter(
            QrSession.reservation_id == reservation_id,
            QrSession.user_id == user_id,
        )
        .order_by(QrSession.created_at.desc())
        .first()
    )

    if not row:
        raise HTTPException(status_code=404, detail="QR 세션을 찾을 수 없습니다.")

    qr, reservation, theater = row

    return QrDetailResponse(
        qr_token=qr.qr_token,
        theater_id=theater.id,
        theater_name=theater.name,
        main_img=theater.main_img,
        viewed_at=reservation.viewed_at,
        show_time=reservation.show_time,
    )