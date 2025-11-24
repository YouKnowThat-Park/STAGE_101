from fastapi import APIRouter

from server.routes.user import public, social

router = APIRouter()
router.include_router(public.router)
router.include_router(social.router)
