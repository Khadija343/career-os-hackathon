import { extractSection, splitIntoBullets } from "./sectionExtractor.helper.js";

const PAREN_REGEX = /\(([^)]+)\)/;
const SEPARATOR_REGEX = /[:\-–—]\s*(.+)$/;

/**
 * Parse one language line into { language, proficiency }. Proficiency is
 * looked for in two ways, tried in order:
 *   1. Parenthesized, e.g. "English (Professional Working)" — checked
 *      first so a hyphen inside the language name (e.g.
 *      "Mandarin-Chinese (Native)") isn't mistaken for a separator.
 *   2. Colon/dash separated, e.g. "English - Professional Working" or
 *      "English: Fluent" — the whole remainder is taken as the
 *      proficiency (not matched against a fixed keyword list) since
 *      proficiency scales vary ("Professional Working", "Native or
 *      Bilingual", etc).
 * If neither is present, proficiency is left as an empty string rather
 * than guessed.
 */
const parseLanguageLine = (line) => {

    const trimmed = line.trim();
    const parenMatch = trimmed.match(PAREN_REGEX);

    if (parenMatch) {
        return {
            language: trimmed.replace(PAREN_REGEX, "").trim(),
            proficiency: parenMatch[1].trim(),
        };
    }

    const sepMatch = trimmed.match(SEPARATOR_REGEX);

    if (sepMatch) {
        return {
            language: trimmed.slice(0, sepMatch.index).trim(),
            proficiency: sepMatch[1].trim(),
        };
    }

    return { language: trimmed, proficiency: "" };

};

/**
 * Parse the Languages section (natural/spoken languages — distinct from
 * programming languages, which live under skills.languages).
 * @param {string} rawText
 * @returns {Array<{language:string,proficiency:string}>}
 */
const parseLanguages = (rawText) => {

    const sectionText = extractSection(rawText, "languages");

    if (!sectionText) {
        return [];
    }

    // Strip bullet markers first, then split each resulting line on
    // commas — languages are sometimes comma-separated on one line
    // (e.g. "English (Native), Urdu (Fluent)") rather than one per line.
    const entries = splitIntoBullets(sectionText)
        .flatMap((line) => line.split(","))
        .map((s) => s.trim())
        .filter(Boolean);

    return entries.map(parseLanguageLine);

};

export default parseLanguages;
