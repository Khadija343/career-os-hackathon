"""
Resume analysis service — Milestone 2.

Uses Google's Gemini API (via the official `google-genai` SDK) to produce
a structured, ATS-style resume analysis. Every failure mode — missing
config, missing input, a failed Gemini call, or a malformed Gemini
response — is converted into a clean `HTTPException` here so the router
stays a one-line pass-through and FastAPI never crashes or leaks a raw
traceback for something an upstream API did.
"""

import json

from fastapi import HTTPException
from google import genai
from google.genai import types
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.resume import ResumeAnalysisRequest, ResumeAnalysisResponse
from app.utils.logger import get_logger

logger = get_logger(__name__)

SYSTEM_INSTRUCTION = """
You are acting as three experts combined:
1. An Applicant Tracking System (ATS) scanner that checks formatting,
   keyword coverage, and machine-parseability.
2. A senior technical recruiter who has screened thousands of resumes
   and can judge seniority, clarity, and impact at a glance.
3. A software engineering career coach who gives specific, actionable
   feedback to help the candidate improve.

Analyze the resume text you are given from all three perspectives and
return ONLY a single JSON object matching the required schema — no
markdown, no code fences, no commentary before or after the JSON.
Be honest, specific, and constructive.
""".strip()


def _build_prompt(payload: ResumeAnalysisRequest) -> str:
    """Assemble the user-turn prompt sent to Gemini."""

    return (
        "Analyze the following resume and return your assessment as JSON.\n\n"
        "RESUME:\n"
        "-----\n"
        f"{payload.resume_text}\n"
        "-----\n\n"
        "Return a JSON object with exactly these fields:\n"
        "- overallScore (integer 0-100): overall resume quality\n"
        "- atsScore (integer 0-100): how well an ATS would parse and rank this resume\n"
        "- careerLevel (string): e.g. 'Entry-level', 'Junior', 'Mid-level', 'Senior', 'Lead'\n"
        "- strengths (array of strings): what the resume does well\n"
        "- weaknesses (array of strings): what is holding the resume back\n"
        "- missingSkills (array of strings): skills/keywords missing for the candidate's apparent target roles\n"
        "- recommendations (array of strings): concrete, actionable improvements\n"
    )


class ResumeService:

    def __init__(self):
        # Created lazily so importing this module never requires
        # GEMINI_API_KEY to be set (e.g. other endpoints/tests unaffected).
        self._client: genai.Client | None = None

    def _get_client(self) -> genai.Client:

        if not settings.GEMINI_API_KEY:
            logger.error("Resume analysis requested but GEMINI_API_KEY is not configured.")
            raise HTTPException(
                status_code=503,
                detail="Resume analysis is not configured on the server (missing GEMINI_API_KEY).",
            )

        if self._client is None:
            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)

        return self._client

    async def analyze_resume(self, payload: ResumeAnalysisRequest) -> ResumeAnalysisResponse:

        if not payload.resume_text or not payload.resume_text.strip():
            raise HTTPException(
                status_code=400,
                detail="resume_text is required to perform resume analysis.",
            )

        client = self._get_client()

        try:

            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=_build_prompt(payload),
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    response_mime_type="application/json",
                    response_schema=ResumeAnalysisResponse,
                    temperature=0.4,
                ),
            )

        except HTTPException:

            raise

        except Exception as error:

            logger.error("Gemini API call failed: %s", error)
            raise HTTPException(
                status_code=502,
                detail="Failed to reach the Gemini API. Please try again later.",
            ) from error

        raw_text = (getattr(response, "text", None) or "").strip()

        if not raw_text:
            logger.error("Gemini returned an empty response.")
            raise HTTPException(
                status_code=502,
                detail="Gemini returned an empty response.",
            )

        try:

            data = json.loads(raw_text)

        except json.JSONDecodeError as error:

            logger.error("Gemini returned invalid JSON: %s", raw_text[:500])
            raise HTTPException(
                status_code=502,
                detail="Gemini returned invalid JSON.",
            ) from error

        try:

            return ResumeAnalysisResponse.model_validate(data)

        except ValidationError as error:

            logger.error("Gemini JSON failed schema validation: %s", error)
            raise HTTPException(
                status_code=502,
                detail="Gemini returned an analysis that did not match the expected structure.",
            ) from error


resume_service = ResumeService()
