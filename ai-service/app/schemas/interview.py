from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class InterviewQuestionsRequest(BaseModel):
    """
    Request body for POST /interview-questions.

    `job_role` / `current_role` / `experience_level` / `skills` are
    explicit, typed hints. `resume`, `resumeAnalysis`, `careerRoadmap`,
    and `githubAnalytics` carry richer context assembled by the Node
    backend's AI orchestration layer (see
    backend/src/services/ai.service.js#buildUserContext) — typed loosely
    since their shape is owned by other modules and can evolve
    independently of this schema. `extra="allow"` means any additional
    context fields Node sends (e.g. `user`, `githubProfile`,
    `dashboardAnalytics`) are accepted without validation errors, even
    though this service only reads the fields it actually needs.
    """

    model_config = ConfigDict(extra="allow")

    job_role: str | None = Field(
        default=None, description="Target job role / role being interviewed for."
    )
    current_role: str | None = Field(
        default=None, description="Candidate's current role, if different from the target."
    )
    experience_level: str | None = Field(
        default=None, description="e.g. 'entry', 'mid', 'senior'."
    )
    skills: list[str] = Field(default_factory=list, description="Relevant skills.")

    resume: dict[str, Any] | None = Field(
        default=None, description="Sanitized structured resume, if available."
    )
    resumeAnalysis: dict[str, Any] | None = Field(
        default=None, description="Prior Gemini resume analysis output, if available."
    )
    careerRoadmap: dict[str, Any] | None = Field(
        default=None, description="Prior Gemini career roadmap output, if available."
    )
    githubAnalytics: dict[str, Any] | None = Field(
        default=None, description="Computed GitHub analytics, if available."
    )


class TechnicalQuestion(BaseModel):
    question: str
    difficulty: str
    expectedTopics: list[str] = Field(default_factory=list)
    idealAnswerSummary: str


class BehavioralQuestion(BaseModel):
    question: str
    purpose: str
    idealAnswerSummary: str


class CodingChallenge(BaseModel):
    title: str
    difficulty: str
    description: str
    expectedSkills: list[str] = Field(default_factory=list)


class InterviewQuestionsResponse(BaseModel):
    """
    Response body for POST /interview-questions.

    This is also handed to Gemini as the `response_schema` for JSON-mode
    structured output, so its shape IS the contract Gemini must satisfy —
    keep it in sync with the "Expected JSON schema" from the spec exactly.
    """

    jobRole: str
    experienceLevel: str
    technicalQuestions: list[TechnicalQuestion] = Field(default_factory=list)
    behavioralQuestions: list[BehavioralQuestion] = Field(default_factory=list)
    codingChallenges: list[CodingChallenge] = Field(default_factory=list)
    preparationTips: list[str] = Field(default_factory=list)
