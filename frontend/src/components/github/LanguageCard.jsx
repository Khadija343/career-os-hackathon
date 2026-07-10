function LanguageCard({ language, percentage, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 mb-4">
      <div className="flex justify-between mb-2">
        <h3 className="font-semibold">{language}</h3>
        <span>{percentage}%</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

export default LanguageCard;