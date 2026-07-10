import Card from "../ui/Card";
import DifficultyBadge from "./DifficultyBadge";

function QuestionCard({ question, category, difficulty }) {
  return (
    <Card className="hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-blue-400">
          {category}
        </span>
        <DifficultyBadge difficulty={difficulty} />
      </div>
      <p className="mt-3 text-base font-medium text-slate-100 leading-relaxed">
        {question}
      </p>
    </Card>
  );
}

export default QuestionCard;
