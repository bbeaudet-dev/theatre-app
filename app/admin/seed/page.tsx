"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function SeedPage() {
  const seedMockData = useMutation(api.seed.seedMockData);
  const [isSeeding, setIsSeeding] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSeed = async () => {
    setIsSeeding(true);
    setResult(null);
    try {
      await seedMockData({});
      setResult("✅ Database seeded successfully! You can now test all features.");
    } catch (error) {
      setResult(`❌ Error seeding database: ${error}`);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Seed Database</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        This will create a test user and 15 mock shows for development and testing.
      </p>
      
      <button
        onClick={handleSeed}
        disabled={isSeeding}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSeeding ? "Seeding..." : "Seed Database"}
      </button>

      {result && (
        <div className={`mt-4 p-4 rounded ${result.startsWith("✅") ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
          <p>{result}</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h2 className="font-semibold mb-2">What gets created:</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
          <li>1 test user (Test User, test@example.com)</li>
          <li>15 mock shows (Hamilton, Wicked, Hadestown, etc.)</li>
          <li>Shows include: titles, theatres, districts, showtimes, dates, descriptions, images</li>
        </ul>
      </div>
    </div>
  );
}

