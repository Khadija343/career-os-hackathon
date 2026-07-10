from fastapi import APIRouter

from app.schemas.roadmap import CareerRoadmapRequest, CareerRoadmapResponse
from app.services.roadmap_service import roadmap_service

router = APIRouter(tags=["Roadmap"])


@router.post("/career-roadmap", response_model=CareerRoadmapResponse)
async def career_roadmap(payload: CareerRoadmapRequest) -> CareerRoadmapResponse:
    """Placeholder endpoint — routes straight through to the service layer."""
    return await roadmap_service.generate_roadmap(payload)
