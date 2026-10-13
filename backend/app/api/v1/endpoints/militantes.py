from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.militante import MilitanteCreate, MilitanteResponse
from app.services.militante_service import MilitanteService

router = APIRouter()


@router.post("", response_model=MilitanteResponse, status_code=status.HTTP_201_CREATED)
async def create_militante(
    m_in: MilitanteCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> MilitanteResponse:
    service = MilitanteService(session)
    return await service.create_militante(m_in, current_user=current_user)


@router.get("", response_model=List[MilitanteResponse])
async def list_militantes(
    municipio_id: Optional[int] = Query(None),
    parroquia_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> List[MilitanteResponse]:
    service = MilitanteService(session)
    return await service.list_militantes_for_user(
        current_user=current_user,
        municipio_id=municipio_id,
        parroquia_id=parroquia_id,
        search=search,
        skip=skip,
        limit=limit,
    )


@router.get("/{militante_id}", response_model=MilitanteResponse)
async def get_militante(
    militante_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> MilitanteResponse:
    service = MilitanteService(session)
    return await service.get_militante_by_id(militante_id, current_user=current_user)
