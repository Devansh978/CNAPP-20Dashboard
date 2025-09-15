import AddWidgetDialog from "@/components/dashboard/AddWidgetDialog";
import { WidgetCard, AddWidgetPlaceholder } from "@/components/dashboard/WidgetCard";
import { useDashboardStore } from "@/store/dashboard";

export default function CategorySection({ id }: { id: string }) {
  const getCategory = useDashboardStore((s) => s.getCategory);
  const getWidgetsForCategory = useDashboardStore((s) => s.getWidgetsForCategory);
  const removeWidgetFromCategory = useDashboardStore((s) => s.removeWidgetFromCategory);
  const category = getCategory(id)!;
  const widgets = getWidgetsForCategory(id);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{category.name}</h2>
        <AddWidgetDialog categoryId={id} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((w) => (
          <WidgetCard key={w.id} id={w.id} title={w.name} text={w.text} chart={w.chart ?? null} onRemove={(wid) => removeWidgetFromCategory(id, wid)} />
        ))}
        <AddWidgetPlaceholder onClick={() => { /* open via hidden button: use label by id approach would be complex; instead rely on visible button above */ }} />
      </div>
    </section>
  );
}
