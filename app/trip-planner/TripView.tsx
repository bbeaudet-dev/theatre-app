"use client";

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

export default function TripView({ tripId, onBack }: TripViewProps) {
  const trip = useQuery(api.functions.trips.getTrip, { tripId });
  const deleteTrip = useMutation(api.functions.trips.deleteTrip);

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

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);

  return (
    <div className="flex min-h-screen">
      {/* Main Trip View - 2/3 width */}
      <div className="flex-1 overflow-y-auto p-6 min-w-0">
        <div className="flex justify-between items-start mb-6">
          <div>
            <button
              onClick={onBack}
              className="mb-2 text-blue-600 hover:underline"
            >
              ← Back to Trips
            </button>
            <h2 className="text-lg font-bold">{trip.title}</h2>
            {trip.description && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                {trip.description}
              </p>
            )}
            <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
          >
            Delete
          </button>
        </div>

        <div className="space-y-6">
          {trip.days.map((day: DayWithSlots) => (
            <TripDay key={day._id} day={day} tripId={tripId} />
          ))}
        </div>
      </div>

      {/* Right Panel - 1/3 width */}
      <TripPlanningPanel tripId={tripId} />
    </div>
  );
}

