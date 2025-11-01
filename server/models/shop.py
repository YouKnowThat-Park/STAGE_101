from sqlalchemy import Column, Integer, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from server.database import Base
import uuid

class Shop(Base):
    __tablename__ = "shop"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    point = Column(Integer, nullable=False)
    edition = Column(Boolean)
    image_url = Column(Text, nullable=False)