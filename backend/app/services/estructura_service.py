from typing import List, Optional
import uuid
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.repositories.estructura_repo import EstructuraRepository
from app.schemas.estructura import (
    AsignacionCargoCreate,
    CargoSeatDetail,
    EstructuraTerritorioResponse,
    MunicipioResponse,
    ParroquiaResponse,
)


class EstructuraService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.estructura_repo = EstructuraRepository(session)

    async def get_estructura_municipio(
        self, municipio_id: int, current_user: User
    ) -> EstructuraTerritorioResponse:
        cargos = await self.estructura_repo.get_cargos_by_nivel("MUNICIPAL")
        asignaciones = await self.estructura_repo.get_asignaciones(municipio_id=municipio_id)
        asig_map = {a.cargo_id: a for a in asignaciones if a.estado == "ACTIVO"}

        seats: List[CargoSeatDetail] = []
        cargos_ocupados = 0

        for cargo in cargos:
            asig = asig_map.get(cargo.id)
            if asig and asig.militante:
                cargos_ocupados += 1
                titular_nombre = f"{asig.militante.primer_nombre} {asig.militante.primer_apellido}"
                seats.append(
                    CargoSeatDetail(
                        cargo_id=cargo.id,
                        nombre_cargo=cargo.nombre_cargo,
                        nivel=cargo.nivel,
                        orden_jerarquico=cargo.orden_jerarquico,
                        vacante=False,
                        titular_id=asig.militante_id,
                        titular_nombre=titular_nombre,
                        titular_telefono=asig.militante.telefono,
                        titular_cedula=asig.militante.cedula,
                        estado_asignacion=asig.estado,
                        fecha_nombramiento=asig.fecha_nombramiento,
                    )
                )
            else:
                seats.append(
                    CargoSeatDetail(
                        cargo_id=cargo.id,
                        nombre_cargo=cargo.nombre_cargo,
                        nivel=cargo.nivel,
                        orden_jerarquico=cargo.orden_jerarquico,
                        vacante=True,
                    )
                )

        total_cargos = len(cargos)
        cargos_vacantes = total_cargos - cargos_ocupados
        pct = round((cargos_ocupados / total_cargos * 100), 1) if total_cargos > 0 else 0.0

        return EstructuraTerritorioResponse(
            nivel="MUNICIPAL",
            municipio_id=municipio_id,
            total_cargos=total_cargos,
            cargos_ocupados=cargos_ocupados,
            cargos_vacantes=cargos_vacantes,
            porcentaje_cobertura=pct,
            cargos=seats,
        )

    async def get_estructura_parroquia(
        self, parroquia_id: int, current_user: User
    ) -> EstructuraTerritorioResponse:
        cargos = await self.estructura_repo.get_cargos_by_nivel("PARROQUIAL")
        asignaciones = await self.estructura_repo.get_asignaciones(parroquia_id=parroquia_id)
        asig_map = {a.cargo_id: a for a in asignaciones if a.estado == "ACTIVO"}

        seats: List[CargoSeatDetail] = []
        cargos_ocupados = 0

        for cargo in cargos:
            asig = asig_map.get(cargo.id)
            if asig and asig.militante:
                cargos_ocupados += 1
                titular_nombre = f"{asig.militante.primer_nombre} {asig.militante.primer_apellido}"
                seats.append(
                    CargoSeatDetail(
                        cargo_id=cargo.id,
                        nombre_cargo=cargo.nombre_cargo,
                        nivel=cargo.nivel,
                        orden_jerarquico=cargo.orden_jerarquico,
                        vacante=False,
                        titular_id=asig.militante_id,
                        titular_nombre=titular_nombre,
                        titular_telefono=asig.militante.telefono,
                        titular_cedula=asig.militante.cedula,
                        estado_asignacion=asig.estado,
                        fecha_nombramiento=asig.fecha_nombramiento,
                    )
                )
            else:
                seats.append(
                    CargoSeatDetail(
                        cargo_id=cargo.id,
                        nombre_cargo=cargo.nombre_cargo,
                        nivel=cargo.nivel,
                        orden_jerarquico=cargo.orden_jerarquico,
                        vacante=True,
                    )
                )

        total_cargos = len(cargos)
        cargos_vacantes = total_cargos - cargos_ocupados
        pct = round((cargos_ocupados / total_cargos * 100), 1) if total_cargos > 0 else 0.0

        return EstructuraTerritorioResponse(
            nivel="PARROQUIAL",
            parroquia_id=parroquia_id,
            total_cargos=total_cargos,
            cargos_ocupados=cargos_ocupados,
            cargos_vacantes=cargos_vacantes,
            porcentaje_cobertura=pct,
            cargos=seats,
        )

    async def asignar_cargo(
        self, asig_in: AsignacionCargoCreate, current_user: User
    ) -> CargoSeatDetail:
        # Validación de jerarquía territorial RBAC
        if current_user.role == "MUNICIPAL_LEADER" and asig_in.municipio_id != current_user.municipio_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permiso territorial para asignar cargos en otro municipio.",
            )

        asig = await self.estructura_repo.create_asignacion(asig_in)
        # Recargar para devolver datos completos
        return CargoSeatDetail(
            cargo_id=asig.cargo_id,
            nombre_cargo=asig.cargo.nombre_cargo if asig.cargo else "Cargo",
            nivel=asig.cargo.nivel if asig.cargo else "MUNICIPAL",
            orden_jerarquico=asig.cargo.orden_jerarquico if asig.cargo else 1,
            vacante=False,
            titular_id=asig.militante_id,
            titular_nombre=f"{asig.militante.primer_nombre} {asig.militante.primer_apellido}" if asig.militante else None,
            titular_telefono=asig.militante.telefono if asig.militante else None,
            titular_cedula=asig.militante.cedula if asig.militante else None,
            estado_asignacion=asig.estado,
            fecha_nombramiento=asig.fecha_nombramiento,
        )

    async def list_municipios(self) -> List[MunicipioResponse]:
        m = await self.estructura_repo.list_municipios()
        return [MunicipioResponse.model_validate(item) for item in m]

    async def list_parroquias(self, municipio_id: Optional[int] = None) -> List[ParroquiaResponse]:
        p = await self.estructura_repo.list_parroquias(municipio_id=municipio_id)
        return [ParroquiaResponse.model_validate(item) for item in p]
