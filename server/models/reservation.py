from sqlalchemy import Column, Text, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from server.database import Base
import uuid

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"),  nullable=False)
    theater_id = Column(UUID(as_uuid=True), ForeignKey("theaters.id"), nullable=False)
    seat_number = Column(ARRAY(Text), nullable=False)
    total_price = Column(Integer, nullable=False)
    status = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    viewed_at = Column(DateTime)
    show_time = Column(Text)
    theater = relationship("Theater", back_populates="reservations")
    qr_session = relationship("QrSession", uselist=False, back_populates="reservation")
