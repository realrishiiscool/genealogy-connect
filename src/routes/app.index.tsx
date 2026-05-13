import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Copy, Share2 } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const { profile } = useAuth();
  const role = profile!.user_type;

  const [stats, setStats] = useState({ users: 0, customers: 0, owners: 0, referrals: 0, pending: 0, active: 0, direct: 0, network: 0 });
  const [series, setSeries] = useState<{ day: string; users: number }[]>([]);
  const [parent, setParent] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: all } = await supabase.from("profiles").select("id, user_type, status, referred_by, created_at");
      const list = all ?? [];
      const customers = list.filter((u) => u.user_type === "customer");
      const owners = list.filter((u) => u.user_type === "boutique_owner");
      const pending = list.filter((u) => u.status === "pending").length;
      const active = list.filter((u) => u.status === "active").length;
      const referrals = customers.filter((u) => u.referred_by).length;

      // build downline for current customer
      let direct = 0, network = 0;
      if (role === "customer") {
        const map = new Map<string, string[]>();
        customers.forEach((c) => {
          if (c.referred_by) {
            if (!map.has(c.referred_by)) map.set(c.referred_by, []);
            map.get(c.referred_by)!.push(c.id);
          }
        });
        const queue = [{ id: profile!.id, depth: 0 }];
        const visited = new Set<string>();
        while (queue.length) {
          const curr = queue.shift()!;
          for (const ch of map.get(curr.id) ?? []) {
            if (visited.has(ch)) continue;
            visited.add(ch);
            if (curr.depth + 1 < 3) {
              queue.push({ id: ch, depth: curr.depth + 1 });
            }
            if (curr.id === profile!.id) direct++;
          }
        }
        network = visited.size;
        // sponsor
        if (profile!.referred_by) {
          const { data: p } = await supabase.from("profiles").select("full_name").eq("id", profile!.referred_by).maybeSingle();
          setParent(p?.full_name ?? null);
        }
      }

      setStats({
        users: list.length, customers: customers.length, owners: owners.length, referrals,
        pending, active, direct, network,
      });

      // 14-day growth
      const days: { day: string; users: number }[] = [];
      const now = new Date();
      for (let i = 13; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const count = list.filter((u) => u.created_at.slice(0, 10) <= key).length;
        days.push({ day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), users: count });
      }
      setSeries(days);
    })();
  }, [profile, role]);

  const referralLink = profile?.referral_code
    ? `${window.location.origin}${window.location.pathname}#/register?ref=${profile.referral_code}`
    : null;

  return (
    <div className="space-y-8 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {profile?.full_name?.split(" ")[0]}</h1>
        <p className="mt-1 text-muted-foreground capitalize">{role.replace("_", " ")} dashboard</p>
      </div>

      {role === "admin" && (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total Users" value={stats.users} accent />
          <StatCard label="Customers" value={stats.customers} />
          <StatCard label="Boutique Owners" value={stats.owners} />
          <StatCard label="Referrals" value={stats.referrals} />
          <StatCard label="Active" value={stats.active} />
          <StatCard label="Pending" value={stats.pending} />
        </div>
      )}

      {role === "boutique_owner" && (
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Total Customers" value={stats.customers} accent />
          <StatCard label="Active" value={stats.active} />
          <StatCard label="New (30d)" value={stats.customers} />
          <StatCard label="Network Activity" value={stats.referrals} />
        </div>
      )}

      {role === "customer" && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard label="Direct Referrals" value={stats.direct} accent />
            <StatCard label="Network Size" value={stats.network} />
            <StatCard label="Sponsor" value={parent ?? "—"} />
            <StatCard label="Status" value={profile!.status} />
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Your referral code</div>
                <div className="mt-1 font-mono text-2xl font-bold text-gradient-primary">{profile!.referral_code}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(profile!.referral_code!);
                    toast.success("Code copied");
                  }}
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy code
                </Button>
                <Button
                  className="bg-gradient-primary text-primary-foreground"
                  onClick={() => {
                    if (referralLink) {
                      navigator.clipboard.writeText(referralLink);
                      toast.success("Referral link copied");
                    }
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" /> Share link
                </Button>
              </div>
            </div>
            {referralLink && (
              <div className="mt-4 truncate rounded-lg bg-muted px-3 py-2 font-mono text-xs text-muted-foreground">{referralLink}</div>
            )}
          </div>
        </>
      )}

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-lg font-semibold">Network growth</h2>
        <p className="text-sm text-muted-foreground">Cumulative platform users (14 days)</p>
        <div className="mt-6 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="oklch(0.55 0.22 295)" />
                  <stop offset="100%" stopColor="oklch(0.72 0.18 50)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.02 290)" />
              <XAxis dataKey="day" stroke="oklch(0.5 0.03 280)" fontSize={12} />
              <YAxis stroke="oklch(0.5 0.03 280)" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid oklch(0.92 0.02 290)" }} />
              <Line type="monotone" dataKey="users" stroke="url(#g1)" strokeWidth={3} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
