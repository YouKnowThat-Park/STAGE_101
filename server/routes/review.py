from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List, cast

from server.database import get_db
from server.models.review import Review
from server.schemas.review import ReviewsListResponse
from server.schemas.user import UserReviewRanking, UserReviewRow
from server.models.user import User

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("/", response_model=ReviewsListResponse)
def get_all_reviews(
    page: int = Query(1, ge=1),
    sort: str = Query("newest", regex="^(newest|oldest)$"),
    order: str = Query("desc", regex="^(asc|desc)$"),
    user_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):

    query = db.query(Review)

    #  유저 필터
    if user_id:
        query = query.filter(Review.user_id == user_id)

    #  정렬 설정
    if sort == "newest":
        query = query.order_by(Review.created_at.desc())
    elif sort == "oldest":
        query = query.order_by(Review.created_at.asc())

    #  페이지네이션
    page_size = 10
    total_count = query.count()
    reviews = query.offset((page - 1) * page_size).limit(page_size).all()

    #  다음 페이지 계산
    next_page = page + 1 if (page * page_size) < total_count else None

    #  프론트에서 기대하는 구조로 반환
    return {
        "data": reviews,
        "totalCount": total_count,
        "nextPage": next_page,
    }


@router.get("/ranking", response_model=List[UserReviewRanking])
def get_user_review_ranking(db: Session = Depends(get_db)):
    result = (
        db.query(
            Review.user_id,
            func.count(Review.id),
            User.nickname,
            User.profile_img,
        )
        .join(User, User.id == Review.user_id)
        .group_by(Review.user_id, User.nickname, User.profile_img)
        .order_by(func.count(Review.id).desc())
        .limit(3)
        .all()
    )

    return [
        UserReviewRanking(
            user_id=row[0],
            count=row[1],
            nickname=row[2] or "익명",
            profile_img=row[3] or "/default.png",
        )
        for row in result
    ]