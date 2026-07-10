import express from "express";

import authController from "../controllers/Auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

import validate from "../middleware/validation.middleware.js";

import {

    registerSchema,

    loginSchema,

    updateProfileSchema,

} from "../validators/auth.validator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Register

router.post(

    "/register",

    validate(registerSchema),

    authController.register

);

// Login

router.post(

    "/login",

    validate(loginSchema),

    authController.login

);
/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/
router
    .route("/profile")

    .get(

        authMiddleware,

        authController.getProfile

    )

    .put(

        authMiddleware,

        validate(updateProfileSchema),

        authController.updateProfile

    );
// Get Logged-in User Profile


export default router;