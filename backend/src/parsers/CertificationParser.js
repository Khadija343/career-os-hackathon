import {
    extractSection,
    splitIntoBullets,
    hasCombinedCertAchievementsHeader,
} from "./sectionExtractor.helper.js";
import { isCertificationLine } from "./patterns.helper.js";

const YEAR_REGEX = /\b(19|20)\d{2}\b/;

/**
 * Certifications are usually one line each, often
 * "Certification Name - Issuer (Year)" or "Certification Name, Issuer, 2022".
 */
const parseCertificationLine = (line) => {

    const yearMatch = line.match(YEAR_REGEX);
    const withoutYear = line.replace(YEAR_REGEX, "").trim();

    const parts = withoutYear.split(/,|–|—|\s-\s|\(|\)/).map((p) => p.trim()).filter(Boolean);

    return {
        name: parts[0] || withoutYear,
        issuer: parts[1] || "",
        date: yearMatch ? yearMatch[0] : "",
    };

};

/**
 * Parse the Certifications section of a resume into structured entries.
 *
 * Some resumes list a single combined "Certifications & Achievements"
 * header instead of two separate sections. extractSection() matches that
 * combined header for both "certifications" and "achievements", so in
 * that case the section body contains both kinds of lines — this filters
 * down to only the ones that look like certifications. When the resume
 * has its own dedicated "Certifications" header, every line is trusted
 * as-is.
 *
 * @param {string} rawText
 * @returns {Array<{name:string,issuer:string,date:string}>}
 */
const parseCertifications = (rawText) => {

    const sectionText = extractSection(rawText, "certifications");

    if (!sectionText) {
        return [];
    }

    let lines = splitIntoBullets(sectionText);

    if (hasCombinedCertAchievementsHeader(rawText)) {
        lines = lines.filter(isCertificationLine);
    }

    return lines.map(parseCertificationLine);

};

export default parseCertifications;
