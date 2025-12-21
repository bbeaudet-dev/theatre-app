"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser, getAuthToken } from "@/lib/auth-client";

interface QuickActionsProps {
  showId: Id<"shows">;
}

export default function QuickActions({ showId }: QuickActionsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const userId = useCurrentUser();
  const upsertUserShow = useMutation(api.functions.profile.upsertUserShow);
  const userLists = useQuery(
    api.functions.profile.getUserLists,
    userId ? { userId } : "skip"
  );

  const handleAction = async (
    status: "seen" | "watchlist" | "considering" | "not-interested"
  ) => {
    if (!userId) {
      alert("Please sign in first");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert("Please sign in first");
      return;
    }

    try {
      await upsertUserShow({
        token,
        userId,
        showId,
        status,
      });
      setShowMenu(false);
    } catch (error) {
      console.error("Error updating show status:", error);
      alert("Failed to update show status");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded"
      >
        ⋮
      </button>
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border rounded-lg shadow-lg z-20">
            <div className="py-1">
              <button
                onClick={() => handleAction("watchlist")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm"
              >
                Add to Watchlist
              </button>
              <button
                onClick={() => handleAction("considering")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm"
              >
                Considering
              </button>
              <button
                onClick={() => handleAction("seen")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm"
              >
                Mark as Seen
              </button>
              <button
                onClick={() => handleAction("not-interested")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm text-red-600 dark:text-red-400"
              >
                Not Interested
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

