"""manually add password column to users

Revision ID: 635b0eb6b625
Revises: a40e49345efb
Create Date: 2025-11-04 02:52:49.947222

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '635b0eb6b625'
down_revision: Union[str, Sequence[str], None] = 'a40e49345efb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('password', sa.Text(), nullable=True))

def downgrade() -> None:
    op.drop_column('users', 'password')
