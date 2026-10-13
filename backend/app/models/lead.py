from datetime import datetime, timezone
import uuid
from typing import Optional
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )
    tipo: Mapped[str] = mapped_column(String(50), nullable=False)  # VOLUNTARIADO_GENERAL, FORMACION_POLITICA
    nombre_completo: Mapped[str] = mapped_column(String(150), nullable=False)
    edad: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    telefono: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    email: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    municipio_texto: Mapped[str] = mapped_column(String(100), nullable=False)
    municipio_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("municipios.id"), nullable=True, index=True
    )
    area_interes: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    mensaje: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    estado: Mapped[str] = mapped_column(
        String(30), default="NUEVO", index=True
    )  # NUEVO, CONTACTADO, EN_CURSO, CONVERTIDO, DESCARTADO
    asignado_a: Mapped[Optional[uuid.UUID]] = mapped_column(
        Uuid, ForeignKey("users.id"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    municipio = relationship("Municipio")
    asignado_usuario = relationship("User")
