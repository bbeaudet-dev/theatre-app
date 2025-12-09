"use client";

export default function PlanView() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input type="date" className="px-4 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input type="date" className="px-4 py-2 border rounded" />
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-6">
          Plan Trip
        </button>
      </div>
      <div className="border rounded p-4">
        <h3 className="font-semibold mb-4">Show Schedule</h3>
        <div className="space-y-2">
          <div className="p-3 border rounded">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Show Name</p>
                <p className="text-sm text-gray-600">Monday, 8:00 PM</p>
              </div>
              <div className="text-sm">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                  Rush Available
                </span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          Schedule view will show all available shows and ticket options
        </p>
      </div>
    </div>
  );
}

