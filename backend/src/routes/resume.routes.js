import express from "express";

import resumeController from "../controllers/resume.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import uploadResumeFile from "../middleware/upload.middleware.js";
import validate from "../middleware/validation.middleware.js";

import { resumeIdParamSchema } from "../validators/resume.validator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| All Resume Routes Require Authentication
|--------------------------------------------------------------------------
*/

router.use(authMiddleware);

// Upload Resume

router.post(
    "/upload",
    uploadResumeFile,
    resumeController.uploadResume
);

// Get All Resumes for Logged-in User

router.get(
    "/",
    resumeController.getMyResumes
);

// Get Active Resume for Logged-in User

router.get(
    "/active",
    resumeController.getActiveResume
);

/*
|--------------------------------------------------------------------------
| Routes with :id Param
|--------------------------------------------------------------------------
*/

router
    .route("/:id")

    .get(
        validate(resumeIdParamSchema, "params"),
        resumeController.getResumeById
    )

    .delete(
        validate(resumeIdParamSchema, "params"),
        resumeController.deleteResume
    );

export default router;
