from pydantic import BaseModel, UUID4
from uuid import UUID
from datetime import datetime, date
from typing import Optional, List

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
    seat_number: List[str]
    total_price: int
    status: str
    created_at: datetime
    viewed_at: Optional[datetime] = None
    show_time: Optional[str] = None

    #  관계 필드
    theater: Optional[TheaterInfo] = None

    class Config:
        orm_mode = True

class ReservationCreate(BaseModel):
    user_id: UUID4
    theater_id: UUID4
    seat_number: List[str]
    total_price: int
    viewed_at: Optional[datetime]
    show_time: Optional[str]
