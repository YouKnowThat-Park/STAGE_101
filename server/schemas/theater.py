from pydantic import BaseModel
from typing import Optional, List
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
        orm_mode = True