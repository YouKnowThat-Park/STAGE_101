from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.user import User
import os
from dotenv import load_dotenv

load_dotenv()

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
# → argon2 알고리즘을 사용 / bcrypt 는 길이 제한에 걸렸음
# → argon2 업데이트 되면 자동으로 최신 스펙을 따라가도록 설정

def hash_password(password: str) -> str:
    """ 비밀번호를 bcrypt로 해싱 """
    return pwd_context.hash(password)
# → 비밀번호 해시 함수 / argon2 해시 + 랜덤 분자열을 섞어서 매번 다른 결과값을 만듬

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """ 입력한 비밀번호와 해시된 비밀번호를 비교 """
    return pwd_context.verify(plain_password, hashed_password)
# → 비밀번호 검증 함수 / argon2는 내부적으로 해시 비교를 지원해줌, 그래서 직접 디코딩할 필요 없음

SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret_key")
ALGORITHM = "HS256"
# → HMAC-SHA256 알고리즘으로 JWT 서명?
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_MINUTES = 60
# → 1시간 토큰 / 1시간 리프레쉬 토큰

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """ JWT 토큰 생성 """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt # →  문자열 형태의 JWT 반환
# → data에는 사용자 정보가 들어감
# → 만료시간은 현재 UTC 시각 + 1시간을 기준
# → JWT 만료시간을 exp 필드로 정의
# → JWT 토큰을 header + payload + signature 구조로 정의

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")
# → FastAPI 내장 기능 / 엔드포인트에서 발급된 토큰을 Authorization 헤더로 받아 인증 처리

# JWT 토큰 검증 후 사용자 조회
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """ JWT 토큰 검증 후 반환 """
    credentials_exception = HTTPException( status_code=status.HTTP_401_UNAUTHORIZED,
        detail="토큰이 유효하지 않습니다.", 
        headers={"WWW-Authenticate": "Bearer"}
    )
    # → 실패할 경우 에러 정의
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # →  성공할 경우 JWT 디코딩
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    # → 토큰 안에 있는 사용지 식별 정보 추출, sub 없으면 유효하지 않는 토큰
    # → 만료시간 자동으로 검증, 만료됐으면 JWTError 실행
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception
    return user
# → 실제 db에서 user 조회, email이 일치 하는지 확인 / 일치 하지 않으면 인증 실패
# → 파이썬 에는 === 가 존재 하지 않는다. 그렇기에 == 사용 (JS의 ===와 동일)
def verify_access_token(token: str):
    """쿠키에 저장된 JWT 토큰 검증용 (만료 or 변조 확인)"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰이 유효하지 않거나 만료되었습니다.",
        )