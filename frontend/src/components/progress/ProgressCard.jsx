function ProgressCard({ title, progress }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-xl font-semibold">
        {title}
      </h2>

      <h1 className="text-4xl font-bold text-blue-600 mt-4">
        {progress}%
      </h1>

      <div className="w-full bg-gray-300 rounded-full h-3 mt-5">
        <div
          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

    </div>
  );
}

export default ProgressCard;