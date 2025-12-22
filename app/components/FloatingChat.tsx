"use client";

import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import PreviewChatbot from "../preview/PreviewChatbot";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [draggedShowId, setDraggedShowId] = useState<Id<"shows"> | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Check if dragging a show (types include showId)
    if (e.dataTransfer.types.includes("text/plain") || e.dataTransfer.types.includes("showId")) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const showId = e.dataTransfer.getData("showId") as Id<"shows">;
    if (showId) {
      setDraggedShowId(showId);
      setIsOpen(true);
      setIsMinimized(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button / Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 ${dragOver ? "px-6 py-3 rounded-lg" : "px-4 py-2 rounded-full"} shadow-lg transition-all flex items-center justify-center z-40 cursor-pointer ${
          dragOver
            ? "bg-green-600 scale-105 ring-4 ring-green-300"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
        aria-label="Drag show here for recommendation"
      >
        {dragOver ? (
          <span className="text-white font-medium text-sm whitespace-nowrap">Drop for Recommendation</span>
        ) : (
          <span className="text-white font-medium text-xs whitespace-nowrap">Drag Show Here</span>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-24 right-6 w-96 ${isMinimized ? 'h-16' : 'h-[600px]'} bg-white dark:bg-zinc-900 border rounded-lg shadow-2xl z-50 flex flex-col transition-all duration-200`}>
            <div className="p-4 border-b bg-gray-50 dark:bg-zinc-800 flex justify-between items-center">
              <div>
                <h2 className="font-semibold">Preview Assistant</h2>
                {!isMinimized && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ask about shows you're considering seeing
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    {isMinimized ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    )}
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsMinimized(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close chat"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {!isMinimized && (
              <div className="flex-1 overflow-hidden min-h-0">
                <PreviewChatbot initialShowId={draggedShowId} onShowProcessed={() => setDraggedShowId(null)} />
              </div>
            )}
          </div>
      )}
    </>
  );
}

