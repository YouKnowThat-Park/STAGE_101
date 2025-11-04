from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserResponse(BaseModel):
    id: UUID
    created_at: datetime
    nickname: str
    email: EmailStr
    phone: str
    name: str
    point: Optional[int]
    profile_img: Optional[str]

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


