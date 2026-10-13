from datetime import datetime
from typing import Optional
import uuid
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class LeadPublicCreate(BaseModel):
    tipo: str = Field(..., description="VOLUNTARIADO_GENERAL o FORMACION_POLITICA")
    nombre_completo: str = Field(..., min_length=3, max_length=150)
    edad: Optional[int] = Field(None, ge=14, le=35)
    telefono: str = Field(..., min_length=7, max_length=30)
    email: Optional[EmailStr] = None
    municipio: str = Field(..., min_length=2, max_length=100)
    area_interes: Optional[str] = Field(None, max_length=100)
    mensaje: Optional[str] = Field(None, max_length=1000)


class LeadUpdateStatus(BaseModel):
    estado: str = Field(
        ..., description="NUEVO, CONTACTADO, EN_CURSO, CONVERTIDO, DESCARTADO"
    )
    asignado_a: Optional[uuid.UUID] = None


class LeadResponse(BaseModel):
    id: uuid.UUID
    tipo: str
    nombre_completo: str
    edad: Optional[int] = None
    telefono: str
    email: Optional[str] = None
    municipio_texto: str
    municipio_id: Optional[int] = None
    area_interes: Optional[str] = None
    mensaje: Optional[str] = None
    estado: str
    asignado_a: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class LeadPublicResponse(BaseModel):
    status: str = "success"
    message: str = "Registro recibido exitosamente"
    lead_id: uuid.UUID
