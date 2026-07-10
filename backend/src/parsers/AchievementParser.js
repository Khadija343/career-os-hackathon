import {
    extractSection,
    splitIntoBullets,
    hasCombinedCertAchievementsHeader,
} from "./sectionExtractor.helper.js";
import { isCertificationLine } from "./patterns.helper.js";

/**
 * Parse the Achievements/Awards section of a resume into a flat list of
 * plain-text bullets — achievements are too free-form for further
 * structuring without an LLM.
 *
 * Some resumes list a single combined "Certifications & Achievements"
 * header instead of two separate sections. extractSection() matches that
 * combined header for both "certifications" and "achievements", so in
 * that case the section body contains both kinds of lines — this filters
 * out the ones that look like certifications so they aren't duplicated
 * here. When the resume has its own dedicated "Achievements" header,
 * every line is trusted as-is.
 *
 * @param {string} rawText
 * @returns {string[]}
 */
const parseAchievements = (rawText) => {

    const sectionText = extractSection(rawText, "achievements");

    if (!sectionText) {
        return [];
    }

    const lines = splitIntoBullets(sectionText);

    if (hasCombinedCertAchievementsHeader(rawText)) {
        return lines.filter((line) => !isCertificationLine(line));
    }

    return lines;

};

export default parseAchievements;
