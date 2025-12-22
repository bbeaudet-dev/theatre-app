"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser, getAuthToken } from "@/lib/auth-client";

interface PreviewChatbotProps {
  initialShowId?: Id<"shows"> | null;
  onShowProcessed?: () => void;
}

export default function PreviewChatbot({ initialShowId, onShowProcessed }: PreviewChatbotProps) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userId = useCurrentUser();
  const token = typeof window !== "undefined" ? getAuthToken() : null;
  
  const getRecommendation = useAction(api.functions.preview.getRecommendation);
  const show = useQuery(
    api.functions.shows.getShow,
    initialShowId ? { showId: initialShowId } : "skip"
  );

  // Handle initial show recommendation when show is dragged and dropped
  useEffect(() => {
    if (initialShowId && show && userId && messages.length === 0) {
      const fetchRecommendation = async () => {
        setIsLoading(true);
        try {
          setMessages([{ role: "user", content: `Will I like ${show.title}?` }]);
          const result = await getRecommendation({
            userId,
            showIds: [initialShowId],
          });
          
          if (result && result.reasoning) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: result.reasoning || "I need more information to make a recommendation.",
              },
            ]);
          }
          onShowProcessed?.();
        } catch (error) {
          console.error("Error getting recommendation:", error);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Sorry, I encountered an error generating a recommendation. Please try again.",
            },
          ]);
          onShowProcessed?.();
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecommendation();
    }
  }, [initialShowId, show, userId, messages.length, getRecommendation, onShowProcessed]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <p>Start a conversation about shows you're interested in!</p>
            <p className="text-sm mt-2">
              Try: "Will I like Hadestown?" or "Which should I see: Wicked or Hamilton?"
            </p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded ${
              msg.role === "user"
                ? "bg-blue-100 dark:bg-blue-900 ml-8"
                : "bg-gray-100 dark:bg-gray-800 mr-8"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center justify-start mr-8 mb-4">
            <div className="bg-gray-100 dark:bg-gray-800 rounded p-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t bg-white dark:bg-zinc-900">
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!input.trim() || !userId || isLoading) return;
            
            const userMessage = input.trim();
            setMessages([...messages, { role: "user", content: userMessage }]);
            setInput("");
            setIsLoading(true);
            
            try {
              // For now, if there's a show context, use recommendation. Otherwise, handle as general question
              // TODO: Implement general chat functionality if needed
              if (initialShowId) {
                const result = await getRecommendation({
                  userId,
                  showIds: [initialShowId],
                });
                
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: result.reasoning || "I couldn't generate a recommendation. Please try again.",
                  },
                ]);
              } else {
                // General question - for now just show a message
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "assistant",
                    content: "Please drag a show here first to get a recommendation, or ask about a specific show by name.",
                  },
                ]);
              }
            } catch (error) {
              console.error("Error getting recommendation:", error);
              setMessages((prev) => [
                ...prev,
                {
                  role: "assistant",
                  content: "Sorry, I encountered an error. Please try again.",
                },
              ]);
            } finally {
              setIsLoading(false);
            }
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a show..."
            className="flex-1 px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Loading...</span>
              </>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

