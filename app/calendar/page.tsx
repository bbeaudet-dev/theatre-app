import CalendarView from "./CalendarView";

export default function CalendarPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Calendar</h1>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
        View all shows currently running on Broadway, Off-Broadway, touring, and
        local productions. Filter by location and add to your Google Calendar.
      </p>
      <CalendarView />
    </div>
  );
}

