from typing import List, Optional
import uuid
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.estructura import Parroquia
from app.models.militante import Militante
from app.schemas.militante import MilitanteCreate, MilitanteUpdate


class MilitanteRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, m_in: MilitanteCreate) -> Militante:
        militante = Militante(
            nacionalidad=m_in.nacionalidad,
            cedula=m_in.cedula,
            primer_nombre=m_in.primer_nombre,
            segundo_nombre=m_in.segundo_nombre,
            primer_apellido=m_in.primer_apellido,
            segundo_apellido=m_in.segundo_apellido,
            fecha_nacimiento=m_in.fecha_nacimiento,
            telefono=m_in.telefono,
            email=m_in.email,
            ocupacion=m_in.ocupacion,
            es_estudiante=m_in.es_estudiante,
            universidad=m_in.universidad,
            parroquia_id=m_in.parroquia_id,
            centro_votacion_id=m_in.centro_votacion_id,
            rol_electoral=m_in.rol_electoral,
            activo=m_in.activo,
        )
        self.session.add(militante)
        await self.session.commit()
        await self.session.refresh(militante)
        return militante

    async def get_by_id(self, militante_id: uuid.UUID) -> Optional[Militante]:
        stmt = (
            select(Militante)
            .where(Militante.id == militante_id)
            .options(selectinload(Militante.parroquia), selectinload(Militante.centro_votacion))
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_cedula(self, cedula: int) -> Optional[Militante]:
        stmt = select(Militante).where(Militante.cedula == cedula)
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_militantes(
        self,
        municipio_id: Optional[int] = None,
        parroquia_id: Optional[int] = None,
        search: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Militante]:
        stmt = select(Militante).join(Parroquia, Militante.parroquia_id == Parroquia.id)
        if parroquia_id is not None:
            stmt = stmt.where(Militante.parroquia_id == parroquia_id)
        elif municipio_id is not None:
            stmt = stmt.where(Parroquia.municipio_id == municipio_id)

        if search:
            if search.isdigit():
                stmt = stmt.where(Militante.cedula == int(search))
            else:
                search_term = f"%{search}%"
                stmt = stmt.where(
                    (Militante.primer_nombre.ilike(search_term))
                    | (Militante.primer_apellido.ilike(search_term))
                )

        stmt = stmt.order_by(Militante.created_at.desc()).offset(skip).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def count_total(
        self, municipio_id: Optional[int] = None, parroquia_id: Optional[int] = None
    ) -> int:
        stmt = select(func.count(Militante.id)).join(Parroquia, Militante.parroquia_id == Parroquia.id)
        if parroquia_id is not None:
            stmt = stmt.where(Militante.parroquia_id == parroquia_id)
        elif municipio_id is not None:
            stmt = stmt.where(Parroquia.municipio_id == municipio_id)
        result = await self.session.execute(stmt)
        return result.scalar_one() or 0
