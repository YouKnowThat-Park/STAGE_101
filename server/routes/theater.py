from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.theater import Theater
from server.schemas.theater import TheaterResponse
from sqlalchemy import or_
from uuid import UUID as _UUID

router = APIRouter(prefix="/theaters", tags=["Theater"])

@router.get("/by-type/{theater_key}", response_model=TheaterResponse)
def get_theater_by_type(theater_key: str, db: Session = Depends(get_db)):
    """
    - 경로는 by-type 유지
    - theater_key가 UUID면 id로 조회
    - 아니면 type/slug/name 중 존재하는 컬럼으로 조회
    - status == False 조건은 기존 로직 유지 (필요 없으면 제거)
    """
    # 1) UUID로 파싱 시도
    theater = None
    try:
        uid = _UUID(theater_key)
        theater = (
            db.query(Theater)
            .filter(
                Theater.id == uid,
                Theater.status == False
            )
            .first()
        )
    except ValueError:
        # 2) 문자열 키로 조회 (존재하는 컬럼만 사용)
        filters = []
        if hasattr(Theater, "type"):
            filters.append(Theater.type == theater_key)
        if hasattr(Theater, "slug"):
            filters.append(Theater.slug == theater_key)
        if hasattr(Theater, "code"):
            filters.append(Theater.code == theater_key)
        if hasattr(Theater, "name"):
            filters.append(Theater.name == theater_key)

        if not filters:
            # 모델에 문자열 매칭용 컬럼이 하나도 없다면, 바로 404
            raise HTTPException(status_code=404, detail="검색 가능한 컬럼(type/slug/code/name)이 없습니다.")

        theater = (
            db.query(Theater)
            .filter(
                or_(*filters),
                Theater.status == False
            )
            .first()
        )

    if not theater:
        raise HTTPException(
            status_code=404,
            detail=f"'{theater_key}' 로 극장을 찾을 수 없습니다."
        )

    return theater