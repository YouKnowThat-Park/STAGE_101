from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.shop import Shop
from server.schemas.shop import ShopResponse
from typing import List

router = APIRouter(prefix="/shops", tags=["Shop"])

@router.get("/", response_model=List[ShopResponse])
def get_shops(db: Session = Depends(get_db)):
    shops = db.query(Shop).all()
    return shops