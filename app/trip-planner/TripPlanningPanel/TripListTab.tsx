"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ShowCard from "./ShowCard";

interface TripListTabProps {
  tripId: Id<"trips">;
}

export default function TripListTab({ tripId }: TripListTabProps) {
  const trip = useQuery(api.functions.trips.getTrip, { tripId });

  // Collect all unique shows from trip slots
  const tripShows = new Set<Id<"shows">>();
  
  if (trip) {
    trip.days.forEach((day) => {
      day.slots.forEach((slot) => {
        if (slot.showId) {
          tripShows.add(slot.showId);
        }
        // Also include backup shows
        slot.backupShowIds?.forEach((backupId) => {
          tripShows.add(backupId);
        });
      });
    });
  }

  // Get show details for all shows in the trip
  const showIds = Array.from(tripShows);
  const shows = useQuery(
    api.functions.shows.getShows,
    {} // We'll filter client-side
  );

  const tripShowDetails = shows?.filter((show) => showIds.includes(show._id)) || [];

  if (trip === undefined || shows === undefined) {
    return <div className="text-center text-gray-500 py-8">Loading...</div>;
  }

  if (tripShowDetails.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No shows added to this trip yet.</p>
        <p className="text-sm mt-2">Add shows from the Find or My Lists tabs!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 text-xs">
      <h3 className="font-semibold text-sm mb-2">This Trip</h3>
      {tripShowDetails.map((show) => (
        <ShowCard key={show._id} show={show} tripId={tripId} draggable={false} />
      ))}
    </div>
  );
}

