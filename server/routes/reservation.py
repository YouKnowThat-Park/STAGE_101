from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session, joinedload
from typing import List

from server.database import get_db
from server.models.reservation import Reservation
from server.models.user import User
from server.schemas.reservation import ReservationResponse
from server.security import verify_access_token

router = APIRouter(prefix="/reservations", tags=["Reservations"])

@router.get("/", response_model=List[ReservationResponse])
def get_all_reservations(db: Session = Depends(get_db)):
    reservations = db.query(Reservation).options(joinedload(Reservation.theater)).all()
    return reservations


@router.get("/me", response_model=List[ReservationResponse])
def get_my_reservations(request: Request, db: Session = Depends(get_db)):
    
    token = request.cookies.get("__stage__")
    if not token:
        raise HTTPException(status_code=401, detail="토큰이 없습니다.")
    
    payload = verify_access_token(token)
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="토큰 정보가 올바르지 않습니다.")
    
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="유저를 찾을 수 없습니다.")
    
    # ✅ Theater 관계 join
    reservations = (
        db.query(Reservation)
        .options(joinedload(Reservation.theater))
        .filter(Reservation.user_id == user.id)
        .all()
    )
    return reservations