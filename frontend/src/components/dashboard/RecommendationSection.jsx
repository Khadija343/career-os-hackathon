import React, { useState } from 'react';

export default function RecommendationSection() {
  // 1. Array shifted to structured items with proper IDs and distinct priorities
  const [recommendations, setRecommendations] = useState([
    { id: 'rec1', text: "Improve Resume Summary", priority: "High" },
    { id: 'rec2', text: "Add More GitHub Projects", priority: "High" },
    { id: 'rec3', text: "Learn Docker Basics", priority: "Medium" },
    { id: 'rec4', text: "Practice DSA Daily", priority: "Low" },
  ]);

  // 2. Clear recommendation action handler
  const handleDismiss = (id) => {
    setRecommendations(prev => prev.filter(item => item.id !== id));
  };

  // Helper utility for dynamic styling based on priority tiers
  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
        <span role="img" aria-label="robot">🤖</span> AI Recommendations
      </h2>

      {recommendations.length === 0 ? (
        <p className="text-gray-500 text-center py-4">All recommendations caught up! 🎉</p>
      ) : (
        <div className="space-y-4">
          {recommendations.map((item) => (
            <div
              key={item.id} // Fixed: String-based unique key preventing rendering bugs
              className="flex justify-between items-center bg-gray-50 border border-gray-100 rounded-xl p-4 hover:bg-gray-100/80 transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="font-medium text-gray-800">{item.text}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border w-max ${getPriorityStyles(item.priority)}`}>
                  {item.priority} Priority
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleDismiss(item.id)}
                className="text-gray-400 hover:text-gray-600 font-medium text-sm p-1 ml-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label={`Dismiss recommendation: ${item.text}`}
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}