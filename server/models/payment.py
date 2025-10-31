from sqlalchemy import Column, Text, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from server.database import Base
from datetime import datetime
import uuid

class Payment(Base):
    __tablename__ = "payments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    reservation_id = Column(UUID(as_uuid=True), ForeignKey("reservations.id"), nullable=False)
    amount = Column(Integer, nullable=False)
    point_earned = Column(Integer)
    status = Column(Text, nullable=False)
    payment_key = Column(Text, nullable=False, unique=True)
    payment_method = Column(Text, nullable=False)
