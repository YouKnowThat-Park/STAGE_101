from sqlalchemy import Column, Integer, Text, DateTime, Boolean, Date, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from server.database import Base
from datetime import datetime
import uuid

from .enums import TheaterDaysEnum

class Theater(Base):
    __tablename__ = "theaters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    name = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    price = Column(Integer, nullable=False)
    show_time = Column(Text, nullable=False)
    total_time = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    image_url = Column(JSONB, nullable=False)
    video_url = Column(JSONB, nullable=False)
    status = Column(Boolean, nullable=False)
    type = Column(Text, nullable=False)
    main_img = Column(Text, nullable=False)
    start_date = Column(Date)
    end_date = Column(Date)
    allowed_days = Column(Enum(TheaterDaysEnum, name="theaters_days"), nullable=True)
    reservations = relationship("Reservation", back_populates="theater")
    reviews = relationship("Review", back_populates="theater")