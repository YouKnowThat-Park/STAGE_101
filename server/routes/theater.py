from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.theater import Theater
from server.schemas.theater import TheaterResponse

router = APIRouter(prefix="/theaters", tags=["Theater"])

@router.get("/by-type/{theater_type}", response_model=TheaterResponse)
def get_theater_by_type(theater_type: str, db: Session = Depends(get_db)):
    theater = db.query(Theater).filter(Theater.type == theater_type, Theater.status == False).first()

    if not theater:
        raise HTTPException(status_code=404, detail=f"{theater_type} 타입 극장을 찾을 수 없습니다.")

    return theater