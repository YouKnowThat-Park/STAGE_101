from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional,List

class ReviewResponse(BaseModel):
    id: UUID
    user_id: UUID
    theater_id: UUID
    comment: str
    created_at: datetime
    display_name: str
    type: str
    dislike_count: int
    image_url: Optional[str]
    
    class Config:
        orm_mode =True

class ReviewsListResponse(BaseModel):
    data: List[ReviewResponse]
    totalCount: int
    nextPage: Optional[int]
