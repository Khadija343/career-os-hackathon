from fastapi import APIRouter

from app.schemas.interview import InterviewQuestionsRequest, InterviewQuestionsResponse
from app.services.interview_service import interview_service

router = APIRouter(tags=["Interview"])


@router.post("/interview-questions", response_model=InterviewQuestionsResponse)
async def interview_questions(payload: InterviewQuestionsRequest) -> InterviewQuestionsResponse:
    """Placeholder endpoint — routes straight through to the service layer."""
    return await interview_service.generate_questions(payload)
