import React, { useState } from 'react';

export default function GoalsSection() {
  // 1. Moving goals to state with proper IDs so React renders them efficiently
  const [goals, setGoals] = useState([
    { id: 'g1', text: "Complete Resume", completed: false },
    { id: 'g2', text: "Push 3 GitHub Projects", completed: false },
    { id: 'g3', text: "Learn Tailwind CSS", completed: true }, // Pre-completed for demonstration
    { id: 'g4', text: "Build Portfolio Website", completed: false },
  ]);

  // 2. Interactive toggle function
  const toggleGoal = (id) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
        <span role="img" aria-label="target">🎯</span> Upcoming Goals
      </h2>

      <div className="space-y-4">
        {goals.map((goal) => (
          <button
            key={goal.id} // Fixed: Using unique ID instead of array index
            onClick={() => toggleGoal(goal.id)}
            type="button"
            className={`w-full flex justify-between items-center rounded-xl p-4 transition-all duration-200 cursor-pointer border text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
              ${goal.completed 
                ? 'bg-gray-50 border-gray-100 opacity-75' 
                : 'bg-green-50 border-green-100 hover:bg-green-100'
              }`}
          >
            <span className={`font-medium ${goal.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
              {goal.text}
            </span>

            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
              goal.completed 
                ? 'bg-gray-200 text-gray-600' 
                : 'bg-green-200 text-green-700'
            }`}>
              {goal.completed ? 'Completed' : 'Pending'}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}