import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Network } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Sign up — Boutify" }] }),
  component: Register,
});

function Register() {
  const nav = useNavigate();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<"customer" | "boutique_owner">("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [referral, setReferral] = useState("");
  const [boutiqueName, setBoutiqueName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) nav({ to: "/app" });
  }, [user, loading, nav]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/app`,
        data: {
          full_name: fullName,
          mobile,
          user_type: tab,
          referral_code_input: referral.trim() || null,
          boutique_name: tab === "boutique_owner" ? boutiqueName : null,
        },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! Welcome.");
    nav({ to: "/app" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-soft">
            <Network className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Bouti<span className="text-gradient-primary">fy</span></span>
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-elegant">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Start growing your network today</p>

          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="customer">Customer</TabsTrigger>
              <TabsTrigger value="boutique_owner">Boutique Owner</TabsTrigger>
            </TabsList>
            <TabsContent value={tab} className="mt-0" />
          </Tabs>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fn">Full name</Label>
              <Input id="fn" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            {tab === "boutique_owner" && (
              <div className="space-y-2">
                <Label htmlFor="bn">Boutique name</Label>
                <Input id="bn" required value={boutiqueName} onChange={(e) => setBoutiqueName(e.target.value)} />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="em">Email</Label>
              <Input id="em" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mob">Mobile</Label>
              <Input id="mob" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw">Password</Label>
              <Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {tab === "customer" && (
              <div className="space-y-2">
                <Label htmlFor="rf">Referral code <span className="text-muted-foreground">(optional)</span></Label>
                <Input id="rf" value={referral} onChange={(e) => setReferral(e.target.value.toUpperCase())} placeholder="e.g. AB12CD34" />
              </div>
            )}
            <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-primary-foreground shadow-soft hover:shadow-elegant">
              {busy ? "Creating…" : "Create account"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
