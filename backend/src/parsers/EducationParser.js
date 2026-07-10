import { extractSection, splitIntoBlocks } from "./sectionExtractor.helper.js";
import { DATE_RANGE_REGEX, DEGREE_REGEX, GPA_REGEX } from "./patterns.helper.js";

/**
 * Parse one education block (institution + degree + dates + gpa).
 * Institution is heuristically the line that isn't the degree line and
 * isn't a date-only line — usually the first line of the block.
 */
const parseEducationBlock = (block) => {

    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

    const degreeLine = lines.find((line) => DEGREE_REGEX.test(line)) || "";

    const institutionLine =
        lines.find(
            (line) => line !== degreeLine && !DATE_RANGE_REGEX.test(line)
        ) ||
        lines[0] ||
        "";

    const dateMatch = block.match(DATE_RANGE_REGEX);
    const gpaMatch = block.match(GPA_REGEX);

    return {
        institution: institutionLine,
        degree: degreeLine,
        startDate: dateMatch ? dateMatch[1] : "",
        endDate: dateMatch ? dateMatch[2] : "",
        gpa: gpaMatch ? gpaMatch[1] : "",
    };

};

/**
 * Parse the Education section of a resume into structured entries.
 * @param {string} rawText
 * @returns {Array<{institution:string,degree:string,startDate:string,endDate:string,gpa:string}>}
 */
const parseEducation = (rawText) => {

    const sectionText = extractSection(rawText, "education");

    if (!sectionText) {
        return [];
    }

    return splitIntoBlocks(sectionText).map(parseEducationBlock);

};

export default parseEducation;
