from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.payment import Payment
from server.models.reservation import Reservation
from server.schemas.payment import PaymentCreate, PaymentResponse
from server.models.qr_session import QrSession
from uuid import uuid4, UUID
from typing import List
from sqlalchemy.exc import IntegrityError
from datetime import datetime
import secrets

router = APIRouter(prefix="/payment", tags=["Payment"])

@router.post("/create", response_model=PaymentResponse)
def create_payment(payload: PaymentCreate, db: Session = Depends(get_db)):
    """
    Toss에서 결제 완료 후 호출되는 결제 생성 + QR 생성 엔드포인트
    """
    # 1. 예약 기준 중복 결제 방지
    existing = (
        db.query(Payment)
        .filter(
            Payment.reservation_id == payload.reservation_id,
            Payment.status == "paid",
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="이미 이 예약에 대한 결제가 존재합니다.")

    # 2. 예약 존재 + 소유자 확인
    reservation = db.query(Reservation).filter(Reservation.id == payload.reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="예약을 찾을 수 없습니다.")

    if str(reservation.user_id) != str(payload.user_id):
        raise HTTPException(status_code=403, detail="해당 예약의 소유자가 아닙니다.")

    # 3. DB용 payment_key (내부 UUID) 생성
    internal_payment_key = uuid4()

    payment = Payment(
        id=uuid4(),
        user_id=payload.user_id,
        reservation_id=payload.reservation_id,
        amount=payload.amount,
        point_earned=payload.point_earned or 0,
        payment_key=internal_payment_key,           # 🔥 DB 컬럼: UUID
        payment_method=payload.payment_method,
        status="paid",
    )

    try:
        db.add(payment)

        reservation.status = "confirmed"

        qr = QrSession(
            id=uuid4(),
            user_id=reservation.user_id,
            theater_id=reservation.theater_id,
            reservation_id=reservation.id,
            qr_token=secrets.token_urlsafe(32),
            created_at=datetime.utcnow(),
            expires_at=None,
        )
        db.add(qr)

        db.commit()
        db.refresh(payment)

        return PaymentResponse(
    id=payment.id,
    created_at=payment.created_at,
    user_id=payment.user_id,
    reservation_id=payment.reservation_id,
    amount=payment.amount,
    point_earned=payment.point_earned,
    payment_key=str(payment.payment_key),
    payment_method=payment.payment_method,
    status=payment.status
)

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="예약에 대한 결제가 존재합니다.")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="결제 처리 중 오류가 발생했습니다.")

@router.get("/{user_id}", response_model=List[PaymentResponse])
def get_payments_by_user(user_id: UUID, db:Session = Depends(get_db)):
    payments = (
        db.query(Payment)
        .filter(Payment.user_id == user_id)
        .order_by(Payment.created_at.desc())
        .all()
    )

    if not payments:
        raise HTTPException(status_code=404, detail="해당 유저의 결제 내역이 없습니다.")

    return [
        PaymentResponse(
            id=p.id,
            created_at=p.created_at,
            user_id=p.user_id,
            reservation_id=p.reservation_id,
            amount=p.amount,
            point_earned=p.point_earned,
            payment_key=str(p.payment_key),  # ❗ 핵심
            payment_method=p.payment_method,
            status=p.status
        )
        for p in payments
    ]