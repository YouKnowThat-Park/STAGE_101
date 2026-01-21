from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from server.database import get_db
from server.models.theater import Theater
from server.schemas.theater import TheaterResponse, TheaterListStats, TheaterListResponse
from sqlalchemy import or_, func
from uuid import UUID as _UUID

router = APIRouter(prefix="/theaters", tags=["Theater"], redirect_slashes=False)

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

@router.get("/list", response_model=TheaterListResponse)
def list_theaters(
    db: Session = Depends(get_db),
    type: str | None = Query(default=None),
    status: bool = Query(default=False), 
    include_stats: bool = Query(default=False),
    limit: int = Query(default=20, ge=1, le=200),
    offset: int = Query(default=0, ge=0),
):
    
    q = db.query(Theater).filter(Theater.status == status)

    if type:
        q = q.filter(Theater.type == type)

    items = (
        q.order_by(Theater.start_date.desc(), Theater.created_at.desc())
         .offset(offset)
         .limit(limit)
         .all()
    )

    stats = None
    if include_stats:
        total = q.count()

        rows = (
            q.with_entities(Theater.type, func.count(Theater.id))
             .group_by(Theater.type)
             .all()
        )
        by_type = {t: c for (t, c) in rows}

        now_showing = total if status else 0

        stats = TheaterListStats(total=total, by_type=by_type, now_showing=now_showing)

    return TheaterListResponse(items=items, stats=stats)