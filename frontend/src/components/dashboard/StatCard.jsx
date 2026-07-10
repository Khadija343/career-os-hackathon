function StatCard({ title, value, icon, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-gray-500 text-sm">{title}</h3>

          <h2 className="text-3xl font-bold mt-2">{value}</h2>

          <p className="text-gray-400 mt-2">{description}</p>
        </div>

        <div className="text-blue-600">{icon}</div>
      </div>
    </div>
  );
}

export default StatCard;