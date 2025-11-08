from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from uuid import UUID
from typing import List
from datetime import datetime
import uuid

from server.database import get_db
from server.models.cart_history import CartHistory
from server.models.user import User
from server.models.cart import Cart
from server.schemas.cart_history import CartHistoryCreate, CartHistoryResponse
from server.security import verify_access_token

router = APIRouter(prefix="/cart-histories", tags=["CartHistory"])


@router.post("/", response_model=CartHistoryResponse)
def create_cart_history(
    data: CartHistoryCreate,
    request: Request,
    db: Session = Depends(get_db)
):
    token = request.cookies.get("__stage__")
    if not token:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")
    
    payload = verify_access_token(token)
    email = payload.get("sub")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="유저를 찾을 수 없습니다.")
    
    if user.point < data.total_price:
        raise HTTPException(status_code=400, detail="포인트가 부족합니다.")

    from server.models.cart import Cart
    cart = db.query(Cart).filter(Cart.id == data.cart_id, Cart.user_id == user.id).first()
    if not cart:
        raise HTTPException(status_code=404, detail="장바구니 항목을 찾을 수 없습니다.")
    
    try:
        # 삭제 먼저

        # 포인트 차감

        # 히스토리 저장
        history = CartHistory(
            id=uuid.uuid4(),
            created_at=datetime.utcnow(),
            user_id=user.id,
            payment_key=data.payment_key,
            total_price=data.total_price,
            quantity=data.quantity,
            status=data.status,
            image_url=data.image_url,
            name=data.name,
            cart_id=data.cart_id,
        )

        db.add(history)
        db.flush()
        db.delete(cart)
        user.point -= data.total_price
        db.commit()
        return history

    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"결제 중 DB 오류 발생: {str(e)}")


@router.get("/me", response_model=List[CartHistoryResponse])
def get_my_cart_histories(
    request: Request,
    db: Session = Depends(get_db)
):
    token = request.cookies.get("__stage__")
    if not token:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")

    payload = verify_access_token(token)
    email = payload.get("sub")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="유저를 찾을 수 없습니다.")

    histories = (
        db.query(CartHistory)
        .filter(CartHistory.user_id == user.id)
        .order_by(CartHistory.created_at.desc())
        .all()
    )

    return histories


@router.patch("/cancel", response_model=CartHistoryResponse)
def cancel_cart_history(
    request: Request,
    data: dict,
    db: Session = Depends(get_db)
):
    history_id = data.get("id")
    if not history_id:
        raise HTTPException(status_code=400, detail="ID가 필요합니다.")

    history = db.query(CartHistory).filter(CartHistory.id == history_id).first()
    if not history:
        raise HTTPException(status_code=404, detail="기록을 찾을 수 없습니다.")

    if history.status == "canceled":
        raise HTTPException(status_code=400, detail="이미 취소된 거래입니다.")
    if history.status == "completed":
        raise HTTPException(status_code=400, detail="수령된 거래는 취소할 수 없습니다.")

    history.status = "canceled"
    db.commit()
    db.refresh(history)

    return history
