"use client";

export default function CalendarView() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <select className="px-4 py-2 border rounded">
          <option>All Types</option>
          <option>Broadway</option>
          <option>Off-Broadway</option>
          <option>Touring</option>
          <option>Local</option>
        </select>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Export to Google Calendar
        </button>
      </div>
      <div className="border rounded p-4">
        <p className="text-gray-500">Calendar view will be displayed here</p>
      </div>
    </div>
  );
}

