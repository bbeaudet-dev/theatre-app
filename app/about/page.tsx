import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-zinc-900 dark:text-zinc-50">
          About Broadway Pulse
        </h1>
        
        <div className="space-y-6 text-base sm:text-lg text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="text-2xl font-semibold mb-3 text-zinc-900 dark:text-zinc-50">
              Our Mission
            </h2>
            <p>
              Broadway Pulse is dedicated to improving the accessibility and enjoyment of theatre.
              We believe that everyone should have the opportunity to discover, explore, and 
              connect with the vibrant world of Broadway, Off-Broadway, and theatre productions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-zinc-900 dark:text-zinc-50">
              Our Story
            </h2>
            <p>
              Built by software engineer and theatre enthusiast <strong>Ben B.</strong> and his wife and product manager <strong>Sophia</strong>, Broadway Pulse is a passion project that helps everyone enjoy the magic of theatre, from helping first-timers discover their first show without breaking the bank, to giving seasoned theatre-goers new ways to share their favorites and plan out entire trips. 
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3 text-zinc-900 dark:text-zinc-50">
              Special Thanks
            </h2>
            <p>
              A heartfelt shoutout to <strong>Rose</strong> for igniting our love of New York 
              City and Broadway, and to <strong>Eric</strong> for being our resident "expert", and for introducing us to Marie's Crisis. 
            </p>
          </section>

          <div className="pt-6">
            <Link 
              href="/" 
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

