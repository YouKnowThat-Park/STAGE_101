from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.payment import Payment
from server.models.reservation import Reservation
from server.schemas.payment import PaymentCreate, PaymentResponse
from uuid import uuid4, UUID
from typing import List
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/payment", tags=["Payment"])

@router.post("/create", response_model=PaymentResponse)
def create_payment(payload: PaymentCreate, db: Session = Depends(get_db)):
    # 1. 이미 같은 payment_key로 결제 완료된 경우 방지
    existing = db.query(Payment).filter(Payment.payment_key == payload.payment_key).first()
    if existing:
        raise HTTPException(status_code=400, detail="이미 완료된 결제입니다.")

    # 2. 해당 예약이 존재하는지 확인
    reservation = db.query(Reservation).filter(Reservation.id == payload.reservation_id).first()
    if not reservation:
        raise HTTPException(status_code=404, detail="예약을 찾을 수 없습니다.")

    # 3. 결제 row 생성 (status는 서버에서 강제)
    payment = Payment(
        id=uuid4(),
        user_id=payload.user_id,
        reservation_id=payload.reservation_id,
        amount=payload.amount,
        point_earned=payload.point_earned,
        payment_key=payload.payment_key,
        payment_method=payload.payment_method,
        status="paid",  # ✅ DB 제약에 맞게 'paid'로 고정
    )

    try:
        db.add(payment)

        # 4. 예약 상태를 'confirmed'로 변경
        reservation.status = "confirmed"

        db.commit()
        db.refresh(payment)
    except IntegrityError:
        db.rollback()
        # unique_paid_reservation (예약당 paid 1개) 에 위배되면 여기로 옴
        raise HTTPException(status_code=400, detail="이미 이 예약에 대한 결제가 존재합니다.")
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="결제 처리 중 오류가 발생했습니다.")

    return payment


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

    return payments