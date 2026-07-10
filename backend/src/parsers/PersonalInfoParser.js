import {
    EMAIL_REGEX,
    PHONE_REGEX,
    LINKEDIN_REGEX,
    GITHUB_REGEX,
    LOCATION_REGEX,
} from "./patterns.helper.js";

/*
|--------------------------------------------------------------------------
| Personal Info Parser
|--------------------------------------------------------------------------
| Contact details live at the top of the resume, before any section
| headers, so this parser scans the raw text directly rather than relying
| on extractSection() (which is for headered sections only).
*/

/**
 * The name is almost always the very first non-empty line, as long as
 * that line isn't itself an email/phone/link (some templates put a
 * "Resume" or "Curriculum Vitae" title first — skip those too).
 */
const guessName = (lines) => {

    const skipWords = ["resume", "curriculum vitae", "cv"];

    for (const line of lines.slice(0, 5)) {

        const trimmed = line.trim();

        if (!trimmed) {
            continue;
        }

        if (EMAIL_REGEX.test(trimmed) || PHONE_REGEX.test(trimmed)) {
            continue;
        }

        if (skipWords.includes(trimmed.toLowerCase())) {
            continue;
        }

        // A name line is short and has no digits.
        if (trimmed.length <= 60 && !/\d/.test(trimmed)) {
            return trimmed;
        }

    }

    return "";

};

/**
 * Location is heuristically a "City, Region/Country" pair near the top of
 * the header block. Unlike email/phone/links, it's frequently combined
 * with other contact details on the same line (e.g.
 * "Lahore, Pakistan | jane@email.com | +92 300 1234567"), so this looks
 * for the pattern as a substring of each line rather than requiring the
 * whole line to match — otherwise lines containing an email would be
 * skipped entirely and the location on that same line would be missed.
 */
const guessLocation = (lines, name) => {

    for (const line of lines.slice(0, 8)) {

        const trimmed = line.trim();

        if (!trimmed || trimmed === name) {
            continue;
        }

        const match = trimmed.match(LOCATION_REGEX);

        if (match) {
            return `${match[1].trim()}, ${match[2].trim()}`;
        }

    }

    return "";

};

/**
 * Extract personal/contact information from resume raw text.
 * @param {string} rawText
 * @returns {{name:string,email:string,phone:string,linkedin:string,github:string,location:string}}
 */
const parsePersonalInfo = (rawText) => {

    const result = {
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        github: "",
        location: "",
    };

    if (!rawText) {
        return result;
    }

    const lines = rawText.split("\n");

    result.name = guessName(lines);
    result.location = guessLocation(lines, result.name);

    const emailMatch = rawText.match(EMAIL_REGEX);
    result.email = emailMatch ? emailMatch[0] : "";

    const phoneMatch = rawText.match(PHONE_REGEX);
    result.phone = phoneMatch ? phoneMatch[0].trim() : "";

    const linkedinMatch = rawText.match(LINKEDIN_REGEX);
    result.linkedin = linkedinMatch ? linkedinMatch[0] : "";

    const githubMatch = rawText.match(GITHUB_REGEX);
    result.github = githubMatch ? githubMatch[0] : "";

    return result;

};

export default parsePersonalInfo;
