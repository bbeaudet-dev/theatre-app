"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import TripDay from "./TripDay";

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
    <div>
      <div className="flex justify-between items-start mb-6">
        <div>
          <button
            onClick={onBack}
            className="mb-2 text-blue-600 hover:underline"
          >
            ← Back to Trips
          </button>
          <h2 className="text-3xl font-bold">{trip.title}</h2>
          {trip.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {trip.description}
            </p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete Trip
        </button>
      </div>

      <div className="space-y-6">
        {trip.days.map((day) => (
          <TripDay key={day._id} day={day} tripId={tripId} />
        ))}
      </div>
    </div>
  );
}

