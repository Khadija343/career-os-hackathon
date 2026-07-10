"""
Career assistant chat service — Milestone 5.

Uses Google's Gemini API (via the `google-genai` SDK, reusing the same
integration pattern established in `resume_service.py`,
`roadmap_service.py`, and `interview_service.py`) to answer a single
career-related question, grounded strictly in whatever context is
available: the user's structured resume, a prior resume analysis, a
prior career roadmap, prior interview questions, GitHub profile/
analytics, and dashboard analytics. Everything needed lives in this file
— the router and schemas are untouched pass-throughs.

This is intentionally single-turn — no conversation history, memory,
embeddings, vector store, or RAG. Every failure mode (missing config, a
failed Gemini call, malformed output) is converted into a clean
`HTTPException` — never an unhandled crash.
"""

import json

from fastapi import HTTPException
from google import genai
from google.genai import types
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.chat import ChatRequest, ChatResponse
from app.utils.logger import get_logger

logger = get_logger(__name__)

SYSTEM_INSTRUCTION = """
You are an experienced, encouraging career mentor for software engineers.

You help with things like: explaining resume analysis results, explaining
career roadmap recommendations, explaining interview questions, recommending
next learning steps, projects, and certifications, suggesting career
improvements, explaining GitHub profile weaknesses, and encouraging good
engineering practices.

Ground every answer strictly in the context you are given below. Do NOT
invent facts, scores, skills, projects, or history that are not present
in that context — if something isn't in the context and you don't know
it, say so plainly instead of guessing.

Answers should be concise, actionable, and personalized to this specific
person.

Return ONLY a single JSON object matching the required schema — no
markdown, no code fences, no commentary before or after the JSON.
""".strip()


def _summarize_context(payload: ChatRequest) -> str:
    """
    Turn whatever context is available into a compact block of text for
    the prompt. Every piece is optional — if something is missing, the
    assistant is told to keep going with whatever it does have rather
    than invent the gap.
    """

    lines: list[str] = [
        f"Current role: {payload.current_role or 'Not provided'}",
        f"Target role: {payload.target_role or 'Not provided'}",
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
        lines.append("\nPrior resume analysis (JSON):")
        lines.append(json.dumps(payload.resumeAnalysis, default=str)[:3000])

    if payload.careerRoadmap:
        lines.append("\nPrior career roadmap (JSON):")
        lines.append(json.dumps(payload.careerRoadmap, default=str)[:3000])

    if payload.interviewQuestions:
        lines.append("\nPrior interview questions pack (JSON):")
        lines.append(json.dumps(payload.interviewQuestions, default=str)[:3000])

    if payload.githubProfile:
        lines.append("\nGitHub profile (JSON):")
        lines.append(json.dumps(payload.githubProfile, default=str)[:2000])

    if payload.githubAnalytics:
        lines.append("\nGitHub activity analytics (JSON):")
        lines.append(json.dumps(payload.githubAnalytics, default=str)[:3000])

    if payload.dashboardAnalytics:
        lines.append("\nDashboard analytics (JSON):")
        lines.append(json.dumps(payload.dashboardAnalytics, default=str)[:2000])

    return "\n".join(lines)


def _build_prompt(payload: ChatRequest) -> str:

    return (
        "Answer this person's question as their career mentor, using only "
        "the context below plus their question. If a piece of context they "
        "ask about isn't present below, say you don't have that information "
        "yet instead of making it up.\n\n"
        "CONTEXT:\n"
        f"{_summarize_context(payload)}\n\n"
        "QUESTION:\n"
        f"{payload.message}\n\n"
        "Return a JSON object with exactly these fields:\n"
        "- answer (string): a concise, actionable, personalized answer to the question\n"
        "- followUpSuggestions (array of strings): 2-4 natural follow-up questions or "
        "next actions this person might want to ask/take next\n"
    )


class ChatService:

    def __init__(self):
        # Created lazily so importing this module never requires
        # GEMINI_API_KEY to be set.
        self._client: genai.Client | None = None

    def _get_client(self) -> genai.Client:

        if not settings.GEMINI_API_KEY:
            logger.error("Chat requested but GEMINI_API_KEY is not configured.")
            raise HTTPException(
                status_code=503,
                detail="Career assistant chat is not configured on the server (missing GEMINI_API_KEY).",
            )

        if self._client is None:
            self._client = genai.Client(api_key=settings.GEMINI_API_KEY)

        return self._client

    async def send_message(self, payload: ChatRequest) -> ChatResponse:

        if not payload.message or not payload.message.strip():
            raise HTTPException(
                status_code=400,
                detail="message is required to chat with the career assistant.",
            )

        client = self._get_client()

        try:

            response = client.models.generate_content(
                model=settings.GEMINI_MODEL,
                contents=_build_prompt(payload),
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    response_mime_type="application/json",
                    response_schema=ChatResponse,
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

            return ChatResponse.model_validate(data)

        except ValidationError as error:

            logger.error("Gemini JSON failed schema validation: %s", error)
            raise HTTPException(
                status_code=502,
                detail="Gemini returned a response that did not match the expected structure.",
            ) from error


chat_service = ChatService()
