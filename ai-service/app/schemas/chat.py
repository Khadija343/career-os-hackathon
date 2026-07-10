from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    """
    Request body for POST /chat.

    `message` is the one field that actually drives a chat turn.
    `conversation_id` is accepted but unused — no memory/history is
    implemented (single-turn only, by design). `current_role` /
    `target_role` / `skills` are explicit, typed hints; `resume`,
    `resumeAnalysis`, `careerRoadmap`, `interviewQuestions`,
    `githubProfile`, `githubAnalytics`, and `dashboardAnalytics` carry
    richer context assembled by the Node backend's AI orchestration layer
    (see backend/src/services/ai.service.js) or passed directly by a
    caller — typed loosely since their shape is owned by other modules.
    `extra="allow"` means any additional context fields are accepted
    without validation errors, even though this service only reads the
    ones it actually uses.
    """

    model_config = ConfigDict(extra="allow")

    message: str | None = Field(default=None, description="User's chat message.")
    conversation_id: str | None = Field(
        default=None,
        description="ID used to group messages into a conversation (unused — no memory is implemented).",
    )

    current_role: str | None = Field(default=None, description="User's current role.")
    target_role: str | None = Field(default=None, description="User's target role.")
    skills: list[str] = Field(default_factory=list, description="Known skills.")

    resume: dict[str, Any] | None = Field(
        default=None, description="Sanitized structured resume, if available."
    )
    resumeAnalysis: dict[str, Any] | None = Field(
        default=None, description="Prior Gemini resume analysis output, if available."
    )
    careerRoadmap: dict[str, Any] | None = Field(
        default=None, description="Prior Gemini career roadmap output, if available."
    )
    interviewQuestions: dict[str, Any] | None = Field(
        default=None, description="Prior Gemini interview questions output, if available."
    )
    githubProfile: dict[str, Any] | None = Field(
        default=None, description="Connected GitHub profile, if available."
    )
    githubAnalytics: dict[str, Any] | None = Field(
        default=None, description="Computed GitHub analytics, if available."
    )
    dashboardAnalytics: dict[str, Any] | None = Field(
        default=None, description="Computed dashboard analytics, if available."
    )


class ChatResponse(BaseModel):
    """
    Response body for POST /chat.

    This is also handed to Gemini as the `response_schema` for JSON-mode
    structured output, so its shape IS the contract Gemini must satisfy —
    keep it in sync with the "Expected JSON schema" from the spec exactly.
    """

    answer: str
    followUpSuggestions: list[str] = Field(default_factory=list)
