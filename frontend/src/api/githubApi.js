import api from "./axios";

/*
|--------------------------------------------------------------------------
| GitHub Analysis API
|--------------------------------------------------------------------------
| The FastAPI AI service has no GitHub-specific endpoint (GitHub analytics
| are only ever forwarded as *context* into the roadmap/interview/chat
| prompts — see ai-service/app/schemas/{roadmap,interview,chat}.py). So,
| unlike Resume Analysis, GitHub Analysis is served entirely by the
| existing Node backend's `/github` module (connect -> sync -> analytics),
| which computes deterministic stats directly from GitHub's REST API.
| There is nothing to proxy through the AI service here.
*/

// A GitHub profile can only be connected once per account (see
// github.service.js#connectGithub) — there is no "disconnect" endpoint.
// Fetches the existing connection, if any, without throwing on 404.
const getExistingProfile = async () => {
  try {
    const response = await api.get("/github/profile");
    return response.data?.data || null;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const connectGithub = async (username) => {
  const response = await api.post("/github/connect", { username });
  return response.data;
};

export const getGithubProfile = async () => {
  const response = await api.get("/github/profile");
  return response.data;
};

export const syncGithubRepositories = async () => {
  const response = await api.post("/github/sync");
  return response.data;
};

export const getGithubRepositories = async () => {
  const response = await api.get("/github/repositories");
  return response.data;
};

export const getGithubAnalytics = async () => {
  const response = await api.get("/github/analytics");
  return response.data;
};

// Derives simple, honest, data-driven observations from the deterministic
// analytics the backend already computes. These are plain factual
// call-outs (not AI-generated insights) since no AI/Gemini analysis
// exists for GitHub yet — see the module note above.
const buildStrengths = (analytics) => {
  const strengths = [];

  if (analytics.repositoryCount > 0) {
    strengths.push(
      `${analytics.repositoryCount} repositories synced from GitHub.`
    );
  }

  if (analytics.mostUsedLanguage) {
    strengths.push(`Most used language: ${analytics.mostUsedLanguage}.`);
  }

  if (analytics.totalStars > 0) {
    strengths.push(
      `${analytics.totalStars} total stars earned across your repositories.`
    );
  }

  if (analytics.topTopics?.length > 0) {
    strengths.push(
      `Active in topics like ${analytics.topTopics
        .slice(0, 3)
        .map((t) => t.topic)
        .join(", ")}.`
    );
  }

  return strengths;
};

const buildImprovements = (analytics) => {
  const improvements = [];

  if (analytics.repositoryCount === 0) {
    improvements.push(
      "No repositories synced yet — push some projects to GitHub to build your portfolio."
    );

    return improvements;
  }

  if (!analytics.topTopics || analytics.topTopics.length === 0) {
    improvements.push(
      "Add topics/tags to your repositories to improve discoverability."
    );
  }

  if (analytics.totalStars === 0) {
    improvements.push(
      "None of your repositories have been starred yet — a polished README can help."
    );
  }

  if (
    analytics.forkedRepositoryCount === analytics.repositoryCount &&
    analytics.repositoryCount > 0
  ) {
    improvements.push(
      "Most of your repositories are forks — consider showcasing original projects too."
    );
  }

  return improvements;
};

// Simple, transparent heuristic (not AI-generated) so the existing
// "GitHub Score" UI slot has a meaningful value — up to 40 points for
// repository count, 40 for stars, 20 for language diversity.
const computeGithubScore = (analytics) => {
  const repoScore = Math.min(analytics.repositoryCount * 8, 40);
  const starScore = Math.min(analytics.totalStars * 2, 40);
  const languageScore = Math.min(
    Object.keys(analytics.languageDistribution || {}).length * 5,
    20
  );

  return Math.min(100, repoScore + starScore + languageScore);
};

const mapAnalysisResult = (analytics, repositories) => {
  const languages = Object.entries(analytics.languageDistribution || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name]) => ({ name }));

  const projects = (repositories || []).slice(0, 5).map((repo) => ({
    name: repo.name,
    description: repo.description || "No description provided.",
  }));

  return {
    githubScore: computeGithubScore(analytics),
    repositories: analytics.repositoryCount,
    strengths: buildStrengths(analytics),
    improvements: buildImprovements(analytics),
    languages,
    projects,
  };
};

/**
 * Analyze a GitHub Profile
 *
 * Orchestrates the existing `/github` endpoints — connect (only if not
 * already connected), sync, then analytics + repositories — and maps
 * the result into the flat shape the existing GitHub Analysis UI expects.
 * Throws an axios-shaped error (with `.response.status`/`.data.message`)
 * for a same-user/different-username conflict so the caller's existing
 * error handling can treat it the same as any other backend error.
 */
export const analyzeGithub = async (username) => {
  const existingProfile = await getExistingProfile();

  if (!existingProfile) {
    await connectGithub(username);
  } else if (
    existingProfile.username?.toLowerCase() !== username.trim().toLowerCase()
  ) {
    const conflictError = new Error(
      `Your account is already connected to GitHub user "${existingProfile.username}". Disconnecting and switching accounts isn't supported yet.`
    );
    conflictError.response = {
      status: 409,
      data: { message: conflictError.message },
    };
    throw conflictError;
  }

  await syncGithubRepositories();

  const [analyticsResponse, repositoriesResponse] = await Promise.all([
    getGithubAnalytics(),
    getGithubRepositories(),
  ]);

  return mapAnalysisResult(
    analyticsResponse?.data,
    repositoriesResponse?.data
  );
};
