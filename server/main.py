from fastapi import FastAPI
from server.database import engine
from server.database import Base
from server.routes import shop, user, cart, payment, qr_session, cart_history, theater, reservation, review
from fastapi.middleware.cors import CORSMiddleware
from server import models
from server.cleanup import delete_expired_reservations_loop
import asyncio

app = FastAPI()

origins = [
    "http://localhost:3000",         # 로컬 개발용
    "http://13.221.60.6:3000",       # 지금 EC2 프론트 주소
    "http://13.221.60.6",            # 나중에 Nginx로 :3000 빼면 이거도 필요
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(shop.router)
app.include_router(user.router)
app.include_router(cart.router)
app.include_router(cart_history.router)
app.include_router(theater.router)
app.include_router(reservation.router)
app.include_router(review.router)
app.include_router(payment.router)
app.include_router(qr_session.router)


@app.get("/")
def root():
    return {"message": "FastAPI 및 PostgreSQL 마이그레이션 완료"}

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(delete_expired_reservations_loop())