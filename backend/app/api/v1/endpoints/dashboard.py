from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.dashboard import DashboardMetricsResponse
from app.services.dashboard_service import DashboardService

router = APIRouter()


@router.get("/metrics", response_model=DashboardMetricsResponse)
async def get_dashboard_metrics(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
) -> DashboardMetricsResponse:
    service = DashboardService(session)
    return await service.get_metrics(current_user=current_user)
