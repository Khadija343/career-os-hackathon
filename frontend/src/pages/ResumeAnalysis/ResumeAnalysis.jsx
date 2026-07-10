import { useState } from "react";
import aiService from "../../services/aiService";

import ScoreCard from "../../components/resume/ScoreCard";
import AnalysisCard from "../../components/resume/AnalysisCard";
import KeywordTag from "../../components/resume/KeywordTag";
import SuggestionCard from "../../components/resume/SuggestionCard";
import UploadResumeCard from "../../components/resume/UploadResumeCard";

// Maps AI-service/backend/network failures to a single user-facing message.
function getAnalysisErrorMessage(err) {
  if (err?.code === "ECONNABORTED" || /timeout/i.test(err?.message || "")) {
    return "Analysis is taking longer than expected. Please try again in a moment.";
  }

  if (!err?.response) {
    return "Unable to reach the analysis service. Please check your connection and try again.";
  }

  const { status, data } = err.response;

  if (status === 404) {
    return data?.message || "No resume found to analyze. Please upload a resume first.";
  }

  if (status >= 500) {
    return "The AI analysis service is temporarily unavailable. Please try again shortly.";
  }

  return data?.message || "Resume analysis failed. Please try again.";
}

function ResumeAnalysis() {
  const [resumeMeta, setResumeMeta] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  // Calls the Resume Analysis endpoint (Node -> FastAPI AI service).
  const runAnalysis = async (resumeId) => {
    setAnalyzing(true);
    setAnalysisError("");

    try {
      const result = await aiService.analyzeResume(resumeId);
      setAnalysis(result?.data || null);
    } catch (err) {
      setAnalysisError(getAnalysisErrorMessage(err));
    } finally {
      setAnalyzing(false);
    }
  };

  // Upload success handler — automatically kicks off analysis once a
  // resume has been uploaded (backend metadata comes in via `uploadedResume`).
  const handleUploadSuccess = (uploadedResume) => {
    setResumeMeta(uploadedResume);
    runAnalysis(uploadedResume?.id);
  };

  // Lets the user re-run analysis on demand (e.g. after a failure, or to
  // refresh the report) without re-uploading.
  const handleReanalyze = () => {
    runAnalysis(resumeMeta?.id);
  };

  // 🔴 EMPTY STATE — nothing uploaded yet
  if (!analysis && !analyzing && !analysisError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 text-gray-600">
        <h2 className="text-2xl font-bold mb-4">
          📄 Resume Analysis
        </h2>

        <p className="mb-6">
          Upload your resume to start analysis
        </p>

        <UploadResumeCard onUploadSuccess={handleUploadSuccess} />
      </div>
    );
  }

  // 🟡 LOADING STATE — first analysis run in progress, nothing to show yet
  if (analyzing && !analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 text-gray-600">
        <h2 className="text-2xl font-bold mb-4">
          📄 Resume Analysis
        </h2>
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p>Analyzing your resume with AI. This can take a moment...</p>
      </div>
    );
  }

  // 🟠 ERROR STATE — first analysis run failed, nothing to show yet
  if (analysisError && !analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 text-gray-600">
        <h2 className="text-2xl font-bold mb-4">
          📄 Resume Analysis
        </h2>

        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-md">
          <p className="text-red-600 font-medium mb-4">{analysisError}</p>
          <button
            onClick={handleReanalyze}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>

        <div className="mt-8 w-full max-w-xl">
          <UploadResumeCard onUploadSuccess={handleUploadSuccess} />
        </div>
      </div>
    );
  }

  // 🔵 MAIN UI — analysis is available (may be silently re-analyzing)
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-4xl font-bold">
          📄 Resume Analysis
        </h1>

        <button
          onClick={handleReanalyze}
          disabled={analyzing}
          className={`px-5 py-2.5 rounded-lg font-medium text-white transition ${
            analyzing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {analyzing ? "Re-analyzing..." : "Re-run Analysis"}
        </button>
      </div>

      {analysisError && (
        <div className="mb-6 bg-red-100 text-red-600 p-3 rounded-lg">
          {analysisError}
        </div>
      )}

      {/* SCORE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScoreCard
          title="Resume Score"
          score={`${analysis?.resumeScore || 0}%`}
        />

        <ScoreCard
          title="ATS Score"
          score={`${analysis?.atsScore || 0}%`}
        />
      </div>

      {/* STRENGTHS / WEAKNESSES */}
      <div className="mt-8">
        <AnalysisCard
          title="Strengths"
          type="success"
          items={analysis?.strengths || []}
        />

        <AnalysisCard
          title="Weaknesses"
          type="danger"
          items={analysis?.weaknesses || []}
        />

        <AnalysisCard
          title="Missing Skills"
          type="warning"
          items={analysis?.missingSkills || []}
        />

        <AnalysisCard
          title="Recommendations"
          type="info"
          items={analysis?.recommendations || []}
        />
      </div>

      {/* KEYWORDS */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Matched Keywords
        </h2>

        <div className="flex flex-wrap gap-3">
          {(analysis?.keywords || []).map((item, index) => (
            <KeywordTag
              key={index}
              keyword={item.name}
              matched={item.matched}
            />
          ))}
        </div>
      </div>

      {/* SUGGESTIONS */}
      <div className="mt-8">
        {(analysis?.suggestions || []).map((s, index) => (
          <SuggestionCard key={index} suggestion={s} />
        ))}
      </div>

      {/* UPLOAD AGAIN */}
      <div className="mt-8">
        <UploadResumeCard onUploadSuccess={handleUploadSuccess} />
      </div>
    </div>
  );
}

export default ResumeAnalysis;
