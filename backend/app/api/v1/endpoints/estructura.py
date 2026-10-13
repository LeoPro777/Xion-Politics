from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.estructura import (
    AsignacionCargoCreate,
    CargoSeatDetail,
    EstructuraTerritorioResponse,
    MunicipioResponse,
    ParroquiaResponse,
)
from app.services.estructura_service import EstructuraService

router = APIRouter()


@router.get("/municipios", response_model=List[MunicipioResponse])
async def list_municipios(
    session: AsyncSession = Depends(get_db),
) -> List[MunicipioResponse]:
    service = EstructuraService(session)
    return await service.list_municipios()


@router.get("/municipios/{municipio_id}", response_model=EstructuraTerritorioResponse)
async def get_estructura_municipio(
    municipio_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> EstructuraTerritorioResponse:
    service = EstructuraService(session)
    return await service.get_estructura_municipio(municipio_id, current_user=current_user)


@router.get("/parroquias", response_model=List[ParroquiaResponse])
async def list_parroquias(
    municipio_id: Optional[int] = Query(None),
    session: AsyncSession = Depends(get_db),
) -> List[ParroquiaResponse]:
    service = EstructuraService(session)
    return await service.list_parroquias(municipio_id=municipio_id)


@router.get("/parroquias/{parroquia_id}", response_model=EstructuraTerritorioResponse)
async def get_estructura_parroquia(
    parroquia_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> EstructuraTerritorioResponse:
    service = EstructuraService(session)
    return await service.get_estructura_parroquia(parroquia_id, current_user=current_user)


@router.post("/asignaciones", response_model=CargoSeatDetail, status_code=status.HTTP_201_CREATED)
async def asignar_cargo_titular(
    asig_in: AsignacionCargoCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> CargoSeatDetail:
    service = EstructuraService(session)
    return await service.asignar_cargo(asig_in, current_user=current_user)
