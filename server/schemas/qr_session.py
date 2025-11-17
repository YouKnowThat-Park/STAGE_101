from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

class QrSessionBase(BaseModel):
    user_id: UUID
    theater_id: UUID
    reservation_id: UUID


class QrSessionCreate(QrSessionBase):
    expires_at: Optional[datetime] = None


class QrSessionResponse(QrSessionBase):
    id: UUID
    qr_token: str
    created_at: datetime
    expires_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class QrSessionSimple(BaseModel):
    qr_token: Optional[str]

    class Config:
        orm_mode = True

class QrDetailResponse(BaseModel):
    qr_token: Optional[str]
    theater_id: UUID
    theater_name: str
    main_img: Optional[str] = None
    viewed_at: Optional[datetime] = None
    show_time: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)