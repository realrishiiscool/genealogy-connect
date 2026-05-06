import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/app/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { profile } = useAuth();
  return (
    <div className="space-y-6 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="mt-1 text-muted-foreground">Your account details.</p>
      </div>
      <div className="max-w-xl space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="space-y-2"><Label>Full name</Label><Input value={profile?.full_name ?? ""} disabled /></div>
        <div className="space-y-2"><Label>Email</Label><Input value={profile?.email ?? ""} disabled /></div>
        <div className="space-y-2"><Label>Mobile</Label><Input value={profile?.mobile ?? ""} disabled /></div>
        <div className="space-y-2"><Label>Account type</Label><Input value={profile?.user_type.replace("_", " ") ?? ""} disabled className="capitalize" /></div>
        {profile?.referral_code && (
          <div className="space-y-2"><Label>Referral code</Label><Input value={profile.referral_code} disabled className="font-mono" /></div>
        )}
      </div>
    </div>
  );
}
