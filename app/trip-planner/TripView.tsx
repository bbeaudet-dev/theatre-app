"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { DayWithSlots } from "@/lib/types";
import TripDay from "./TripDay";
import TripPlanningPanel from "./TripPlanningPanel";

interface TripViewProps {
  tripId: Id<"trips">;
  onBack: () => void;
}

// Helper to format date as YYYY-MM-DD in local timezone
const formatDateLocal = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper to parse YYYY-MM-DD date string to timestamp at midnight local time
const parseDateLocal = (dateString: string): number => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getTime();
};

export default function TripView({ tripId, onBack }: TripViewProps) {
  const trip = useQuery(api.functions.trips.getTrip, { tripId });
  const deleteTrip = useMutation(api.functions.trips.deleteTrip);
  const updateTrip = useMutation(api.functions.trips.updateTrip);
  const generateTripDays = useMutation(api.functions.trips.generateTripDays);

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Initialize form fields when trip loads
  useEffect(() => {
    if (trip) {
      setTitle(trip.title);
      setStartDate(formatDateLocal(trip.startDate));
      setEndDate(formatDateLocal(trip.endDate));
    }
  }, [trip]);

  // Auto-generate days when dates change
  useEffect(() => {
    if (trip && startDate && endDate) {
      const start = parseDateLocal(startDate);
      const end = parseDateLocal(endDate);
      
      // Validate dates
      if (isNaN(start) || isNaN(end) || end < start) {
        return; // Don't update if dates are invalid
      }
      
      // Only regenerate if dates actually changed
      if (Math.abs(start - trip.startDate) > 1000 || Math.abs(end - trip.endDate) > 1000) {
        const timer = setTimeout(async () => {
          try {
            await updateTrip({
              tripId,
              startDate: start,
              endDate: end,
            });
            await generateTripDays({ tripId });
          } catch (error) {
            console.error("Error updating trip dates:", error);
          }
        }, 500); // Debounce 500ms

        return () => clearTimeout(timer);
      }
    }
  }, [startDate, endDate, tripId, updateTrip, generateTripDays, trip]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this trip?")) {
      try {
        await deleteTrip({ tripId });
        onBack();
      } catch (error) {
        console.error("Error deleting trip:", error);
        alert("Failed to delete trip");
      }
    }
  };

  const handleTitleChange = async (newTitle: string) => {
    setTitle(newTitle);
    try {
      await updateTrip({ tripId, title: newTitle });
    } catch (error) {
      console.error("Error updating trip title:", error);
    }
  };

  if (trip === undefined) {
    return <div>Loading trip...</div>;
  }

  if (trip === null) {
    return (
      <div>
        <p>Trip not found</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
          ← Back to trips
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Main Trip View - 2/3 width */}
      <div className="flex-1 overflow-y-auto p-6 min-w-0">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="mb-4 text-blue-600 hover:underline text-sm"
          >
            ← Back to Trips
          </button>
          
          {/* Editable Title - Google Docs style */}
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-2xl font-bold bg-transparent border-none outline-none w-full mb-4 focus:bg-gray-50 dark:focus:bg-zinc-800 rounded px-2 py-1 -ml-2"
            placeholder="Trip Title"
          />

          {/* Date Inputs */}
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700 text-sm"
              />
            </div>
            <div className="ml-auto">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {trip.days.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p>Set start and end dates above to generate trip days.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {trip.days.map((day: DayWithSlots) => (
              <TripDay key={day._id} day={day} tripId={tripId} />
            ))}
          </div>
        )}
      </div>

      {/* Right Panel - 1/3 width */}
      <TripPlanningPanel tripId={tripId} />
    </div>
  );
}

