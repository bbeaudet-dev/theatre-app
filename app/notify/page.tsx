import NotifySettings from "./NotifySettings";

export default function NotifyPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Notify</h1>
      <p className="text-gray-600 mb-6">
        Stay up to date on shows you're interested in. Get notified about
        openings, closings, cast changes, news, and reviews via email or SMS.
      </p>
      <NotifySettings />
    </div>
  );
}

