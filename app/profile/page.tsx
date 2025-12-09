import TheatreCloud from "@/components/profile/TheatreCloud";
import UserPreferences from "@/components/profile/UserPreferences";

export default function ProfilePage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Profile & Rankings</h1>
      <p className="text-gray-600 mb-6">
        Record and rank all the shows you've seen. Create your theatre cloud
        and manage your preferences.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TheatreCloud />
        <UserPreferences />
      </div>
    </div>
  );
}

