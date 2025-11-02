from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.shop import Shop
from server.schemas.shop import ShopResponse
from uuid import UUID
from typing import List

router = APIRouter(prefix="/shops", tags=["Shop"])

@router.get("/", response_model=List[ShopResponse])
def get_shops(db: Session = Depends(get_db)):
    shops = db.query(Shop).all()
    return shops

@router.get("/{shop_id}", response_model=ShopResponse)
def get_shop_by_id(shop_id:UUID, db: Session = Depends(get_db)):
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return shop 