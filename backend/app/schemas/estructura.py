from datetime import date, datetime
from typing import List, Optional
import uuid
from pydantic import BaseModel, ConfigDict


class MunicipioResponse(BaseModel):
    id: int
    nombre: str
    subregion: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ParroquiaResponse(BaseModel):
    id: int
    municipio_id: int
    nombre: str

    model_config = ConfigDict(from_attributes=True)


class CentroVotacionResponse(BaseModel):
    id: int
    parroquia_id: int
    codigo_cne: str
    nombre: str
    direccion: Optional[str] = None
    mesas_electorales: int
    votantes_esperados: int

    model_config = ConfigDict(from_attributes=True)


class CargoEstructuraResponse(BaseModel):
    id: int
    nivel: str
    nombre_cargo: str
    orden_jerarquico: int

    model_config = ConfigDict(from_attributes=True)


class AsignacionCargoCreate(BaseModel):
    cargo_id: int
    militante_id: uuid.UUID
    municipio_id: Optional[int] = None
    parroquia_id: Optional[int] = None
    estado: str = "ACTIVO"
    fecha_nombramiento: date


class CargoSeatDetail(BaseModel):
    cargo_id: int
    nombre_cargo: str
    nivel: str
    orden_jerarquico: int
    vacante: bool
    titular_id: Optional[uuid.UUID] = None
    titular_nombre: Optional[str] = None
    titular_telefono: Optional[str] = None
    titular_cedula: Optional[int] = None
    estado_asignacion: Optional[str] = None
    fecha_nombramiento: Optional[date] = None


class EstructuraTerritorioResponse(BaseModel):
    nivel: str
    municipio_id: Optional[int] = None
    parroquia_id: Optional[int] = None
    total_cargos: int
    cargos_ocupados: int
    cargos_vacantes: int
    porcentaje_cobertura: float
    cargos: List[CargoSeatDetail]
