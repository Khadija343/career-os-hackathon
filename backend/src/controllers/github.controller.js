import githubService from "../services/github.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

class GithubController {

    /**
     * Connect GitHub Account
     */
    connectGithub = asyncHandler(async (req, res) => {

        const result =
            await githubService.connectGithub(
                req.user.id,
                req.body.username
            );

        return res.status(201).json(

            new ApiResponse(
                201,
                result,
                "GitHub account connected successfully."
            )

        );

    });

    /**
     * Get Connected GitHub Profile for Logged-in User
     */
    getProfile = asyncHandler(async (req, res) => {

        const result =
            await githubService.getProfile(
                req.user.id
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "GitHub profile fetched successfully."
            )

        );

    });

    /**
     * Sync GitHub Repositories
     */
    syncRepositories = asyncHandler(async (req, res) => {

        const result =
            await githubService.syncRepositories(
                req.user.id
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "GitHub repositories synced successfully."
            )

        );

    });

    /**
     * Get Synced Repositories for Logged-in User
     */
    getRepositories = asyncHandler(async (req, res) => {

        const result =
            await githubService.getRepositories(
                req.user.id
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "GitHub repositories fetched successfully."
            )

        );

    });

    /**
     * Get GitHub Analytics for Logged-in User
     */
    getAnalytics = asyncHandler(async (req, res) => {

        const result =
            await githubService.getGithubAnalytics(
                req.user.id
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "GitHub analytics fetched successfully."
            )

        );

    });

}

export default new GithubController();
