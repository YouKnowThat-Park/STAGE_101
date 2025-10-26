from sqlalchemy import create_engine
# → SQLALchemy에서 데이터베이스와 연결을 도와주는 함수
from sqlalchemy.ext.declarative import declarative_base
# → 모든 모델이 이 클래스를 상속해서 정의도로록 함 (모델의 부모 클래스)
from sqlalchemy.orm import sessionmaker
# → 데이터 베이스 세션을 관리해주는 도구
from dotenv import load_dotenv
# → env 파일 환경 변수를 불러오는 함수
import os
# → 파이썬 표준 모듈 - 운영체제 환경변수 접근할 때 사용

# 장고로 치면 settings.py 역할이구나

load_dotenv()
# → env 불러오기

DATABASE_URL = os.getenv("DATABASE_URL")
# → 환경변수에서 DATABASE_URL를 읽을 수 있도록

engine = create_engine(DATABASE_URL)
# → SQLALchemy 엔진을 생성 해서 DB랑 연결
# → SQL올케미?

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# → 요청마다 세션을 만들고 요청이 끝나면 정리

Base = declarative_base()
# →  모델들이 상속받을 베이스 클래스 (테이블 정리용)
