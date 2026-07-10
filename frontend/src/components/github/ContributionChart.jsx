function ContributionChart() {
  const weeks = [5, 8, 3, 10, 7, 12, 9];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        Weekly Contributions
      </h2>

      <div className="flex items-end justify-between h-48">
        {weeks.map((value, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
          >
            <div
              className="bg-green-500 rounded-t-lg w-10 transition-all duration-300 hover:bg-green-600"
              style={{ height: `${value * 12}px` }}
            ></div>

            <span className="mt-2 text-sm text-gray-500">
              W{index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContributionChart;