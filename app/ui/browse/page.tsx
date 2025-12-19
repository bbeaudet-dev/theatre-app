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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Browse Shows</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Discover shows, search for specific productions, and manage your lists.
      </p>

      <div className="border-b mb-6">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
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

