"use client";

import { useState } from "react";

export default function PreviewChatbot() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-[600px] border rounded-lg">
      <div className="p-4 border-b bg-gray-50">
        <h2 className="font-semibold">Preview Assistant</h2>
        <p className="text-sm text-gray-600">
          Ask about shows you're considering seeing
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
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
              msg.role === "user" ? "bg-blue-100 ml-8" : "bg-gray-100 mr-8"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: Handle message submission
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a show..."
            className="flex-1 px-4 py-2 border rounded"
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

