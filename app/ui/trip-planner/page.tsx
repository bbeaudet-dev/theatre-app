"use client";

import TripListView from "./TripListView";

export default function PlanPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Trip Planner</h1>
      <p className="text-gray-600 mb-6">
        Plan your theatre trip! Create trips, add shows to your schedule, and
        organize your perfect theatre experience.
      </p>
      <TripListView />
    </div>
  );
}

