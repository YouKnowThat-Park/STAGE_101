from fastapi import APIRouter, Depends, HTTPException, Response, Request, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, timezone
from botocore.exceptions import BotoCoreError, ClientError

import os
import uuid
import random
import string
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
from .helpers import THEATER_IDS, _unlink_kakao, create_default_data_for_new_user


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
        create_default_data_for_new_user(db, new_user)

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
                        "phone": new_user,
            "name": new_user
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
            "phone": user.phone,
            "name": user.name
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
        "point": user.point,
        "phone": user.phone,
        "name": user.name
    }

@router.delete("/delete", status_code=204)
def delete_user(data: DeleteUserRequest, request: Request, db: Session = Depends(get_db)):
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

    # ✅ provider 판별
    phone_value = user.phone or ""
    is_kakao = phone_value == "Kakao"
    is_google = phone_value == "Google"
    is_social = is_kakao or is_google

    if is_social:
        # 소셜 유저 → 동의 문구
        if data.agreement_text != "동의합니다":
            raise HTTPException(status_code=400, detail="탈퇴 동의 문구를 정확히 입력해주세요.")
    else:
        # 일반 유저 → 비밀번호
        if not data.password:
            raise HTTPException(status_code=400, detail="비밀번호를 입력해주세요.")
        if not verify_password(data.password, user.password):
            raise HTTPException(status_code=403, detail="비밀번호가 일치하지 않습니다.")

    # ✅ 소셜 계정 언링크 요청
    try:
        if is_kakao and user.social_id:
            _unlink_kakao(user.social_id)
    except Exception as e:
        print("Social unlink failed:", e)

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
        user.profile_img = data.profile_img

    db.commit()
    db.refresh(user)

    return {
        "message": "유저 정보가 성공적으로 업데이트되었습니다.",
        "user": {
            "nickname": user.nickname,
            "profile_img": user.profile_img,
        }
    }