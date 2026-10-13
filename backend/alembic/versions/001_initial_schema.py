"""Initial schema and seed data for SIGO-PJ Zulia

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-12 17:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Extensión UUID
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')

    # 1. municipios
    op.create_table(
        'municipios',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('nombre', sa.String(length=100), nullable=False),
        sa.Column('subregion', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text("TIMEZONE('utc', NOW())"), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('nombre')
    )

    # 2. parroquias
    op.create_table(
        'parroquias',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('municipio_id', sa.Integer(), nullable=False),
        sa.Column('nombre', sa.String(length=100), nullable=False),
        sa.ForeignKeyConstraint(['municipio_id'], ['municipios.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('municipio_id', 'nombre', name='uq_municipio_parroquia')
    )

    # 3. centros_votacion
    op.create_table(
        'centros_votacion',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('parroquia_id', sa.Integer(), nullable=False),
        sa.Column('codigo_cne', sa.String(length=20), nullable=False),
        sa.Column('nombre', sa.String(length=200), nullable=False),
        sa.Column('direccion', sa.Text(), nullable=True),
        sa.Column('mesas_electorales', sa.Integer(), server_default='1', nullable=False),
        sa.Column('votantes_esperados', sa.Integer(), server_default='0', nullable=False),
        sa.ForeignKeyConstraint(['parroquia_id'], ['parroquias.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('codigo_cne')
    )

    # 4. users
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('uuid_generate_v4()'), nullable=False),
        sa.Column('email', sa.String(length=150), nullable=False),
        sa.Column('full_name', sa.String(length=150), nullable=False),
        sa.Column('google_id', sa.String(length=100), nullable=True),
        sa.Column('avatar_url', sa.Text(), nullable=True),
        sa.Column('role', sa.String(length=30), server_default='OPERADOR_PARROQUIAL', nullable=False),
        sa.Column('municipio_id', sa.Integer(), nullable=True),
        sa.Column('parroquia_id', sa.Integer(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text("TIMEZONE('utc', NOW())"), nullable=False),
        sa.Column('last_login', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['municipio_id'], ['municipios.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['parroquia_id'], ['parroquias.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('google_id')
    )

    # 5. militantes
    op.create_table(
        'militantes',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('uuid_generate_v4()'), nullable=False),
        sa.Column('nacionalidad', sa.String(length=1), server_default='V', nullable=False),
        sa.Column('cedula', sa.Integer(), nullable=False),
        sa.Column('primer_nombre', sa.String(length=60), nullable=False),
        sa.Column('segundo_nombre', sa.String(length=60), nullable=True),
        sa.Column('primer_apellido', sa.String(length=60), nullable=False),
        sa.Column('segundo_apellido', sa.String(length=60), nullable=True),
        sa.Column('fecha_nacimiento', sa.Date(), nullable=False),
        sa.Column('telefono', sa.String(length=20), nullable=False),
        sa.Column('email', sa.String(length=150), nullable=True),
        sa.Column('ocupacion', sa.String(length=100), nullable=True),
        sa.Column('es_estudiante', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('universidad', sa.String(length=100), nullable=True),
        sa.Column('parroquia_id', sa.Integer(), nullable=False),
        sa.Column('centro_votacion_id', sa.Integer(), nullable=True),
        sa.Column('rol_electoral', sa.String(length=40), server_default='NO_ASIGNADO', nullable=False),
        sa.Column('activo', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text("TIMEZONE('utc', NOW())"), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text("TIMEZONE('utc', NOW())"), nullable=False),
        sa.CheckConstraint("nacionalidad IN ('V', 'E')", name='chk_militante_nacionalidad'),
        sa.ForeignKeyConstraint(['centro_votacion_id'], ['centros_votacion.id'], ),
        sa.ForeignKeyConstraint(['parroquia_id'], ['parroquias.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('cedula')
    )

    # 6. cargos_estructura y asignaciones_cargos
    op.create_table(
        'cargos_estructura',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('nivel', sa.String(length=20), nullable=False),
        sa.Column('nombre_cargo', sa.String(length=100), nullable=False),
        sa.Column('orden_jerarquico', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_table(
        'asignaciones_cargos',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('uuid_generate_v4()'), nullable=False),
        sa.Column('cargo_id', sa.Integer(), nullable=False),
        sa.Column('militante_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('municipio_id', sa.Integer(), nullable=True),
        sa.Column('parroquia_id', sa.Integer(), nullable=True),
        sa.Column('estado', sa.String(length=20), server_default='ACTIVO', nullable=False),
        sa.Column('fecha_nombramiento', sa.Date(), nullable=False),
        sa.ForeignKeyConstraint(['cargo_id'], ['cargos_estructura.id'], ),
        sa.ForeignKeyConstraint(['militante_id'], ['militantes.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['municipio_id'], ['municipios.id'], ),
        sa.ForeignKeyConstraint(['parroquia_id'], ['parroquias.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('cargo_id', 'municipio_id', 'parroquia_id', name='uq_cargo_territorio')
    )

    # 7. leads
    op.create_table(
        'leads',
        sa.Column('id', postgresql.UUID(as_uuid=True), server_default=sa.text('uuid_generate_v4()'), nullable=False),
        sa.Column('tipo', sa.String(length=50), nullable=False),
        sa.Column('nombre_completo', sa.String(length=150), nullable=False),
        sa.Column('edad', sa.Integer(), nullable=True),
        sa.Column('telefono', sa.String(length=30), nullable=False),
        sa.Column('email', sa.String(length=150), nullable=True),
        sa.Column('municipio_texto', sa.String(length=100), nullable=False),
        sa.Column('municipio_id', sa.Integer(), nullable=True),
        sa.Column('area_interes', sa.String(length=100), nullable=True),
        sa.Column('mensaje', sa.Text(), nullable=True),
        sa.Column('estado', sa.String(length=30), server_default='NUEVO', nullable=False),
        sa.Column('asignado_a', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text("TIMEZONE('utc', NOW())"), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text("TIMEZONE('utc', NOW())"), nullable=False),
        sa.ForeignKeyConstraint(['asignado_a'], ['users.id'], ),
        sa.ForeignKeyConstraint(['municipio_id'], ['municipios.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Seeders obligatorios
    # 21 Municipios
    municipios_seed = [
        ("Maracaibo", "Metropolitana"),
        ("San Francisco", "Metropolitana"),
        ("Cabimas", "COL"),
        ("Lagunillas", "COL"),
        ("Machiques de Perijá", "Perijá"),
        ("Colón", "Sur del Lago"),
        ("Santa Rita", "COL"),
        ("Mara", "Guajira"),
        ("Baralt", "COL"),
        ("Valmore Rodríguez", "COL"),
        ("Miranda", "COL"),
        ("Simón Bolívar", "COL"),
        ("Rosario de Perijá", "Perijá"),
        ("Jesús Enrique Lossada", "Metropolitana"),
        ("La Cañada de Urdaneta", "Metropolitana"),
        ("Guajira", "Guajira"),
        ("Catatumbo", "Sur del Lago"),
        ("Francisco Javier Pulgar", "Sur del Lago"),
        ("Sucre", "Sur del Lago"),
        ("Jesús María Semprúm", "Sur del Lago"),
        ("Almirante Padilla", "Metropolitana"),
    ]
    for nombre, subregion in municipios_seed:
        op.execute(f"INSERT INTO municipios (nombre, subregion) VALUES ('{nombre}', '{subregion}') ON CONFLICT (nombre) DO NOTHING;")

    # 13 Cargos Estatutarios Municipales
    cargos_municipales = [
        "Coordinador Juvenil Municipal",
        "Coordinador Adjunto Juvenil Municipal",
        "Coordinador de Asuntos Políticos",
        "Coordinador de Organización",
        "Coordinador de Formación",
        "Coordinador de Comunicación",
        "Coordinador de Asuntos Universitarios",
        "Coordinador de Activismo",
        "Coordinador Electoral",
        "Coordinador de Asuntos Sociales",
        "Coordinador de DDHH",
        "Coordinador de Ambiente y Desarrollo",
        "Coordinador Político I",
        "Coordinador Político II"
    ]
    for idx, cargo in enumerate(cargos_municipales[:13], start=1):
        op.execute(f"INSERT INTO cargos_estructura (nivel, nombre_cargo, orden_jerarquico) VALUES ('MUNICIPAL', '{cargo}', {idx});")

    # 9 Cargos Estatutarios Parroquiales
    cargos_parroquiales = [
        "Coordinador Juvenil Parroquial",
        "Coordinador Adjunto Juvenil Parroquial",
        "Coordinador de Asuntos Políticos",
        "Coordinador de Organización",
        "Coordinador de Formación",
        "Coordinador de Comunicación",
        "Coordinador de Activismo",
        "Coordinador Electoral",
        "Coordinador Político I"
    ]
    for idx, cargo in enumerate(cargos_parroquiales, start=1):
        op.execute(f"INSERT INTO cargos_estructura (nivel, nombre_cargo, orden_jerarquico) VALUES ('PARROQUIAL', '{cargo}', {idx});")

    # Usuario Superadmin Semilla
    op.execute("""
        INSERT INTO users (email, full_name, role, is_active)
        VALUES ('admin@pjzulia.org.ve', 'Superadmin Regional SIGO', 'SUPERADMIN', true)
        ON CONFLICT (email) DO NOTHING;
    """)


def downgrade() -> None:
    op.drop_table('leads')
    op.drop_table('asignaciones_cargos')
    op.drop_table('cargos_estructura')
    op.drop_table('militantes')
    op.drop_table('users')
    op.drop_table('centros_votacion')
    op.drop_table('parroquias')
    op.drop_table('municipios')
