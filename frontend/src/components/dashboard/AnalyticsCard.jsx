import React from 'react';

function AnalyticsCard({ 
  title = "Analytics Metric", 
  subtitle = "No data provided yet.", 
  buttonText = "View Details", 
  onButtonClick = () => {} 
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full">
      <div>
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-500 mt-2 text-sm leading-relaxed">{subtitle}</p>
      </div>

      <div className="mt-5">
        <button 
          type="button"
          onClick={onButtonClick}
          className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default AnalyticsCard;