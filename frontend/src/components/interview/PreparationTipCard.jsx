import { Lightbulb } from "lucide-react";
import Card from "../ui/Card";

function PreparationTipCard({ title, description }) {
  return (
    <Card className="flex items-start gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        <Lightbulb size={20} />
      </span>
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}

export default PreparationTipCard;
