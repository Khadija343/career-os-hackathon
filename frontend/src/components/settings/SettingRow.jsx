function SettingRow({ title, description, control }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800/70 bg-slate-950/40 px-4 py-3.5">
      <div>
        <p className="text-sm font-medium text-slate-100">{title}</p>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      {control}
    </div>
  );
}

export default SettingRow;
