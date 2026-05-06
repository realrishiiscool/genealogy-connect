import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AppShell } from "@/components/app/AppShell";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const { user, loading, profile } = useAuth();
  const nav = useNavigate();
  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [user, loading, nav]);

  if (loading || !user || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-hero">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
