from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.cart import Cart
from server.schemas.cart import CartResponse, CartCreate, CartUpdate
from uuid import uuid4, UUID

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("/", response_model=list[CartResponse])
def get_cart_items(user_id: UUID = Query, db:Session = Depends(get_db)):
    items = db.query(Cart).filter(Cart.user_id == user_id).order_by(Cart.created_at.desc()).all()
    return items

@router.post("/", response_model=CartResponse, status_code=201)
def add_to_cart(payload: CartCreate, db: Session = Depends(get_db)):
    existing = db.query(Cart).filter(Cart.user_id == payload.user_id, Cart.shop_id == payload.shop_id).first()

    if existing:
        existing.quantity += payload.quantity
    else:
        existing = Cart(
            id=uuid4(),
            user_id=payload.user_id,
            shop_id=payload.shop_id,
            name=payload.name,
            point=payload.point,
            quantity=payload.quantity,
            image_url=payload.image_url,
        )
        db.add(existing)

    db.commit()
    db.refresh(existing)
    return existing

@router.put("/", status_code=204)
def update_cart(payload: CartUpdate, db: Session = Depends(get_db)):
    cart_item = db.query(Cart).filter(
        Cart.user_id == payload.user_id,
        Cart.shop_id == payload.shop_id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="해당 장바구니 항목을 찾을 수 없습니다.")

    cart_item.quantity = payload.quantity
    db.commit()
    return None

@router.delete("/", status_code=200)
def delete_cart_item(
    user_id: UUID = Query(...),
    shop_id: UUID = Query(...),
    db: Session = Depends(get_db)
):
    cart_item = db.query(Cart).filter(
        Cart.user_id == user_id,
        Cart.shop_id == shop_id
    ).first()

    if not cart_item:
        raise HTTPException(status_code=404, detail="해당 장바구니 항목을 찾을 수 없습니다.")

    db.delete(cart_item)
    db.commit()
    return { "message": "장바구니 항목이 삭제되었습니다." }