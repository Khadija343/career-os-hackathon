from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Response body for GET /health."""

    status: str = Field(..., examples=["healthy"])
    service: str = Field(..., examples=["Career OS AI Service"])
