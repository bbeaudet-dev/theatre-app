"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useCurrentUser } from "@/lib/auth-client";
import ShowCard from "./ShowCard";

interface TripListTabProps {
  tripId: Id<"trips"> | null;
}

export default function TripListTab({ tripId }: TripListTabProps) {
  const trip = useQuery(
    api.functions.trips.getTrip,
    tripId ? { tripId } : "skip"
  );
  const userId = useCurrentUser();
  const allTrips = useQuery(
    api.functions.trips.getUserTrips,
    userId ? { userId } : "skip"
  );

  const shows = useQuery(api.functions.shows.getShows, {});
  
  // Collect all unique shows from trip slots
  const tripShows = new Set<Id<"shows">>();
  
  if (tripId && trip) {
    // Single trip mode
    trip.days.forEach((day) => {
      day.slots.forEach((slot) => {
        if (slot.showId) {
          tripShows.add(slot.showId);
        }
        slot.backupShowIds?.forEach((backupId) => {
          tripShows.add(backupId);
        });
      });
    });
  } else if (!tripId && allTrips) {
    // All trips mode - collect shows from all trips
    allTrips.forEach((t) => {
      t.days?.forEach((day) => {
        day.slots?.forEach((slot) => {
          if (slot.showId) {
            tripShows.add(slot.showId);
          }
          slot.backupShowIds?.forEach((backupId) => {
            tripShows.add(backupId);
          });
        });
      });
    });
  }

  const showIds = Array.from(tripShows);
  const tripShowDetails = shows?.filter((show) => showIds.includes(show._id)) || [];

  if ((tripId && trip === undefined) || shows === undefined || (!tripId && allTrips === undefined)) {
    return <div className="text-center text-gray-500 py-8">Loading...</div>;
  }

  if (!tripId) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p className="text-sm mb-2">Select a trip to view its shows</p>
        <p className="text-xs text-gray-400">or browse from the Find tab</p>
      </div>
    );
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

