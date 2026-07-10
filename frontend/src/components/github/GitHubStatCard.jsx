function GitHubStatCard({ title, value, icon, color }) {
  return (
    <div
      className={`rounded-3xl p-6 shadow-lg text-white hover:scale-105 transition duration-300 ${color}`}
    >
      <div className="flex justify-between items-center">

        <div>
          <h3 className="text-lg">{title}</h3>

          <h2 className="text-4xl font-bold mt-3">
            {value}
          </h2>
        </div>

        <div>
          {icon}
        </div>

      </div>
    </div>
  );
}

export default GitHubStatCard;