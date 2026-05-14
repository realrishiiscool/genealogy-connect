import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Profile } from "@/contexts/AuthContext";

export const Route = createFileRoute("/app/users")({
  component: UsersPage,
});

function UsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "customer" | "boutique_owner">("all");

  const load = async () => {
    try {
      const qQuery = query(collection(db, "profiles"), orderBy("created_at", "desc"));
      const snapshot = await getDocs(qQuery);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Profile));
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: "active" | "restricted") => {
    try {
      await updateDoc(doc(db, "profiles", id), { status });
      toast.success(`User ${status}`);
      load();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filtered = users.filter((u) => {
    if (filter !== "all" && u.user_type !== filter) return false;
    if (!q) return true;
    return u.full_name.toLowerCase().includes(q.toLowerCase()) || (u.mobile && u.mobile.includes(q));
  });

  return (
    <div className="space-y-6 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="mt-1 text-muted-foreground">Manage all users across the platform.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Input className="max-w-xs" placeholder="Search name or mobile…" value={q} onChange={(e) => setQ(e.target.value)} />
        {(["all", "customer", "boutique_owner"] as const).map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className={filter === f ? "bg-gradient-primary text-primary-foreground" : ""}>
            {f.replace("_", " ")}
          </Button>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{u.full_name}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.mobile ?? "—"}</td>
                <td className="px-4 py-3 capitalize">{u.user_type.replace("_", " ")}</td>
                <td className="px-4 py-3 font-mono text-xs">
                  {u.referral_code ? (
                    <button
                      className="text-primary hover:underline"
                      onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#/register?ref=${u.referral_code}`);
                        toast.success("Referral link copied!");
                      }}

                    >
                      {u.referral_code}
                    </button>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
                    u.status === "active" ? "bg-emerald-100 text-emerald-700" :
                    u.status === "pending" ? "bg-amber-100 text-amber-700" :
                    "bg-rose-100 text-rose-700"
                  }`}>{u.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {u.status === "active" ? (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(u.id, "restricted")}>Restrict</Button>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(u.id, "active")}>Activate</Button>
                  )}
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
