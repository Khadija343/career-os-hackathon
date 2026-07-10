import mongoose from "mongoose";
import path from "path";

import resumeRepository from "../repositories/Resume.repository.js";
import userRepository from "../repositories/User.repository.js";
import ApiError from "../utils/ApiError.js";
import extractResumeText from "../helpers/extractResumeText.js";

import {
    parsePersonalInfo,
    parseEducation,
    parseExperience,
    parseProjects,
    parseSkills,
    parseCertifications,
    parseAchievements,
    parseLanguages,
} from "../parsers/index.js";

import { RESUME_STATUS } from "../constants/status.constants.js";

const MAX_RESUMES_PER_USER = 5;

class ResumeService {

    /**
     * Remove internal/sensitive fields before sending resume to client
     */
    sanitizeResume(resume) {

        return {
            id: resume._id,
            originalFileName: resume.originalFileName,
            fileType: resume.fileType,
            fileSize: resume.fileSize,
            status: resume.status,
            isActive: resume.isActive,
            rawText: resume.rawText,
            parsedAt: resume.parsedAt,
            parseError: resume.parseError,
            parsedData: resume.parsedData,
            createdAt: resume.createdAt,
            updatedAt: resume.updatedAt,
        };

    }

    /**
     * Ensure the resume exists and belongs to the requesting user
     */
    async getOwnedResumeOrFail(userId, resumeId) {

        if (!mongoose.Types.ObjectId.isValid(resumeId)) {

            throw new ApiError(400, "Invalid resume ID.");

        }

        const resume = await resumeRepository.findById(resumeId);

        if (!resume) {

            throw new ApiError(404, "Resume not found.");

        }

        if (resume.user.toString() !== userId.toString()) {

            throw new ApiError(
                403,
                "You do not have access to this resume."
            );

        }

        return resume;

    }

    /**
     * Extract & Persist Resume Text (Phase 1 — deterministic parsing only)
     *
     * Runs synchronously right after upload since there is no job queue
     * yet. A parsing failure must NEVER fail the upload request — the
     * file and Resume record already exist successfully at that point,
     * so failures here are only reflected in status/parseError.
     */
    async parseResumeText(resume) {

        try {

            await resumeRepository.markProcessing(resume._id);

            const rawText = await extractResumeText(
                resume.filePath,
                resume.fileType
            );

            return await resumeRepository.markParsed(resume._id, rawText);

        } catch (error) {

            return await resumeRepository.markParseFailed(
                resume._id,
                error.message || "Failed to extract text from resume."
            );

        }

    }

    /**
     * Structure Resume Text into JSON (Phase 2 — deterministic, no LLM)
     *
     * Orchestrates the individual, single-purpose parsers (each one only
     * knows how to read rawText and return its own slice of structured
     * data) and assembles their output into one parsedData object.
     *
     * Only called when rawText extraction actually succeeded — there is
     * nothing to structure otherwise. Like parsing, a structuring failure
     * must not undo the already-successful "parsed" state; the resume
     * simply stays at status "parsed" and the error is recorded.
     */
    async structureResume(resume) {

        if (!resume.rawText) {
            return resume;
        }

        try {

            const parsedData = {
                personalInfo: parsePersonalInfo(resume.rawText),
                education: parseEducation(resume.rawText),
                experience: parseExperience(resume.rawText),
                projects: parseProjects(resume.rawText),
                skills: parseSkills(resume.rawText),
                certifications: parseCertifications(resume.rawText),
                achievements: parseAchievements(resume.rawText),
                languages: parseLanguages(resume.rawText),
            };

            return await resumeRepository.saveParsedData(resume._id, parsedData);

        } catch (error) {

            return await resumeRepository.markParseFailed(
                resume._id,
                `Structuring failed: ${error.message}`
            );

        }

    }

    /**
     * Upload Resume
     */
    async uploadResume(userId, file) {

        if (!file) {

            throw new ApiError(400, "Resume file is required.");

        }

        const resumeCount = await resumeRepository.countByUser(userId);

        if (resumeCount >= MAX_RESUMES_PER_USER) {

            throw new ApiError(
                400,
                `You can only store up to ${MAX_RESUMES_PER_USER} resumes. Please delete an existing resume first.`
            );

        }

        const fileType = path
            .extname(file.originalname)
            .toLowerCase()
            .replace(".", "");

        // The newly uploaded resume becomes the active one

        await resumeRepository.deactivateAllForUser(userId);

        const resume = await resumeRepository.createResume({
            user: userId,
            originalFileName: file.originalname,
            storedFileName: file.filename,
            filePath: file.path,
            fileType,
            fileSize: file.size,
            status: RESUME_STATUS.UPLOADED,
            isActive: true,
        });

        await userRepository.markProfileCompleted(userId);

        // Phase 1 resume parsing: extract raw text right away so the
        // client immediately sees status "parsed" (or "failed") and,
        // when successful, the extracted rawText in the same response.
        const parsedResume = await this.parseResumeText(resume);

        // Phase 2: only attempt structuring if text extraction actually
        // succeeded — there is nothing to structure from a failed parse.
        const finalResume =
            parsedResume.status === RESUME_STATUS.PARSED
                ? await this.structureResume(parsedResume)
                : parsedResume;

        return this.sanitizeResume(finalResume);

    }

    /**
     * Get All Resumes for Logged-in User
     */
    async getResumesForUser(userId) {

        const resumes = await resumeRepository.findAllByUser(userId);

        return resumes.map((resume) => this.sanitizeResume(resume));

    }

    /**
     * Get Active Resume for Logged-in User
     */
    async getActiveResume(userId) {

        const resume = await resumeRepository.findActiveByUser(userId);

        if (!resume) {

            throw new ApiError(404, "No active resume found.");

        }

        return this.sanitizeResume(resume);

    }

    /**
     * Get Resume by ID
     */
    async getResumeById(userId, resumeId) {

        const resume = await this.getOwnedResumeOrFail(userId, resumeId);

        return this.sanitizeResume(resume);

    }

    /**
     * Delete Resume
     */
    async deleteResume(userId, resumeId) {

        await this.getOwnedResumeOrFail(userId, resumeId);

        await resumeRepository.softDeleteResume(resumeId);

        return { message: "Resume deleted successfully." };

    }

}

export default new ResumeService();
