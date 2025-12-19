"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ShowSelector from "./ShowSelector";

interface SlotEditorProps {
  tripDayId: Id<"tripDays">;
  tripId: Id<"trips">;
  slotId: Id<"tripDaySlots"> | null;
  onClose: () => void;
}

export default function SlotEditor({
  tripDayId,
  tripId,
  slotId,
  onClose,
}: SlotEditorProps) {
  const [type, setType] = useState<
    "show" | "meal" | "transport" | "flight" | "custom"
  >("show");
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("");
  const [showId, setShowId] = useState<Id<"shows"> | undefined>(undefined);
  const [backupShowIds, setBackupShowIds] = useState<Id<"shows">[]>([]);
  const [notes, setNotes] = useState("");
  const [showShowSelector, setShowShowSelector] = useState(false);
  const [showBackupSelector, setShowBackupSelector] = useState(false);

  const existingSlot = useQuery(
    api.functions.trips.getTrip,
    slotId ? { tripId } : "skip"
  );

  const addSlot = useMutation(api.functions.trips.addTripSlot);
  const updateSlot = useMutation(api.functions.trips.updateTripSlot);

  useEffect(() => {
    if (slotId && existingSlot) {
      // Find the slot in the trip data
      const slot = existingSlot.days
        .flatMap((day) => day.slots)
        .find((s) => s._id === slotId);

      if (slot) {
        setType(slot.type);
        setTitle(slot.title);
        setStartTime(slot.startTime);
        setEndTime(slot.endTime || "");
        setShowId(slot.showId);
        setBackupShowIds(slot.backupShowIds || []);
        setNotes(slot.notes || "");
      }
    } else {
      // Set defaults for new slot
      setType("show");
      setTitle("Matinee");
      setStartTime("14:00");
      setEndTime("16:30");
    }
  }, [slotId, existingSlot]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (slotId) {
        // Update existing slot
        await updateSlot({
          slotId,
          type,
          title,
          startTime,
          endTime: endTime || undefined,
          showId: showId || undefined,
          backupShowIds: backupShowIds.length > 0 ? backupShowIds : undefined,
          notes: notes || undefined,
        });
      } else {
        // Create new slot
        await addSlot({
          tripDayId,
          tripId,
          type,
          title,
          startTime,
          endTime: endTime || undefined,
          showId: showId || undefined,
          backupShowIds: backupShowIds.length > 0 ? backupShowIds : undefined,
          notes: notes || undefined,
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving slot:", error);
      alert("Failed to save slot");
    }
  };

  const handleShowSelect = (selectedShowId: Id<"shows">) => {
    setShowId(selectedShowId);
    setShowShowSelector(false);
  };

  const handleBackupShowSelect = (selectedShowId: Id<"shows">) => {
    if (!backupShowIds.includes(selectedShowId)) {
      setBackupShowIds([...backupShowIds, selectedShowId]);
    }
    setShowBackupSelector(false);
  };

  const removeBackupShow = (showIdToRemove: Id<"shows">) => {
    setBackupShowIds(backupShowIds.filter((id) => id !== showIdToRemove));
  };

  const selectedShow = useQuery(
    api.functions.shows.getShow,
    showId ? { showId } : "skip"
  );

  const backupShows = useQuery(
    api.functions.shows.getShows,
    backupShowIds.length > 0 ? { limit: 100 } : "skip"
  );

  const displayBackupShows =
    backupShows && backupShowIds.length > 0
      ? backupShows.filter((s) => backupShowIds.includes(s._id))
      : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {slotId ? "Edit Slot" : "Add Slot"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Type *</label>
            <select
              value={type}
              onChange={(e) =>
                setType(
                  e.target.value as
                    | "show"
                    | "meal"
                    | "transport"
                    | "flight"
                    | "custom"
                )
              }
              className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
              required
            >
              <option value="show">Show</option>
              <option value="meal">Meal</option>
              <option value="transport">Transport</option>
              <option value="flight">Flight</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Start Time *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
              />
            </div>
          </div>

          {type === "show" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Primary Show
                </label>
                {selectedShow ? (
                  <div className="flex items-center justify-between p-3 border rounded dark:bg-zinc-800 dark:border-zinc-700">
                    <span>{selectedShow.title}</span>
                    <button
                      type="button"
                      onClick={() => setShowShowSelector(true)}
                      className="text-blue-600 hover:underline"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowShowSelector(true)}
                    className="w-full px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-zinc-800 dark:border-zinc-700"
                  >
                    Select Show
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Backup Shows
                </label>
                {displayBackupShows.length > 0 && (
                  <div className="space-y-2 mb-2">
                    {displayBackupShows.map((show) => (
                      <div
                        key={show._id}
                        className="flex items-center justify-between p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
                      >
                        <span className="text-sm">{show.title}</span>
                        <button
                          type="button"
                          onClick={() => removeBackupShow(show._id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowBackupSelector(true)}
                  className="w-full px-4 py-2 border rounded hover:bg-gray-50 dark:hover:bg-zinc-800 dark:border-zinc-700"
                >
                  Add Backup Show
                </button>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {slotId ? "Update" : "Create"} Slot
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
          </div>
        </form>

        {showShowSelector && (
          <ShowSelector
            onSelect={handleShowSelect}
            onClose={() => setShowShowSelector(false)}
          />
        )}

        {showBackupSelector && (
          <ShowSelector
            onSelect={handleBackupShowSelect}
            onClose={() => setShowBackupSelector(false)}
          />
        )}
      </div>
    </div>
  );
}

