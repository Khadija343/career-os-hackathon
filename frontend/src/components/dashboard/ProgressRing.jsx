import React from 'react';

export default function ProgressRing({ 
  percentage = 0, 
  label = "Progress" 
}) {
  // Clamping percentage between 0 and 100 to prevent layout/SVG breaking
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  // SVG dimensions math
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // Calculate how much of the ring should be filled
  const strokeDashoffset = circumference - (safePercentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300">
      
      {/* Dynamic SVG Progress Ring */}
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg
          className="transform -rotate-90 w-full h-full"
          viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        >
          {/* Track Circle (Gray Background) */}
          <circle
            className="text-gray-100"
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Circle (Blue Indicator) */}
          <circle
            className="text-blue-600 transition-[stroke-dashoffset] duration-500 ease-out"
            stroke="currentColor"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>

        {/* Centered Percentage Text */}
        <span className="absolute text-2xl font-bold text-gray-800">
          {safePercentage}%
        </span>
      </div>

      <h3 className="mt-5 text-xl font-semibold text-gray-700">
        {label}
      </h3>
    </div>
  );
}