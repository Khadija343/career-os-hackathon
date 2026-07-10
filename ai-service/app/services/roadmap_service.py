"""
Career roadmap generation service — Milestone 3.

Uses Google's Gemini API (via the `google-genai` SDK, reusing the same
integration pattern established in `resume_service.py`) to build a
personalized learning roadmap from whatever context is available:
declared role/skill hints, the user's structured resume, a prior resume
analysis, and GitHub analytics. Everything needed lives in this file —
the router and schemas are untouched pass-throughs.

Every failure mode (missing config, a failed Gemini call, malformed
output) is converted into a clean `HTTPException` — never an unhandled
crash.
"""

import json

from fastapi import HTTPException
from google import genai
from google.genai import types
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.roadmap import CareerRoadmapRequest, CareerRoadmapResponse
from app.utils.logger import get_logger

logger = get_logger(__name__)

SYSTEM_INSTRUCTION = """
You are a senior software engineering career coach who designs
personalized, realistic learning roadmaps. You tailor every roadmap to
the specific person in front of you — their current level, their target
role, the skills they already have, and any known gaps — instead of
giving generic, one-size-fits-all advice.

Return ONLY a single JSON object matching the required schema — no
markdown, no code fences, no commentary before or after the JSON.
""".strip()


def _summarize_context(payload: CareerRoadmapRequest) -> str:
    """
    Turn whatever context is available into a compact block of text for
    the prompt. Every piece is optional — Gemini is told to make
    reasonable, sensible assumptions about anything missing.
    """

    lines: list[str] = [
        f"Current role: {payload.current_role or 'Not provided'}",
        f"Target role: {payload.target_role or 'Not provided'}",
        (
            "Years of experience: "
            f"{payload.experience_years if payload.experience_years is not None else 'Not provided'}"
        ),
        f"Known skills: {', '.join(payload.skills) if payload.skills else 'Not provided'}",
    ]

    if payload.resume:

        parsed_data = payload.resume.get("parsedData") or {}

        if parsed_data:
            lines.append("\nParsed resume data (JSON):")
            lines.append(json.dumps(parsed_data, default=str)[:6000])
        elif payload.resume.get("rawText"):
            lines.append("\nRaw resume text:")
            lines.append(str(payload.resume.get("rawText"))[:4000])

    if payload.resumeAnalysis:
        lines.append(
            "\nPrior resume analysis (JSON) — explicitly use its missingSkills, "
            "weaknesses, and recommendations to shape this roadmap:"
        )
        lines.append(json.dumps(payload.resumeAnalysis, default=str)[:3000])

    if payload.githubAnalytics:
        lines.append(
            "\nGitHub activity analytics (JSON) — use this to gauge real "
            "hands-on/project experience already demonstrated:"
        )
        lines.append(json.dumps(payload.githubAnalytics, default=str)[:3000])

    return "\n".join(lines)


def _build_prompt(payload: CareerRoadmapRequest) -> str:

    return (
        "Build a personalized career roadmap for this candidate using every "
        "piece of context below. If resume analysis is provided, explicitly "
        "address its missing skills, weaknesses, and recommendations inside "
        "the roadmap's learning stages, recommended projects, or job "
        "preparation tips — don't ignore it. If almost no context is "
        "provided, make reasonable assumptions and produce a sensible "
        "general-purpose roadmap toward the target role.\n\n"
        f"{_summarize_context(payload)}\n\n"
        "Return a JSON object with exactly these fields:\n"
        "- targetRole (string): the target role this roadmap is built for (infer one if not given)\n"
        "- estimatedDuration (string): realistic total time estimate, e.g. '4-6 months'\n"
        "- learningStages (array of objects): ordered stages, each with:\n"
        "    - title (string)\n"
        "    - description (string)\n"
        "    - skills (array of strings): skills covered in this stage\n"
        "    - resources (array of strings): courses, books, docs, or tools to use\n"
        "- recommendedProjects (array of strings): hands-on projects to build\n"
        "- recommendedCertificates (array of strings): relevant certifications\n"
        "- jobPreparationTips (array of strings): interview/job-search prep tips\n"
        "- milestones (array of strings): concrete checkpoints to track progress\n"
    )


class RoadmapService:

    def __init__(self):
        # Created lazily so importing this module never requires
        # GEMINI_API_KEY to be set.
        self._client: genai.Client | None = None

    def _get_client(self) -> genai.Client:

        if not settings.GEMINI_API_KEY:
            logger.error("Career roadmap requested but GEMINI_API_KEY is not configured.")
            raise HTTPException(
                status_code=503,
                detail="Career roadmap generation is not configured on the server (missing GEMINI_API_KEY).",
            )

        if self._client is None:
            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)

        return self._client

    async def generate_roadmap(self, payload: CareerRoadmapRequest) -> CareerRoadmapResponse:

        client = self._get_client()

        try:

            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=_build_prompt(payload),
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    response_mime_type="application/json",
                    response_schema=CareerRoadmapResponse,
                    temperature=0.5,
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

            return CareerRoadmapResponse.model_validate(data)

        except ValidationError as error:

            logger.error("Gemini JSON failed schema validation: %s", error)
            raise HTTPException(
                status_code=502,
                detail="Gemini returned a roadmap that did not match the expected structure.",
            ) from error


roadmap_service = RoadmapService()
