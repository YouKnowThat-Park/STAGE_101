from fastapi import APIRouter, Depends, HTTPException, Response, Request
from fastapi.responses import JSONResponse
from sqlalchemy import literal, text
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timezone
import uuid
import random
import string

from server.database import get_db
from server.models.user import User
from server.models.reservation import Reservation
from server.models.payment import Payment
from server.models.review import Review
from server.models.cart import Cart
from server.models.cart_history import CartHistory
from server.schemas.user import UserCreate, AuthResponse, UserSignIn, DeleteUserRequest
from server.security import hash_password, create_access_token, verify_password, verify_access_token

router = APIRouter(prefix="/users", tags=["User"])

# 트리거가 사용하던 극장 ID들
THEATER_IDS = [
    uuid.UUID("f32817ed-9564-4654-a670-3b4d2cb1fa12"),  # ✅ DB에 있는 값으로 수정(172d)
    uuid.UUID("32d05b50-b486-4bc7-b8ab-dc81aaa9b1aa"),
    uuid.UUID("6301fab5-95e6-443c-bbbb-609bc21ac5a6"),
]

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

@router.post("/signup", response_model=AuthResponse)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """ 회원가입 + 기본 예약/결제 자동 생성 """
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 가입된 이메일 입니다.")

    hashed_pw = hash_password(user_data.password)

    # 한 트랜잭션으로 처리
    try:
        now = datetime.now(timezone.utc)

        new_user = User(
            name=user_data.name,
            nickname=user_data.nickname,
            email=user_data.email,
            phone=user_data.phone,
            password=hashed_pw,
            point=10000,  # ✅ 트리거와 동일하게 가입 시 1만 포인트
        )
        db.add(new_user)
        db.flush()  # new_user.id 확보

        # 각 극장에 대해 예약 + 결제 생성
        for theater_id in THEATER_IDS:
            seat = _generate_unique_seat(db, theater_id)

            reservation = Reservation(
                id=uuid.uuid4(),
                user_id=new_user.id,
                theater_id=theater_id,
                seat_number=[seat],
                total_price=1,           # 트리거와 동일
                status="confirmed",      # enum이면 맞춰서 사용
                created_at=now,
                viewed_at=datetime(2024, 5, 2, 0, 0, 0, tzinfo=timezone.utc),  # 고정값
                show_time="14:00:00",    # 문자열 컬럼 가정 (time 타입이면 time(14,0,0)로 맞추세요)
            )
            db.add(reservation)
            db.flush()  # reservation.id 확보

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

        db.commit()
        db.refresh(new_user)

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"회원가입 처리 중 DB 오류: {str(e)}")

    # 로그인 토큰 발급 + 쿠키 세팅
    access_token = create_access_token({"sub": new_user.email})
    response = JSONResponse(content={
        "message": "회원가입 및 로그인 성공",
        "user": {
            "id": str(new_user.id),
            "nickname": new_user.nickname,
            "profile_img": new_user.profile_img,
            "point": new_user.point,
        },
    })
    response.set_cookie(
        key="__stage__",
        value=access_token,
        httponly=True,
        secure=False,  # 배포시 True
        samesite="lax",
        max_age=60 * 60,
    )
    return response

@router.post("/signin")
def signin(user_data: UserSignIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 올바르지 않습니다.")

    access_token = create_access_token({"sub": user.email})

    response = JSONResponse(content={
        "message": "로그인 성공",
        "user": {
            "id": str(user.id),
            "nickname": user.nickname,
            "profile_img": user.profile_img,
            "point": user.point,
        }
    })

    response.set_cookie(
        key="__stage__",
        value=access_token,
        httponly=True,
        secure=False,  # 배포 시 True
        samesite="lax", # 배포 시 none? 
        max_age=60 * 60,
    )

    return response

@router.get("/me")
def get_current_user(request: Request, db: Session = Depends(get_db)):
    """ JWT 쿠키로 현재 로그인 유저 정보 반환 """
    token = request.cookies.get("__stage__")
    if not token:
        raise HTTPException(status_code=401, detail="인증 토큰이 없습니다.")
    
    payload = verify_access_token(token)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="토큰 정보가 올바르지 않습니다.")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="유저를 찾을 수 없습니다.")
    
    return {
        "id": str(user.id),
        "name": user.name,
        "nickname": user.nickname,
        "profile_img": user.profile_img,
        "point": user.point
    }

@router.delete("/delete", status_code=204)
def delete_user(data:DeleteUserRequest, request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("__stage__")
    if not token:
        raise HTTPException(status_code=401, detail="인증 토큰이 없습니다.")
    
    payload = verify_access_token(token)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="토큰 정보가 올바르지 않습니다.")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="유저를 찾을 수 없습니다.")
    
    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=403, detail="비밀번호가 일치하지 않습니다.")
    
    try:

            db.query(Payment).filter(Payment.user_id == user.id).delete()
            db.query(Reservation).filter(Reservation.user_id == user.id).delete()
            db.query(Review).filter(Review.user_id == user.id).delete()
            db.query(CartHistory).filter(CartHistory.user_id == user.id).delete()
            db.query(Cart).filter(Cart.user_id == user.id).delete()
            db.delete(user)
            db.commit()

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"회원 탈퇴 처리 중 오류 발생: {str(e)}")

    response = Response(status_code=204)
    response.delete_cookie("__stage__")
    return response