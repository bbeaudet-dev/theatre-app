import CalendarView from "@/components/calendar/CalendarView";

export default function CalendarPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Calendar</h1>
      <p className="text-gray-600 mb-6">
        View all shows currently running on Broadway, Off-Broadway, touring, and
        local productions. Filter by location and add to your Google Calendar.
      </p>
      <CalendarView />
    </div>
  );
}

