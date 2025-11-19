from sqlalchemy import Column, Text, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from server.database import Base
from datetime import datetime
import uuid

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    nickname = Column(Text, nullable=False, unique=True)
    email = Column(Text, nullable=False)
    phone = Column(Text, nullable=False)
    name = Column(Text, nullable=False)
    point = Column(Integer)
    profile_img = Column(Text)
    password = Column(Text)
    # 일단 null을 열어두고 db 마이그레이션 진행 한 후 데이터를 추가하고 다시 닫을것.