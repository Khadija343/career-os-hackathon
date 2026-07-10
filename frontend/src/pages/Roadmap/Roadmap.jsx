import { useState } from "react";
import aiService from "../../services/aiService";
import { getRoadmapErrorMessage } from "../../api/roadmapApi";

import CurrentGoal from "../../components/roadmap/CurrentGoal";
import RoadmapStep from "../../components/roadmap/RoadmapStep";
import MilestoneCard from "../../components/roadmap/MilestoneCard";
import RecommendationBox from "../../components/roadmap/RecommendationBox";

function Roadmap() {
  const [role, setRole] = useState("");
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!role.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await aiService.generateRoadmap(role);
      setRoadmapData(response);
    } catch (err) {
      setError(getRoadmapErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 selection:bg-blue-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
            🗺️ AI Career Roadmap
          </h1>
          <p className="text-slate-400 mt-2 text-sm md:text-base">
            Generate a personalized, step-by-step learning path powered by AI.
          </p>
        </header>

        {/* Dynamic Input Bar */}
        <div className="flex flex-col sm:flex-row gap-3 bg-slate-900/50 p-2 rounded-2xl border border-slate-800/80 backdrop-blur-md shadow-xl mb-10 focus-within:border-blue-500/50 transition duration-300">
          <input
            type="text"
            placeholder="Enter Career Role (e.g. Frontend Developer, DevOps Engineer...)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
            className="flex-1 bg-transparent px-4 py-3 text-white placeholder-slate-500 outline-none text-sm md:text-base"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !role.trim()}
            className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 active:scale-98 disabled:opacity-50 disabled:pointer-events-none transition-all duration-200 shadow-lg shadow-blue-900/20 whitespace-nowrap"
          >
            {loading ? "Generating..." : "Generate Roadmap"}
          </button>
        </div>

        {/* CONDITIONAL RENDER AREA */}
        
        {/* 1. Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm animate-pulse">Mapping out your future skills...</p>
          </div>
        )}

        {/* 2. Error State */}
        {!loading && error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-xl mx-auto backdrop-blur-md">
            <p className="text-red-400 font-medium mb-4">{error}</p>
            <button
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* 3. Empty State (No Data & No Action Yet) */}
        {!loading && !error && !roadmapData && (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
            <div className="text-4xl mb-4 opacity-60">🚀</div>
            <h2 className="text-lg font-medium text-slate-300">Your AI-driven journey starts here</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1">
              Input your desired professional role above to unlock a custom curated skill-tree.
            </p>
          </div>
        )}

        {/* 4. Success Dashboard (Data Render) */}
        {!loading && !error && roadmapData && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Current Goal Component Wrapper */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-1 backdrop-blur-sm">
              <CurrentGoal goal={roadmapData?.goal} progress={roadmapData?.progress} />
            </div>

            {/* Learning Path Flowchart Block */}
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-6 md:p-8 backdrop-blur-sm shadow-xl">
              <h2 className="text-xl md:text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
                Learning Path Hierarchy
              </h2>
              <div className="space-y-3 pl-2 border-l border-slate-800/80 ml-3">
                {roadmapData?.roadmap?.map((item, index) => (
                  <RoadmapStep
                    key={index}
                    title={item}
                    status={index < 2 ? "completed" : index === 2 ? "current" : "pending"}
                  />
                ))}
              </div>
            </div>

            {/* Milestones Sections Grid */}
            <div>
              <h3 className="text-lg font-semibold text-slate-300 mb-4 px-1">Target Milestones</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roadmapData?.milestones?.map((item, index) => (
                  <div key={index} className="transition duration-300 hover:-translate-y-1">
                    <MilestoneCard title={item} />
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Recommendations List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-300 mb-2 px-1">AI Smart Recommendations</h3>
              {roadmapData?.recommendations?.map((item, index) => (
                <RecommendationBox key={index} recommendation={item} />
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default Roadmap;
