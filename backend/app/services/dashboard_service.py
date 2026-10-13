from datetime import datetime, timezone
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.estructura import AsignacionCargo, CentroVotacion, Municipio, Parroquia
from app.models.lead import Lead
from app.models.militante import Militante
from app.models.user import User
from app.schemas.dashboard import DashboardMetricsResponse, SubregionStat


class DashboardService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_metrics(self, current_user: User) -> DashboardMetricsResponse:
        # Total militantes
        m_stmt = select(func.count(Militante.id))
        total_militantes = (await self.session.execute(m_stmt)).scalar_one() or 0

        # Total leads
        l_stmt = select(func.count(Lead.id))
        total_leads = (await self.session.execute(l_stmt)).scalar_one() or 0

        # Leads nuevos en los últimos 30 días
        now = datetime.now(timezone.utc)
        thirty_days_ago = now.replace(day=1) if now.day == 1 else now.replace(day=1)  # principio de mes
        new_leads_stmt = select(func.count(Lead.id)).where(Lead.created_at >= thirty_days_ago)
        leads_nuevos_mes = (await self.session.execute(new_leads_stmt)).scalar_one() or 0

        # Cobertura de cargos municipales (21 municipios * 13 cargos estatutarios = 273 cargos potenciales)
        total_plazas_municipales = 21 * 13
        asig_mun_stmt = select(func.count(AsignacionCargo.id)).where(
            (AsignacionCargo.municipio_id.is_not(None))
            & (AsignacionCargo.parroquia_id.is_(None))
            & (AsignacionCargo.estado == "ACTIVO")
        )
        asig_mun_count = (await self.session.execute(asig_mun_stmt)).scalar_one() or 0
        cobertura_cargos_pct = (
            round((asig_mun_count / total_plazas_municipales) * 100, 1)
            if total_plazas_municipales > 0
            else 0.0
        )

        # Cobertura centros de votación
        total_cv_stmt = select(func.count(CentroVotacion.id))
        total_cv = (await self.session.execute(total_cv_stmt)).scalar_one() or 0

        covered_cv_stmt = (
            select(func.count(func.distinct(Militante.centro_votacion_id)))
            .where(Militante.centro_votacion_id.is_not(None))
            .where(Militante.rol_electoral.in_(["TESTIGO", "COORDINADOR_CENTRO"]))
        )
        covered_cv = (await self.session.execute(covered_cv_stmt)).scalar_one() or 0
        cobertura_cv_pct = round((covered_cv / total_cv) * 100, 1) if total_cv > 0 else 0.0

        # Distribución por subregiones
        subreg_stmt = (
            select(Municipio.subregion, func.count(Militante.id))
            .join(Parroquia, Parroquia.municipio_id == Municipio.id)
            .join(Militante, Militante.parroquia_id == Parroquia.id)
            .group_by(Municipio.subregion)
        )
        subreg_res = await self.session.execute(subreg_stmt)
        subreg_rows = subreg_res.all()

        distribucion = [
            SubregionStat(subregion=row[0], militantes=row[1]) for row in subreg_rows
        ]

        if not distribucion:
            # Fallback a subregiones oficiales con datos base si está recién sembrado
            distribucion = [
                SubregionStat(subregion="Metropolitana", militantes=total_militantes),
                SubregionStat(subregion="Costa Oriental", militantes=0),
                SubregionStat(subregion="Sur del Lago", militantes=0),
                SubregionStat(subregion="Perijá y Guajira", militantes=0),
            ]

        return DashboardMetricsResponse(
            total_militantes=total_militantes,
            total_leads=total_leads,
            leads_nuevos_mes=leads_nuevos_mes,
            cobertura_cargos_municipales_pct=cobertura_cargos_pct,
            cobertura_centros_votacion_pct=cobertura_cv_pct,
            distribucion_subregiones=distribucion,
        )
