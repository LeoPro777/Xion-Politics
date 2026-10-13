from typing import List, Optional
import uuid
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.estructura import (
    AsignacionCargo,
    CargoEstructura,
    CentroVotacion,
    Municipio,
    Parroquia,
)
from app.schemas.estructura import AsignacionCargoCreate


class EstructuraRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def list_municipios(self) -> List[Municipio]:
        stmt = select(Municipio).order_by(Municipio.nombre.asc())
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_municipio_by_name(self, nombre: str) -> Optional[Municipio]:
        stmt = select(Municipio).where(Municipio.nombre.ilike(nombre))
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def list_parroquias(self, municipio_id: Optional[int] = None) -> List[Parroquia]:
        stmt = select(Parroquia)
        if municipio_id is not None:
            stmt = stmt.where(Parroquia.municipio_id == municipio_id)
        stmt = stmt.order_by(Parroquia.nombre.asc())
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def list_centros(self, parroquia_id: Optional[int] = None) -> List[CentroVotacion]:
        stmt = select(CentroVotacion)
        if parroquia_id is not None:
            stmt = stmt.where(CentroVotacion.parroquia_id == parroquia_id)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_cargos_by_nivel(self, nivel: str) -> List[CargoEstructura]:
        stmt = (
            select(CargoEstructura)
            .where(CargoEstructura.nivel == nivel)
            .order_by(CargoEstructura.orden_jerarquico.asc())
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_asignaciones(
        self, municipio_id: Optional[int] = None, parroquia_id: Optional[int] = None
    ) -> List[AsignacionCargo]:
        stmt = select(AsignacionCargo).options(
            selectinload(AsignacionCargo.cargo),
            selectinload(AsignacionCargo.militante),
        )
        if parroquia_id is not None:
            stmt = stmt.where(AsignacionCargo.parroquia_id == parroquia_id)
        elif municipio_id is not None:
            stmt = stmt.where(
                (AsignacionCargo.municipio_id == municipio_id)
                & (AsignacionCargo.parroquia_id.is_(None))
            )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def create_asignacion(self, a_in: AsignacionCargoCreate) -> AsignacionCargo:
        asignacion = AsignacionCargo(
            cargo_id=a_in.cargo_id,
            militante_id=a_in.militante_id,
            municipio_id=a_in.municipio_id,
            parroquia_id=a_in.parroquia_id,
            estado=a_in.estado,
            fecha_nombramiento=a_in.fecha_nombramiento,
        )
        self.session.add(asignacion)
        await self.session.commit()
        await self.session.refresh(asignacion)
        return asignacion

    async def count_total_centros(self) -> int:
        stmt = select(func.count(CentroVotacion.id))
        result = await self.session.execute(stmt)
        return result.scalar_one() or 0
