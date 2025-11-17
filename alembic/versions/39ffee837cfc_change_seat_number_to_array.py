"""Change seat_number to ARRAY

Revision ID: 39ffee837cfc
Revises: d43140b0b4bd
Create Date: 2025-11-15 02:14:24.909004

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '39ffee837cfc'
down_revision: Union[str, Sequence[str], None] = 'd43140b0b4bd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('reservations', sa.Column('seat_number_tmp', sa.ARRAY(sa.Text()), nullable=True))

    op.execute("""
        UPDATE reservations
        SET seat_number_tmp = string_to_array(seat_number, ',')
    """)

    op.drop_column('reservations', 'seat_number')

    op.alter_column(
        'reservations',
        'seat_number_tmp',
        new_column_name='seat_number',
        existing_type=sa.ARRAY(sa.Text()),
        nullable=False
    )


def downgrade():
    op.add_column('reservations', sa.Column('seat_number_tmp', sa.Text(), nullable=True))

    op.execute("""
        UPDATE reservations
        SET seat_number_tmp = array_to_string(seat_number, ',')
    """)

    op.drop_column('reservations', 'seat_number')

    op.alter_column(
        'reservations',
        'seat_number_tmp',
        new_column_name='seat_number',
        existing_type=sa.Text(),
        nullable=False
    )