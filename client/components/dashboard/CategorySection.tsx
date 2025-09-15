import { useState } from "react";
import AddWidgetDialog from "@/components/dashboard/AddWidgetDialog";
import { WidgetCard, AddWidgetPlaceholder } from "@/components/dashboard/WidgetCard";
import { useDashboardStore } from "@/store/dashboard";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

export default function CategorySection({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const getCategory = useDashboardStore((s) => s.getCategory);
  const getWidgetsForCategory = useDashboardStore((s) => s.getWidgetsForCategory);
  const removeWidgetFromCategory = useDashboardStore((s) => s.removeWidgetFromCategory);
  const category = getCategory(id)!;
  const widgets = getWidgetsForCategory(id);

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{category.name}</h2>
        <AddWidgetDialog
          categoryId={id}
          open={open}
          onOpenChange={setOpen}
          trigger={<Button size="sm" className="rounded-full">+ Add Widget</Button>}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {widgets.map((w) => (
          <WidgetCard
            key={w.id}
            id={w.id}
            title={w.name}
            text={w.text}
            chart={w.chart ?? null}
            onRemove={(wid) => {
              removeWidgetFromCategory(id, wid);
              toast({ title: "Widget removed", description: `${w.name} removed from ${category.name}` });
            }}
          />
        ))}
        <AddWidgetPlaceholder onClick={() => setOpen(true)} />
      </div>
    </section>
  );
}
