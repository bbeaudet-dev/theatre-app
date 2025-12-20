"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
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
  onEdit: (event: React.MouseEvent) => void;
  tripId: Id<"trips">;
  tripDayId: Id<"tripDays">;
}

const typeColors = {
  show: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  meal: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  transport: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  flight: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  custom: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
};

export default function TripSlot({ slot, onEdit, tripId, tripDayId }: TripSlotProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
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

  const updateSlot = useMutation(api.functions.trips.updateTripSlot);
  const deleteSlot = useMutation(api.functions.trips.deleteTripSlot);

  const displayBackupShows =
    backupShows && slot.backupShowIds
      ? backupShows.filter((s) => slot.backupShowIds?.includes(s._id))
      : [];

  const timeDisplay = slot.endTime
    ? `${slot.startTime} - ${slot.endTime}`
    : slot.startTime;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (slot.type === "show") {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);

    const showId = e.dataTransfer.getData("showId");
    const droppedTripId = e.dataTransfer.getData("tripId");

    if (!showId || droppedTripId !== tripId || slot.type !== "show") {
      return;
    }

    try {
      // If slot already has a show, add as backup, otherwise set as primary
      if (slot.showId) {
        const currentBackups = slot.backupShowIds || [];
        if (!currentBackups.includes(showId as Id<"shows">) && slot.showId !== showId) {
          await updateSlot({
            slotId: slot._id,
            backupShowIds: [...currentBackups, showId as Id<"shows">],
          });
        }
      } else {
        await updateSlot({
          slotId: slot._id,
          showId: showId as Id<"shows">,
        });
      }
    } catch (error) {
      console.error("Error updating slot:", error);
      alert("Failed to add show to slot");
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this slot?")) {
      try {
        await deleteSlot({ slotId: slot._id });
      } catch (error) {
        console.error("Error deleting slot:", error);
        alert("Failed to delete slot");
      }
    }
  };

  return (
    <div
      className={`border rounded p-1.5 hover:shadow transition-shadow cursor-pointer text-xs min-w-[200px] max-w-[300px] flex flex-col ${
        isDraggingOver ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
      onClick={onEdit}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-start gap-1 flex-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <span
              className={`px-1 py-0.5 rounded text-[9px] font-medium ${typeColors[slot.type]}`}
            >
              {slot.type}
            </span>
            <span className="text-[10px] font-semibold">{slot.title}</span>
          </div>

          {slot.type === "show" && show && (
            <div className="mt-0.5">
              <p className="text-[10px] font-medium truncate">{show.title}</p>
            </div>
          )}

          {slot.type === "show" && displayBackupShows.length > 0 && (
            <div className="mt-0.5">
              <p className="text-[9px] text-gray-600 dark:text-gray-400">
                Backup: {displayBackupShows.map(s => s.title).join(", ")}
              </p>
            </div>
          )}

          {slot.notes && (
            <p className="text-[9px] text-gray-600 dark:text-gray-400 mt-0.5 italic truncate">
              {slot.notes}
            </p>
          )}
        </div>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 text-xs flex-shrink-0"
          title="Delete slot"
        >
          ×
        </button>
      </div>
      
      {/* Time at bottom with different background */}
      <div className="mt-1.5 pt-1 border-t bg-gray-100 dark:bg-zinc-800 rounded-b -mx-1.5 -mb-1.5 px-1.5 pb-1">
        <span className="text-[9px] font-medium text-gray-700 dark:text-gray-300">
          {timeDisplay}
        </span>
      </div>
    </div>
  );
}
