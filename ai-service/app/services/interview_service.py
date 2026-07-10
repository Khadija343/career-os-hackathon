"""
Interview question generation service — Milestone 4.

Uses Google's Gemini API (via the `google-genai` SDK, reusing the same
integration pattern established in `resume_service.py` and
`roadmap_service.py`) to generate a personalized interview prep pack —
technical questions, behavioral questions, coding challenges, and
preparation tips — from whatever context is available: declared
role/skill hints, the user's structured resume, a prior resume analysis,
a prior career roadmap, and GitHub analytics. Everything needed lives in
this file — the router and schemas are untouched pass-throughs.

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
from app.schemas.interview import InterviewQuestionsRequest, InterviewQuestionsResponse
from app.utils.logger import get_logger

logger = get_logger(__name__)

SYSTEM_INSTRUCTION = """
You are a senior technical interviewer and hiring panel lead who designs
personalized interview preparation packs. You tailor every question set
to the specific candidate in front of you — their target role, their
current skills and gaps, their career roadmap, and their real project
history — instead of asking generic, one-size-fits-all questions.

Return ONLY a single JSON object matching the required schema — no
markdown, no code fences, no commentary before or after the JSON.
""".strip()


def _summarize_context(payload: InterviewQuestionsRequest) -> str:
    """
    Turn whatever context is available into a compact block of text for
    the prompt. Every piece is optional — Gemini is told to make
    reasonable, sensible assumptions about anything missing.
    """

    lines: list[str] = [
        f"Target job role: {payload.job_role or 'Not provided'}",
        f"Candidate's current role: {payload.current_role or 'Not provided'}",
        f"Experience level: {payload.experience_level or 'Not provided'}",
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
            "\nPrior resume analysis (JSON) — write technical/coding questions that "
            "specifically probe its weaknesses, missingSkills, and recommendations, "
            "to see whether the candidate has since closed those gaps:"
        )
        lines.append(json.dumps(payload.resumeAnalysis, default=str)[:3000])

    if payload.careerRoadmap:
        lines.append(
            "\nCareer roadmap already generated for this candidate (JSON) — align "
            "technical questions and coding challenges with its learningStages, so "
            "the interview mirrors what they're actually studying toward:"
        )
        lines.append(json.dumps(payload.careerRoadmap, default=str)[:3000])

    if payload.githubAnalytics:
        lines.append(
            "\nGitHub activity analytics (JSON) — base some questions on the "
            "candidate's actual languages used, repository/project complexity, "
            "star counts, and topics, e.g. asking them to justify real design "
            "decisions from their own work:"
        )
        lines.append(json.dumps(payload.githubAnalytics, default=str)[:3000])

    return "\n".join(lines)


def _build_prompt(payload: InterviewQuestionsRequest) -> str:

    return (
        "Build a personalized interview preparation pack for this candidate "
        "using every piece of context below.\n\n"
        "- If a prior resume analysis is provided, make sure at least some "
        "technical questions and/or coding challenges directly target its "
        "weaknesses, missing skills, and recommendations.\n"
        "- If a career roadmap is provided, align technical question topics "
        "with its learning stages.\n"
        "- If GitHub analytics are provided, reference the candidate's actual "
        "languages, repositories, star counts, or project complexity in at "
        "least some questions.\n"
        "- If almost no context is provided, make reasonable assumptions from "
        "the target role and experience level and produce a solid general "
        "interview pack for that role.\n\n"
        f"{_summarize_context(payload)}\n\n"
        "Return a JSON object with exactly these fields:\n"
        "- jobRole (string): the role this interview pack is built for (infer one if not given)\n"
        "- experienceLevel (string): e.g. 'Entry-level', 'Mid-level', 'Senior' (infer if not given)\n"
        "- technicalQuestions (array of objects), each with:\n"
        "    - question (string)\n"
        "    - difficulty (string): e.g. 'Easy', 'Medium', 'Hard'\n"
        "    - expectedTopics (array of strings): concepts a strong answer should cover\n"
        "    - idealAnswerSummary (string): a brief summary of what a great answer looks like\n"
        "- behavioralQuestions (array of objects), each with:\n"
        "    - question (string)\n"
        "    - purpose (string): what this question is trying to assess\n"
        "    - idealAnswerSummary (string): a brief summary of what a great answer looks like\n"
        "- codingChallenges (array of objects), each with:\n"
        "    - title (string)\n"
        "    - difficulty (string): e.g. 'Easy', 'Medium', 'Hard'\n"
        "    - description (string): the problem statement\n"
        "    - expectedSkills (array of strings): skills/concepts this challenge tests\n"
        "- preparationTips (array of strings): concrete tips to prepare for this specific interview\n"
    )


class InterviewService:

    def __init__(self):
        # Created lazily so importing this module never requires
        # GEMINI_API_KEY to be set.
        self._client: genai.Client | None = None

    def _get_client(self) -> genai.Client:

        if not settings.GEMINI_API_KEY:
            logger.error("Interview questions requested but GEMINI_API_KEY is not configured.")
            raise HTTPException(
                status_code=503,
                detail="Interview question generation is not configured on the server (missing GEMINI_API_KEY).",
            )

        if self._client is None:
            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)

        return self._client

    async def generate_questions(self, payload: InterviewQuestionsRequest) -> InterviewQuestionsResponse:

        client = self._get_client()

        try:

            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=_build_prompt(payload),
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    response_mime_type="application/json",
                    response_schema=InterviewQuestionsResponse,
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

            return InterviewQuestionsResponse.model_validate(data)

        except ValidationError as error:

            logger.error("Gemini JSON failed schema validation: %s", error)
            raise HTTPException(
                status_code=502,
                detail="Gemini returned an interview pack that did not match the expected structure.",
            ) from error


interview_service = InterviewService()
