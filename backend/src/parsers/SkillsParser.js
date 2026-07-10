import { extractSection } from "./sectionExtractor.helper.js";

/*
|--------------------------------------------------------------------------
| Known Skill Keywords (fallback categorization)
|--------------------------------------------------------------------------
| Used only when the resume doesn't already label its skills with
| "Languages:", "Frameworks:", etc. Lowercase for case-insensitive lookup.
*/
const KNOWN_SKILLS = {
    languages: [
        "javascript", "typescript", "python", "java", "c++", "c#", "c",
        "go", "golang", "rust", "ruby", "php", "swift", "kotlin", "dart",
        "scala", "r", "sql", "html", "css", "shell", "bash",
    ],
    frameworks: [
        "react", "angular", "vue", "next.js", "nuxt", "express", "django",
        "flask", "spring", "spring boot", "laravel", "rails", ".net",
        "node.js", "nestjs", "fastapi", "bootstrap", "tailwind", "redux",
        "tailwind css", "tailwindcss", "material ui", "material-ui",
    ],
    databases: [
        "mongodb", "mysql", "postgresql", "postgres", "sqlite", "redis",
        "oracle", "mariadb", "cassandra", "dynamodb", "firebase", "elasticsearch",
    ],
    tools: [
        "git", "github", "gitlab", "docker", "kubernetes", "jenkins", "aws",
        "azure", "gcp", "linux", "postman", "jira", "webpack", "vite",
        "figma", "terraform", "nginx", "ci/cd",
        // Auth/architecture concepts that show up alongside tools on
        // resumes but don't fit "language"/"framework"/"database".
        "jwt", "oauth", "oauth2",
        "rest api", "rest apis", "restful api", "restful apis", "rest",
        "mvc", "mvc architecture", "oop", "object oriented programming",
        "design patterns", "microservices", "websocket", "websockets",
    ],
};

const LABELED_LINE_REGEX = {
    languages: /^(languages?|programming languages?)\s*[:\-]/i,
    frameworks: /^(frameworks?(\s*\/\s*libraries)?|libraries)\s*[:\-]/i,
    databases: /^(databases?)\s*[:\-]/i,
    tools: /^(tools?(\s*&\s*platforms)?|platforms?)\s*[:\-]/i,
};

const splitSkillList = (text) => {
    return text
        .split(/,|\||•/)
        .map((s) => s.trim())
        .filter(Boolean);
};

/**
 * Categorize a flat list of skill tokens against the known-keyword
 * dictionary; anything unrecognized goes into "other".
 */
const categorizeByKeyword = (tokens, buckets) => {

    for (const token of tokens) {

        const normalized = token.toLowerCase();
        let matched = false;

        for (const [category, keywords] of Object.entries(KNOWN_SKILLS)) {

            if (keywords.includes(normalized)) {
                buckets[category].push(token);
                matched = true;
                break;
            }

        }

        if (!matched) {
            buckets.other.push(token);
        }

    }

};

/**
 * Parse the Skills section of a resume into categorized buckets.
 *
 * Two strategies, tried in order:
 *   1. Labeled lines ("Languages: JS, Python") — the reliable case.
 *   2. Otherwise, every skill token in the section is matched against a
 *      known-keyword dictionary; unmatched tokens land in "other".
 *
 * @param {string} rawText
 * @returns {{languages:string[],frameworks:string[],databases:string[],tools:string[],other:string[]}}
 */
const parseSkills = (rawText) => {

    const buckets = {
        languages: [],
        frameworks: [],
        databases: [],
        tools: [],
        other: [],
    };

    const sectionText = extractSection(rawText, "skills");

    if (!sectionText) {
        return buckets;
    }

    const lines = sectionText.split("\n").map((l) => l.trim()).filter(Boolean);

    const unlabeledTokens = [];

    for (const line of lines) {

        let handled = false;

        for (const [category, pattern] of Object.entries(LABELED_LINE_REGEX)) {

            if (pattern.test(line)) {
                const value = line.replace(pattern, "").trim();
                buckets[category].push(...splitSkillList(value));
                handled = true;
                break;
            }

        }

        if (!handled) {
            unlabeledTokens.push(...splitSkillList(line));
        }

    }

    // Only keyword-categorize the leftover tokens; if the section had no
    // labels at all, that means *every* token is "leftover".
    if (unlabeledTokens.length > 0) {
        categorizeByKeyword(unlabeledTokens, buckets);
    }

    return buckets;

};

export default parseSkills;
