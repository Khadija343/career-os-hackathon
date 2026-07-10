import api from "./axios";

export const uploadResume = async (formData, onUploadProgress) => {
  try {
    const response = await api.post("/resume/upload", formData, {
      onUploadProgress,
    });

    return response.data;
  } catch (error) {
    console.error("Resume Upload Error:", error);
    throw error;
  }
};

// Triggers AI-powered resume analysis (Node backend -> FastAPI AI service).
// Analysis can take a while since it involves an LLM call, so this request
// uses a longer, explicit timeout so a hung request can be surfaced to the
// user instead of waiting indefinitely.
export const analyzeResume = async (resumeId) => {
  try {
    const response = await api.post(
      "/ai/resume/analyze",
      resumeId ? { resumeId } : {},
      { timeout: 45000 }
    );

    return response.data;
  } catch (error) {
    console.error("Resume Analysis Error:", error);
    throw error;
  }
};