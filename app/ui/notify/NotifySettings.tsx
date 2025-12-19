"use client";

export default function NotifySettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span>Email notifications</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span>SMS notifications</span>
          </label>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">What to notify me about:</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span>Show openings</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span>Show closings</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span>Cast changes</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span>News and reviews</span>
          </label>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Interested Shows</h3>
        <p className="text-gray-500">Your interested shows list will appear here</p>
      </div>
    </div>
  );
}

