"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import ShowCard from "@/app/components/ShowCard";

export default function BrowsePanel() {
  const [district, setDistrict] = useState<
    "broadway" | "off-broadway" | "touring" | "local" | undefined
  >(undefined);
  const [isOpenRun, setIsOpenRun] = useState<boolean | undefined>(undefined);
  const [isInPreviews, setIsInPreviews] = useState<boolean | undefined>(
    undefined
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const shows = useQuery(api.functions.shows.getShows, {
    district,
    isOpenRun,
    isInPreviews,
  });

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium mb-1">District</label>
            <select
              value={district || ""}
              onChange={(e) =>
                setDistrict(
                  e.target.value
                    ? (e.target.value as
                        | "broadway"
                        | "off-broadway"
                        | "touring"
                        | "local")
                    : undefined
                )
              }
              className="px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
            >
              <option value="">All Districts</option>
              <option value="broadway">Broadway</option>
              <option value="off-broadway">Off-Broadway</option>
              <option value="touring">Touring</option>
              <option value="local">Local</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={
                isOpenRun === undefined
                  ? ""
                  : isOpenRun
                  ? "open"
                  : "limited"
              }
              onChange={(e) =>
                setIsOpenRun(
                  e.target.value === ""
                    ? undefined
                    : e.target.value === "open"
                )
              }
              className="px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
            >
              <option value="">All Runs</option>
              <option value="open">Open Run</option>
              <option value="limited">Limited Run</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Previews</label>
            <select
              value={
                isInPreviews === undefined
                  ? ""
                  : isInPreviews
                  ? "yes"
                  : "no"
              }
              onChange={(e) =>
                setIsInPreviews(
                  e.target.value === ""
                    ? undefined
                    : e.target.value === "yes"
                )
              }
              className="px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
            >
              <option value="">All Shows</option>
              <option value="yes">In Previews</option>
              <option value="no">Opened</option>
            </select>
          </div>

          <div className="flex-1" />

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

      {shows === undefined ? (
        <div>Loading shows...</div>
      ) : shows.length === 0 ? (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          No shows found matching your filters.
        </div>
      ) : (
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
      )}
    </div>
  );
}

