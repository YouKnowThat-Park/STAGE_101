from fastapi import FastAPI
from server.database import engine
from server.database import Base
from server.routes import shop, user, cart, payment, qr_session, cart_history, theater, reservation, review, health
from fastapi.middleware.cors import CORSMiddleware
from server import models
from server.cleanup import delete_expired_reservations_loop
import asyncio
app = FastAPI()

origins = [
    "http://localhost:3000",         # 로컬 개발용
    "https://www.stage101.shop:3000",       # 지금 EC2 프론트 주소
    "https://stage101.shop",
    "https://www.stage101.shop",            # 나중에 Nginx로 :3000 빼면 이거도 필요
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(shop.router, prefix="/api")
app.include_router(user.router, prefix="/api")
app.include_router(cart.router, prefix="/api")
app.include_router(cart_history.router, prefix="/api")
app.include_router(theater.router, prefix="/api")
app.include_router(reservation.router, prefix="/api")
app.include_router(review.router, prefix="/api")
app.include_router(payment.router, prefix="/api")
app.include_router(qr_session.router, prefix="/api")
app.include_router(health.router)

@app.get("/")
def root():
    return {"message": "FastAPI 및 PostgreSQL 마이그레이션 완료"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(delete_expired_reservations_loop())