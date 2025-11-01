from fastapi import FastAPI
from server.database import engine
from server.models import (cart, cart_history, enums, payment, qna, qr_session, reservation, review, shop, theater, user)
from server.database import Base

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "FastAPI 및 PostgreSQL 마이그레이션 완료"}