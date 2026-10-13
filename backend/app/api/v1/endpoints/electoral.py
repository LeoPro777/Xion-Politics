from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.repositories.estructura_repo import EstructuraRepository
from app.schemas.estructura import CentroVotacionResponse

router = APIRouter()


@router.get("/centros", response_model=List[CentroVotacionResponse])
async def list_centros_votacion(
    parroquia_id: Optional[int] = Query(None),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> List[CentroVotacionResponse]:
    repo = EstructuraRepository(session)
    centros = await repo.list_centros(parroquia_id=parroquia_id)
    return [CentroVotacionResponse.model_validate(c) for c in centros]
