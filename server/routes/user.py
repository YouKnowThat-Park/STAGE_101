from fastapi import APIRouter, Depends, HTTPException, Response, Request, UploadFile, File, status
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy import literal, text
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timezone
from botocore.exceptions import BotoCoreError, ClientError
from typing import Optional

import os
import uuid
import random
import string
import httpx
import urllib.parse
import boto3

from server.database import get_db
from server.models.user import User
from server.models.reservation import Reservation
from server.models.payment import Payment
from server.models.review import Review
from server.models.cart import Cart
from server.models.cart_history import CartHistory
from server.schemas.user import UserCreate, AuthResponse, UserSignIn, DeleteUserRequest, UserUpdate
from server.security import hash_password, create_access_token, verify_password, verify_access_token

FRONTEND_REDIRECT_URL = os.getenv("FRONTEND_REDIRECT_URL", "http://localhost:3000")

KAKAO_CLIENT_ID = os.getenv("KAKAO_CLIENT_ID")
KAKAO_CLIENT_SECRET = os.getenv("KAKAO_CLIENT_SECRET")
KAKAO_REDIRECT_URI = os.getenv(
    "KAKAO_REDIRECT_URI",
    "http://localhost:8000/users/social/kakao/callback",
)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv(
    "GOOGLE_REDIRECT_URI",
    "http://localhost:8000/users/social/google/callback",
)

AWS_REGION = os.getenv("AWS_REGION", "ap-northeast-2")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", "stage101")
S3_PROFILE_PREFIX = os.getenv("S3_PROFILE_PREFIX", "user_profile_img/")

s3_client = boto3.client(
    "s3",
    region_name=AWS_REGION,
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)

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

def _create_default_data_for_new_user(db: Session, new_user: User) -> None:
    """회원가입 시 기본 예약/결제 생성 로직 (소셜 가입에서도 재사용)"""
    now = datetime.now(timezone.utc)

    for theater_id in THEATER_IDS:
        seat = _generate_unique_seat(db, theater_id)

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

            _create_default_data_for_new_user(db, new_user)

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
        "phone": user.phone,
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



@router.get("/social/kakao/signin")
def kakao_login():
    if not KAKAO_CLIENT_ID or not KAKAO_REDIRECT_URI:
        raise HTTPException(status_code=500, detail="KAKAO OAuth 설정이 올바르지 않습니다.")
    
    params = {
        "client_id": KAKAO_CLIENT_ID,
        "redirect_uri": KAKAO_REDIRECT_URI,
        "response_type": "code"
    }

    url = "https://kauth.kakao.com/oauth/authorize?" + urllib.parse.urlencode(params)
    return RedirectResponse(url)


@router.get("/social/kakao/callback")
async def kakao_callback(code: str, db: Session = Depends(get_db)):
    if not KAKAO_CLIENT_ID or not KAKAO_REDIRECT_URI or not KAKAO_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Kakao OAuth 설정이 올바르지 않습니다.")

    try:
        async with httpx.AsyncClient() as client:
            # 1) code -> access_token
            token_res = await client.post(
                "https://kauth.kakao.com/oauth/token",
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                data={
                    "grant_type": "authorization_code",
                    "client_id": KAKAO_CLIENT_ID,
                    "client_secret": KAKAO_CLIENT_SECRET,
                    "redirect_uri": KAKAO_REDIRECT_URI,
                    "code": code,
                },
            )
            if token_res.status_code != 200:
                raise HTTPException(status_code=400, detail="카카오 토큰 발급 실패")

            token_data = token_res.json()
            access_token = token_data.get("access_token")
            if access_token is None:
                raise HTTPException(status_code=400, detail="카카오 액세스 토큰 없음")

            # 2) 유저 정보
            profile_res = await client.get(
                "https://kapi.kakao.com/v2/user/me",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if profile_res.status_code != 200:
                raise HTTPException(status_code=400, detail="카카오 사용자 정보 조회 실패")

            profile = profile_res.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Kakao HTTP 통신 오류: {str(e)}")

    kakao_account = profile.get("kakao_account", {})
    email = kakao_account.get("email")
    profile_info = kakao_account.get("profile") or {}
    nickname = profile_info.get("nickname") or "KakaoUser"

    if email is None:
        raise HTTPException(status_code=400, detail="카카오에서 이메일 정보를 제공하지 않았습니다.")

    # 3) 유저 조회/생성
    try:
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            random_pw = uuid.uuid4().hex
            hashed_pw = hash_password(random_pw)

            user = User(
                name=nickname,
                nickname=nickname,
                email=email,
                phone="social",
                password=hashed_pw,
                point=10000,
            )
            db.add(user)
            db.flush()

            _create_default_data_for_new_user(db, user)

        db.commit()
        db.refresh(user)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"카카오 로그인 처리 중 DB 오류: {str(e)}")

    # 4) JWT 쿠키 + 프론트로 리다이렉트
    access_token = create_access_token({"sub": user.email})

    response = RedirectResponse(url=FRONTEND_REDIRECT_URL)
    response.set_cookie(
        key="__stage__",
        value=access_token,
        httponly=True,
        secure=False,  # 배포 시 True
        samesite="lax",
        max_age=60 * 60,
    )
    return response

