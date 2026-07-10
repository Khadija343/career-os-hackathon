import api from "./axios";

/*
|--------------------------------------------------------------------------
| Career Roadmap API
|--------------------------------------------------------------------------
| Node's POST /ai/roadmap proxies to FastAPI's POST /career-roadmap,
| whose CareerRoadmapResponse shape (targetRole, estimatedDuration,
| learningStages, recommendedProjects, recommendedCertificates,
| jobPreparationTips, milestones) does not match the existing Roadmap
| page's UI contract (goal, progress, roadmap, milestones,
| recommendations). Per the "map, don't redesign" rule, that translation
| happens here so Roadmap.jsx and its components stay untouched.
*/

// Flattens the real FastAPI response into the flat shape Roadmap.jsx
// already renders. No field is invented — every value maps to a real
// field on CareerRoadmapResponse. `progress` has no backend equivalent
// (a freshly generated roadmap has no progress yet), so it starts at 0.
const mapRoadmapResponse = (roadmap) => {
  if (!roadmap) {
    return null;
  }

  const recommendations = [
    ...(roadmap.jobPreparationTips || []),
    ...(roadmap.recommendedProjects || []).map((project) => `Project idea: ${project}`),
    ...(roadmap.recommendedCertificates || []).map((cert) => `Certification: ${cert}`),
  ];

  return {
    goal: roadmap.targetRole,
    progress: 0,
    roadmap: (roadmap.learningStages || []).map((stage) => stage.title),
    milestones: roadmap.milestones || [],
    recommendations,
  };
};

// Maps backend/AI-service/network failures to a single user-facing
// message, mirroring getAnalysisErrorMessage in ResumeAnalysis.jsx.
export function getRoadmapErrorMessage(err) {
  if (err?.code === "ECONNABORTED" || /timeout/i.test(err?.message || "")) {
    return "Roadmap generation is taking longer than expected. Please try again in a moment.";
  }

  if (!err?.response) {
    return "Unable to reach the server. Please check your connection and try again.";
  }

  const { status, data } = err.response;

  if (status === 400 || status === 422) {
    return data?.message || "Please enter a valid career role.";
  }

  if (status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (status === 403) {
    return data?.message || "You don't have permission to perform this action.";
  }

  if (status === 404) {
    return data?.message || "Roadmap service not found. Please try again later.";
  }

  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }

  if (status === 502 || status === 503 || status === 504) {
    return "The AI roadmap service is temporarily unavailable. Please try again shortly.";
  }

  if (status >= 500) {
    return "Something went wrong while generating your roadmap. Please try again.";
  }

  return data?.message || "Failed to generate roadmap. Please try again.";
}

export const generateRoadmap = async (role) => {
  try {
    const response = await api.post("/ai/roadmap", { role });

    return mapRoadmapResponse(response.data?.data);
  } catch (error) {
    console.error("Roadmap Generation Error:", error);
    throw error;
  }
};
