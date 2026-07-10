import { Bot } from "lucide-react";

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300">
        <Bot size={16} />
      </span>
      <div className="flex items-center gap-1.5 rounded-2xl border border-slate-700/50 bg-slate-800/70 px-4 py-3.5 shadow-lg">
        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]"></span>
        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]"></span>
        <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce"></span>
      </div>
    </div>
  );
}

export default TypingIndicator;
