"use client";

export default function UserPreferences() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Theatre Preferences</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            How much do you appreciate good dance in a show? (1-5)
          </label>
          <input type="range" min="1" max="5" className="w-full" />
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span>Do you appreciate a live orchestra?</span>
          </label>
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span>
              Do you enjoy listening to soundtracks/songs from musicals in your
              daily life?
            </span>
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            How much do you appreciate unique stage elements? (1-5)
          </label>
          <input type="range" min="1" max="5" className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            How much do you appreciate prop efficiency? (1-5)
          </label>
          <input type="range" min="1" max="5" className="w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            How much do you value the message/moral of the story? (1-5)
          </label>
          <input type="range" min="1" max="5" className="w-full" />
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save Preferences
        </button>
      </div>
    </div>
  );
}

