import { CheckCircle, XCircle, AlertTriangle, Lightbulb } from "lucide-react";

const CARD_STYLES = {
  success: {
    icon: CheckCircle,
    iconColor: "text-emerald-400",
    itemBg: "bg-emerald-500/10",
    itemBorder: "border-emerald-500/20",
  },
  danger: {
    icon: XCircle,
    iconColor: "text-red-400",
    itemBg: "bg-red-500/10",
    itemBorder: "border-red-500/20",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-400",
    itemBg: "bg-amber-500/10",
    itemBorder: "border-amber-500/20",
  },
  info: {
    icon: Lightbulb,
    iconColor: "text-blue-400",
    itemBg: "bg-blue-500/10",
    itemBorder: "border-blue-500/20",
  },
};

function AnalysisCard({ title, items, type }) {
  const { icon: Icon, iconColor, itemBg, itemBorder } =
    CARD_STYLES[type] || CARD_STYLES.success;

  return (
    <div className="bg-slate-800/70 border border-slate-700/50 rounded-3xl shadow-lg p-6 mt-6 hover:shadow-xl hover:border-slate-600/50 transition duration-300">
      <h2 className="text-2xl font-bold mb-5 text-white">
        {title}
      </h2>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-xl border ${itemBorder} ${itemBg}`}
          >
            <Icon className={iconColor} size={22} />

            <span className="font-medium text-slate-100">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnalysisCard;
