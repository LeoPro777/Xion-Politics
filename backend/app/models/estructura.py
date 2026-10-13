from datetime import date, datetime, timezone
import uuid
from typing import Optional
from sqlalchemy import (
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    Uuid,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Municipio(Base):
    __tablename__ = "municipios"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    subregion: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    parroquias = relationship("Parroquia", back_populates="municipio", cascade="all, delete-orphan")


class Parroquia(Base):
    __tablename__ = "parroquias"
    __table_args__ = (
        UniqueConstraint("municipio_id", "nombre", name="uq_municipio_parroquia"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    municipio_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("municipios.id", ondelete="CASCADE"), nullable=False, index=True
    )
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)

    municipio = relationship("Municipio", back_populates="parroquias")
    centros_votacion = relationship("CentroVotacion", back_populates="parroquia", cascade="all, delete-orphan")


class CentroVotacion(Base):
    __tablename__ = "centros_votacion"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    parroquia_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("parroquias.id", ondelete="CASCADE"), nullable=False, index=True
    )
    codigo_cne: Mapped[str] = mapped_column(String(20), unique=True, nullable=False, index=True)
    nombre: Mapped[str] = mapped_column(String(200), nullable=False)
    direccion: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    mesas_electorales: Mapped[int] = mapped_column(Integer, default=1)
    votantes_esperados: Mapped[int] = mapped_column(Integer, default=0)

    parroquia = relationship("Parroquia", back_populates="centros_votacion")


class CargoEstructura(Base):
    __tablename__ = "cargos_estructura"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nivel: Mapped[str] = mapped_column(String(20), nullable=False)  # MUNICIPAL o PARROQUIAL
    nombre_cargo: Mapped[str] = mapped_column(String(100), nullable=False)
    orden_jerarquico: Mapped[int] = mapped_column(Integer, nullable=False)


class AsignacionCargo(Base):
    __tablename__ = "asignaciones_cargos"
    __table_args__ = (
        UniqueConstraint("cargo_id", "municipio_id", "parroquia_id", name="uq_cargo_territorio"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )
    cargo_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("cargos_estructura.id"), nullable=False
    )
    militante_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("militantes.id", ondelete="CASCADE"), nullable=False
    )
    municipio_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("municipios.id"), nullable=True
    )
    parroquia_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("parroquias.id"), nullable=True
    )
    estado: Mapped[str] = mapped_column(String(20), default="ACTIVO")  # ACTIVO, SUPLENTE, SUSPENDIDO
    fecha_nombramiento: Mapped[date] = mapped_column(Date, nullable=False)

    cargo = relationship("CargoEstructura")
    militante = relationship("Militante", back_populates="asignacion")
    municipio = relationship("Municipio")
    parroquia = relationship("Parroquia")
