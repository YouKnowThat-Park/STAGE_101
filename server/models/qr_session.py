from sqlalchemy import Column, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from server.database import Base
from datetime import datetime
import uuid

class QRSession(Base):
    __tablename__ = "qr_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    theater_id = Column(UUID(as_uuid=True), ForeignKey("theaters.id"), nullable=False)
    reservation_id = Column(UUID(as_uuid=True), ForeignKey("reservations.id"), nullable=False)
    qr_token = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime)
