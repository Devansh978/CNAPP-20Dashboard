import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChartWidget, { ChartConfig } from "@/components/dashboard/ChartWidget";

export type WidgetCardProps = {
  id: string;
  title: string;
  text: string;
  chart?: ChartConfig | null;
  onRemove?: (id: string) => void;
};

export function WidgetCard({ id, title, text, chart, onRemove }: WidgetCardProps) {
  return (
    <Card className="relative shadow-sm hover:shadow-md transition-shadow">
      {onRemove && (
        <button
          aria-label={`Remove ${title}`}
          onClick={() => onRemove(id)}
          className="absolute right-2 top-2 text-slate-400 hover:text-slate-700"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {chart ? (
          <div className="h-48">
            <ChartWidget config={chart} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function AddWidgetPlaceholder({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-full min-h-[140px] w-full border-2 border-dashed rounded-xl text-slate-500 hover:text-slate-700 hover:border-slate-300 grid place-items-center bg-white/60"
    >
      + Add Widget
    </button>
  );
}
