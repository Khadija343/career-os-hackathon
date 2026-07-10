import express from "express";

import authRoutes from "./auth.routes.js";
import resumeRoutes from "./resume.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import githubRoutes from "./github.routes.js";
import aiRoutes from "./ai.routes.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

router.use("/auth", authRoutes);

/*
|--------------------------------------------------------------------------
| Resume Routes
|--------------------------------------------------------------------------
*/

router.use("/resume", resumeRoutes);

/*
|--------------------------------------------------------------------------
| Dashboard Routes
|--------------------------------------------------------------------------
*/

router.use("/dashboard", dashboardRoutes);

/*
|--------------------------------------------------------------------------
| GitHub Routes
|--------------------------------------------------------------------------
*/

router.use("/github", githubRoutes);

/*
|--------------------------------------------------------------------------
| AI Routes
|--------------------------------------------------------------------------
*/

router.use("/ai", aiRoutes);

export default router;