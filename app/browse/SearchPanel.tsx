"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import ShowCard from "@/app/components/ShowCard";

export default function SearchPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const searchResults = useQuery(
    api.functions.shows.searchShows,
    searchQuery.trim() ? { query: searchQuery } : "skip"
  );

  const shows = searchQuery.trim() ? searchResults || [] : [];

  return (
    <div>
      <div className="mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Search Shows
            </label>
            <input
              type="text"
              placeholder="Search by title, description, or theatre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 border rounded ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "dark:bg-zinc-800 dark:border-zinc-700"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 border rounded ${
                viewMode === "list"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "dark:bg-zinc-800 dark:border-zinc-700"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {!searchQuery.trim() ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          Enter a search query to find shows.
        </div>
      ) : shows === undefined ? (
        <div>Searching...</div>
      ) : shows.length === 0 ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          No shows found matching "{searchQuery}".
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Found {shows.length} show{shows.length !== 1 ? "s" : ""}
          </p>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "space-y-4"
            }
          >
            {shows.map((show: Doc<"shows">) => (
              <ShowCard key={show._id} show={show} viewMode={viewMode} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

