from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.lead import (
    LeadPublicCreate,
    LeadPublicResponse,
    LeadResponse,
    LeadUpdateStatus,
)
from app.services.lead_service import LeadService

router = APIRouter()


@router.post("/public", response_model=LeadPublicResponse, status_code=status.HTTP_201_CREATED)
async def create_public_lead(
    lead_in: LeadPublicCreate,
    session: AsyncSession = Depends(get_db),
) -> LeadPublicResponse:
    service = LeadService(session)
    return await service.ingest_public_lead(lead_in)


@router.get("", response_model=List[LeadResponse])
async def list_leads(
    municipio_id: Optional[int] = Query(None),
    estado: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> List[LeadResponse]:
    service = LeadService(session)
    return await service.get_leads_for_user(
        current_user=current_user,
        municipio_id=municipio_id,
        estado=estado,
        skip=skip,
        limit=limit,
    )


@router.patch("/{lead_id}/status", response_model=LeadResponse)
async def update_lead_status(
    lead_id: uuid.UUID,
    update_data: LeadUpdateStatus,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> LeadResponse:
    service = LeadService(session)
    return await service.update_lead_status(
        lead_id=lead_id,
        update_data=update_data,
        current_user=current_user,
    )
