from pydantic import BaseModel
from typing import Optional, List, Dict
from uuid import UUID
from datetime import datetime, date
from server.models.enums import TheaterDaysEnum

class TheaterResponse(BaseModel):
    id: UUID
    name: str
    description: str
    price: int
    show_time: str
    total_time: int
    created_at: datetime
    image_url: List[str]
    video_url: List[str]
    status: bool
    type: str
    main_img: str
    start_date: Optional[date]
    end_date: Optional[date]
    allowed_days: Optional[TheaterDaysEnum]

    class Config:
        from_attributes = True

class TheaterListStats(BaseModel):
    total: int
    by_type: Dict[str, int] = {}
    now_showing: int = 0

class TheaterListResponse(BaseModel):
    items: List[TheaterResponse]
    stats: Optional[TheaterListStats] = None