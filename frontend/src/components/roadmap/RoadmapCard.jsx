function RoadmapCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">
        {title}
      </h2>

      {children}
    </div>
  );
}

export default RoadmapCard;