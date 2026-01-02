"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import ShowCard from "./ShowCard";

interface FindTabProps {
  tripId: Id<"trips"> | null;
}

export default function FindTab({ tripId }: FindTabProps) {
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
    <div className="space-y-2 text-xs">
      <h3 className="font-semibold text-sm">Find Shows</h3>
      
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 py-1 text-xs border rounded dark:bg-zinc-800 dark:border-zinc-700"
        />
      </div>

      {/* Filter */}
      <div>
        <label className="block text-[10px] font-medium mb-0.5">District</label>
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
          className="w-full px-2 py-1 text-xs border rounded dark:bg-zinc-800 dark:border-zinc-700"
        >
          <option value="">All</option>
          <option value="broadway">Broadway</option>
          <option value="off-broadway">Off-Broadway</option>
          <option value="touring">Touring</option>
          <option value="local">Local</option>
        </select>
      </div>

      {/* Results */}
      <div className="space-y-2">
        {showsToDisplay.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No shows found
          </p>
        ) : (
          showsToDisplay.map((show: Doc<"shows">) => (
            <ShowCard key={show._id} show={show} tripId={tripId} draggable />
          ))
        )}
      </div>
    </div>
  );
}
