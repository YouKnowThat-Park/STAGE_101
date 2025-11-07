from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class CartResponse(BaseModel):
    id: UUID
    user_id: UUID
    shop_id: UUID
    name: str
    point: int
    quantity: int
    image_url: str

    class Config:
        orm_mode = True

class CartCreate(BaseModel):
    user_id: UUID
    shop_id: UUID
    name: str
    point: int
    quantity: int
    image_url: str

class CartUpdate(BaseModel):
    user_id: UUID
    shop_id: UUID
    quantity: int
