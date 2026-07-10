import { extractSection, splitIntoEntries, splitIntoBullets } from "./sectionExtractor.helper.js";
import { GENERIC_URL_REGEX } from "./patterns.helper.js";

const TECH_LINE_REGEX = /^(tech(nologies)?(\s+used)?|tech\s*stack|stack|tools?\s*used|built\s*with)\s*[:\-]/i;

/**
 * Parse a "Technologies: React, Node.js, MongoDB" style line into an
 * array. Falls back to [] if no such line exists in the block.
 */
const extractTechnologies = (lines) => {

    const techLine = lines.find((line) => TECH_LINE_REGEX.test(line));

    if (!techLine) {
        return [];
    }

    return techLine
        .replace(TECH_LINE_REGEX, "")
        .split(/,|\|/)
        .map((t) => t.trim())
        .filter(Boolean);

};

/**
 * Parse one project entry into { name, description, technologies, link }.
 * The first line is treated as the project name (and often contains its
 * link, which is extracted separately).
 */
const parseProjectBlock = (block) => {

    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

    const nameLine = lines[0] || "";
    const linkMatch = block.match(GENERIC_URL_REGEX);

    const name = nameLine
        .replace(GENERIC_URL_REGEX, "")
        .replace(/[()[\]]/g, "")
        .trim();
    const technologies = extractTechnologies(lines);

    const descriptionLines = lines.slice(1).filter((line) => !TECH_LINE_REGEX.test(line));

    return {
        name,
        description: splitIntoBullets(descriptionLines.join("\n")),
        technologies,
        link: linkMatch ? linkMatch[0] : "",
    };

};

/**
 * Parse the Projects section of a resume into structured entries.
 *
 * Uses splitIntoEntries() rather than a plain blank-line split because
 * project lists are frequently packed together without blank lines
 * between them — relying only on blank lines would merge every project
 * (and, if the next section's header goes undetected, even later
 * sections) into a single entry.
 *
 * @param {string} rawText
 * @returns {Array<{name:string,description:string[],technologies:string[],link:string}>}
 */
const parseProjects = (rawText) => {

    const sectionText = extractSection(rawText, "projects");

    if (!sectionText) {
        return [];
    }

    return splitIntoEntries(sectionText).map(parseProjectBlock);

};

export default parseProjects;
