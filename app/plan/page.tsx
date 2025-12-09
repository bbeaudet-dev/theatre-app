import PlanView from "@/components/plan/PlanView";

export default function PlanPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Plan</h1>
      <p className="text-gray-600 mb-6">
        Plan your theatre trip! See show schedules, ticket options (rush,
        lottery, student discounts), and availability at a glance.
      </p>
      <PlanView />
    </div>
  );
}

