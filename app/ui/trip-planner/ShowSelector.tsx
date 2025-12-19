"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ShowSelectorProps {
  onSelect: (showId: Id<"shows">) => void;
  onClose: () => void;
}

export default function ShowSelector({ onSelect, onClose }: ShowSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState<
    "broadway" | "off-broadway" | "touring" | "local" | undefined
  >(undefined);

  const allShows = useQuery(api.functions.shows.getShows, {
    district: selectedDistrict,
  });

  const searchResults = useQuery(
    api.functions.shows.searchShows,
    searchQuery ? { query: searchQuery } : "skip"
  );

  const showsToDisplay = searchQuery
    ? searchResults || []
    : allShows || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Select a Show</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <input
              type="text"
              placeholder="Search shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Filter by District</label>
            <select
              value={selectedDistrict || ""}
              onChange={(e) =>
                setSelectedDistrict(
                  e.target.value
                    ? (e.target.value as
                        | "broadway"
                        | "off-broadway"
                        | "touring"
                        | "local")
                    : undefined
                )
              }
              className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
            >
              <option value="">All Districts</option>
              <option value="broadway">Broadway</option>
              <option value="off-broadway">Off-Broadway</option>
              <option value="touring">Touring</option>
              <option value="local">Local</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {showsToDisplay.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No shows found
            </p>
          ) : (
            showsToDisplay.map((show) => (
              <div
                key={show._id}
                onClick={() => onSelect(show._id)}
                className="p-4 border rounded hover:bg-gray-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{show.title}</h3>
                    {show.theatre && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {show.theatre}
                      </p>
                    )}
                    {show.district && (
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs">
                        {show.district}
                      </span>
                    )}
                  </div>
                  {show.isInPreviews && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded text-xs">
                      Previews
                    </span>
                  )}
                </div>
                {show.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {show.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

