from sqlalchemy import Column, Text, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from server.database import Base
from datetime import datetime
import uuid

class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    theater_id = Column(UUID(as_uuid=True), ForeignKey("theaters.id"), nullable=False)
    comment = Column(Text, nullable=False)
    display_name = Column(Text, nullable=False)
    type = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    dislike_count = Column(Integer)
    image_url = Column(Text)

    theater = relationship("Theater", back_populates="reviews")