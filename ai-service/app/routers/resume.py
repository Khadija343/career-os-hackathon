from fastapi import APIRouter

from app.schemas.resume import ResumeAnalysisRequest, ResumeAnalysisResponse
from app.services.resume_service import resume_service

router = APIRouter(tags=["Resume"])


@router.post("/analyze-resume", response_model=ResumeAnalysisResponse)
async def analyze_resume(payload: ResumeAnalysisRequest) -> ResumeAnalysisResponse:
    """Placeholder endpoint — routes straight through to the service layer."""
    return await resume_service.analyze_resume(payload)
