from pydantic import BaseModel, UUID4, ConfigDict
from datetime import datetime
from typing import Optional


class PaymentCreate(BaseModel):
    user_id: UUID4
    reservation_id: UUID4
    amount: int
    point_earned: Optional[int]
    payment_key: str
    payment_method: str


class PaymentResponse(BaseModel):
    id: UUID4
    created_at: datetime
    user_id: UUID4
    reservation_id: UUID4
    amount: int
    point_earned: Optional[int]
    payment_key: str
    payment_method: str
    status: str

    model_config = ConfigDict(from_attributes=True)