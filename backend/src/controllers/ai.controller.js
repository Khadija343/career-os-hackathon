import aiService from "../services/ai.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

class AIController {

    /**
     * Resume Analysis
     */
    analyzeResume = asyncHandler(async (req, res) => {

        const { resumeId } = req.body;

        if (!resumeId || typeof resumeId !== "string") {

            throw new ApiError(400, "resumeId is required.");

        }

        const result =
            await aiService.analyzeResume(
                req.user.id,
                req.body
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Resume analyzed successfully."
            )

        );

    });

    /**
     * Career Roadmap Generation
     */
    generateRoadmap = asyncHandler(async (req, res) => {

        const { role } = req.body;

        if (!role || typeof role !== "string") {

            throw new ApiError(400, "role is required.");

        }

        const result =
            await aiService.generateRoadmap(
                req.user.id,
                req.body
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Roadmap generated successfully."
            )

        );

    });

    /**
     * Interview Question Generation
     *
     * `role` is optional here (unlike Roadmap's), since FastAPI's
     * job_role is itself optional and infers a sensible role when
     * absent — the existing Interview Preparation page has no role
     * input, so requiring one would always fail with a 400.
     */
    generateInterviewQuestions = asyncHandler(async (req, res) => {

        const { role } = req.body;

        if (role !== undefined && typeof role !== "string") {

            throw new ApiError(400, "role must be a string.");

        }

        const result =
            await aiService.generateInterviewQuestions(
                req.user.id,
                req.body
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Interview questions generated successfully."
            )

        );

    });

    /**
     * Career Chat
     */
    sendChatMessage = asyncHandler(async (req, res) => {

        const { message } = req.body;

        if (!message || typeof message !== "string") {

            throw new ApiError(400, "message is required.");

        }

        const result =
            await aiService.sendChatMessage(
                req.user.id,
                req.body
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Chat response generated successfully."
            )

        );

    });

}

export default new AIController();
