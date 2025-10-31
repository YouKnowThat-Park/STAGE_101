from sqlalchemy import Column, Text, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID
from server.database import Base
from datetime import datetime
import uuid

from models.enums import CartStatusEnum

class CartHistory(Base):
    __tablename__ = "cart_histories"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    payment_key = Column(UUID(as_uuid=True), ForeignKey("payments.payment_key"), nullable=False)
    total_price = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    status = Column(Enum(CartStatusEnum, name="cart_status"), nullable=False)
    image_url = Column(Text)
    name = Column(Text)
    cart_id = Column(UUID(as_uuid=True), ForeignKey("carts.id"))
