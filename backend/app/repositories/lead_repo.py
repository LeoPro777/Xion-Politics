from typing import List, Optional
import uuid
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.estructura import Municipio
from app.models.lead import Lead
from app.schemas.lead import LeadPublicCreate, LeadUpdateStatus


class LeadRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, lead_in: LeadPublicCreate, municipio_id: Optional[int] = None) -> Lead:
        lead = Lead(
            tipo=lead_in.tipo,
            nombre_completo=lead_in.nombre_completo,
            edad=lead_in.edad,
            telefono=lead_in.telefono,
            email=lead_in.email,
            municipio_texto=lead_in.municipio,
            municipio_id=municipio_id,
            area_interes=lead_in.area_interes,
            mensaje=lead_in.mensaje,
            estado="NUEVO",
        )
        self.session.add(lead)
        await self.session.commit()
        await self.session.refresh(lead)
        return lead

    async def get_by_id(self, lead_id: uuid.UUID) -> Optional[Lead]:
        stmt = select(Lead).where(Lead.id == lead_id)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_phone(self, telefono: str) -> Optional[Lead]:
        stmt = select(Lead).where(Lead.telefono == telefono)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_leads(
        self,
        municipio_id: Optional[int] = None,
        estado: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Lead]:
        stmt = select(Lead)
        if municipio_id is not None:
            stmt = stmt.where(Lead.municipio_id == municipio_id)
        if estado:
            stmt = stmt.where(Lead.estado == estado)
        stmt = stmt.order_by(Lead.created_at.desc()).offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def update_status(self, lead: Lead, update_data: LeadUpdateStatus) -> Lead:
        lead.estado = update_data.estado
        if update_data.asignado_a is not None:
            lead.asignado_a = update_data.asignado_a
        await self.session.commit()
        await self.session.refresh(lead)
        return lead

    async def count_total(self, municipio_id: Optional[int] = None) -> int:
        stmt = select(func.count(Lead.id))
        if municipio_id is not None:
            stmt = stmt.where(Lead.municipio_id == municipio_id)
        result = await self.session.execute(stmt)
        return result.scalar_one() or 0
