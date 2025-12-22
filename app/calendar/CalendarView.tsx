"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

type District = "broadway" | "off-broadway" | "touring" | "local";

export default function CalendarView() {
  const [selectedDistrict, setSelectedDistrict] = useState<District | "all">("all");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const shows = useQuery(
    api.functions.calendar.getShows,
    selectedDistrict === "all"
      ? {}
      : { district: selectedDistrict }
  );

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Helper to check if a show is active on a given date
  const isShowActiveOnDate = (
    show: Doc<"shows">,
    date: number
  ): boolean => {
    if (!show) return false;
    const showDate = new Date(date);
    const opening = show.openingDate ? new Date(show.openingDate) : null;
    const closing = show.closingDate ? new Date(show.closingDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If it's an open run and past opening date (or no opening date), it's active
    if (show.isOpenRun) {
      if (opening) {
        return showDate >= opening;
      }
      return true;
    }

    // If it has both opening and closing dates
    if (opening && closing) {
      return showDate >= opening && showDate <= closing;
    }

    // If it only has opening date
    if (opening) {
      return showDate >= opening;
    }

    return false;
  };

  // Get shows for a specific date
  const getShowsForDate = (date: number) => {
    if (!shows) return [];
    return shows.filter((show: Doc<"shows">) => isShowActiveOnDate(show, date));
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Export to Google Calendar (placeholder)
  const handleExport = () => {
    // TODO: Implement Google Calendar export
    alert("Google Calendar export coming soon!");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4 flex-wrap">
        <select
          value={selectedDistrict}
          onChange={(e) =>
            setSelectedDistrict(e.target.value as District | "all")
          }
          className="px-4 py-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
        >
          <option value="all">All Types</option>
          <option value="broadway">Broadway</option>
          <option value="off-broadway">Off-Broadway</option>
          <option value="touring">Touring</option>
          <option value="local">Local</option>
        </select>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Export to Google Calendar
        </button>
      </div>

      {/* Calendar Header */}
      <div className="bg-white dark:bg-zinc-900 border rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={previousMonth}
            className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            ←
          </button>
          <h2 className="text-xl font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          <button
            onClick={nextMonth}
            className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            →
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center font-semibold text-sm py-2 text-gray-600 dark:text-gray-400"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const date = i + 1;
            const dateObj = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              date
            );
            const dateTimestamp = dateObj.getTime();
            const showsForDate = getShowsForDate(dateTimestamp);

            return (
              <div
                key={date}
                className="aspect-square border border-gray-200 dark:border-zinc-700 p-1 overflow-y-auto"
              >
                <div className="text-xs font-medium mb-1">{date}</div>
                <div className="space-y-1">
                  {showsForDate.length === 0 ? (
                    <p className="text-xs text-gray-400 dark:text-gray-500">No shows</p>
                  ) : (
                    showsForDate.map((show: Doc<"shows">) => (
                      <div
                        key={show._id}
                        className="text-xs px-1 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded truncate"
                        title={show.title}
                      >
                        {show.title}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show count */}
      {shows && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {shows.length} show{shows.length !== 1 ? "s" : ""}
          {selectedDistrict !== "all" && ` (${selectedDistrict})`}
        </p>
      )}
    </div>
  );
}
