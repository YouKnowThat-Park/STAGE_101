"""Add unique constraint to users.nickname

Revision ID: d2a750a27869
Revises: 8e8e5aa726d7
Create Date: 2025-11-18 16:41:46.295326
"""

from alembic import op
import sqlalchemy as sa
from typing import Union, Sequence

# revision identifiers, used by Alembic.
revision: str = 'd2a750a27869'
down_revision: Union[str, Sequence[str], None] = '8e8e5aa726d7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_unique_constraint("uq_users_nickname", "users", ["nickname"])


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_constraint("uq_users_nickname", "users", type_="unique")
