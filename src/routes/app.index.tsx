import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Copy, Share2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

function Dashboard() {
  const { profile, loading: authLoading, signOut, apiBase } = useAuth();
  const nav = useNavigate();
  const [dataLoading, setDataLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, customers: 0, owners: 0, referrals: 0, pending: 0, active: 0, direct: 0, network: 0 });
  const [series, setSeries] = useState<{ day: string; users: number }[]>([]);
  const [parent, setParent] = useState<string | null>(null);

  const role = profile?.user_type;

  useEffect(() => {
    if (!profile || !role) return;

    (async () => {
      try {
        setDataLoading(true);
        const res = await fetch(`${apiBase}/api/dashboard/stats?userId=${profile.id}&role=${role}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error);

        setStats({
          users: data.usersCount,
          customers: data.customersCount,
          owners: data.ownersCount,
          referrals: data.referralsCount,
          pending: data.pendingCount,
          active: data.activeCount,
          direct: data.directCount,
          network: data.networkCount,
        });

        if (data.sponsorName) setParent(data.sponsorName);

        // 14-day growth chart
        const list = data.allUsers;
        const days: { day: string; users: number }[] = [];
        const now = new Date();
        for (let i = 13; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const key = d.toISOString().slice(0, 10);
          const count = list.filter((u: any) => u.created_at?.slice(0, 10) <= key).length;
          days.push({ day: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), users: count });
        }
        setSeries(days);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message);
      } finally {
        setDataLoading(false);
      }
    })();
  }, [profile, role]);

  const referralLink = profile?.referral_code
    ? `${window.location.origin}${window.location.pathname.replace(/\/$/, '')}/#/register?ref=${profile.referral_code}`
    : null;

  const handleShare = async () => {
    if (!referralLink) {
      toast.error("Referral link not available");
      return;
    }
    
    // 1. Immediate Open (to avoid popup blocker)
    try {
      const win = window.open(referralLink, '_blank');
      if (!win) {
        // If blocked, we fallback to clipboard and notify
        toast.info("Popup blocked, but link copied to clipboard!");
      } else {
        toast.success("Opening registration page...");
      }
    } catch (e) {
      console.error("Window open failed", e);
    }

    // 2. Clipboard Copy
    try {
      await navigator.clipboard.writeText(referralLink);
    } catch (err) {
      console.warn("Clipboard copy failed", err);
    }

    // 3. Native Share (Optional mobile experience)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Boutify',
          text: `Use my code ${profile?.referral_code} to join my network!`,
          url: referralLink,
        });
      } catch (err) {
        // Silently ignore share cancellation
      }
    }
  };

  const isLoading = authLoading || dataLoading;

  return (
    <div className="space-y-8 p-6 md:p-10">
      <div className="flex items-start justify-between">
        <div>
          {isLoading ? (
            <>
              <Skeleton className="h-9 w-48 mb-2" />
              <Skeleton className="h-5 w-32" />
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name?.split(" ")[0]}</h1>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {role?.replace("_", " ")}
                </span>
                <span className="text-sm text-muted-foreground">Personalized Dashboard</span>
              </div>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-2xl border border-border p-6 bg-card shadow-soft space-y-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-12" />
            </div>
          ))}
        </div>
      ) : (
        <>
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
                      className="bg-gradient-primary text-primary-foreground shadow-soft"
                      onClick={handleShare}
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
        </>
      )}

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="text-lg font-semibold">Network growth</h2>
        <p className="text-sm text-muted-foreground">Cumulative platform users (14 days)</p>
        <div className="mt-6 h-64">
          {isLoading ? (
            <Skeleton className="w-full h-full rounded-xl" />
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
