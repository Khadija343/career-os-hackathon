import express from "express";

import dashboardController from "../controllers/dashboard.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| All Dashboard Routes Require Authentication
|--------------------------------------------------------------------------
*/

router.use(authMiddleware);

// Get Dashboard Analytics for Logged-in User

router.get(
    "/",
    dashboardController.getDashboard
);

export default router;
