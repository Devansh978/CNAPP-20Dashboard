import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import AppShell from "@/components/layout/AppShell";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <AppShell>
      <div className="py-24 text-center">
        <h1 className="text-5xl font-extrabold mb-2">404</h1>
        <p className="text-lg text-muted-foreground mb-6">Page not found</p>
        <a href="/" className="text-primary underline font-medium">
          Return to Home
        </a>
      </div>
    </AppShell>
  );
};

export default NotFound;
