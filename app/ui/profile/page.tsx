"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TheatreCloud from "./TheatreCloud";
import RankingsManager from "./RankingsManager";
import ListsManager from "./ListsManager";
import UserPreferences from "./UserPreferences";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    "rankings" | "lists" | "preferences"
  >("rankings");

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "lists" || tab === "preferences") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: "rankings" | "lists" | "preferences") => {
    setActiveTab(tab);
    if (tab === "rankings") {
      router.push("/ui/profile");
    } else {
      router.push(`/ui/profile?tab=${tab}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Profile & Rankings</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Record and rank all the shows you've seen. Create your theatre cloud
        and manage your preferences.
      </p>

      <div className="border-b mb-6">
        <nav className="flex gap-4">
          <button
            onClick={() => handleTabChange("rankings")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "rankings"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Rankings
          </button>
          <button
            onClick={() => handleTabChange("lists")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "lists"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Lists
          </button>
          <button
            onClick={() => handleTabChange("preferences")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "preferences"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Preferences
          </button>
        </nav>
      </div>

      {activeTab === "rankings" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TheatreCloud />
          <RankingsManager />
        </div>
      )}
      {activeTab === "lists" && <ListsManager />}
      {activeTab === "preferences" && <UserPreferences />}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-6">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}

