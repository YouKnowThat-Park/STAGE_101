from pydantic import BaseModel, UUID4, Field, validator
from uuid import UUID
from datetime import datetime, date
from typing import Optional, List
import re

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

class CheckoutSummaryResponse(BaseModel):
    """결제 페이지에서 사용할 요약 응답"""
    reservations: List[ReservationResponse]
    total_price: int


SEAT_RE = re.compile(r"^[A-Z][1-9]\d?$")  # A1~Z99

class ReservationCreate(BaseModel):
    user_id: UUID4
    theater_id: UUID4
    seat_number: List[str] = Field(min_items=1, max_items=4)
    total_price: int = Field(gt=0)
    viewed_at: date
    show_time: str = Field(pattern=r"^\d{2}:\d{2}(:\d{2})?$")  # "HH:MM" or "HH:MM:SS"

    @validator("seat_number")
    def validate_seats(cls, v: List[str]) -> List[str]:
        if len(set(v)) != len(v):
            raise ValueError("좌석 목록에 중복이 있습니다.")
        for s in v:
            if not SEAT_RE.match(s):
                raise ValueError(f"좌석 형식이 올바르지 않습니다: {s}")
        return v
    
    