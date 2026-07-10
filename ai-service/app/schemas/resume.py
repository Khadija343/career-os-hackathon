from pydantic import BaseModel, Field


class ResumeAnalysisRequest(BaseModel):
    """
    Request body for POST /analyze-resume.

    `resume_text` is the raw resume content to analyze. `resume_id` is an
    optional reference back to the resume in the main backend, useful for
    logging/traceability but not required for analysis itself.
    """

    resume_id: str | None = Field(
        default=None,
        description="ID of the resume in the main backend (optional, for traceability).",
    )
    resume_text: str | None = Field(
        default=None,
        description="Raw extracted resume text to analyze.",
    )


class ResumeAnalysisResponse(BaseModel):
    """
    Response body for POST /analyze-resume.

    This is also handed to Gemini as the `response_schema` for JSON-mode
    structured output, so its shape IS the contract Gemini must satisfy —
    keep it in sync with the "Expected JSON schema" from the spec exactly.
    """

    overallScore: int = Field(
        ..., ge=0, le=100, description="Overall resume quality score (0-100)."
    )
    atsScore: int = Field(
        ..., ge=0, le=100, description="Estimated ATS-friendliness score (0-100)."
    )
    careerLevel: str = Field(
        ...,
        description="Perceived seniority, e.g. 'Entry-level', 'Junior', 'Mid-level', 'Senior'.",
    )
    strengths: list[str] = Field(default_factory=list)
    weaknesses: list[str] = Field(default_factory=list)
    missingSkills: list[str] = Field(default_factory=list)
    recommendations: list[str] = Field(default_factory=list)
