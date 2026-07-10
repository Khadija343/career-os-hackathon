import resumeService from "../services/resume.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

class ResumeController {

    /**
     * Upload Resume
     */
    uploadResume = asyncHandler(async (req, res) => {

        const result =
            await resumeService.uploadResume(
                req.user.id,
                req.file
            );

        return res.status(201).json(

            new ApiResponse(
                201,
                result,
                "Resume uploaded successfully."
            )

        );

    });

    /**
     * Get All Resumes for Logged-in User
     */
    getMyResumes = asyncHandler(async (req, res) => {

        const result =
            await resumeService.getResumesForUser(
                req.user.id
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Resumes fetched successfully."
            )

        );

    });

    /**
     * Get Active Resume for Logged-in User
     */
    getActiveResume = asyncHandler(async (req, res) => {

        const result =
            await resumeService.getActiveResume(
                req.user.id
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Active resume fetched successfully."
            )

        );

    });

    /**
     * Get Resume by ID
     */
    getResumeById = asyncHandler(async (req, res) => {

        const result =
            await resumeService.getResumeById(
                req.user.id,
                req.params.id
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Resume fetched successfully."
            )

        );

    });

    /**
     * Delete Resume
     */
    deleteResume = asyncHandler(async (req, res) => {

        const result =
            await resumeService.deleteResume(
                req.user.id,
                req.params.id
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Resume deleted successfully."
            )

        );

    });

}

export default new ResumeController();
