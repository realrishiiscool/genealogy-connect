import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/app/boutique")({
  component: BoutiquePage,
});

function BoutiquePage() {
  const { profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.boutique_name ?? "");
  const [busy, setBusy] = useState(false);
  const save = async () => {
    setBusy(true);
    const { error } = await supabase.from("profiles").update({ boutique_name: name }).eq("id", profile!.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Boutique updated");
    refreshProfile();
  };
  return (
    <div className="space-y-6 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold">Boutique Profile</h1>
        <p className="mt-1 text-muted-foreground">Manage your boutique presence.</p>
      </div>
      <div className="max-w-xl rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Boutique name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Owner</Label>
            <Input value={profile?.full_name ?? ""} disabled />
          </div>
          <Button onClick={save} disabled={busy} className="bg-gradient-primary text-primary-foreground">
            {busy ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
