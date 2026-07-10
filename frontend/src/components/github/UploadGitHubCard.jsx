import { useState } from "react";
import { analyzeGithub } from "../../api/githubApi";

// Maps backend/GitHub-API/network failures to a single user-facing
// message, mirroring getAnalysisErrorMessage in ResumeAnalysis.jsx.
function getGithubAnalysisErrorMessage(err) {
  if (err?.code === "ECONNABORTED" || /timeout/i.test(err?.message || "")) {
    return "GitHub analysis is taking longer than expected. Please try again in a moment.";
  }

  if (!err?.response) {
    return "Unable to reach the server. Please check your connection and try again.";
  }

  const { status, data } = err.response;

  if (status === 404) {
    return data?.message || "That GitHub username doesn't exist. Please check the spelling and try again.";
  }

  if (status === 409) {
    return data?.message || "This account is already connected to a different GitHub username.";
  }

  if (status === 429) {
    return data?.message || "GitHub API rate limit exceeded. Please try again later.";
  }

  if (status === 400) {
    return data?.message || "Please enter a valid GitHub username.";
  }

  if (status === 502) {
    return "Unable to reach GitHub right now. Please try again later.";
  }

  if (status >= 500) {
    return "The GitHub analysis service is temporarily unavailable. Please try again shortly.";
  }

  return data?.message || "Failed to analyze GitHub profile.";
}

function UploadGitHubCard({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!username.trim()) {
      setError("Please enter GitHub username");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await analyzeGithub(username.trim());
      onSuccess(data);
    } catch (err) {
      setError(getGithubAnalysisErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl rounded-3xl border border-slate-700/70 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">GitHub Insight</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Analyze a developer profile</h2>
        <p className="mt-2 text-sm text-slate-400">Enter a GitHub handle to review activity, strengths, and project signal.</p>
      </div>

      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
      />

      {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="mt-5 w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Analyzing..." : "Analyze Profile"}
      </button>
    </div>
  );
}

export default UploadGitHubCard;