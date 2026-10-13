from typing import List, Optional
import uuid
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.militante import Militante
from app.models.user import User
from app.repositories.militante_repo import MilitanteRepository
from app.schemas.militante import MilitanteCreate, MilitanteResponse, MilitanteUpdate


class MilitanteService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.militante_repo = MilitanteRepository(session)

    async def create_militante(
        self, m_in: MilitanteCreate, current_user: User
    ) -> MilitanteResponse:
        # Validación de cédula única
        existing = await self.militante_repo.get_by_cedula(m_in.cedula)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"La cédula {m_in.cedula} ya se encuentra registrada en el padrón.",
            )

        # Validación territorial para creación
        if current_user.role == "PARROQUIAL_LEADER" and m_in.parroquia_id != current_user.parroquia_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo tienes autorización para registrar militantes en tu parroquia asignada.",
            )

        militante = await self.militante_repo.create(m_in)
        return MilitanteResponse.model_validate(militante)

    async def list_militantes_for_user(
        self,
        current_user: User,
        municipio_id: Optional[int] = None,
        parroquia_id: Optional[int] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[MilitanteResponse]:
        # Aplicar aislamiento territorial estricto
        if current_user.role == "PARROQUIAL_LEADER":
            parroquia_id = current_user.parroquia_id
            municipio_id = None
        elif current_user.role == "MUNICIPAL_LEADER":
            municipio_id = current_user.municipio_id

        militantes = await self.militante_repo.list_militantes(
            municipio_id=municipio_id,
            parroquia_id=parroquia_id,
            search=search,
            skip=skip,
            limit=limit,
        )
        return [MilitanteResponse.model_validate(m) for m in militantes]

    async def get_militante_by_id(
        self, militante_id: uuid.UUID, current_user: User
    ) -> MilitanteResponse:
        militante = await self.militante_repo.get_by_id(militante_id)
        if not militante:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"El militante con ID {militante_id} no fue encontrado.",
            )

        if current_user.role == "PARROQUIAL_LEADER" and militante.parroquia_id != current_user.parroquia_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acceso denegado fuera de su jurisdicción parroquial.",
            )

        return MilitanteResponse.model_validate(militante)
