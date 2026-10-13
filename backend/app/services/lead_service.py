import re
from typing import List, Optional
import uuid
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.lead import Lead
from app.models.user import User
from app.repositories.estructura_repo import EstructuraRepository
from app.repositories.lead_repo import LeadRepository
from app.schemas.lead import LeadPublicCreate, LeadPublicResponse, LeadResponse, LeadUpdateStatus


class LeadService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.lead_repo = LeadRepository(session)
        self.estructura_repo = EstructuraRepository(session)

    def normalize_phone(self, phone: str) -> str:
        cleaned = re.sub(r"\D", "", phone)
        if cleaned.startswith("0"):
            cleaned = "58" + cleaned[1:]
        elif cleaned.startswith("4") and len(cleaned) == 10:
            cleaned = "58" + cleaned
        return f"+{cleaned}" if not cleaned.startswith("+") else cleaned

    async def ingest_public_lead(self, lead_in: LeadPublicCreate) -> LeadPublicResponse:
        lead_in.telefono = self.normalize_phone(lead_in.telefono)
        lead_in.nombre_completo = lead_in.nombre_completo.strip()
        lead_in.municipio = lead_in.municipio.strip()

        # Intentar asociar con catálogo de municipios
        municipio_obj = await self.estructura_repo.get_municipio_by_name(lead_in.municipio)
        municipio_id = municipio_obj.id if municipio_obj else None

        # Evaluación de recurrencia por teléfono
        existing_lead = await self.lead_repo.get_by_phone(lead_in.telefono)
        if existing_lead:
            # Si ya existe, anexar nota de recurrencia sin romper
            existing_lead.mensaje = (
                f"{existing_lead.mensaje or ''}\n[Contacto recurrente {lead_in.tipo}]: {lead_in.mensaje or ''}"
            ).strip()
            await self.session.commit()
            return LeadPublicResponse(
                status="success",
                message="Tu solicitud previa ha sido actualizada con éxito.",
                lead_id=existing_lead.id,
            )

        lead = await self.lead_repo.create(lead_in, municipio_id=municipio_id)
        return LeadPublicResponse(
            status="success",
            message="Registro recibido exitosamente",
            lead_id=lead.id,
        )

    async def get_leads_for_user(
        self,
        current_user: User,
        municipio_id: Optional[int] = None,
        estado: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[LeadResponse]:
        # Aplicar aislamiento territorial estricto
        if current_user.role == "MUNICIPAL_LEADER":
            municipio_id = current_user.municipio_id
        elif current_user.role == "PARROQUIAL_LEADER":
            municipio_id = current_user.municipio_id

        leads = await self.lead_repo.list_leads(
            municipio_id=municipio_id,
            estado=estado,
            skip=skip,
            limit=limit,
        )
        return [LeadResponse.model_validate(l) for l in leads]

    async def update_lead_status(
        self,
        lead_id: uuid.UUID,
        update_data: LeadUpdateStatus,
        current_user: User,
    ) -> LeadResponse:
        lead = await self.lead_repo.get_by_id(lead_id)
        if not lead:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"El lead con ID {lead_id} no existe.",
            )

        # Validación de jerarquía territorial
        if current_user.role == "MUNICIPAL_LEADER" and lead.municipio_id != current_user.municipio_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permiso territorial para gestionar leads de otro municipio.",
            )

        updated = await self.lead_repo.update_status(lead, update_data)
        return LeadResponse.model_validate(updated)
