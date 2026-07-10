import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Award,
  FileText,
  GitBranch,
  TrendingUp,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getGithubAnalytics } from "../../api/githubApi";
import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import StatCard from "../../components/dashboard/StatCard";
import AnalyticsCard from "../../components/dashboard/AnalyticsCard";
import ProgressRing from "../../components/dashboard/ProgressRing";
import WeeklyActivity from "../../components/dashboard/WeeklyActivity";
import RecommendationSection from "../../components/dashboard/RecommendationSection";
import GoalsSection from "../../components/dashboard/GoalsSection";

// Mirrors computeGithubScore() in frontend/src/api/githubApi.js exactly
// (same weighting: up to 40 pts repos, 40 pts stars, 20 pts languages).
// That helper isn't exported and the GitHub module must not be modified
// for this task, so the identical, already-established formula is
// duplicated here read-only rather than inventing a different one.
const computeGithubHealth = (analytics) => {
  const repoScore = Math.min(analytics.repositoryCount * 8, 40);
  const starScore = Math.min(analytics.totalStars * 2, 40);
  const languageScore = Math.min(
    Object.keys(analytics.languageDistribution || {}).length * 5,
    20
  );

  return Math.min(100, repoScore + starScore + languageScore);
};

export default function Dashboard() {
  const navigate = useNavigate();

  // Same AuthContext user object Navbar reads — single shared source, no
  // duplicate state and no extra API call (already populated at login).
  const { user } = useAuth();

  const displayName = user?.fullName || "User";

  // GitHub Health: read-only reuse of the existing GET /github/analytics
  // endpoint, which is explicitly computed only from repositories already
  // stored in MongoDB (github.service.js#getGithubAnalytics — "never
  // calls the GitHub API"). No sync/connect is triggered here. A 404
  // (no GitHub account connected yet) is a valid, expected state, not
  // an error to surface — it just means "--".
  const [githubHealth, setGithubHealth] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadGithubHealth = async () => {
      try {
        const response = await getGithubAnalytics();
        const analytics = response?.data;

        if (isMounted && analytics) {
          setGithubHealth(computeGithubHealth(analytics));
        }
      } catch (err) {
        // No GitHub account connected (404) or any other failure: leave
        // githubHealth as null so the card shows "--" rather than a
        // fake/stale value.
      }
    };

    loadGithubHealth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Resume Score: there is currently no persisted Resume Analysis result
  // anywhere in the backend (no score field on the Resume model, no
  // ResumeAnalysis collection, and the AI service response is never
  // saved — see backend/src/services/ai.service.js#analyzeResume). Since
  // re-running analysis or calling FastAPI again from the Dashboard is
  // explicitly not allowed, there is nothing already-stored to display,
  // so this always falls back to "--" until that persistence exists.
  const resumeScoreDisplay = "--";
  const githubHealthDisplay = githubHealth !== null ? `${githubHealth}%` : "--";

  const stats = [
    {
      id: "stat-career",
      title: "Career Score",
      value: "92%",
      icon: <Award size={24} />, // Adjusted size slightly for better aesthetic proportion
      description: "Excellent Progress",
    },
    {
      id: "stat-resume",
      title: "Resume Score",
      value: resumeScoreDisplay,
      icon: <FileText size={24} />,
      description: "ATS Optimized",
    },
    {
      id: "stat-github",
      title: "GitHub Health",
      value: githubHealthDisplay,
      icon: <GitBranch size={24} />,
      description: "Good Activity",
    },
    {
      id: "stat-weekly",
      title: "Weekly Progress",
      value: "76%",
      icon: <TrendingUp size={24} />,
      description: "Keep Going!",
    },
  ];

  // Action handlers connecting to the new functional props we built
  const handleResumeAnalysisClick = () => {
    console.log("Navigating to detailed resume breakdown view...");
    // You can replace this with your routing push or modal state toggles
  };

  const handleCreateAccountClick = () => {
    navigate("/signup");
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8 max-w-7xl animate-fade-in">
      
      {/* 1. Welcome Header section */}
      <WelcomeBanner name={displayName} streakCount={5} />

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCreateAccountClick}
          className="rounded-full bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg transition duration-200 hover:bg-blue-700"
        >
          Create Account
        </button>
      </div>

      {/* 2. Top-tier Stat Metric Display Matrix */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.id} // Fixed: String key prevents unnecessary UI layout shifts
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </section>

      {/* 3. Deep Dive Analytics & Dynamic Visual Tracking Elements */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
          <AnalyticsCard
            title="Resume Analysis"
            subtitle="Your resume was analyzed today. View detailed AI insights, keyword deficiencies, and direct formatting suggestions to boost visibility."
            buttonText="View Detailed Analysis"
            onButtonClick={handleResumeAnalysisClick}
          />
        </div>
        
        <div className="lg:col-span-1">
          <ProgressRing
            percentage={76}
            label="Weekly Target Progress"
          />
        </div>
      </section>

      {/* 4. Core Activity Performance Data Vector */}
      <section>
        <WeeklyActivity />
      </section>

      {/* 5. Bottom Layout Splitting: Dynamic AI Suggestions and Interactive Checklists */}
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <RecommendationSection />
        <GoalsSection />
      </section>
      
    </div>
  );
}