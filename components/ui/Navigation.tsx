"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Calendar", href: "/calendar" },
  { name: "Notify", href: "/notify" },
  { name: "Preview", href: "/preview" },
  { name: "Plan", href: "/plan" },
  { name: "Profile", href: "/profile" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            Theatre News
          </Link>
          <div className="flex gap-6">
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
          </div>
        </div>
      </div>
    </nav>
  );
}

