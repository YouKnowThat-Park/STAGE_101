"""Add ondelete CASCADE to user-related foreign keys

Revision ID: 8e8e5aa726d7
Revises: 4d7e6db7c1b1
Create Date: 2025-11-18 16:13:11.437408
"""

from alembic import op
import sqlalchemy as sa
from typing import Union, Sequence

# revision identifiers, used by Alembic.
revision: str = '8e8e5aa726d7'
down_revision: Union[str, Sequence[str], None] = '4d7e6db7c1b1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Apply ondelete='CASCADE' to all user-related foreign keys."""

    op.drop_constraint('reviews_user_id_fkey', 'reviews', type_='foreignkey')
    op.create_foreign_key(
        'reviews_user_id_fkey', 'reviews', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )

    op.drop_constraint('payments_user_id_fkey', 'payments', type_='foreignkey')
    op.create_foreign_key(
        'payments_user_id_fkey', 'payments', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )

    op.drop_constraint('reservations_user_id_fkey', 'reservations', type_='foreignkey')
    op.create_foreign_key(
        'reservations_user_id_fkey', 'reservations', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )

    op.drop_constraint('carts_user_id_fkey', 'carts', type_='foreignkey')
    op.create_foreign_key(
        'carts_user_id_fkey', 'carts', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )

    op.drop_constraint('qnas_user_id_fkey', 'qnas', type_='foreignkey')
    op.create_foreign_key(
        'qnas_user_id_fkey', 'qnas', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )

    op.drop_constraint('cart_histories_user_id_fkey', 'cart_histories', type_='foreignkey')
    op.create_foreign_key(
        'cart_histories_user_id_fkey', 'cart_histories', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )

    op.drop_constraint('qr_sessions_user_id_fkey', 'qr_sessions', type_='foreignkey')
    op.create_foreign_key(
        'qr_sessions_user_id_fkey', 'qr_sessions', 'users',
        ['user_id'], ['id'],
        ondelete='CASCADE'
    )


def downgrade() -> None:
    """Revert ondelete='CASCADE' from user-related foreign keys."""

    op.drop_constraint('reviews_user_id_fkey', 'reviews', type_='foreignkey')
    op.create_foreign_key(
        'reviews_user_id_fkey', 'reviews', 'users',
        ['user_id'], ['id']
    )

    op.drop_constraint('payments_user_id_fkey', 'payments', type_='foreignkey')
    op.create_foreign_key(
        'payments_user_id_fkey', 'payments', 'users',
        ['user_id'], ['id']
    )

    op.drop_constraint('reservations_user_id_fkey', 'reservations', type_='foreignkey')
    op.create_foreign_key(
        'reservations_user_id_fkey', 'reservations', 'users',
        ['user_id'], ['id']
    )

    op.drop_constraint('carts_user_id_fkey', 'carts', type_='foreignkey')
    op.create_foreign_key(
        'carts_user_id_fkey', 'carts', 'users',
        ['user_id'], ['id']
    )

    op.drop_constraint('qnas_user_id_fkey', 'qnas', type_='foreignkey')
    op.create_foreign_key(
        'qnas_user_id_fkey', 'qnas', 'users',
        ['user_id'], ['id']
    )

    op.drop_constraint('cart_histories_user_id_fkey', 'cart_histories', type_='foreignkey')
    op.create_foreign_key(
        'cart_histories_user_id_fkey', 'cart_histories', 'users',
        ['user_id'], ['id']
    )

    op.drop_constraint('qr_sessions_user_id_fkey', 'qr_sessions', type_='foreignkey')
    op.create_foreign_key(
        'qr_sessions_user_id_fkey', 'qr_sessions', 'users',
        ['user_id'], ['id']
    )
