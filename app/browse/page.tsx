"use client";

import { useState } from "react";
import BrowsePanel from "./BrowsePanel";
import SearchPanel from "./SearchPanel";
import MyListsPanel from "./MyListsPanel";

export default function BrowsePage() {
  const [activeTab, setActiveTab] = useState<"browse" | "search" | "lists">(
    "browse"
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="border-b mb-4 sm:mb-6 overflow-x-auto">
        <nav className="flex gap-2 sm:gap-4 min-w-max">
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "browse"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveTab("search")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "search"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Search
          </button>
          <button
            onClick={() => setActiveTab("lists")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "lists"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            My Lists
          </button>
        </nav>
      </div>

      {activeTab === "browse" && <BrowsePanel />}
      {activeTab === "search" && <SearchPanel />}
      {activeTab === "lists" && <MyListsPanel />}
    </div>
  );
}