@router.get("/social/google/signin")
def google_login():
    if not GOOGLE_CLIENT_ID or not GOOGLE_REDIRECT_URI:
        raise HTTPException(status_code=500, detail="Google OAuth 설정이 올바르지 않습니다.")
    
    params = {
        "client_id" : GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent"
    }
    
    url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode(params)
    return RedirectResponse(url)

@router.get("/social/google/callback")
async def google_callback(code: str, db: Session =Depends(get_db)):
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET or not GOOGLE_REDIRECT_URI:
        raise HTTPException(status_code=500, detail="Google OAuth 설정이 올바르지 않습니다.")
    
    try:
        async with httpx.AsyncClient() as client:
            token_res = await client.post(
                "https://oauth2.googleapis.com/token",
                headers = {"Content-Type": "application/x-www-form-urlencoded"},
                data={
                    "grant_type": "authorization_code",
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "redirect_uri": GOOGLE_REDIRECT_URI,
                    "code": code,
                },
            )
            if token_res.status_code != 200:
                raise HTTPException(status_code=400, detail="구글 토큰 발급 실패")

            token_data = token_res.json()
            access_token = token_data.get("access_token")
            if access_token is None:
                raise HTTPException(status_code=400, detail="구글 액세스 토큰 없음")

            # 2) 유저 정보
            profile_res = await client.get(
                "https://openidconnect.googleapis.com/v1/userinfo",
                headers={"Authorization": f"Bearer {access_token}"},
            )
            if profile_res.status_code != 200:
                raise HTTPException(status_code=400, detail="구글 사용자 정보 조회 실패")

            profile = profile_res.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Google HTTP 통신 오류: {str(e)}")

    email = profile.get("email")
    name = profile.get("name") or "GoogleUser"

    if email is None:
        raise HTTPException(status_code=400, detail="구글에서 이메일 정보를 제공하지 않았습니다.")

    # 3) 유저 조회/생성
    try:
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            random_pw = uuid.uuid4().hex
            hashed_pw = hash_password(random_pw)

            user = User(
                name=name,
                nickname=name,
                email=email,
                phone="social",
                password=hashed_pw,
                point=10000,
            )
            db.add(user)
            db.flush()

            _create_default_data_for_new_user(db, user)

        db.commit()
        db.refresh(user)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"구글 로그인 처리 중 DB 오류: {str(e)}")

    # 4) JWT 쿠키 + 프론트로 리다이렉트
    access_token = create_access_token({"sub": user.email})

    response = RedirectResponse(url=FRONTEND_REDIRECT_URL)
    response.set_cookie(
        key="__stage__",
        value=access_token,
        httponly=True,
        secure=False,  # 배포 시 True
        samesite="lax",
        max_age=60 * 60,
    )
    return response

@router.post("/me/profile-image")
async def upload_profile_image(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    token = request.cookies.get("__stage__")
    if not token:
        raise HTTPException(status_code=401, detail="인증 토큰이 없습니다.")
    
    payload = verify_access_token(token)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=404, detail="토큰 정보가 올바르지 않습니다.")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="유저를 찾을 수 없습니다.")
      
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="이미지 파일만 업로드할 수 있습니다.")

    _, ext = os.path.splitext(file.filename or "")
    ext = ext.lower()
    if ext not in [".jpg", ".jpeg", ".png", ".webp"]:
        ext = ".jpg"

    key = f"{S3_PROFILE_PREFIX}{uuid.uuid4()}{ext}"

    try:
        content = await file.read()

        s3_client.put_object(
            Bucket=S3_BUCKET_NAME,
            Key=key,
            Body=content,
            ContentType = file.content_type or "image/jpeg"
        )

    except (BotoCoreError, ClientError) as e:
        raise HTTPException(status_code=500, detail=f"S3 업로드 중 오류가 발생했습니다: {str(e)}")
    
    profile_url = f"https://{S3_BUCKET_NAME}.s3.{AWS_REGION}.amazonaws.com/{key}"
    user.profile_img = profile_url
    db.commit()
    db.refresh(user)

    return {
        "message": "프로필 이미지 업로드 완료",
        "profile_img": user.profile_img
    }

@router.patch("/me/update")
def update_user_info(
    data: UserUpdate,
    request: Request,
    db: Session = Depends(get_db)
):
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
    
    # 업데이트할 항목 반영
    if data.nickname:
        user.nickname = data.nickname
    if data.profile_img:
        user.phone = data.profile_img

    db.commit()
    db.refresh(user)

    return {
        "message": "유저 정보가 성공적으로 업데이트되었습니다.",
        "user": {
            "nickname": user.nickname,
            "profile_img": user.profile_img,
        }
    }