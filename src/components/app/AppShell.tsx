import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Network, LayoutDashboard, GitBranch, Users, Settings, LogOut, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function AppShell({ children }: { children: ReactNode }) {
  const { profile, signOut, loading } = useAuth();
  const nav = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  const role = profile?.user_type;
  const items: { to: string; label: string; icon: any }[] = [
    { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  ];

  if (profile) {
    if (role === "customer") {
      items.push({ to: "/app/network", label: "My Network", icon: GitBranch });
    }
    if (role === "admin") {
      items.push({ to: "/users", label: "Users", icon: Users });
      items.push({ to: "/app/network", label: "Genealogy", icon: GitBranch });
    }
    if (role === "boutique_owner") {
      items.push({ to: "/app/customers", label: "Customers", icon: Users });
      items.push({ to: "/app/boutique", label: "Boutique", icon: Store });
    }
  }
  
  items.push({ to: "/app/settings", label: "Settings", icon: Settings });

  return (
    <div className="flex min-h-screen bg-gradient-soft">
      <aside className="hidden w-64 flex-col border-r border-border bg-sidebar md:flex">
        <Link to="/" className="flex items-center gap-2 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-soft">
            <Network className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold">Bouti<span className="text-gradient-primary">fy</span></span>
        </Link>
        <nav className="flex-1 space-y-1 px-3">
          {items.map((it) => {
            const active = path === it.to;
            return (
              <Link
                key={it.to}
                to={it.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-gradient-primary text-primary-foreground shadow-soft"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <it.icon className="h-4 w-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg p-2">
            {!profile && loading ? (
              <>
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="space-y-1 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </>
            ) : (
              <>
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                  {profile?.full_name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{profile?.full_name ?? "User"}</div>
                  <div className="truncate text-xs text-muted-foreground capitalize">{role?.replace("_", " ") ?? "Loading..."}</div>
                </div>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={async () => {
              await signOut();
              nav({ to: "/" });
            }}
          >
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}

export function StatCard({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-2xl border border-border p-6 shadow-soft ${accent ? "bg-gradient-primary text-primary-foreground" : "bg-card"}`}>
      <div className={`text-xs font-medium uppercase tracking-wide ${accent ? "opacity-90" : "text-muted-foreground"}`}>{label}</div>
      <div className="mt-2 text-3xl font-bold">{value}</div>
    </div>
  );
}
