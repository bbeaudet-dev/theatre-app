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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const userId = useCurrentUser();
  const trips = useQuery(
    api.functions.trips.getUserTrips,
    userId ? { userId } : "skip"
  );
  const createTrip = useMutation(api.functions.trips.createTrip);

  const handleCreateTrip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userId) {
      alert("Please sign in first");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;

    if (!title || !startDate || !endDate) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const tripId = await createTrip({
        userId,
        title,
        description: description || undefined,
        startDate: new Date(startDate).getTime(),
        endDate: new Date(endDate).getTime(),
        startTime: startTime || undefined,
        endTime: endTime || undefined,
      });
      setSelectedTripId(tripId);
      setShowCreateForm(false);
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

  if (showCreateForm) {
    return (
      <div className="max-w-2xl">
        <button
          onClick={() => setShowCreateForm(false)}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Back to trips
        </button>
        <div className="bg-white dark:bg-zinc-900 border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Create New Trip</h2>
          <form onSubmit={handleCreateTrip} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Trip Title *
              </label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
                placeholder="e.g., NYC Theatre Weekend"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
                rows={3}
                placeholder="Optional description..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  required
                  className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  name="endDate"
                  required
                  className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create Trip
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 border rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
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
        <h1 className="text-3xl font-bold mb-4">Trip Planner</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Plan your theatre trip! Create trips, add shows to your schedule, and
          organize your perfect theatre experience.
        </p>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Trips</h2>
          <button
            onClick={() => setShowCreateForm(true)}
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
              onClick={() => setShowCreateForm(true)}
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

