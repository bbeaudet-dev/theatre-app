"use client";

import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import TripListTab from "./TripPlanningPanel/TripListTab";
import FindTab from "./TripPlanningPanel/FindTab";
import UserListsTab from "./TripPlanningPanel/UserListsTab";

interface TripPlanningPanelProps {
  tripId: Id<"trips">;
}

type Tab = "trip-list" | "find" | "user-lists";

export default function TripPlanningPanel({ tripId }: TripPlanningPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("trip-list");

  return (
    <div className="w-1/3 border-l bg-gray-50 dark:bg-zinc-900 flex flex-col min-h-screen">
      {/* Tab Selector */}
      <div className="border-b bg-white dark:bg-zinc-800 p-2">
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab("trip-list")}
            className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
              activeTab === "trip-list"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600"
            }`}
          >
            Trip List
          </button>
          <button
            onClick={() => setActiveTab("find")}
            className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
              activeTab === "find"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600"
            }`}
          >
            Find
          </button>
          <button
            onClick={() => setActiveTab("user-lists")}
            className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
              activeTab === "user-lists"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-600"
            }`}
          >
            My Lists
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "trip-list" && <TripListTab tripId={tripId} />}
        {activeTab === "find" && <FindTab tripId={tripId} />}
        {activeTab === "user-lists" && <UserListsTab tripId={tripId} />}
      </div>
    </div>
  );
}

