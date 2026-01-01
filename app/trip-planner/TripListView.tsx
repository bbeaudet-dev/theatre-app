"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "@/lib/auth-client";
import { Trip } from "@/lib/types";
import TripView from "./TripView";
import TripPlanningPanel from "./TripPlanningPanel";

export default function TripListView() {
  const [selectedTripId, setSelectedTripId] = useState<Id<"trips"> | null>(null);
  const userId = useCurrentUser();
  const trips = useQuery(
    api.functions.trips.getUserTrips,
    userId ? { userId } : "skip"
  );
  const createTripWithoutDays = useMutation(api.functions.trips.createTripWithoutDays);

  const handleCreateNewTrip = async () => {
    if (!userId) {
      alert("Please sign in first");
      return;
    }

    try {
      const tripId = await createTripWithoutDays({
        userId,
        title: "New Trip",
        description: undefined,
      });
      setSelectedTripId(tripId);
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Failed to create trip");
    }
  };

  if (selectedTripId) {
    return (
      <TripView
        tripId={selectedTripId}
        onBack={() => setSelectedTripId(null)}
      />
    );
  }

  if (userId === undefined) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <p className="text-yellow-800 dark:text-yellow-200 mb-2">
          Please sign in to view your trips.
        </p>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          Create an account or sign in to start planning your theatre trips.
        </p>
      </div>
    );
  }

  if (trips === undefined) {
    return <div>Loading trips...</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Main Content - 2/3 width */}
      <div className="flex-1 overflow-y-auto p-6 min-w-0">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleCreateNewTrip}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create New Trip
          </button>
        </div>

        {trips.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border rounded-lg p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You don't have any trips yet.
            </p>
            <button
              onClick={handleCreateNewTrip}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.map((trip: Trip) => {
              const startDate = new Date(trip.startDate);
              const endDate = new Date(trip.endDate);
              const daysDiff =
                Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

              return (
                <div
                  key={trip._id}
                  onClick={() => setSelectedTripId(trip._id)}
                  className="bg-white dark:bg-zinc-900 border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
                  {trip.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {trip.description}
                    </p>
                  )}
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p>
                      {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                    </p>
                    <p>{daysDiff} day{daysDiff !== 1 ? "s" : ""}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Panel - 1/3 width */}
      <TripPlanningPanel tripId={null} />
    </div>
  );
}

