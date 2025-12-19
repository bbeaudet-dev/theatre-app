"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function TheatreCloud() {
  const userId = useQuery(api.functions.profile.getFirstUser);
  const rankings = useQuery(
    api.functions.profile.getUserRankings,
    userId ? { userId } : "skip"
  );

  if (userId === undefined || rankings === undefined) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Theatre Cloud</h2>
          <div className="border rounded p-8 min-h-[400px] flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Theatre Cloud</h2>
          <div className="border rounded p-8 min-h-[400px] flex items-center justify-center">
            <p className="text-gray-500">
              Please seed the database first to create a user.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (rankings.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Theatre Cloud</h2>
          <div className="border rounded p-8 min-h-[400px] flex items-center justify-center">
            <p className="text-gray-500">
              You haven't ranked any shows yet. Mark shows as "Seen" and rank
              them to see your theatre cloud!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Simple grid layout for now - full cloud visualization can be added later
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Theatre Cloud</h2>
        <div className="border rounded p-8 min-h-[400px]">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {rankings.map((ranking) => {
              if (!ranking.show) return null;
              return (
                <div
                  key={ranking._id}
                  className="relative group"
                  style={{
                    transform: `scale(${1 + (rankings.length - (ranking.rank || 0)) / rankings.length * 0.3})`,
                  }}
                >
                  {ranking.show.imageUrl ? (
                    <img
                      src={ranking.show.imageUrl}
                      alt={ranking.show.title}
                      className="w-full aspect-[2/3] object-cover rounded border-2 border-gray-300 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded border-2 border-gray-300 dark:border-gray-700 flex items-center justify-center">
                      <span className="text-xs text-center p-2">
                        {ranking.show.title}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    #{ranking.rank}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

