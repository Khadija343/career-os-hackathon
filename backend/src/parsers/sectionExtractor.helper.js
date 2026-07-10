/*
|--------------------------------------------------------------------------
| Section Header Aliases
|--------------------------------------------------------------------------
| Resumes label the same section differently. Each parser looks up its
| own aliases here; everything else is treated as a "foreign" header that
| marks where its own section ends.
*/
const SECTION_ALIASES = {
    education: ["education", "academic background", "academics", "educational qualifications"],
    experience: [
        "experience",
        "work experience",
        "professional experience",
        "employment history",
        "work history",
    ],
    projects: ["projects", "personal projects", "academic projects", "key projects"],
    skills: [
        "skills",
        "technical skills",
        "skills & tools",
        "skills and tools",
        "core competencies",
    ],
    certifications: [
        "certifications",
        "certificates",
        "licenses & certifications",
        "licenses and certifications",
        "certifications & achievements",
        "certifications and achievements",
    ],
    achievements: [
        "achievements",
        "awards",
        "honors",
        "honors & awards",
        "accomplishments",
        "certifications & achievements",
        "certifications and achievements",
    ],
    languages: ["languages", "language proficiency"],
};

const COMBINED_CERT_ACHIEVEMENT_HEADERS = [
    "certifications & achievements",
    "certifications and achievements",
];

const ALL_HEADERS = Object.values(SECTION_ALIASES).flat();

const normalizeHeaderLine = (line) => {
    return line
        .trim()
        .toLowerCase()
        .replace(/[:.\-–—]+$/, "")
        .trim();
};

/**
 * True when the resume uses a single combined "Certifications &
 * Achievements" header instead of two separate sections — both
 * CertificationParser and AchievementParser use this to know whether
 * they need to split the shared section body by content, or can trust
 * the whole section belongs to them.
 */
export const hasCombinedCertAchievementsHeader = (rawText) => {

    if (!rawText) {
        return false;
    }

    return rawText
        .split("\n")
        .some((line) => COMBINED_CERT_ACHIEVEMENT_HEADERS.includes(normalizeHeaderLine(line)));

};

/**
 * Extract the raw text belonging to one resume section (e.g. "education"),
 * i.e. everything between its own header line and the next recognized
 * section header (or end of document).
 *
 * Relies on section headers appearing on their own line, which is the
 * near-universal convention in resumes and holds up well after PDF/DOCX
 * text extraction.
 *
 * @param {string} rawText - Full resume text.
 * @param {keyof typeof SECTION_ALIASES} sectionKey - Which section to extract.
 * @returns {string} The section's body text, or "" if not found.
 */
export const extractSection = (rawText, sectionKey) => {

    if (!rawText) {
        return "";
    }

    const aliases = SECTION_ALIASES[sectionKey] || [];
    const lines = rawText.split("\n");

    let startIndex = -1;

    for (let i = 0; i < lines.length; i++) {

        if (aliases.includes(normalizeHeaderLine(lines[i]))) {
            startIndex = i;
            break;
        }

    }

    if (startIndex === -1) {
        return "";
    }

    let endIndex = lines.length;

    for (let i = startIndex + 1; i < lines.length; i++) {

        const normalized = normalizeHeaderLine(lines[i]);

        if (ALL_HEADERS.includes(normalized) && !aliases.includes(normalized)) {
            endIndex = i;
            break;
        }

    }

    return lines.slice(startIndex + 1, endIndex).join("\n").trim();

};

/**
 * Split a section's body into entry blocks separated by one or more
 * blank lines (the common convention for separating education entries,
 * jobs, projects, etc.).
 */
export const splitIntoBlocks = (sectionText) => {

    if (!sectionText) {
        return [];
    }

    return sectionText
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean);

};

/**
 * Split a block into individual bullet points, stripping common bullet
 * characters ("-", "*", "•", "◦") from the start of each line.
 */
export const splitIntoBullets = (blockText) => {

    if (!blockText) {
        return [];
    }

    return blockText
        .split("\n")
        .map((line) => line.replace(/^[\s•◦▪‣*-]+/, "").trim())
        .filter(Boolean);

};

const BULLET_LINE_REGEX = /^\s*[•◦▪‣*-]\s*\S/;
const METADATA_LINE_REGEX = /^\s*(tech(nologies)?(\s+used)?|tech\s*stack|stack|tools?\s*used|built\s*with)\s*[:\-]/i;
const TITLE_MAX_LENGTH = 60;

/**
 * Heuristically decide whether a line starts a brand-new entry (a project
 * or job title) as opposed to continuing the previous one. Bullets and
 * "Technologies: ..." lines are always continuations. Otherwise, a line
 * "looks like a title" if it's short and doesn't end in sentence
 * punctuation — description lines are typically full sentences (and tend
 * to run long even when the author skips the trailing period).
 */
const looksLikeNewEntryTitle = (line) => {

    if (BULLET_LINE_REGEX.test(line) || METADATA_LINE_REGEX.test(line)) {
        return false;
    }

    const trimmed = line.trim();

    if (/[.!?]$/.test(trimmed)) {
        return false;
    }

    return trimmed.length <= TITLE_MAX_LENGTH;

};

/**
 * Split a single block (no blank lines inside it, in principle) into
 * multiple entries using the title-line heuristic above.
 */
const splitBlockByTitleLines = (block) => {

    const lines = block.split("\n").filter((line) => line.trim() !== "");
    const entries = [];
    let current = [];

    for (const line of lines) {

        if (looksLikeNewEntryTitle(line) && current.length > 0) {
            entries.push(current.join("\n"));
            current = [line];
        } else {
            current.push(line);
        }

    }

    if (current.length > 0) {
        entries.push(current.join("\n"));
    }

    return entries;

};

/**
 * A more robust alternative to splitIntoBlocks() for sections whose
 * entries aren't reliably separated by blank lines (a common real-world
 * case for tightly-packed project/experience lists).
 *
 * If the section already contains blank-line-separated blocks, those are
 * trusted completely and returned as-is — this avoids incorrectly
 * splitting a normal "title line + free-form description line" entry
 * whose description happens to lack a bullet or trailing punctuation.
 * Only when there's no blank-line separation at all (everything lands in
 * one block) does it fall back to the title-line heuristic, which is
 * exactly the case where entries would otherwise get merged together.
 */
export const splitIntoEntries = (sectionText) => {

    if (!sectionText) {
        return [];
    }

    const blocks = sectionText
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean);

    if (blocks.length > 1) {
        return blocks;
    }

    return splitBlockByTitleLines(blocks[0] || "");

};
