from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional
from server.models.enums import CartStatusEnum


class CartHistoryCreate(BaseModel):
    payment_key: UUID
    total_price: int
    quantity: int
    status: CartStatusEnum
    image_url: Optional[str] = None
    name: Optional[str] = None
    cart_id: Optional[UUID] = None


class CartHistoryResponse(CartHistoryCreate):
    id: UUID
    created_at: datetime
    user_id: UUID

    class Config:
        orm_mode = True
