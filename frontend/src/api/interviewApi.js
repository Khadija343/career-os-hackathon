import api from "./axios";

/*
|--------------------------------------------------------------------------
| Interview Preparation API
|--------------------------------------------------------------------------
| Node's POST /ai/interview proxies to FastAPI's POST /interview-questions,
| whose InterviewQuestionsResponse shape (jobRole, experienceLevel,
| technicalQuestions, behavioralQuestions, codingChallenges,
| preparationTips) does not match the existing Interview page's UI
| contract (technical/behavioral/coding/tips arrays shaped for
| QuestionCard, CodingChallengeCard and PreparationTipCard). Per the
| "map, don't redesign" rule already used for the Roadmap page, that
| translation happens here so Interview.jsx and its components stay
| untouched.
*/

// Flattens the real FastAPI response into the shape Interview.jsx already
// renders. No question/challenge/tip content is invented — every value
// maps to a real field on InterviewQuestionsResponse. Two small, clearly
// non-invented gaps are filled for display purposes only:
//   - FastAPI's BehavioralQuestion has no `difficulty` field, so the
//     QuestionCard badge defaults to "Medium" for that tab only.
//   - `preparationTips` is an array of plain strings, but
//     PreparationTipCard needs a `title` + `description` pair, so each
//     tip is numbered ("Preparation Tip 1", ...) with the real tip text
//     as the description.
const mapInterviewResponse = (pack) => {
  if (!pack) {
    return null;
  }

  const technical = (pack.technicalQuestions || []).map((item, index) => ({
    id: `technical-${index}`,
    question: item.question,
    category: (item.expectedTopics || []).join(", ") || "Technical",
    difficulty: item.difficulty,
  }));

  const behavioral = (pack.behavioralQuestions || []).map((item, index) => ({
    id: `behavioral-${index}`,
    question: item.question,
    category: item.purpose || "Behavioral",
    difficulty: "Medium",
  }));

  const coding = (pack.codingChallenges || []).map((item, index) => ({
    id: `coding-${index}`,
    title: item.title,
    difficulty: item.difficulty,
    description: item.description,
    tags: item.expectedSkills || [],
  }));

  const tips = (pack.preparationTips || []).map((tip, index) => ({
    id: `tip-${index}`,
    title: `Preparation Tip ${index + 1}`,
    description: tip,
  }));

  return { technical, behavioral, coding, tips };
};

// Maps backend/AI-service/network failures to a single user-facing
// message, mirroring getRoadmapErrorMessage in roadmapApi.js.
export function getInterviewErrorMessage(err) {
  if (err?.code === "ECONNABORTED" || /timeout/i.test(err?.message || "")) {
    return "Interview question generation is taking longer than expected. Please try again in a moment.";
  }

  if (!err?.response) {
    return "Unable to reach the server. Please check your connection and try again.";
  }

  const { status, data } = err.response;

  if (status === 400 || status === 422) {
    return data?.message || "Something about that request wasn't valid. Please try again.";
  }

  if (status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (status === 403) {
    return data?.message || "You don't have permission to perform this action.";
  }

  if (status === 404) {
    return data?.message || "Interview service not found. Please try again later.";
  }

  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }

  if (status === 502 || status === 503 || status === 504) {
    return "The AI interview service is temporarily unavailable. Please try again shortly.";
  }

  if (status >= 500) {
    return "Something went wrong while generating interview questions. Please try again.";
  }

  return data?.message || "Failed to generate interview questions. Please try again.";
}

export const generateInterviewQuestions = async (role) => {
  try {
    const response = await api.post("/ai/interview", role ? { role } : {});

    return mapInterviewResponse(response.data?.data);
  } catch (error) {
    console.error("Interview Question Generation Error:", error);
    throw error;
  }
};
