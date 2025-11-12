from pydantic import BaseModel
from uuid import UUID
from datetime import datetime, date
from typing import Optional

class TheaterInfo(BaseModel):
    name: str
    start_date: Optional[date]
    end_date: Optional[date]
    main_img: Optional[str]
    type: Optional[str]

    class Config:
        orm_mode = True


class ReservationResponse(BaseModel):
    id: UUID
    user_id: UUID
    theater_id: UUID
    seat_number: str
    total_price: int
    status: str
    created_at: datetime
    viewed_at: Optional[datetime] = None
    show_time: Optional[str] = None

    #  관계 필드
    theater: Optional[TheaterInfo] = None

    class Config:
        orm_mode = True