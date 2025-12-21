"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "@/lib/auth-client";
import ShowCard from "./ShowCard";

interface UserListsTabProps {
  tripId: Id<"trips">;
}

export default function UserListsTab({ tripId }: UserListsTabProps) {
  const userId = useCurrentUser();
  const userLists = useQuery(
    api.functions.profile.getUserLists,
    userId ? { userId } : "skip"
  );
  // Get all shows 
  const allShows = useQuery(api.functions.shows.getShows, {});
  
  if (userId === undefined || userLists === undefined || allShows === undefined) {
    return <div className="text-center text-gray-500 py-8">Loading...</div>;
  }

  return (
    <div className="space-y-3 text-xs">
      <h3 className="font-semibold text-sm">My Lists</h3>

      {/* Custom Lists */}
      {userLists && userLists.length > 0 ? (
        <div>
          {userLists.map((list) => {
            const listShows = (allShows || []).filter((show) =>
              list.showIds.includes(show._id)
            );
            return (
              <div key={list._id} className="mb-2">
                <h4 className="font-medium text-xs mb-1">{list.title}</h4>
                {list.description && (
                  <p className="text-[10px] text-gray-600 dark:text-gray-400 mb-1">
                    {list.description}
                  </p>
                )}
                <div className="space-y-1.5">
                  {listShows.length > 0 ? (
                    listShows.map((show) => (
                      <ShowCard key={show._id} show={show} tripId={tripId} draggable />
                    ))
                  ) : (
                    <p className="text-[10px] text-gray-500">No shows</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">
          No lists created yet. Create lists in the Profile page!
        </p>
      )}
    </div>
  );
}

