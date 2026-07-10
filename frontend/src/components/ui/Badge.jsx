function Badge({ text, color = "bg-blue-500/10 text-blue-400 border border-blue-500/20" }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide transition ${color}`}
    >
      {text}
    </span>
  );
}

export default Badge;