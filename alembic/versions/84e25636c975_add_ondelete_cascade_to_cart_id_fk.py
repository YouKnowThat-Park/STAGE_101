"""add ondelete cascade to cart_id fk

Revision ID: 84e25636c975
Revises: 1506aeb7009a
Create Date: 2025-11-09 03:41:25.173108
"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '84e25636c975'
down_revision: Union[str, Sequence[str], None] = '1506aeb7009a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint('cart_histories_cart_id_fkey', 'cart_histories', type_='foreignkey')

    op.create_foreign_key(
        'cart_histories_cart_id_fkey',
        source_table='cart_histories',
        referent_table='carts',
        local_cols=['cart_id'],
        remote_cols=['id'],
        ondelete='CASCADE'
    )


def downgrade() -> None:
    op.drop_constraint('cart_histories_cart_id_fkey', 'cart_histories', type_='foreignkey')

    op.create_foreign_key(
        'cart_histories_cart_id_fkey',
        source_table='cart_histories',
        referent_table='carts',
        local_cols=['cart_id'],
        remote_cols=['id']
    )
