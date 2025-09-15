import AppShell from "@/components/layout/AppShell";
import CategorySection from "@/components/dashboard/CategorySection";
import { useDashboardStore } from "@/store/dashboard";

export default function Index() {
  const order = useDashboardStore((s) => s.categoryOrder);
  return (
    <AppShell>
      <h1 className="text-2xl font-bold mb-4">CNAPP Dashboard</h1>
      {order.map((id) => (
        <CategorySection key={id} id={id} />
      ))}
    </AppShell>
  );
}
