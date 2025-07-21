"""Fix land model

Revision ID: 66a6fc5dc145
Revises: a0298fcaa4ae
Create Date: 2025-06-24 04:00:43.661125

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '66a6fc5dc145'
down_revision = 'a0298fcaa4ae'
branch_labels = None
depends_on = None


def upgrade():
    # Conversion explicite depuis VARCHAR(36) vers UUID
    op.execute('ALTER TABLE news ALTER COLUMN id TYPE UUID USING id::uuid')
    
    # Alternative si l'approche directe échoue :
    # op.execute('''
    #    ALTER TABLE news 
    #    ALTER COLUMN id DROP DEFAULT,
    #    ALTER COLUMN id TYPE UUID USING id::uuid,
    #    ALTER COLUMN id SET DEFAULT gen_random_uuid()
    # ''')


def downgrade():
    # Conversion de retour vers VARCHAR(36)
    op.alter_column('news', 'id', type_=sa.VARCHAR(36),
                   postgresql_using='id::varchar')
