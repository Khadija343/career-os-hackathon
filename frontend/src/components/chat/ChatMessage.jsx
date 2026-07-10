import { Bot, User } from "lucide-react";

function ChatMessage({ role, content, timestamp }) {
  const isUser = role === "user";

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
          isUser
            ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
            : "border-slate-700 bg-slate-800 text-slate-300"
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </span>

      <div className={`flex max-w-[75%] flex-col ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
            isUser
              ? "bg-blue-600 text-white shadow-blue-500/10"
              : "bg-slate-800/70 text-slate-100 border border-slate-700/50"
          }`}
        >
          {content}
        </div>
        {timestamp && (
          <span className="mt-1 text-[11px] text-slate-500">{timestamp}</span>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
