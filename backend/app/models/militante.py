from datetime import date, datetime, timezone
import uuid
from typing import Optional
from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    CheckConstraint,
    Uuid
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Militante(Base):
    __tablename__ = "militantes"
    __table_args__ = (
        CheckConstraint("nacionalidad IN ('V', 'E')", name="chk_militante_nacionalidad"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )
    nacionalidad: Mapped[str] = mapped_column(String(1), default="V", nullable=False)
    cedula: Mapped[int] = mapped_column(Integer, unique=True, nullable=False, index=True)
    primer_nombre: Mapped[str] = mapped_column(String(60), nullable=False)
    segundo_nombre: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
    primer_apellido: Mapped[str] = mapped_column(String(60), nullable=False)
    segundo_apellido: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
    fecha_nacimiento: Mapped[date] = mapped_column(Date, nullable=False)
    telefono: Mapped[str] = mapped_column(String(20), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    ocupacion: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    es_estudiante: Mapped[bool] = mapped_column(Boolean, default=False)
    universidad: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    parroquia_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("parroquias.id"), nullable=False, index=True
    )
    centro_votacion_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("centros_votacion.id"), nullable=True, index=True
    )
    rol_electoral: Mapped[str] = mapped_column(
        String(40), default="NO_ASIGNADO"  # TESTIGO, COORDINADOR_CENTRO, LOGISTICA
    )
    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    parroquia = relationship("Parroquia")
    centro_votacion = relationship("CentroVotacion")
    asignacion = relationship("AsignacionCargo", back_populates="militante", uselist=False)
