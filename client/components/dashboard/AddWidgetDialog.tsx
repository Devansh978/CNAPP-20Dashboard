import { ReactNode, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { useDashboardStore } from "@/store/dashboard";

export default function AddWidgetDialog({ categoryId, open: controlledOpen, onOpenChange, trigger }: { categoryId: string; open?: boolean; onOpenChange?: (o: boolean) => void; trigger?: ReactNode }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const addWidgetToCategory = useDashboardStore((s) => s.addWidgetToCategory);
  const toggleWidgetInCategory = useDashboardStore((s) => s.toggleWidgetInCategory);
  const getAllWidgets = useDashboardStore((s) => s.getAllWidgets);
  const getCategory = useDashboardStore((s) => s.getCategory);
  const setSearchQuery = useDashboardStore((s) => s.setSearchQuery);
  const searchQuery = useDashboardStore((s) => s.searchQuery);

  const category = getCategory(categoryId)!;
  const widgets = getAllWidgets();

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return widgets;
    return widgets.filter((w) => w.name.toLowerCase().includes(q) || w.text.toLowerCase().includes(q));
  }, [searchQuery, widgets]);

  const [name, setName] = useState("");
  const [text, setText] = useState("");

  function createWidget() {
    if (!name.trim()) return;
    addWidgetToCategory(categoryId, { name: name.trim(), text: text.trim() || "New widget" });
    setName("");
    setText("");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button size="sm" className="rounded-full">+ Add Widget</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Widget to {category.name}</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="create">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
          </TabsList>
          <TabsContent value="create" className="space-y-3 pt-3">
            <Input placeholder="Widget name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Widget text" value={text} onChange={(e) => setText(e.target.value)} />
            <DialogFooter>
              <Button onClick={createWidget} className="ml-auto">Add</Button>
            </DialogFooter>
          </TabsContent>
          <TabsContent value="library" className="space-y-3 pt-3">
            <Input
              placeholder="Search widgets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="max-h-72 overflow-auto pr-2 space-y-2">
              {filtered.map((w) => {
                const checked = category.widgetIds.includes(w.id);
                return (
                  <label key={w.id} className="flex items-start gap-3 px-2 py-2 rounded-md hover:bg-muted cursor-pointer">
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => toggleWidgetInCategory(categoryId, w.id, Boolean(v))}
                    />
                    <div>
                      <div className="font-medium leading-tight">{w.name}</div>
                      <div className="text-xs text-muted-foreground">{w.text}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            <DialogFooter>
              <Button onClick={() => setOpen(false)} className="ml-auto">Done</Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
