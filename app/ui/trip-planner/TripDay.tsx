"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import TripSlot from "./TripSlot";
import SlotEditor from "./SlotEditor";

interface TripDayProps {
  day: {
    _id: Id<"tripDays">;
    tripId: Id<"trips">;
    date: number;
    slots: Array<{
      _id: Id<"tripDaySlots">;
      tripDayId: Id<"tripDays">;
      tripId: Id<"trips">;
      type: "show" | "meal" | "transport" | "flight" | "custom";
      title: string;
      startTime: string;
      endTime?: string;
      showId?: Id<"shows">;
      backupShowIds?: Id<"shows">[];
      notes?: string;
    }>;
  };
  tripId: Id<"trips">;
}

export default function TripDay({ day, tripId }: TripDayProps) {
  const [showSlotEditor, setShowSlotEditor] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<Id<"tripDaySlots"> | null>(null);
  const addSlot = useMutation(api.functions.trips.addTripSlot);

  const date = new Date(day.date);
  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" });
  const dateString = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleAddSlot = () => {
    setEditingSlotId(null);
    setShowSlotEditor(true);
  };

  const handleEditSlot = (slotId: Id<"tripDaySlots">) => {
    setEditingSlotId(slotId);
    setShowSlotEditor(true);
  };

  const handleSlotEditorClose = () => {
    setShowSlotEditor(false);
    setEditingSlotId(null);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold">{dayOfWeek}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{dateString}</p>
        </div>
        <button
          onClick={handleAddSlot}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          Add Custom Slot
        </button>
      </div>

      <div className="space-y-3">
        {day.slots.map((slot) => (
          <TripSlot
            key={slot._id}
            slot={slot}
            onEdit={() => handleEditSlot(slot._id)}
          />
        ))}
      </div>

      {showSlotEditor && (
        <SlotEditor
          tripDayId={day._id}
          tripId={tripId}
          slotId={editingSlotId}
          onClose={handleSlotEditorClose}
        />
      )}
    </div>
  );
}

