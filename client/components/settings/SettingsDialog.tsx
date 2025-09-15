import { ReactNode, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDashboardStore } from "@/store/dashboard";

export default function SettingsDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const resetToDefaults = useDashboardStore((s) => s.resetToDefaults);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your dashboard preferences.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="rounded-md border p-3">
            <div className="font-medium mb-1">Reset Dashboard</div>
            <p className="text-sm text-muted-foreground mb-3">Restore default categories and widgets. This clears local changes.</p>
            <Button
              variant="destructive"
              onClick={() => {
                try { localStorage.removeItem("dashboard-store"); } catch {}
                resetToDefaults();
                location.reload();
              }}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
