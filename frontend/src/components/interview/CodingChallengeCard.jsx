import { Code2 } from "lucide-react";
import Card from "../ui/Card";
import DifficultyBadge from "./DifficultyBadge";

function CodingChallengeCard({ title, difficulty, description, tags = [] }) {
  return (
    <Card className="hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <Code2 size={18} />
          </span>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <DifficultyBadge difficulty={difficulty} />
      </div>

      <p className="mt-3 text-sm text-slate-400 leading-relaxed">{description}</p>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-700/50 bg-slate-950/60 px-2.5 py-1 text-xs font-medium text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Card>
  );
}

export default CodingChallengeCard;
