"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface TripSlotProps {
  slot: {
    _id: Id<"tripDaySlots">;
    type: "show" | "meal" | "transport" | "flight" | "custom";
    title: string;
    startTime: string;
    endTime?: string;
    showId?: Id<"shows">;
    backupShowIds?: Id<"shows">[];
    notes?: string;
  };
  onEdit: () => void;
}

const typeColors = {
  show: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  meal: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  transport: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  flight: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  custom: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

export default function TripSlot({ slot, onEdit }: TripSlotProps) {
  const show = useQuery(
    api.functions.shows.getShow,
    slot.showId ? { showId: slot.showId } : "skip"
  );

  const backupShows = useQuery(
    api.functions.shows.getShows,
    slot.backupShowIds && slot.backupShowIds.length > 0
      ? { limit: 100 }
      : "skip"
  );

  const displayBackupShows =
    backupShows && slot.backupShowIds
      ? backupShows.filter((s) => slot.backupShowIds?.includes(s._id))
      : [];

  const timeDisplay = slot.endTime
    ? `${slot.startTime} - ${slot.endTime}`
    : slot.startTime;

  return (
    <div
      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onEdit}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${typeColors[slot.type]}`}
            >
              {slot.type}
            </span>
            <span className="text-sm font-semibold">{slot.title}</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {timeDisplay}
            </span>
          </div>

          {slot.type === "show" && show && (
            <div className="mt-2">
              <p className="font-medium">{show.title}</p>
              {show.theatre && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {show.theatre}
                </p>
              )}
            </div>
          )}

          {slot.type === "show" && displayBackupShows.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Backup shows:
              </p>
              <div className="flex flex-wrap gap-1">
                {displayBackupShows.map((backupShow) => (
                  <span
                    key={backupShow._id}
                    className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded"
                  >
                    {backupShow.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          {slot.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
              {slot.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

