from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class CareerRoadmapRequest(BaseModel):
    """
    Request body for POST /career-roadmap.

    `current_role` / `target_role` / `skills` / `experience_years` are
    explicit, typed hints. `resume`, `resumeAnalysis`, and
    `githubAnalytics` carry richer context assembled by the Node
    backend's AI orchestration layer (see
    backend/src/services/ai.service.js#buildUserContext) — typed loosely
    since their shape is owned by other modules and can evolve
    independently of this schema. `extra="allow"` means any additional
    context fields Node sends (e.g. `user`, `githubProfile`,
    `dashboardAnalytics`) are accepted without validation errors, even
    though this service only reads the fields it actually needs.
    """

    model_config = ConfigDict(extra="allow")

    current_role: str | None = Field(default=None, description="User's current role.")
    target_role: str | None = Field(default=None, description="User's target role.")
    skills: list[str] = Field(default_factory=list, description="Known skills.")
    experience_years: float | None = Field(default=None, description="Years of experience.")

    resume: dict[str, Any] | None = Field(
        default=None, description="Sanitized structured resume, if available."
    )
    resumeAnalysis: dict[str, Any] | None = Field(
        default=None, description="Prior Gemini resume analysis output, if available."
    )
    githubAnalytics: dict[str, Any] | None = Field(
        default=None, description="Computed GitHub analytics, if available."
    )


class LearningStage(BaseModel):
    """A single ordered stage within a generated roadmap."""

    title: str
    description: str
    skills: list[str] = Field(default_factory=list)
    resources: list[str] = Field(default_factory=list)


class CareerRoadmapResponse(BaseModel):
    """
    Response body for POST /career-roadmap.

    This is also handed to Gemini as the `response_schema` for JSON-mode
    structured output, so its shape IS the contract Gemini must satisfy —
    keep it in sync with the "Expected JSON schema" from the spec exactly.
    """

    targetRole: str
    estimatedDuration: str
    learningStages: list[LearningStage] = Field(default_factory=list)
    recommendedProjects: list[str] = Field(default_factory=list)
    recommendedCertificates: list[str] = Field(default_factory=list)
    jobPreparationTips: list[str] = Field(default_factory=list)
    milestones: list[str] = Field(default_factory=list)
