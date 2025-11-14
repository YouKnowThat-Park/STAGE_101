"""add payment constraints and cron

Revision ID: 4d7e6db7c1b1
Revises: 39ffee837cfc
Create Date: 2025-11-15 03:43:00.274482

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "4d7e6db7c1b1"
down_revision: Union[str, Sequence[str], None] = "39ffee837cfc"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # ------------------------------------
    # 1. payments 테이블에서 'pending' 삭제
    # ------------------------------------
    op.execute(
        """
    DELETE FROM payments
    WHERE status = 'pending';
    """
    )

    # -----------------------------------------------------
    # 2. payments 테이블에 유니크 제약/인덱스 추가 (paid만 유니크)
    #    - 예전 unique_reservation_id 제약 있으면 삭제
    #    - status = 'paid' 인 경우에만 reservation_id 유니크 (부분 유니크 인덱스)
    # -----------------------------------------------------
    op.execute(
        """
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'unique_reservation_id'
      ) THEN
        ALTER TABLE payments DROP CONSTRAINT unique_reservation_id;
      END IF;
    END $$;
    """
    )

    op.execute(
        """
    CREATE UNIQUE INDEX IF NOT EXISTS unique_paid_reservation
    ON payments (reservation_id)
    WHERE status = 'paid';
    """
    )

    # -------------------------------------------------
    # 3. payments.status = 'pending' 자체를 막는 체크
    # -------------------------------------------------
    op.execute(
        """
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.check_constraints
        WHERE constraint_name = 'no_pending_payments'
      ) THEN
        ALTER TABLE payments
        ADD CONSTRAINT no_pending_payments CHECK (status != 'pending');
      END IF;
    END $$;
    """
    )

    # ------------------------------------------------------
    # 4. BEFORE INSERT 트리거로 pending insert 이중 방어
    # ------------------------------------------------------
    op.execute(
        """
    CREATE OR REPLACE FUNCTION prevent_pending_payment_insert()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.status = 'pending' THEN
        RAISE EXCEPTION '🚫 payments 테이블에 status = ''pending'' 값은 허용되지 않습니다.';
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    """
    )

    op.execute(
        """
    DROP TRIGGER IF EXISTS trg_block_pending ON payments;

    CREATE TRIGGER trg_block_pending
    BEFORE INSERT ON payments
    FOR EACH ROW
    EXECUTE FUNCTION prevent_pending_payment_insert();
    """
    )


def downgrade():
    # 부분 유니크 인덱스 제거
    op.execute(
        """
    DROP INDEX IF EXISTS unique_paid_reservation;
    """
    )

    # 트리거 및 함수 제거
    op.execute(
        """
    DROP TRIGGER IF EXISTS trg_block_pending ON payments;
    DROP FUNCTION IF EXISTS prevent_pending_payment_insert();
    """
    )

    # 제약 제거
    op.execute(
        """
    ALTER TABLE payments DROP CONSTRAINT IF EXISTS no_pending_payments;
    """
    )
