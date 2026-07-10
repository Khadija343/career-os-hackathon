import ApiError from "../utils/ApiError.js";

const GITHUB_API_BASE_URL = "https://api.github.com";
const REPOS_PER_PAGE = 100;
const MAX_REPO_PAGES = 50; // safety cap — 5,000 repos is far beyond any real account

/**
 * Uses Node's built-in fetch (Node 18+) so no extra HTTP client
 * dependency is needed. An optional GITHUB_TOKEN env var is sent as a
 * bearer token when present, raising the otherwise very low (60/hr)
 * unauthenticated rate limit.
 */
const buildHeaders = () => {

    const headers = {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "career-os-app",
    };

    if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    return headers;

};

/**
 * Shared response handling for every GitHub API call in this app.
 */
const assertSuccessfulResponse = (response, username) => {

    if (response.status === 404) {
        throw new ApiError(404, `GitHub user "${username}" does not exist.`);
    }

    if (response.status === 403 || response.status === 429) {
        throw new ApiError(429, "GitHub API rate limit exceeded. Please try again later.");
    }

    if (!response.ok) {
        throw new ApiError(502, "Failed to reach GitHub. Please try again later.");
    }

};

const requestGithub = async (url, username) => {

    let response;

    try {

        response = await fetch(url, { headers: buildHeaders() });

    } catch (error) {

        throw new ApiError(502, "Unable to reach GitHub right now. Please try again later.");

    }

    assertSuccessfulResponse(response, username);

    return await response.json();

};

/**
 * Fetch a public GitHub user's profile via the official REST API.
 * Only ever reads GET /users/:username — no repositories, no writes.
 *
 * @param {string} username
 * @returns {Promise<object>} Raw GitHub user object.
 * @throws {ApiError} 404 if the user doesn't exist, 429 if rate
 * limited, 502 for any other unreachable/unexpected API failure.
 */
export const fetchGithubUser = async (username) => {

    return await requestGithub(
        `${GITHUB_API_BASE_URL}/users/${encodeURIComponent(username)}`,
        username
    );

};

/**
 * Fetch every public repository owned by a GitHub user via the official
 * REST API, following pagination until a short page (or the safety cap)
 * is reached. Never writes anything — this only ever GETs.
 *
 * @param {string} username
 * @returns {Promise<object[]>} Raw GitHub repository objects.
 * @throws {ApiError} 404 if the user doesn't exist, 429 if rate
 * limited, 502 for any other unreachable/unexpected API failure.
 */
export const fetchGithubRepos = async (username) => {

    const allRepos = [];

    for (let page = 1; page <= MAX_REPO_PAGES; page++) {

        const url =
            `${GITHUB_API_BASE_URL}/users/${encodeURIComponent(username)}/repos` +
            `?per_page=${REPOS_PER_PAGE}&sort=updated&page=${page}`;

        const pageRepos = await requestGithub(url, username);

        allRepos.push(...pageRepos);

        // A page shorter than the requested page size means it was the last one.
        if (pageRepos.length < REPOS_PER_PAGE) {
            break;
        }

    }

    return allRepos;

};

export default fetchGithubUser;
