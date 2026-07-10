/*
|--------------------------------------------------------------------------
| Dashboard Analytics Helpers
|--------------------------------------------------------------------------
| Pure, deterministic, rule-based functions that turn a resume's
| parsedData into dashboard metrics. No AI/LLM involved — every score is
| a fixed formula over counts/fields so results are 100% reproducible.
*/

const EMPTY_SKILLS = {
    languages: [],
    frameworks: [],
    databases: [],
    tools: [],
    other: [],
};

const EMPTY_PARSED_DATA = {
    personalInfo: {},
    education: [],
    experience: [],
    projects: [],
    skills: EMPTY_SKILLS,
    certifications: [],
    achievements: [],
    languages: [],
};

const asList = (value) => (Array.isArray(value) ? value : []);

/**
 * Flatten the categorized skills object into a single count.
 */
const countSkills = (skills) => {

    if (!skills) {
        return 0;
    }

    return Object.values(skills).reduce(
        (total, bucket) => total + asList(bucket).length,
        0
    );

};

/**
 * Section entry counts shown on the dashboard.
 * @param {object|null} parsedData
 */
export const getSectionCounts = (parsedData) => {

    const data = parsedData || EMPTY_PARSED_DATA;

    return {
        education: asList(data.education).length,
        experience: asList(data.experience).length,
        projects: asList(data.projects).length,
        skills: countSkills(data.skills),
        certifications: asList(data.certifications).length,
        achievements: asList(data.achievements).length,
        languages: asList(data.languages).length,
    };

};

/*
|--------------------------------------------------------------------------
| Completion Percentage
|--------------------------------------------------------------------------
| A fixed checklist of profile sections. Each item is worth an equal
| share of 100% — simple and predictable rather than opinionated about
| which sections matter "more".
*/
const COMPLETION_CHECKLIST = [
    (data) => Boolean(data.personalInfo?.name && data.personalInfo?.email),
    (data) => asList(data.education).length > 0,
    (data) => asList(data.experience).length > 0,
    (data) => asList(data.projects).length > 0,
    (data) => countSkills(data.skills) > 0,
    (data) => asList(data.certifications).length > 0,
    (data) => asList(data.achievements).length > 0,
    (data) => asList(data.languages).length > 0,
];

/**
 * @param {object|null} parsedData
 * @returns {number} 0-100
 */
export const calculateCompletionPercentage = (parsedData) => {

    const data = parsedData || EMPTY_PARSED_DATA;
    const completedCount = COMPLETION_CHECKLIST.filter((isComplete) => isComplete(data)).length;

    return Math.round((completedCount / COMPLETION_CHECKLIST.length) * 100);

};

/*
|--------------------------------------------------------------------------
| Resume Score (rule-based, out of 100)
|--------------------------------------------------------------------------
| Each section contributes a capped share of the total, scaled by how
| much content it has (e.g. 2 experience entries already earns full
| marks for that section — more isn't rewarded further).
*/
const SCORE_WEIGHTS = {
    personalInfo: 10,
    education: 15,
    experience: 20,
    projects: 20,
    skills: 15,
    certifications: 10,
    achievements: 5,
    languages: 5,
};

const PERSONAL_INFO_FIELDS = ["name", "email", "phone", "linkedin", "github"];

const scorePersonalInfo = (personalInfo) => {

    const filledCount = PERSONAL_INFO_FIELDS.filter((field) => Boolean(personalInfo?.[field])).length;

    return (filledCount / PERSONAL_INFO_FIELDS.length) * SCORE_WEIGHTS.personalInfo;

};

/**
 * Full marks once `count` reaches `saturationCount`; scaled linearly below that.
 */
const scoreByCount = (count, saturationCount, weight) => {

    return (Math.min(count, saturationCount) / saturationCount) * weight;

};

/**
 * @param {object|null} parsedData
 * @returns {number} 0-100
 */
export const calculateResumeScore = (parsedData) => {

    const data = parsedData || EMPTY_PARSED_DATA;
    const counts = getSectionCounts(data);

    const rawScore =
        scorePersonalInfo(data.personalInfo) +
        scoreByCount(counts.education, 2, SCORE_WEIGHTS.education) +
        scoreByCount(counts.experience, 2, SCORE_WEIGHTS.experience) +
        scoreByCount(counts.projects, 4, SCORE_WEIGHTS.projects) +
        scoreByCount(counts.skills, 10, SCORE_WEIGHTS.skills) +
        scoreByCount(counts.certifications, 2, SCORE_WEIGHTS.certifications) +
        scoreByCount(counts.achievements, 2, SCORE_WEIGHTS.achievements) +
        scoreByCount(counts.languages, 2, SCORE_WEIGHTS.languages);

    return Math.round(Math.min(rawScore, 100));

};
