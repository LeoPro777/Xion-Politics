import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.core.init_db import init_db
from app.models.base import Base
from app.core.database import async_session_factory, engine


@pytest.fixture(autouse=True)
async def ensure_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with async_session_factory() as session:
        await init_db(session)



@pytest.mark.asyncio
async def test_health_check():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "SIGO" in data["app"]


@pytest.mark.asyncio
async def test_error_structure_format():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.get("/api/v1/non_existent_route")
        assert response.status_code == 404
        data = response.json()
        assert data["error_code"] == "RESOURCE_NOT_FOUND"
        assert "detail" in data
        assert "timestamp" in data


@pytest.mark.asyncio
async def test_public_lead_submission():
    payload = {
        "tipo": "VOLUNTARIADO_GENERAL",
        "nombre_completo": "Andrés Bello Test",
        "edad": 22,
        "telefono": "+584141239999",
        "email": "andres.test@pjzulia.org.ve",
        "municipio": "Maracaibo",
        "area_interes": "Defensa Electoral",
        "mensaje": "Quiero ser voluntario de mesa."
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/leads/public", json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["status"] == "success"
        assert "lead_id" in data


@pytest.mark.asyncio
async def test_auth_google_mock_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        response = await ac.post("/api/v1/auth/google", json={"token": "mock_token_admin@pjzulia.org.ve"})
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["user"]["email"] == "admin@pjzulia.org.ve"
        assert data["user"]["role"] == "SUPERADMIN"
