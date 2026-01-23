from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from uuid import UUID
from typing import List
from datetime import datetime
import uuid

from server.database import get_db
from server.models.cart_history import CartHistory
from server.models.user import User
from server.models.cart import Cart
from server.schemas.cart_history import CartHistoryCreate, CartHistoryResponse, GoodsRankingItem
from server.security import verify_access_token
from server.models.enums import CartStatusEnum

router = APIRouter(prefix="/cart-histories", tags=["CartHistory"])

@router.post("/", response_model=List[CartHistoryResponse])
def create_cart_histories(
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

    if not data.cart_item_ids:
        raise HTTPException(status_code=400, detail="선택된 장바구니 항목이 없습니다.")

    try:
        carts: List[Cart] = (
            db.query(Cart)
            .filter(Cart.user_id == user.id, Cart.id.in_(data.cart_item_ids))
            .all()
        )
        if len(carts) != len(data.cart_item_ids):
            raise HTTPException(status_code=404, detail="일부 장바구니 항목을 찾을 수 없습니다.")

        server_total_price = sum(c.point * c.quantity for c in carts)
        server_total_quantity = sum(c.quantity for c in carts)

        if server_total_price != data.total_price or server_total_quantity != data.quantity:
            raise HTTPException(status_code=400, detail="결제 금액 또는 수량이 올바르지 않습니다.")
        if user.point < server_total_price:
            raise HTTPException(status_code=400, detail="포인트가 부족합니다.")

        histories: List[CartHistory] = []
        now = datetime.utcnow()

        for c in carts:
            h = CartHistory(
                id=uuid.uuid4(),
                created_at=now,
                user_id=user.id,
                payment_key=data.payment_key,          # 같은 결제 키로 그룹핑 (UNIQUE 제거됨)
                total_price=c.point * c.quantity,      # 개별 항목 금액
                quantity=c.quantity,                   # 개별 항목 수량
                status=data.status,
                image_url=(getattr(c, "image_url", None) or data.image_url),
                name=(getattr(c, "name", None) or data.name),
                cart_id=c.id,                          # cart 삭제돼도 SET NULL로 보존
            )
            db.add(h)
            histories.append(h)

        user.point -= server_total_price
        for c in carts:
            db.delete(c)

        db.commit()
        for h in histories:
            db.refresh(h)
        return histories

    except HTTPException:
        db.rollback()
        raise
    except SQLAlchemyError as e:
        db.rollback()
        import traceback
        traceback.print_exc()
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
async def cancel_cart_history(
    request: Request,
    db: Session = Depends(get_db)
):
    try:
        data = await request.json()  # ✅ JSON 파싱
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

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="결제 취소 중 오류 발생")


@router.get("/{id}", response_model=CartHistoryResponse)
def get_cart_history(id: UUID, db: Session = Depends(get_db)):
    history = db.query(CartHistory).filter(CartHistory.id == id).first()
    if not history:
        raise HTTPException(status_code=400, detail="주문 내역이 없습니다.")
    return history

def _current_user(request: Request, db: Session) -> User:
    token = request.cookies.get("__stage__")
    if not token:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")
    payload = verify_access_token(token)
    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="유저를 찾을 수 없습니다.")
    return user


@router.get("/by-payment/{payment_key}", response_model=List[CartHistoryResponse])
def get_histories_by_payment(
    payment_key: UUID,
    request: Request,
    db: Session = Depends(get_db),
):
    user = _current_user(request, db)
    rows = (
        db.query(CartHistory)
        .filter(
            CartHistory.payment_key == payment_key,
            CartHistory.user_id == user.id,
        )
        .all()
    )
    if not rows:
        raise HTTPException(status_code=404, detail="해당 결제의 히스토리가 없습니다.")
    return rows

@router.get("/ranking", response_model=list[GoodsRankingItem])
def goods_ranking(
    limit: int = 5,
    db: Session = Depends(get_db),
):
    rows = (
        db.query(
            CartHistory.name,
            func.sum(CartHistory.quantity).label("value"),
        )
        .filter(
            CartHistory.status == CartStatusEnum.pending,
            CartHistory.name.isnot(None),
        )
        .group_by(CartHistory.name)
        .order_by(func.sum(CartHistory.quantity).desc())
        .limit(limit)
        .all()
    )

    return rows