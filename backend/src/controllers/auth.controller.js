import authService from "../services/Auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

class AuthController {

    /**
     * Register User
     */
    register = asyncHandler(async (req, res) => {

        const result =
            await authService.register(req.body);

        return res.status(201).json(

            new ApiResponse(
                201,
                result,
                "User registered successfully."
            )

        );

    });

    /**
     * Login User
     */
    login = asyncHandler(async (req, res) => {

        const { email, password } = req.body;

        const result =
            await authService.login(
                email,
                password
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Login successful."
            )

        );

    });
    /**
     * Get Logged-in User Profile
     */
    getProfile = asyncHandler(async (req, res) => {

        const result =
            await authService.getProfile(
                req.user.id
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Profile fetched successfully."
            )

        );

    });

    /**
     * Update Logged-in User Profile
     */
    updateProfile = asyncHandler(async (req, res) => {

        const result =
            await authService.updateProfile(
                req.user.id,
                req.body
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Profile updated successfully."
            )

        );

    });

}

export default new AuthController();