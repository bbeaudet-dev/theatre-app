import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-black dark:to-zinc-900">
      <main className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">
            Theatre News
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Your complete guide to Broadway, Off-Broadway, and theatre
            productions. Stay informed, get recommendations, and plan your
            perfect theatre experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard
            title="Browse"
            description="Discover shows, search for specific productions, and manage your lists."
            href="/ui/browse"
          />
          <FeatureCard
            title="Trip Planner"
            description="Plan your theatre trip with show schedules and ticket options at a glance."
            href="/ui/trip-planner"
          />
          <FeatureCard
            title="Calendar"
            description="View all shows currently running. Filter by location and add to Google Calendar."
            href="/ui/calendar"
          />
          <FeatureCard
            title="Profile & Rankings"
            description="Record and rank all the shows you've seen. Create your theatre cloud and manage notifications."
            href="/ui/profile"
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:shadow-lg transition-shadow"
    >
      <h2 className="text-2xl font-semibold mb-2 text-zinc-900 dark:text-zinc-50">
        {title}
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
    </Link>
  );
}
