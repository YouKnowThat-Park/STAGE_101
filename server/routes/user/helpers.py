from fastapi import HTTPException
from datetime import datetime, timezone
import os
import uuid
import random
import string

import httpx
from sqlalchemy.orm import Session
from sqlalchemy import text

from server.models.user import User
from server.models.reservation import Reservation
from server.models.payment import Payment


# 트리거가 사용하던 극장 ID들
THEATER_IDS = [
    uuid.UUID("f32817ed-9564-4654-a670-3b4d2cb1fa12"),
    uuid.UUID("32d05b50-b486-4bc7-b8ab-dc81aaa9b1aa"),
    uuid.UUID("6301fab5-95e6-443c-bbbb-609bc21ac5a6"),
]

KAKAO_ADMIN_KEY = os.getenv("KAKAO_ADMIN_KEY")


def generate_unique_seat(db: Session, theater_id: uuid.UUID) -> str:
    """
    해당 극장에서 사용되지 않은 좌석코드 생성 (A-Z + 1..50)
    """
    for _ in range(500):
        letter = random.choice(string.ascii_uppercase)  # A-Z
        number = random.randint(1, 50)                  # 1..50
        seat = f"{letter}{number}"

        exists = (
            db.query(Reservation)
            .filter(
                Reservation.theater_id == theater_id,
                text(f"'{seat}' = ANY(seat_number)"),
            )
            .first()
        )

        if not exists:
            return seat

    raise RuntimeError("예약 좌석 생성 중 충돌이 발생했습니다.")


def create_default_data_for_new_user(db: Session, new_user: User) -> None:
    """
    회원가입 시 기본 예약/결제 생성 로직 (일반/소셜 모두에서 재사용)
    """
    now = datetime.now(timezone.utc)

    for theater_id in THEATER_IDS:
        seat = generate_unique_seat(db, theater_id)

        reservation = Reservation(
            id=uuid.uuid4(),
            user_id=new_user.id,
            theater_id=theater_id,
            seat_number=[seat],
            total_price=1,
            status="confirmed",
            created_at=now,
            viewed_at=datetime(2024, 5, 2, 0, 0, 0, tzinfo=timezone.utc),
            show_time="14:00:00",
        )
        db.add(reservation)
        db.flush()

        payment = Payment(
            id=uuid.uuid4(),
            user_id=new_user.id,
            reservation_id=reservation.id,
            amount=1,
            point_earned=0,
            status="paid",
            payment_key=uuid.uuid4(),
            payment_method="credit_card",
            created_at=now,
        )
        db.add(payment)

def _generate_unique_seat(db: Session, theater_id: uuid.UUID) -> str:
    """해당 극장에서 아직 사용되지 않은 좌석코드 생성 (A-Z + 1..50)"""
    # 최대 시도 제한 (이론상 중복이 너무 많을 경우 대비)
    for _ in range(500):
        letter = random.choice(string.ascii_uppercase)  # A-Z
        number = random.randint(1, 50)                  # 1..50
        seat = f"{letter}{number}"
        exists = (
        db.query(Reservation)
        .filter(
            Reservation.theater_id == theater_id,
            text(f"'{seat}' = ANY(seat_number)")
        )
        .first()
    )
        if not exists:
            return seat
    # 좌석 풀이 부족하거나 이상 상황
    raise HTTPException(status_code=500, detail="예약 좌석 생성 중 충돌이 발생했습니다.")

def _unlink_kakao(kakao_user_id: str):
    if not KAKAO_ADMIN_KEY:
        print("KAKAO_ADMIN_KEY not set; skip unlink")
        return

    try:
        res = httpx.post(
            "https://kapi.kakao.com/v1/user/unlink",
            headers={
                "Authorization": f"KakaoAK {KAKAO_ADMIN_KEY}",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data={
                "target_id_type": "user_id",
                "target_id": kakao_user_id,
            },
            timeout=5.0,
        )
        if res.status_code != 200:
            print("Kakao unlink failed:", res.status_code, res.text)
    except Exception as e:
        print("Kakao unlink exception:", e)