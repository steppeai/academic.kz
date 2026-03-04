"""Basic smoke tests for the programs endpoint."""
import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.mark.anyio
async def test_health():
    """Health check should return 200 OK."""
    from app.main import app
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.anyio
async def test_programs_list_needs_db(monkeypatch):
    """Programs endpoint should return 200 with mocked DB."""
    from app.main import app
    from app import database

    mock_programs = []
    mock_total = 0

    async def mock_get_programs(db, filters):
        return mock_programs, mock_total

    with patch("app.api.v1.programs.get_programs", new=mock_get_programs):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.get("/api/v1/programs")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert data["total"] == 0


@pytest.mark.anyio
async def test_bolashak_overview_mocked():
    """Bolashak overview should return criteria/steps/documents."""
    from app.main import app

    with patch("app.api.v1.bolashak.get_criteria", new=AsyncMock(return_value=[])), \
         patch("app.api.v1.bolashak.get_steps",    new=AsyncMock(return_value=[])), \
         patch("app.api.v1.bolashak.get_documents", new=AsyncMock(return_value=[])):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.get("/api/v1/bolashak")
    assert response.status_code == 200
    body = response.json()
    assert "criteria" in body and "steps" in body and "documents" in body
