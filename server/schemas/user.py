from pydantic import BaseModel, EmailStr
from typing import Optional, TypedDict
from datetime import datetime
from uuid import UUID

class UserUpdate(BaseModel):
    nickname: Optional[str] = None
    profile_img: Optional[str] = None
    
class UserResponse(BaseModel):
    id: UUID
    created_at: datetime
    nickname: Optional[str] = None
    email: EmailStr
    phone: str
    name: str
    point: Optional[int]
    profile_img: Optional[str] = None

    class Config:
        orm_mode =True
    # 클라이언트 응답용 이기 때문에 password는 제외, 입력시 api에 노출

class UserCreate(BaseModel):
    name: str
    nickname: str
    email: EmailStr
    phone: str
    password: str

class UserSignIn(BaseModel):
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    access_token: str
    user: UserResponse

class UserReviewRanking(BaseModel):
    user_id: UUID
    nickname: str
    profile_img: str
    count: int

class UserReviewRow(TypedDict):
    user_id: UUID
    nickname: str | None
    profile_img: str | None
    count: int

class DeleteUserRequest(BaseModel):
    password: str