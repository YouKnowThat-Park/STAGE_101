from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from server.models.enums import CartStatusEnum

class CartHistoryCreate(BaseModel):
    payment_key: UUID
    total_price: int
    quantity: int
    status: CartStatusEnum
    image_url: Optional[str] = None
    name: Optional[str] = None

    #  다중 장바구니 항목 지원
    cart_item_ids: List[UUID] = Field(default_factory=list)

class CartHistoryResponse(BaseModel):
    id: UUID
    created_at: datetime
    user_id: UUID

    payment_key: UUID
    total_price: int
    quantity: int
    status: CartStatusEnum
    image_url: Optional[str] = None
    name: Optional[str] = None
    cart_id: Optional[UUID] = None  # 대표 하나만 연결(호환 목적)

    class Config:
        from_attributes = True
