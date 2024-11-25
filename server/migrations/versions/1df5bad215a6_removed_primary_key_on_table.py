"""removed primary key on table

Revision ID: 1df5bad215a6
Revises: 80ea1f471e97
Create Date: 2024-11-25 15:01:45.388720

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1df5bad215a6'
down_revision = '80ea1f471e97'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('order_products', schema=None) as batch_op:
        batch_op.alter_column('order_id',
               existing_type=sa.INTEGER(),
               nullable=False)
        batch_op.drop_column('id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('order_products', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id', sa.INTEGER(), nullable=False))
        batch_op.alter_column('order_id',
               existing_type=sa.INTEGER(),
               nullable=True)

    # ### end Alembic commands ###
