import asyncio
from server.database import SessionLocal
from server.models.reservation import Reservation
from sqlalchemy import func, text


async def delete_expired_reservations_loop():
    while True:
        try:
            with SessionLocal() as db:  
                threshold_expr = func.now() - text("interval '30 minutes'")

                db.query(Reservation).filter(
                    Reservation.status == "pending",
                    Reservation.created_at < threshold_expr,
                ).delete(synchronize_session=False)

                db.commit()
        except Exception:
            # 로그만 찍고 루프는 계속 돌게
            pass

        # 1분에 한 번씩 실행
        await asyncio.sleep(60)
