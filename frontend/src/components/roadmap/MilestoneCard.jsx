function MilestoneCard({ title }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl transition">
      <h2 className="text-lg font-semibold">
        🏆 {title}
      </h2>
    </div>
  );
}

export default MilestoneCard;