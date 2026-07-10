import { useEffect, useRef, useState } from "react";
import { Send, Trash2, Loader2 } from "lucide-react";

import aiService from "../../services/aiService";
import { getChatErrorMessage } from "../../api/chatApi";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ChatMessage from "../../components/chat/ChatMessage";
import TypingIndicator from "../../components/chat/TypingIndicator";
import ChatWelcome from "../../components/chat/ChatWelcome";

const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const scrollAnchorRef = useRef(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending, error]);

  const dispatchMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const userMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: trimmed,
      timestamp: formatTime(new Date()),
    };

    const history = messages.map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const { reply } = await aiService.sendChatMessage(trimmed, history);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-ai`,
          role: "assistant",
          content: reply,
          timestamp: formatTime(new Date()),
        },
      ]);
    } catch (err) {
      setError(getChatErrorMessage(err));
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatchMessage(input);
  };

  const handleClear = async () => {
    setMessages([]);
    setError(null);
    setInput("");
    try {
      await aiService.clearChatConversation();
    } catch {
      // Non-blocking: local conversation is already cleared for the user.
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800/80 bg-slate-900/70 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
          Your Career Copilot
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">AI Career Assistant</h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Chat with your AI assistant for personalized resume, GitHub, roadmap, and interview
          guidance.
        </p>
      </div>

      {/* Chat Window */}
      <div className="flex h-[70vh] flex-col rounded-3xl border border-slate-800/80 bg-slate-900/70 shadow-2xl shadow-slate-950/30 backdrop-blur-xl overflow-hidden">
        {/* Chat Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-300">Conversation</h2>
          <button
            type="button"
            onClick={handleClear}
            disabled={!hasMessages && !error}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700/70 px-3 py-1.5 text-xs font-medium text-slate-400 transition duration-200 hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            <Trash2 size={14} />
            Clear Conversation
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {!hasMessages && !isSending && !error ? (
            <ChatWelcome onSuggestionClick={dispatchMessage} />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  timestamp={message.timestamp}
                />
              ))}

              {isSending && <TypingIndicator />}

              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center backdrop-blur-md">
                  <p className="text-sm font-medium text-red-400">{error}</p>
                  <Button
                    text="Retry"
                    className="mt-3 px-4 py-2 text-sm"
                    onClick={() => dispatchMessage(messages[messages.length - 1]?.content || "")}
                  />
                </div>
              )}
            </>
          )}
          <div ref={scrollAnchorRef} />
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-3 border-t border-slate-800/80 p-4"
        >
          <Input
            type="text"
            placeholder="Ask about your resume, roadmap, or interview prep..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSending}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isSending || !input.trim()}
            className="flex items-center gap-2 px-5"
            text={
              isSending ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Sending
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Send size={16} />
                  Send
                </span>
              )
            }
          />
        </form>
      </div>
    </div>
  );
}

export default Chat;
