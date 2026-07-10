/*
|--------------------------------------------------------------------------
| GitHub Analytics Helpers
|--------------------------------------------------------------------------
| Pure, deterministic functions that turn an array of already-synced
| GithubRepository records into dashboard-ready analytics. No GitHub API
| calls and no MongoDB access happen here — everything operates on plain
| repository objects handed in by the service layer, so an empty array
| is a perfectly valid input (a user with zero synced repos) rather than
| an error case.
*/

const TOP_TOPICS_LIMIT = 10;

const round = (value, decimals = 2) => {

    const factor = 10 ** decimals;

    return Math.round(value * factor) / factor;

};

/**
 * A small, consistent subset of repo fields used to identify a
 * "notable" repository (most starred, most recently updated, etc.)
 * without leaking the full raw document.
 */
const toRepoSummary = (repo) => {

    if (!repo) {
        return null;
    }

    return {
        name: repo.name,
        fullName: repo.fullName,
        htmlUrl: repo.htmlUrl,
        language: repo.language || "",
        stars: repo.stars || 0,
        forks: repo.forks || 0,
        createdAtGithub: repo.createdAtGithub || null,
        updatedAtGithub: repo.updatedAtGithub || null,
    };

};

/**
 * 1. Repository Summary
 * @param {object[]} repos
 */
export const getRepositorySummary = (repos) => {

    return {
        repositoryCount: repos.length,
        publicRepositoryCount: repos.filter((repo) => !repo.isPrivate).length,
        forkedRepositoryCount: repos.filter((repo) => repo.isFork).length,
        archivedRepositoryCount: repos.filter((repo) => repo.isArchived).length,
    };

};

/**
 * 2. Language Analytics
 * @param {object[]} repos
 */
export const getLanguageAnalytics = (repos) => {

    const counts = {};

    for (const repo of repos) {

        const language = (repo.language || "").trim();

        if (!language) {
            continue;
        }

        counts[language] = (counts[language] || 0) + 1;

    }

    // Sort by frequency so languageDistribution is already presentable
    // (most-used first) and mostUsedLanguage is simply the first entry.
    const sortedEntries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

    return {
        mostUsedLanguage: sortedEntries.length > 0 ? sortedEntries[0][0] : null,
        languageDistribution: Object.fromEntries(sortedEntries),
    };

};

/**
 * 3. Star Analytics
 * @param {object[]} repos
 */
export const getStarAnalytics = (repos) => {

    const totalStars = repos.reduce((sum, repo) => sum + (repo.stars || 0), 0);

    const mostStarredRepository = repos.reduce(
        (best, repo) => (!best || (repo.stars || 0) > (best.stars || 0) ? repo : best),
        null
    );

    return {
        totalStars,
        averageStars: repos.length > 0 ? round(totalStars / repos.length) : 0,
        mostStarredRepository: toRepoSummary(mostStarredRepository),
    };

};

/**
 * 4. Fork Analytics
 * @param {object[]} repos
 */
export const getForkAnalytics = (repos) => {

    const totalForks = repos.reduce((sum, repo) => sum + (repo.forks || 0), 0);

    return {
        totalForks,
        averageForks: repos.length > 0 ? round(totalForks / repos.length) : 0,
    };

};

/**
 * 5. Topic Analytics
 * @param {object[]} repos
 */
export const getTopicAnalytics = (repos) => {

    const counts = {};

    for (const repo of repos) {

        for (const topic of repo.topics || []) {

            if (!topic) {
                continue;
            }

            counts[topic] = (counts[topic] || 0) + 1;

        }

    }

    const topTopics = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, TOP_TOPICS_LIMIT)
        .map(([topic, count]) => ({ topic, count }));

    return { topTopics };

};

/**
 * Picks the repo with the earliest/latest value of `dateField`, skipping
 * repos where that field is missing. Shared by the three activity
 * metrics below since they're all "find the extreme by date" lookups.
 */
const pickByDate = (repos, dateField, pickLatest) => {

    return repos.reduce((best, repo) => {

        if (!repo[dateField]) {
            return best;
        }

        if (!best) {
            return repo;
        }

        const repoTime = new Date(repo[dateField]).getTime();
        const bestTime = new Date(best[dateField]).getTime();

        const repoIsBetter = pickLatest ? repoTime > bestTime : repoTime < bestTime;

        return repoIsBetter ? repo : best;

    }, null);

};

/**
 * 6. Activity Analytics
 * @param {object[]} repos
 */
export const getActivityAnalytics = (repos) => {

    return {
        mostRecentlyUpdatedRepository: toRepoSummary(pickByDate(repos, "updatedAtGithub", true)),
        oldestRepository: toRepoSummary(pickByDate(repos, "createdAtGithub", false)),
        newestRepository: toRepoSummary(pickByDate(repos, "createdAtGithub", true)),
    };

};

/**
 * Combine every analytics category into one payload. An empty `repos`
 * array (connected profile, zero synced repositories) naturally yields
 * zeroed counts and null "notable repository" fields — never throws.
 *
 * @param {object[]} repos
 */
export const buildGithubAnalytics = (repos) => {

    return {
        ...getRepositorySummary(repos),
        ...getLanguageAnalytics(repos),
        ...getStarAnalytics(repos),
        ...getForkAnalytics(repos),
        ...getTopicAnalytics(repos),
        ...getActivityAnalytics(repos),
    };

};
