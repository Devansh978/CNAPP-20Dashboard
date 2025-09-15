import { PropsWithChildren } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppShell({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={cn("min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800", className)}>
      <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
          <div className="font-extrabold tracking-tight text-xl text-primary">CNAPP Dashboard</div>
          <div className="flex-1" />
          <div className="hidden md:block w-72">
            <Input placeholder="Search anything..." className="rounded-full" />
          </div>
          <Button variant="secondary" className="rounded-full">Settings</Button>
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => {
              try {
                localStorage.removeItem("dashboard-store");
              } catch {}
              location.reload();
            }}
          >
            Reset
          </Button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
export default AppShell;
