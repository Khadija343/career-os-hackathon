function CurrentGoal({ goal, progress }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold">
        🎯 Current Goal
      </h2>

      <h1 className="text-3xl font-bold mt-3">
        {goal}
      </h1>

      <p className="mt-4">
        Progress: {progress}%
      </p>

      <div className="w-full bg-blue-300 rounded-full h-3 mt-3">
        <div
          className="bg-white h-3 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

export default CurrentGoal;