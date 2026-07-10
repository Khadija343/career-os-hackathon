import { useEffect, useState, useCallback } from "react";
import { BrainCircuit, MessageCircle, Code2, Lightbulb } from "lucide-react";

import aiService from "../../services/aiService";
import { getInterviewErrorMessage } from "../../api/interviewApi";
import Button from "../../components/ui/Button";
import QuestionCard from "../../components/interview/QuestionCard";
import CodingChallengeCard from "../../components/interview/CodingChallengeCard";
import PreparationTipCard from "../../components/interview/PreparationTipCard";

const TABS = [
  { id: "technical", label: "Technical Questions", icon: BrainCircuit },
  { id: "behavioral", label: "Behavioral Questions", icon: MessageCircle },
  { id: "coding", label: "Coding Challenges", icon: Code2 },
  { id: "tips", label: "Preparation Tips", icon: Lightbulb },
];

const EMPTY_DATA = {
  technical: [],
  behavioral: [],
  coding: [],
  tips: [],
};

function Interview() {
  const [activeTab, setActiveTab] = useState("technical");
  const [data, setData] = useState(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await aiService.generateInterviewQuestions();
      setData(result || EMPTY_DATA);
    } catch (err) {
      setError(getInterviewErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const renderEmpty = (message) => (
    <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
      <div className="text-4xl mb-4 opacity-60">🗂️</div>
      <h3 className="text-lg font-medium text-slate-300">Nothing here yet</h3>
      <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1">{message}</p>
    </div>
  );

  const renderContent = () => {
    if (activeTab === "technical") {
      if (data.technical.length === 0) {
        return renderEmpty("No technical questions are available right now.");
      }
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.technical.map((item) => (
            <QuestionCard
              key={item.id}
              question={item.question}
              category={item.category}
              difficulty={item.difficulty}
            />
          ))}
        </div>
      );
    }

    if (activeTab === "behavioral") {
      if (data.behavioral.length === 0) {
        return renderEmpty("No behavioral questions are available right now.");
      }
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.behavioral.map((item) => (
            <QuestionCard
              key={item.id}
              question={item.question}
              category={item.category}
              difficulty={item.difficulty}
            />
          ))}
        </div>
      );
    }

    if (activeTab === "coding") {
      if (data.coding.length === 0) {
        return renderEmpty("No coding challenges are available right now.");
      }
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {data.coding.map((item) => (
            <CodingChallengeCard
              key={item.id}
              title={item.title}
              difficulty={item.difficulty}
              description={item.description}
              tags={item.tags}
            />
          ))}
        </div>
      );
    }

    if (data.tips.length === 0) {
      return renderEmpty("No preparation tips are available right now.");
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.tips.map((item) => (
          <PreparationTipCard key={item.id} title={item.title} description={item.description} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
              Get Interview Ready
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Interview Preparation</h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Sharpen your skills with curated technical and behavioral questions, coding
              challenges, and expert preparation tips.
            </p>
          </div>
          <Button
            text={loading ? "Generating..." : "Generate Again"}
            onClick={fetchAll}
            disabled={loading}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-2 backdrop-blur-md">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition duration-200 cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/10"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm animate-pulse">Loading interview prep content...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-xl mx-auto backdrop-blur-md">
          <p className="text-red-400 font-medium mb-4">{error}</p>
          <Button text="Try Again" onClick={fetchAll} />
        </div>
      )}

      {/* Content */}
      {!loading && !error && renderContent()}
    </div>
  );
}

export default Interview;
