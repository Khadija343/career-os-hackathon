import mongoose from "mongoose";

import resumeRepository from "../repositories/Resume.repository.js";
import ApiError from "../utils/ApiError.js";

import {
    calculateCompletionPercentage,
    calculateResumeScore,
    getSectionCounts,
} from "../helpers/dashboardAnalytics.helper.js";

const EMPTY_COUNTS = {
    education: 0,
    experience: 0,
    projects: 0,
    skills: 0,
    certifications: 0,
    achievements: 0,
    languages: 0,
};

class DashboardService {

    /**
     * Build dashboard analytics for the logged-in user from their active
     * resume's parsedData. Never returns the raw resume document — only
     * computed, presentation-ready metrics.
     *
     * A user with no active resume (or one that hasn't finished
     * structuring yet) still gets a valid, zeroed-out response rather
     * than a 404, since the dashboard should render for every logged-in
     * user regardless of upload progress.
     */
    async getDashboard(userId) {

        if (!mongoose.Types.ObjectId.isValid(userId)) {

            throw new ApiError(401, "Invalid or missing user context.");

        }

        const resume = await resumeRepository.findActiveByUser(userId);

        if (!resume) {

            return {
                hasResume: false,
                activeResumeStatus: null,
                completionPercentage: 0,
                resumeScore: 0,
                counts: EMPTY_COUNTS,
                lastUpdated: null,
            };

        }

        // parsedData is only populated once the resume reaches
        // "structured" — for any earlier (or failed) status it's still
        // null, and the analytics helpers treat that as an empty resume.
        const parsedData = resume.parsedData || null;

        return {
            hasResume: true,
            activeResumeStatus: resume.status,
            completionPercentage: calculateCompletionPercentage(parsedData),
            resumeScore: calculateResumeScore(parsedData),
            counts: getSectionCounts(parsedData),
            lastUpdated: resume.updatedAt,
        };

    }

}

export default new DashboardService();
