import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/contexts/AuthContext";

export const Route = createFileRoute("/app/customers")({
  component: CustomersPage,
});

function CustomersPage() {
  const [customers, setCustomers] = useState<Profile[]>([]);
  useEffect(() => {
    supabase.from("profiles").select("*").eq("user_type", "customer").order("created_at", { ascending: false })
      .then(({ data }) => setCustomers((data ?? []) as Profile[]));
  }, []);
  return (
    <div className="space-y-6 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="mt-1 text-muted-foreground">All customers active on the platform.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {customers.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:shadow-elegant">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold text-primary-foreground">
                {c.full_name[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="truncate font-semibold">{c.full_name}</div>
                <div className="truncate text-xs text-muted-foreground">{c.email}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono">{c.referral_code}</span>
              <span className="capitalize">{c.status}</span>
            </div>
          </div>
        ))}
        {!customers.length && <div className="text-muted-foreground">No customers yet.</div>}
      </div>
    </div>
  );
}
