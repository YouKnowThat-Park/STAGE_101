from fastapi import FastAPI
from server.database import engine
from server.database import Base
from server.routes import shop
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 프론트엔드 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(shop.router)


@app.get("/")
def root():
    return {"message": "FastAPI 및 PostgreSQL 마이그레이션 완료"}

@app.on_event("startup")
def show_routes():
    from fastapi.routing import APIRoute
    print("\n📦 [라우트 목록]")
    for route in app.routes:
        if isinstance(route, APIRoute):
            print(f"➡️ {route.path} ({route.methods})")