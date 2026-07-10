import api from "./axios";

/*
|--------------------------------------------------------------------------
| Career Chat API
|--------------------------------------------------------------------------
| Node's POST /ai/chat proxies to FastAPI's POST /chat, whose ChatResponse
| shape (answer, followUpSuggestions) does not match the existing Chat
| page's UI contract ({ reply }, consumed by chatService.js's original
| placeholder and Chat.jsx). Per the "map, don't redesign" rule already
| used for Roadmap and Interview, that translation happens here so
| Chat.jsx and its components stay untouched.
|
| FastAPI's chat is explicitly single-turn/stateless — see
| ai-service/app/services/chat_service.py: "no conversation history,
| memory, embeddings, vector store, or RAG". `history` is accepted here
| only to keep the same call signature Chat.jsx already uses; it is not
| sent to the backend since there is nothing on the FastAPI side that
| reads it.
*/

// Maps backend/AI-service/network failures to a single user-facing
// message, mirroring getRoadmapErrorMessage / getInterviewErrorMessage.
export function getChatErrorMessage(err) {
  if (err?.code === "ECONNABORTED" || /timeout/i.test(err?.message || "")) {
    return "The AI Assistant is taking longer than expected to respond. Please try again in a moment.";
  }

  if (!err?.response) {
    return "Unable to reach the server. Please check your connection and try again.";
  }

  const { status, data } = err.response;

  if (status === 400 || status === 422) {
    return data?.message || "Please enter a valid message and try again.";
  }

  if (status === 401) {
    return "Your session has expired. Please log in again.";
  }

  if (status === 403) {
    return data?.message || "You don't have permission to perform this action.";
  }

  if (status === 404) {
    return data?.message || "Chat service not found. Please try again later.";
  }

  if (status === 429) {
    return "Too many requests. Please wait a moment and try again.";
  }

  if (status === 502 || status === 503 || status === 504) {
    return "The AI Assistant is temporarily unavailable. Please try again shortly.";
  }

  if (status >= 500) {
    return "Something went wrong while contacting the AI Assistant. Please try again.";
  }

  return data?.message || "The AI Assistant couldn't respond right now. Please try again.";
}

export const sendMessage = async (message, history = []) => {
  try {
    const response = await api.post("/ai/chat", { message });
    const data = response.data?.data;

    return {
      reply: data?.answer,
      followUpSuggestions: data?.followUpSuggestions || [],
    };
  } catch (error) {
    console.error("Career Chat Error:", error);
    throw error;
  }
};

// No server-side session/history exists to clear — FastAPI's chat
// service is explicitly single-turn/stateless, so there is no backend
// endpoint to call here. Clearing the conversation is already handled
// entirely client-side by Chat.jsx's setMessages([]); this stays a
// resolved no-op instead of inventing an endpoint that doesn't exist.
export const clearConversation = async () => {
  return Promise.resolve();
};
