import { extractSection, splitIntoBlocks, splitIntoBullets } from "./sectionExtractor.helper.js";
import { DATE_RANGE_REGEX } from "./patterns.helper.js";

/**
 * Parse one experience block into { title, company, startDate, endDate, description }.
 *
 * Convention assumed: the first line of the block holds the job title
 * and/or company (commonly "Title, Company" or "Title — Company"), the
 * date range appears on the first or second line, and every remaining
 * line is a bullet describing the role.
 */
const parseExperienceBlock = (block) => {

    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

    const headerLine = lines[0] || "";
    const dateMatch = block.match(DATE_RANGE_REGEX);

    // Header commonly looks like "Software Engineer, Acme Corp" or
    // "Software Engineer - Acme Corp" or "Software Engineer at Acme Corp".
    const headerWithoutDates = headerLine.replace(DATE_RANGE_REGEX, "").trim();
    const splitHeader = headerWithoutDates.split(/,|–|—|\s-\s|\bat\b|\|/i).map((p) => p.trim()).filter(Boolean);

    const title = splitHeader[0] || headerWithoutDates;
    const company = splitHeader[1] || "";

    // Bullets are every line after the header (and after a date-only
    // line, if the date range sits on its own line).
    const descriptionLines = lines.slice(1).filter((line) => !DATE_RANGE_REGEX.test(line) || line !== lines[1]);

    return {
        title,
        company,
        startDate: dateMatch ? dateMatch[1] : "",
        endDate: dateMatch ? dateMatch[2] : "",
        description: splitIntoBullets(descriptionLines.join("\n")),
    };

};

/**
 * Parse the Experience section of a resume into structured entries.
 * @param {string} rawText
 * @returns {Array<{title:string,company:string,startDate:string,endDate:string,description:string[]}>}
 */
const parseExperience = (rawText) => {

    const sectionText = extractSection(rawText, "experience");

    if (!sectionText) {
        return [];
    }

    return splitIntoBlocks(sectionText).map(parseExperienceBlock);

};

export default parseExperience;
