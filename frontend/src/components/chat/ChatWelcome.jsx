import { Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "How can I improve my resume?",
  "What skills should I learn for a frontend role?",
  "Help me prepare for a behavioral interview.",
  "Review my current career roadmap.",
];

function ChatWelcome({ onSuggestionClick }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center py-10">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
        <Sparkles size={26} />
      </span>
      <h3 className="text-lg font-semibold text-white">Ask your AI Career Assistant</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        Get personalized advice on your resume, skills, interviews, and career roadmap.
      </p>

      <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-lg">
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSuggestionClick(suggestion)}
            className="rounded-full border border-slate-700/70 bg-slate-900/60 px-3.5 py-2 text-xs font-medium text-slate-300 transition duration-200 hover:border-blue-500/50 hover:text-white cursor-pointer"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChatWelcome;
