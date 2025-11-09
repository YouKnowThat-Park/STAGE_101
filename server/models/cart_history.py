from sqlalchemy import Column, Text, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from server.database import Base
from datetime import datetime
import uuid


from .enums import CartStatusEnum

class CartHistory(Base):
    __tablename__ = "cart_histories"

    id = Column(PGUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user_id = Column(PGUUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    payment_key = Column(PGUUID(as_uuid=True), nullable=False)
    total_price = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    status = Column(Enum(CartStatusEnum, name="cart_status"), nullable=False)

    image_url = Column(Text, nullable=True)
    name = Column(Text, nullable=True)

    # 기존 ondelete="CASCADE" -> "SET NULL", nullable=True
    cart_id = Column(
        PGUUID(as_uuid=True),
        ForeignKey("carts.id", ondelete="SET NULL"),
        nullable=True,
    )