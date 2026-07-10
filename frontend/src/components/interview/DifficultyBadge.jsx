import Badge from "../ui/Badge";

const DIFFICULTY_COLORS = {
  Easy: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  Hard: "bg-red-500/10 text-red-400 border border-red-500/20",
};

function DifficultyBadge({ difficulty }) {
  const color = DIFFICULTY_COLORS[difficulty] || DIFFICULTY_COLORS.Easy;
  return <Badge text={difficulty} color={color} />;
}

export default DifficultyBadge;
