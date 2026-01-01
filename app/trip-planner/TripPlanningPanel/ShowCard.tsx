"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ShowCardProps } from "@/lib/types";
import { DAY_LABELS, DAYS_OF_WEEK } from "@/lib/constants";

// Convert 24-hour time to 12-hour format
function formatTime(time: string): string {
  if (!time) return "";
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const mins = minutes === "00" ? "" : `:${minutes}`;
  if (hour === 0) return `12${mins}am`;
  if (hour < 12) return `${hour}${mins}am`;
  if (hour === 12) return `12${mins}pm`;
  return `${hour - 12}${mins}pm`;
}

export default function ShowCard({ show, tripId, draggable = false }: ShowCardProps) {
  const trip = useQuery(
    api.functions.trips.getTrip,
    tripId ? { tripId } : "skip"
  );
  
  // Check if show is in trip as primary or backup
  const showInTrip = trip ? (() => {
    for (const day of trip.days) {
      for (const slot of day.slots) {
        if (slot.showId === show._id) return "primary";
        if (slot.backupShowIds?.includes(show._id)) return "backup";
      }
    }
    return null;
  })() : null;

  const handleDragStart = (e: React.DragEvent) => {
    if (draggable) {
      e.dataTransfer.setData("showId", show._id);
      if (tripId) {
        e.dataTransfer.setData("tripId", tripId);
      }
    }
  };

  // Calculate border color
  const getBorderColor = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (show.isOpenRun) {
      return "border-blue-500";
    }

    if (!show.closingDate) {
      return "border-green-500";
    }

    const closing = new Date(show.closingDate);
    closing.setHours(0, 0, 0, 0);
    
    if (closing < today) {
      return "border-red-500";
    }

    const daysUntilClosing = Math.ceil((closing.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilClosing <= 30) {
      return "border-orange-500";
    } else if (daysUntilClosing <= 60) {
      return "border-yellow-500";
    } else {
      return "border-green-500";
    }
  };

  const showtimes = show.showtimes || {};

  const getShowtimesForDay = (day: string): string[] => {
    const time = showtimes?.[day as keyof typeof showtimes];
    if (!time) return [];
    if (Array.isArray(time)) {
      const times = time as string[];
      return times.filter((t) => Boolean(t));
    }
    return [];
  };

  return (
    <div
      draggable={draggable}
      onDragStart={handleDragStart}
      className={`border-2 ${getBorderColor()} rounded p-1.5 bg-white dark:bg-zinc-800 cursor-${draggable ? "grab" : "default"} hover:shadow transition-shadow text-xs`}
    >
      <div className="flex items-start gap-2">
        {/* Title and info on left */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="font-semibold text-xs">{show.title}</h4>
            {showInTrip && (
              <span className={`text-[10px] px-1 py-0.5 rounded ${
                showInTrip === "primary" 
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
              }`}>
                {showInTrip === "primary" ? "In Trip" : "Backup"}
              </span>
            )}
          </div>
        </div>

        {/* Day/Time Grid on right */}
        <div className="shrink-0">
          <div className="flex mb-0.5">
            {DAY_LABELS.map((day) => (
              <div key={day} className="text-[9px] text-center font-medium text-gray-600 dark:text-gray-400 w-5">
                {day}
              </div>
            ))}
          </div>
          <div className="flex">
            {DAYS_OF_WEEK.map((day) => {
              const times = getShowtimesForDay(day);
              const numTimes = times.length;
              return (
                <div 
                  key={day} 
                  className="w-5 flex flex-col items-center justify-start py-0.5"
                >
                  {numTimes === 0 ? (
                    <span className="text-[9px] text-gray-400">X</span>
                  ) : (
                    <div className="flex flex-col gap-0.5 items-center">
                      {times.map((time, idx) => (
                        <span 
                          key={`${day}-${idx}`} 
                          className="text-[9px] text-blue-600 dark:text-blue-400 font-medium leading-tight whitespace-nowrap"
                        >
                          {formatTime(time)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
