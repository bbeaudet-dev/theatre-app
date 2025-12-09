"use client";

export default function TheatreCloud() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Theatre Cloud</h2>
        <div className="border rounded p-8 min-h-[400px] flex items-center justify-center">
          <p className="text-gray-500">
            Your ranked shows will appear here as a visual cloud
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Ranked Shows</h3>
        <div className="space-y-2">
          <p className="text-gray-500 text-sm">
            Drag and drop to reorder your rankings
          </p>
          {/* Ranking list will go here */}
        </div>
      </div>
    </div>
  );
}

