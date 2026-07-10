import dashboardService from "../services/dashboard.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

class DashboardController {

    /**
     * Get Dashboard Analytics for Logged-in User
     */
    getDashboard = asyncHandler(async (req, res) => {

        const result =
            await dashboardService.getDashboard(
                req.user.id
            );

        return res.status(200).json(

            new ApiResponse(
                200,
                result,
                "Dashboard analytics fetched successfully."
            )

        );

    });

}

export default new DashboardController();
