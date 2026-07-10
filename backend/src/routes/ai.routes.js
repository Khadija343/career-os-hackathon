import express from "express";

import aiController from "../controllers/ai.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| All AI Routes Require Authentication
|--------------------------------------------------------------------------
*/

router.use(authMiddleware);

// Resume Analysis

router.post(
    "/resume/analyze",
    aiController.analyzeResume
);

// Career Roadmap Generation

router.post(
    "/roadmap",
    aiController.generateRoadmap
);

// Interview Question Generation

router.post(
    "/interview",
    aiController.generateInterviewQuestions
);

// Career Chat

router.post(
    "/chat",
    aiController.sendChatMessage
);

export default router;
