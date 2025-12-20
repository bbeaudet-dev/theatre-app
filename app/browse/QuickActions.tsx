"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface QuickActionsProps {
  showId: Id<"shows">;
}

export default function QuickActions({ showId }: QuickActionsProps) {
  const [showMenu, setShowMenu] = useState(false);
  const userId = useQuery(api.functions.profile.getFirstUser);
  const upsertUserShow = useMutation(api.functions.profile.upsertUserShow);
  const userLists = useQuery(
    api.functions.profile.getUserLists,
    userId ? { userId } : "skip"
  );

  const handleAction = async (
    status:
      | "interested"
      | "seen"
      | "planning"
      | "want-to-see"
      | "interested-in"
      | "look-into"
      | "not-interested"
  ) => {
    if (!userId) {
      alert("Please seed the database first");
      return;
    }

    try {
      await upsertUserShow({
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
                onClick={() => handleAction("interested-in")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm"
              >
                Add to Interested
              </button>
              <button
                onClick={() => handleAction("want-to-see")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm"
              >
                Want to See
              </button>
              <button
                onClick={() => handleAction("look-into")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm"
              >
                Look Into
              </button>
              <button
                onClick={() => handleAction("seen")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm"
              >
                Mark as Seen
              </button>
              <button
                onClick={() => handleAction("not-interested")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm text-red-600"
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

