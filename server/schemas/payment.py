from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import Optional


class PaymentCreate(BaseModel):
    user_id: UUID4
    reservation_id: UUID4
    amount: int
    point_earned: Optional[int]
    payment_key: UUID4
    payment_method: str
    status: str


class PaymentResponse(BaseModel):
    id: UUID4
    created_at: datetime
    user_id: UUID4
    reservation_id: UUID4
    amount: int
    point_earned: Optional[int]
    payment_key: UUID4
    payment_method: str
    status: str

    class Config:
        orm_mode = True