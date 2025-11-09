"""set cart_histories.cart_id ON DELETE SET NULL and nullable

Revision ID: ac3c82c74978
Revises: 84e25636c975
Create Date: 2025-11-10 01:13:14.055465
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector

# revision identifiers, used by Alembic.
revision: str = 'ac3c82c74978'
down_revision: Union[str, Sequence[str], None] = '84e25636c975'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

TABLE = 'cart_histories'
COLUMN = 'cart_id'
REF_TABLE = 'carts'
REF_COLUMN = 'id'

def _find_fk_name(connection, table_name: str, column_name: str, referred_table: str):
    """현재 컬럼에 걸려있는 FK 이름을 찾아 반환"""
    insp = Inspector.from_engine(connection)
    for fk in insp.get_foreign_keys(table_name):
        cols = fk.get('constrained_columns') or []
        if len(cols) == 1 and cols[0] == column_name and fk.get('referred_table') == referred_table:
            return fk.get('name')
    return None


def upgrade() -> None:
    """Upgrade schema."""
    conn = op.get_bind()

    # 1) 기존 FK 제거
    fk_name = _find_fk_name(conn, TABLE, COLUMN, REF_TABLE)
    if fk_name:
        op.drop_constraint(fk_name, TABLE, type_='foreignkey')

    # 2) cart_id 컬럼을 NULL 허용으로 변경
    op.alter_column(
        TABLE,
        COLUMN,
        existing_type=sa.dialects.postgresql.UUID(as_uuid=True),
        nullable=True,
        # existing_nullable 값은 환경마다 다를 수 있어 명시하지 않아도 됨.
        # 명시하고 싶다면 기존 상태에 맞춰 넣기:
        # existing_nullable=False,
    )

    # 3) 새 FK: ON DELETE SET NULL
    op.create_foreign_key(
        constraint_name=f'{TABLE}_{COLUMN}_fkey_setnull',
        source_table=TABLE,
        referent_table=REF_TABLE,
        local_cols=[COLUMN],
        remote_cols=[REF_COLUMN],
        ondelete='SET NULL',
    )


def downgrade() -> None:
    """Downgrade schema."""
    conn = op.get_bind()

    # 1) SET NULL FK 제거
    setnull_name = f'{TABLE}_{COLUMN}_fkey_setnull'
    insp = Inspector.from_engine(conn)
    existing_fks = [fk.get('name') for fk in insp.get_foreign_keys(TABLE)]
    if setnull_name in existing_fks:
        op.drop_constraint(setnull_name, TABLE, type_='foreignkey')
    else:
        # 방어적으로 기존 FK 이름을 탐색해서 제거
        fk_name = _find_fk_name(conn, TABLE, COLUMN, REF_TABLE)
        if fk_name:
            op.drop_constraint(fk_name, TABLE, type_='foreignkey')

    # 2) cart_id 다시 NOT NULL 로 (주의: NULL 데이터가 있으면 실패할 수 있음)
    op.alter_column(
        TABLE,
        COLUMN,
        existing_type=sa.dialects.postgresql.UUID(as_uuid=True),
        nullable=False,
        # existing_nullable=True,
    )

    # 3) 원래대로 ON DELETE CASCADE 재생성
    op.create_foreign_key(
        constraint_name=f'{TABLE}_{COLUMN}_fkey',
        source_table=TABLE,
        referent_table=REF_TABLE,
        local_cols=[COLUMN],
        remote_cols=[REF_COLUMN],
        ondelete='CASCADE',
    )
