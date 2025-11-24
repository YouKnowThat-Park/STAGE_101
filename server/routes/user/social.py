from fastapi import Depends, HTTPException, APIRouter
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError

import os
import uuid
import httpx
import urllib.parse

from server.database import get_db
from server.models.user import User
from server.security import hash_password, create_access_token
from .public import _create_default_data_for_new_user


FRONTEND_REDIRECT_URL = os.getenv("FRONTEND_REDIRECT_URL", "http://localhost:3000")

KAKAO_ADMIN_KEY = os.getenv("KAKAO_ADMIN_KEY")
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


router = APIRouter(prefix="/users", tags=["User Social"])

@router.get("/social/kakao/signin")
def kakao_login():
    if not KAKAO_CLIENT_ID or not KAKAO_REDIRECT_URI:
        raise HTTPException(status_code=500, detail="KAKAO OAuth 설정이 올바르지 않습니다.")

    params = {
        "client_id": KAKAO_CLIENT_ID,
        "redirect_uri": KAKAO_REDIRECT_URI,
        "response_type": "code",
    }

    url = "https://kauth.kakao.com/oauth/authorize?" + urllib.parse.urlencode(params)
    return RedirectResponse(url)


@router.get("/social/kakao/callback")
async def kakao_callback(code: str, db: Session = Depends(get_db)):
    if not KAKAO_CLIENT_ID or not KAKAO_REDIRECT_URI or not KAKAO_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Kakao OAuth 설정이 올바르지 않습니다.")

    try:
        async with httpx.AsyncClient() as client:
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

    jwt_token = create_access_token({"sub": user.email})

    response = RedirectResponse(url=FRONTEND_REDIRECT_URL)
    response.set_cookie(
        key="__stage__",
        value=jwt_token,
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
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }

    url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode(params)
    return RedirectResponse(url)


@router.get("/social/google/callback")
async def google_callback(code: str, db: Session = Depends(get_db)):
    if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET or not GOOGLE_REDIRECT_URI:
        raise HTTPException(status_code=500, detail="Google OAuth 설정이 올바르지 않습니다.")

    try:
        async with httpx.AsyncClient() as client:
            token_res = await client.post(
                "https://oauth2.googleapis.com/token",
                headers={"Content-Type": "application/x-www-form-urlencoded"},
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

    jwt_token = create_access_token({"sub": user.email})

    response = RedirectResponse(url=FRONTEND_REDIRECT_URL)
    response.set_cookie(
        key="__stage__",
        value=jwt_token,
        httponly=True,
        secure=False,  # 배포 시 True
        samesite="lax",
        max_age=60 * 60,
    )
    return response