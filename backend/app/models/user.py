from datetime import datetime, timezone
import uuid
from typing import Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        Uuid, primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(150), unique=True, nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    google_id: Mapped[Optional[str]] = mapped_column(String(100), unique=True, nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Roles: SUPERADMIN, REGIONAL_DIRECTOR, MUNICIPAL_LEADER, PARROQUIAL_LEADER, OPERADOR
    role: Mapped[str] = mapped_column(String(30), nullable=False, default="OPERADOR_PARROQUIAL")
    
    municipio_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("municipios.id", ondelete="SET NULL"), nullable=True
    )
    parroquia_id: Mapped[Optional[int]] = mapped_column(
        Integer, ForeignKey("parroquias.id", ondelete="SET NULL"), nullable=True
    )
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    last_login: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    municipio = relationship("Municipio", foreign_keys=[municipio_id])
    parroquia = relationship("Parroquia", foreign_keys=[parroquia_id])
