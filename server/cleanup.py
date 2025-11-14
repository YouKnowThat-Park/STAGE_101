import asyncio
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from server.database import SessionLocal
from server.models.reservation import Reservation

async def delete_expired_reservations_loop():
    while True:
        try:
            with SessionLocal() as db:  # SessionLocal은 get_db에서 쓰는 거랑 같은 팩토리
                threshold = datetime.utcnow() - timedelta(minutes=30)

                db.query(Reservation).filter(
                    Reservation.status == "pending",
                    Reservation.created_at < threshold,
                ).delete(synchronize_session=False)

                db.commit()
        except Exception:
            # 로그만 찍고 루프는 계속 돌게
            pass

        # 1분에 한 번씩 실행
        await asyncio.sleep(60)
