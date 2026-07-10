import Card from "../ui/Card";

function SettingsSection({ icon, title, description, badge, children }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            {icon}
          </span>
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
          </div>
        </div>
        {badge}
      </div>

      <div className="space-y-4">{children}</div>
    </Card>
  );
}

export default SettingsSection;
