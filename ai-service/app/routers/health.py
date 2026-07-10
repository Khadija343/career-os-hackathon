from fastapi import APIRouter

from app.core.config import settings
from app.schemas.health import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Simple liveness check — no dependencies, no external calls."""
    return HealthResponse(status="healthy", service=settings.APP_NAME)
