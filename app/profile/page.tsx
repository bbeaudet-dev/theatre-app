"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TheatreCloud from "./TheatreCloud";
import RankingsManager, { RankingsSearch } from "./RankingsManager";
import ListsManager from "./ListsManager";
import UserPreferences from "./UserPreferences";
import NotifySettings from "../notify/NotifySettings";
import { useSignOut } from "@/lib/auth-client";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signOut = useSignOut();
  const [activeTab, setActiveTab] = useState<
    "rankings" | "lists" | "preferences" | "notify"
  >("rankings");

  useEffect(() => {
    const tab = searchParams?.get("tab");
    if (tab === "lists" || tab === "preferences" || tab === "notify") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: "rankings" | "lists" | "preferences" | "notify") => {
    setActiveTab(tab);
    if (tab === "rankings") {
      router.push("/profile");
    } else {
      router.push(`/profile?tab=${tab}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/browse");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex-1 border-b overflow-x-auto">
        <nav className="flex gap-2 sm:gap-4 min-w-max">
          <button
            onClick={() => handleTabChange("rankings")}
            className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-medium border-b-2 transition-colors whitespace-nowrap ${
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
          <button
            onClick={() => handleTabChange("notify")}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "notify"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            Notifications
          </button>
        </nav>
        </div>
        <button
          onClick={handleSignOut}
          className="ml-4 px-3 py-2 rounded text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 whitespace-nowrap"
        >
          Sign Out
        </button>
      </div>

      {activeTab === "rankings" && (
        <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RankingsManager />
            <RankingsSearch />
          </div>
          <TheatreCloud />
        </div>
      )}
      {activeTab === "lists" && <ListsManager />}
      {activeTab === "preferences" && <UserPreferences />}
      {activeTab === "notify" && <NotifySettings />}
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

