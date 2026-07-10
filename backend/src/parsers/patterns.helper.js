/*
|--------------------------------------------------------------------------
| Shared Regex Patterns
|--------------------------------------------------------------------------
| Centralized so every parser interprets dates, emails, links, etc. the
| same way instead of each re-implementing slightly different regexes.
*/

export const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3}[-.\s]?\d{3,4}/;

export const LINKEDIN_REGEX = /(https?:\/\/)?(www\.)?linkedin\.com\/[A-Za-z0-9\-_/]+/i;

export const GITHUB_REGEX = /(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9\-_/]+/i;

// Matches full URLs as well as bare domains commonly pasted without a
// protocol (e.g. "github.com/user/repo") — resumes rarely include "https://".
export const GENERIC_URL_REGEX = /(https?:\/\/[^\s,)]+|(?:www\.)?[a-z0-9-]+\.(?:com|io|dev|net|org|app)\/[^\s,)]+)/i;

const MONTH = "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";

/**
 * Matches date ranges like:
 *   "2020 - 2023", "Jan 2021 – Present", "06/2019 to 08/2021"
 * Captures start and end as loosely-formatted strings (not parsed into
 * real Date objects, since resumes rarely specify exact days).
 */
export const DATE_RANGE_REGEX = new RegExp(
    `((?:${MONTH}\\.?\\s+)?\\d{4}|\\d{1,2}\\/\\d{4})\\s*(?:-|–|—|to)\\s*((?:${MONTH}\\.?\\s+)?\\d{4}|\\d{1,2}\\/\\d{4}|[Pp]resent|[Cc]urrent)`,
    "i"
);

export const GPA_REGEX = /GPA[:\s]*([\d.]+)\s*(?:\/\s*([\d.]+))?/i;

/**
 * Matches a "City, Country/State" pair anywhere within a line — not the
 * whole line — since headers commonly combine it with other contact info
 * on one line (e.g. "Lahore, Pakistan | jane@email.com | +92 300 1234567").
 * Both parts must start with a capital letter and contain no digits/@ so
 * it doesn't accidentally match emails, phone numbers, or links.
 */
export const LOCATION_REGEX = /\b([A-Z][a-zA-Z.]{1,30}(?:\s[A-Z][a-zA-Z.]{1,30})?),\s*([A-Z][a-zA-Z.]{1,30}(?:\s[A-Z][a-zA-Z.]{1,30})?)\b/;

/*
|--------------------------------------------------------------------------
| Certification Detection
|--------------------------------------------------------------------------
| Used to split a combined "Certifications & Achievements" section into
| its two parts: lines that look like certifications vs. everything else.
*/
const CERTIFICATION_PROVIDER_KEYWORDS = [
    "aws", "amazon web services", "google", "microsoft", "azure", "oracle",
    "cisco", "comptia", "coursera", "udemy", "edx", "pmi", "scrum",
    "salesforce", "ibm", "meta", "hubspot", "hackerrank", "freecodecamp",
];

const CERTIFICATION_KEYWORD_REGEX = /certificat|licens/i;

/**
 * Heuristically decide whether a single line reads like a certification
 * entry (as opposed to a general achievement/award line).
 */
export const isCertificationLine = (line) => {

    if (CERTIFICATION_KEYWORD_REGEX.test(line)) {
        return true;
    }

    const normalized = line.toLowerCase();

    return CERTIFICATION_PROVIDER_KEYWORDS.some((keyword) => normalized.includes(keyword));

};

/**
 * Common degree keywords used to identify a "degree line" within an
 * education entry, and to help separate it from the institution line.
 */
export const DEGREE_KEYWORDS = [
    "bachelor",
    "master",
    "b\\.?tech",
    "m\\.?tech",
    "b\\.?sc",
    "m\\.?sc",
    "b\\.?e\\.?",
    "m\\.?e\\.?",
    "b\\.?a\\.?",
    "m\\.?a\\.?",
    "mba",
    "phd",
    "ph\\.?d\\.?",
    "associate",
    "diploma",
    "high school",
];

export const DEGREE_REGEX = new RegExp(`(${DEGREE_KEYWORDS.join("|")})`, "i");
