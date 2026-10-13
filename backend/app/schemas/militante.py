from datetime import date, datetime
from typing import Optional
import uuid
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class MilitanteBase(BaseModel):
    nacionalidad: str = Field("V", pattern="^(V|E)$")
    cedula: int = Field(..., gt=1000000)
    primer_nombre: str = Field(..., min_length=2, max_length=60)
    segundo_nombre: Optional[str] = Field(None, max_length=60)
    primer_apellido: str = Field(..., min_length=2, max_length=60)
    segundo_apellido: Optional[str] = Field(None, max_length=60)
    fecha_nacimiento: date
    telefono: str = Field(..., min_length=7, max_length=20)
    email: Optional[EmailStr] = None
    ocupacion: Optional[str] = Field(None, max_length=100)
    es_estudiante: bool = False
    universidad: Optional[str] = Field(None, max_length=100)
    parroquia_id: int
    centro_votacion_id: Optional[int] = None
    rol_electoral: str = "NO_ASIGNADO"
    activo: bool = True

    @field_validator("fecha_nacimiento")
    @classmethod
    def validate_youth_age(cls, v: date) -> date:
        today = date.today()
        age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
        if age < 14 or age > 35:
            raise ValueError(f"La edad para la estructura juvenil debe estar entre 14 y 35 años. Edad calculada: {age}")
        return v


class MilitanteCreate(MilitanteBase):
    pass


class MilitanteUpdate(BaseModel):
    primer_nombre: Optional[str] = None
    segundo_nombre: Optional[str] = None
    primer_apellido: Optional[str] = None
    segundo_apellido: Optional[str] = None
    telefono: Optional[str] = None
    email: Optional[EmailStr] = None
    ocupacion: Optional[str] = None
    es_estudiante: Optional[bool] = None
    universidad: Optional[str] = None
    parroquia_id: Optional[int] = None
    centro_votacion_id: Optional[int] = None
    rol_electoral: Optional[str] = None
    activo: Optional[bool] = None


class MilitanteResponse(MilitanteBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
