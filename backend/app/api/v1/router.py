from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    dashboard,
    electoral,
    estructura,
    leads,
    militantes,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Autenticación"])
api_router.include_router(leads.router, prefix="/leads", tags=["Leads y Voluntariado"])
api_router.include_router(militantes.router, prefix="/militantes", tags=["Padrón de Militantes"])
api_router.include_router(estructura.router, prefix="/estructura", tags=["Estructura Orgánica"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard Analítico"])
api_router.include_router(electoral.router, prefix="/electoral", tags=["Gestión Electoral"])
