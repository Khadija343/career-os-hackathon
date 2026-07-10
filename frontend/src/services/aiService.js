import { uploadResume, analyzeResume } from "../api/resumeApi";
import { analyzeGithub } from "../api/githubApi";
import { generateRoadmap } from "../api/roadmapApi";
import { generateInterviewQuestions } from "../api/interviewApi";
import { sendMessage as sendChatMessage, clearConversation as clearChatConversation } from "../api/chatApi";

const aiService = {
  uploadResume,
  analyzeResume,
  analyzeGithub,
  generateRoadmap,
  generateInterviewQuestions,
  sendChatMessage,
  clearChatConversation,
};

export default aiService;