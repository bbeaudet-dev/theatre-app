"use client";

import { Id } from "@/convex/_generated/dataModel";

interface RecsTabProps {
  tripId: Id<"trips"> | null;
}

export default function RecsTab({ tripId }: RecsTabProps) {
  return (
    <div className="space-y-2 text-xs">
      <h3 className="font-semibold text-sm mb-2">Recommendations</h3>
      <p className="text-gray-600 dark:text-gray-400 text-center py-8">
        AI-powered recommendations coming soon...
      </p>
    </div>
  );
}

