from fastapi import APIRouter, Depends, HTTPException, Response, Request
from fastapi.responses import JSONResponse

from sqlalchemy.orm import Session
from server.database import get_db
from server.models.user import User
from server.schemas.user import UserCreate, AuthResponse, UserSignIn
from server.security import hash_password, create_access_token, verify_password, verify_access_token

router = APIRouter(prefix="/users", tags=["User"])

@router.post("/signup", response_model=AuthResponse)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """ 회원가입 API """
    
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="이미 가입된 이메일 입니다.")
    
    hashed_pw = hash_password(user_data.password)

    new_user = User(
        name=user_data.name,
        nickname=user_data.nickname,
        email=user_data.email,
        phone=user_data.phone,
        password=hashed_pw,
        point=1000,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

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
        samesite="none",
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
        "nickname": user.nickname,
        "profile_img": user.profile_img,
        "point": user.point
    }