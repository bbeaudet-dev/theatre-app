"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { TripWithDays, DayWithSlots, TripDaySlot, Show } from "@/lib/types";
import ShowSelector from "./ShowSelector";

interface SlotEditorProps {
  tripDayId: Id<"tripDays">;
  tripId: Id<"trips">;
  slotId: Id<"tripDaySlots"> | null;
  onClose: () => void;
  position?: { x: number; y: number } | null;
}

export default function SlotEditor({
  tripDayId,
  tripId,
  slotId,
  onClose,
  position,
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
  const editorRef = useRef<HTMLDivElement>(null);

  const existingSlot = useQuery(
    api.functions.trips.getTrip,
    slotId ? { tripId } : "skip"
  );

  const addSlot = useMutation(api.functions.trips.addTripSlot);
  const updateSlot = useMutation(api.functions.trips.updateTripSlot);

  useEffect(() => {
    if (slotId && existingSlot) {
      const tripWithDays = existingSlot as TripWithDays;
      const slot = tripWithDays.days
        .flatMap((day: DayWithSlots) => day.slots)
        .find((s: TripDaySlot) => s._id === slotId);

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
      setType("show");
      setTitle("Matinee");
      setStartTime("14:00");
      setEndTime("16:30");
    }
  }, [slotId, existingSlot]);

  // Auto-save on change
  useEffect(() => {
    if (!slotId) return; // Don't auto-save new slots until they're created
    
    const timeoutId = setTimeout(async () => {
      try {
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
      } catch (error) {
        console.error("Error auto-saving slot:", error);
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [type, title, startTime, endTime, showId, backupShowIds, notes, slotId, updateSlot]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
        // If it's a new slot, create it first
        if (!slotId) {
          handleCreateSlot();
        }
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, slotId]);

  const handleCreateSlot = async () => {
    try {
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
    } catch (error) {
      console.error("Error creating slot:", error);
      alert("Failed to create slot");
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
      ? backupShows.filter((s: Show) => backupShowIds.includes(s._id))
      : [];

  const style = position
    ? { position: "fixed" as const, left: `${position.x}px`, top: `${position.y}px` }
    : { position: "fixed" as const, bottom: "24px", right: "24px" };

  return (
    <div
      ref={editorRef}
      className="bg-white dark:bg-zinc-900 rounded shadow-2xl border p-2 max-w-xs w-full z-50 text-xs"
      style={style}
    >
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xs font-semibold">
          {slotId ? "Edit Slot" : "New Slot"}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xs"
        >
          ×
        </button>
      </div>

      <div className="space-y-1.5">
        <div>
          <label className="block text-[10px] font-medium mb-0.5">Type</label>
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
            className="w-full px-1.5 py-1 text-xs border rounded dark:bg-zinc-800 dark:border-zinc-700"
          >
            <option value="show">Show</option>
            <option value="meal">Meal</option>
            <option value="transport">Transport</option>
            <option value="flight">Flight</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-medium mb-0.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-1.5 py-1 text-xs border rounded dark:bg-zinc-800 dark:border-zinc-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-1">
          <div>
            <label className="block text-[10px] font-medium mb-0.5">Start</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-1.5 py-1 text-xs border rounded dark:bg-zinc-800 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium mb-0.5">End</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-1.5 py-1 text-xs border rounded dark:bg-zinc-800 dark:border-zinc-700"
            />
          </div>
        </div>

        {type === "show" && (
          <>
            <div>
              <label className="block text-[10px] font-medium mb-0.5">Show</label>
              {selectedShow ? (
                <div className="flex items-center justify-between px-1.5 py-1 border rounded dark:bg-zinc-800 dark:border-zinc-700">
                  <span className="text-xs truncate">{selectedShow.title}</span>
                  <button
                    type="button"
                    onClick={() => setShowShowSelector(true)}
                    className="text-[10px] text-blue-600 hover:underline ml-1"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowShowSelector(true)}
                  className="w-full px-1.5 py-1 text-xs border rounded hover:bg-gray-50 dark:hover:bg-zinc-800 dark:border-zinc-700"
                >
                  Select
                </button>
              )}
            </div>

            {displayBackupShows.length > 0 && (
              <div>
                <label className="block text-[10px] font-medium mb-0.5">Backups</label>
                <div className="space-y-0.5">
                  {displayBackupShows.map((show: Show) => (
                    <div
                      key={show._id}
                      className="flex items-center justify-between px-1.5 py-0.5 text-xs border rounded dark:bg-zinc-800 dark:border-zinc-700"
                    >
                      <span className="truncate">{show.title}</span>
                      <button
                        type="button"
                        onClick={() => removeBackupShow(show._id)}
                        className="text-[10px] text-red-600 hover:underline ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => setShowBackupSelector(true)}
              className="w-full px-1.5 py-0.5 text-[10px] border rounded hover:bg-gray-50 dark:hover:bg-zinc-800 dark:border-zinc-700"
            >
              + Backup
            </button>
          </>
        )}

        <div>
          <label className="block text-[10px] font-medium mb-0.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-1.5 py-1 text-xs border rounded dark:bg-zinc-800 dark:border-zinc-700"
            rows={2}
          />
        </div>
      </div>

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
  );
}
