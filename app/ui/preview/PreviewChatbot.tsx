"use client";

import { useState } from "react";

export default function PreviewChatbot() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");

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
      </div>
      <div className="p-4 border-t bg-white dark:bg-zinc-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              setMessages([...messages, { role: "user", content: input }]);
              setInput("");
              // TODO: Handle message submission with AI
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
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

