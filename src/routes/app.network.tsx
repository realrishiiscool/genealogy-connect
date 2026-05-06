import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";
import { GenealogyTree } from "@/components/app/GenealogyTree";

export const Route = createFileRoute("/app/network")({
  component: NetworkPage,
});

function NetworkPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.user_type === "admin";
  return (
    <div className="flex h-screen flex-col p-6 md:p-10">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">{isAdmin ? "Customer Genealogy" : "My Network"}</h1>
        <p className="mt-1 text-muted-foreground">
          {isAdmin ? "Complete platform-wide referral tree." : "Your downline — interactive and live."}
        </p>
      </div>
      <div className="flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <GenealogyTree rootId={isAdmin ? undefined : profile!.id} />
      </div>
    </div>
  );
}
