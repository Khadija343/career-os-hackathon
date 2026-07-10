import { useState } from "react";

import ScoreCard from "../../components/resume/ScoreCard";
import AnalysisCard from "../../components/resume/AnalysisCard";
import KeywordTag from "../../components/resume/KeywordTag";
import UploadGitHubCard from "../../components/github/UploadGitHubCard";

function GitHubAnalysis() {
  const [analysis, setAnalysis] = useState(null);

  const handleSuccess = (response) => {
    setAnalysis(response);
  };

  if (!analysis) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 text-slate-300 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <div className="mb-4 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300">
          GitHub Intelligence
        </div>
        <h2 className="mb-3 text-3xl font-semibold text-white">Review your coding footprint</h2>
        <p className="mb-6 max-w-xl text-center text-slate-400">Enter a GitHub username to uncover engineering strengths, language patterns, and project momentum.</p>
        <UploadGitHubCard onSuccess={handleSuccess} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">Profile Snapshot</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">GitHub Analysis</h1>
        <p className="mt-3 max-w-2xl text-slate-400">A concise view of your repository activity, development strengths, and opportunities to grow.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <ScoreCard title="GitHub Score" score={`${analysis?.githubScore || 0}%`} />
        <ScoreCard title="Repositories" score={analysis?.repositories || 0} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AnalysisCard title="Strengths" type="success" items={analysis?.strengths || []} />
        <AnalysisCard title="Improvements" type="danger" items={analysis?.improvements || []} />
      </div>

      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <h2 className="mb-4 text-2xl font-semibold text-white">Top Languages</h2>
        <div className="flex flex-wrap gap-3">
          {(analysis?.languages || []).map((lang, index) => (
            <KeywordTag key={index} keyword={lang.name} matched={true} />
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <h2 className="mb-4 text-2xl font-semibold text-white">Recent Projects</h2>
        <div className="space-y-3">
          {(analysis?.projects || []).map((p, index) => (
            <div key={index} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <h3 className="font-semibold text-white">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{p.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <UploadGitHubCard onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export default GitHubAnalysis;