import express from "express";

import githubController from "../controllers/github.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validation.middleware.js";

import { connectGithubSchema } from "../validators/github.validator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| All GitHub Routes Require Authentication
|--------------------------------------------------------------------------
*/

router.use(authMiddleware);

// Connect GitHub Account

router.post(
    "/connect",
    validate(connectGithubSchema),
    githubController.connectGithub
);

// Get Connected GitHub Profile for Logged-in User

router.get(
    "/profile",
    githubController.getProfile
);

// Sync GitHub Repositories

router.post(
    "/sync",
    githubController.syncRepositories
);

// Get Synced Repositories for Logged-in User

router.get(
    "/repositories",
    githubController.getRepositories
);

// Get GitHub Analytics for Logged-in User

router.get(
    "/analytics",
    githubController.getAnalytics
);

export default router;
