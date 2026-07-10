function GoalCard({ goal, status }) {
  const icon =
    status === "completed"
      ? "✅"
      : status === "current"
      ? "🟡"
      : "⬜";

  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-4 hover:shadow-lg transition">

      <h3 className="text-lg font-medium">
        {icon} {goal}
      </h3>

    </div>
  );
}

export default GoalCard;