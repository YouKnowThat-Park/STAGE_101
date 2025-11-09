"""drop UNIQUE on cart_histories.payment_key and add non-unique index

Revision ID: d43140b0b4bd
Revises: ac3c82c74978
Create Date: 2025-11-10 02:58:35.662661
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'd43140b0b4bd'
down_revision: Union[str, Sequence[str], None] = 'ac3c82c74978'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

TABLE = 'cart_histories'
COL = 'payment_key'
UNQ_NAME = f'{TABLE}_{COL}_key'          # 가장 흔한 제약/인덱스 이름 패턴
IDX_NAME = f'ix_{TABLE}_{COL}'           # 우리가 만들 비유니크 인덱스 이름


def upgrade() -> None:
    """Upgrade schema: drop UNIQUE on payment_key, add non-unique index."""
    # 1) UNIQUE 제약(또는 unique index) 제거
    #   환경마다 제약/인덱스 이름이 다를 수 있어 try/except 로 방어적으로 처리
    try:
        op.drop_constraint(UNQ_NAME, TABLE, type_='unique')
    except Exception:
        # unique 제약이 아니라 unique 인덱스로 존재할 수 있음
        try:
            op.drop_index(UNQ_NAME, table_name=TABLE)
        except Exception:
            pass

    # 2) 비유니크 인덱스 생성(조회 성능용)
    #    이미 존재한다면 에러 날 수 있으니, 존재 시 건너뛰도록 try/except
    try:
        op.create_index(IDX_NAME, TABLE, [COL], unique=False)
    except Exception:
        pass


def downgrade() -> None:
    """Downgrade schema: drop non-unique index, restore UNIQUE on payment_key."""
    # 1) 비유니크 인덱스 제거
    try:
        op.drop_index(IDX_NAME, table_name=TABLE)
    except Exception:
        pass

    # 2) UNIQUE 제약 복원
    #    제약으로 복원(가장 표준적)
    try:
        op.create_unique_constraint(UNQ_NAME, TABLE, [COL])
    except Exception:
        # 일부 환경에서는 같은 이름 충돌/기존 인덱스와 충돌 가능성 -> 무시
        pass