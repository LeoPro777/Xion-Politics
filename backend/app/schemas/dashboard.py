from typing import List, Optional
from pydantic import BaseModel


class SubregionStat(BaseModel):
    subregion: str
    militantes: int


class MunicipioStat(BaseModel):
    municipio_id: int
    nombre: str
    total_militantes: int
    total_leads: int


class DashboardMetricsResponse(BaseModel):
    total_militantes: int
    total_leads: int
    leads_nuevos_mes: int
    cobertura_cargos_municipales_pct: float
    cobertura_centros_votacion_pct: float
    distribucion_subregiones: List[SubregionStat]
    municipios_top: Optional[List[MunicipioStat]] = None
