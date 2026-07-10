import axios from "axios";

import ApiError from "../utils/ApiError.js";
import resumeService from "./resume.service.js";

/*
|--------------------------------------------------------------------------
| FastAPI AI Service HTTP Client
|--------------------------------------------------------------------------
| A single, shared Axios instance for every call this service makes to
| the Python (FastAPI) AI service. The base URL always comes from the
| environment — it must never be hardcoded.
*/

const REQUEST_TIMEOUT_MS = 30000;

const aiHttpClient = axios.create({
    baseURL: process.env.AI_SERVICE_URL,
    timeout: REQUEST_TIMEOUT_MS,
    headers: {
        "Content-Type": "application/json",
    },
});

class AIService {

    /**
     * Converts any Axios/FastAPI failure into a safe ApiError. Never
     * leaks raw Axios internals or FastAPI stack traces to the client.
     */
    toApiError(error, context) {

        if (error.code === "ECONNABORTED") {

            return new ApiError(
                504,
                `${context} timed out. Please try again.`
            );

        }

        if (!error.response) {

            return new ApiError(
                503,
                `${context} service is currently unavailable. Please try again later.`
            );

        }

        const { status, data } = error.response;
        const message = data?.message || data?.detail || `${context} failed.`;

        if (status === 400) {
            return new ApiError(400, message);
        }

        if (status === 404) {
            return new ApiError(404, message);
        }

        if (status === 422) {
            return new ApiError(422, message);
        }

        if (status === 503) {
            return new ApiError(503, message);
        }

        return new ApiError(500, `${context} failed unexpectedly.`);

    }

    /**
     * Forwards a request to the FastAPI AI service and returns its
     * response body as-is. This is a pure transport layer between
     * Express and FastAPI — it never contains business logic.
     */
    async forwardRequest(endpoint, payload, context) {

        if (!process.env.AI_SERVICE_URL) {

            throw new ApiError(503, "AI service is not configured.");

        }

        try {

            const fullUrl = new URL(endpoint, process.env.AI_SERVICE_URL).toString();

            const response = await axios.post(fullUrl, payload, {
                timeout: REQUEST_TIMEOUT_MS,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            return response.data;

        } catch (error) {

            if (error instanceof ApiError) {
                throw error;
            }

            throw this.toApiError(error, context);

        }

    }

    /**
     * Resume Analysis
     *
     * The Node backend never re-parses the resume file — it reuses the
     * already-extracted `rawText` saved on the Resume document during
     * upload (see resume.service.js#parseResumeText) and forwards only
     * the exact fields FastAPI's ResumeAnalysisRequest schema expects.
     */
    async analyzeResume(userId, payload) {

        const { resumeId } = payload;

        const resume = await resumeService.getOwnedResumeOrFail(userId, resumeId);

        if (!resume.rawText) {

            throw new ApiError(400, "Resume text not available for analysis.");

        }

        return await this.forwardRequest(
            "/analyze-resume",
            {
                resume_id: resume._id,
                resume_text: resume.rawText,
            },
            "Resume analysis"
        );

    }

    /**
     * Career Roadmap Generation
     *
     * Maps Node's `role` field onto FastAPI's CareerRoadmapRequest
     * schema (`target_role` — confirmed by inspecting the FastAPI
     * schema directly). The roadmap page only collects a single
     * desired role today, so no other optional context fields
     * (current_role, skills, experience_years, resume, resumeAnalysis,
     * githubAnalytics) are sent.
     */
    async generateRoadmap(userId, payload) {

        const { role } = payload;

        return await this.forwardRequest(
            "/career-roadmap",
            { target_role: role },
            "Roadmap generation"
        );

    }

    /**
     * Interview Question Generation
     *
     * Maps Node's `role` field onto FastAPI's InterviewQuestionsRequest
     * schema (`job_role` — confirmed by inspecting the schema directly),
     * the same convention already used for Career Roadmap. `role` is
     * optional: FastAPI infers a reasonable one when it is omitted, so
     * nothing is invented here when the frontend doesn't supply it.
     */
    async generateInterviewQuestions(userId, payload) {

        const { role } = payload;

        return await this.forwardRequest(
            "/interview-questions",
            role ? { job_role: role } : {},
            "Interview question generation"
        );

    }

    /**
     * Career Chat
     *
     * FastAPI's chat router only exposes POST /chat (confirmed by
     * inspecting ai-service/app/routers/chat.py directly) — there is no
     * "/career-chat" endpoint. Only `message` is forwarded: FastAPI's
     * ChatRequest is explicitly single-turn/stateless (no conversation
     * memory), so `userId` and any client-side history are not part of
     * its contract and are dropped rather than sent as dead weight.
     */
    async sendChatMessage(userId, payload) {

        const { message } = payload;

        return await this.forwardRequest(
            "/chat",
            { message },
            "Career chat"
        );

    }

}

export default new AIService();
