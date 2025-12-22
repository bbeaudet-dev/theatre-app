import NotifySettings from "./NotifySettings";

export default function NotifyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Notify</h1>
      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
        Stay up to date on shows you're interested in. Get notified about
        openings, closings, cast changes, news, and reviews via email or SMS.
      </p>
      <NotifySettings />
    </div>
  );
}

