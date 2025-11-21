from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class ShopResponse(BaseModel):
    id:UUID
    name: str
    description: str
    point: int
    edition: bool | None
    image_url: str

    class Config:
        from_attributes = True
        