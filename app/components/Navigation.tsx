"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Browse", href: "/browse" },
  { name: "Trip Planner", href: "/trip-planner" },
  { name: "Calendar", href: "/calendar" },
];


export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNewTrip = () => {
    router.push("/trip-planner");
    setShowDropdown(false);
  };

  const handleNewList = () => {
    router.push("/profile?tab=lists");
    setShowDropdown(false);
  };

  const handleAddShow = () => {
    router.push("/browse");
    setShowDropdown(false);
  };

  return (
    <nav className="border-b bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Theatre News
          </Link>
          <div className="flex gap-2 items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex-1" />
            <Link
              href="/profile"
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                pathname === "/profile"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              Profile
            </Link>
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="px-3 py-2 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <span>+</span>
              </button>
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border rounded-lg shadow-lg z-20">
                    <div className="py-1">
                      <button
                        onClick={handleNewTrip}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm"
                      >
                        New Trip
                      </button>
                      <button
                        onClick={handleNewList}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm"
                      >
                        Create List
                      </button>
                      <button
                        onClick={handleAddShow}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-sm"
                      >
                        Add a Show
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

