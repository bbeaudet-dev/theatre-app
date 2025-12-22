"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/lib/auth-client";

const navItems = [
  { name: "Trip Planner", href: "/trip-planner" },
  { name: "Browse", href: "/browse" },
  { name: "Calendar", href: "/calendar" },
];


export default function Navigation() {
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const currentUserId = useCurrentUser();
  const isAuthenticated = currentUserId !== null && currentUserId !== undefined;

  return (
    <nav className="border-b bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Broadway Pulse
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2 items-center">
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
            {isAuthenticated ? (
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
            ) : (
              <Link
                href="/auth/signin"
                className="px-3 py-2 rounded text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`px-4 py-2 rounded text-base font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "text-zinc-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:text-zinc-800"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <Link
                  href="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className={`px-4 py-2 rounded text-base font-medium transition-colors ${
                    pathname === "/profile"
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                      : "text-zinc-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:text-zinc-800"
                  }`}
                >
                  Profile
                </Link>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setShowMobileMenu(false)}
                  className="px-4 py-2 rounded text-base font-medium text-zinc-600 hover:bg-gray-100 dark:text-zinc-400 dark:hover:text-zinc-800"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
