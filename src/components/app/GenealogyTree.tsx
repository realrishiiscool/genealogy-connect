import { useEffect, useMemo, useState } from "react";
import { ReactFlow, Background, Controls, MiniMap, type Node, type Edge, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useAuth, type Profile } from "@/contexts/AuthContext";

type Customer = Pick<Profile, "id" | "full_name" | "referral_code" | "referred_by" | "status" | "created_at" | "mobile">;

function CustomerNode({ data }: { data: { name: string; code: string | null; refs: number; status: string; date: string; root?: boolean; mobile?: string | null; depth: number } }) {
  const statusColor =
    data.status === "active" ? "bg-emerald-500" : data.status === "pending" ? "bg-amber-500" : "bg-rose-500";

  // Only show details (mobile, code) for level 0 (root) and level 1
  const showDetails = data.depth < 2;

  return (
    <div className={`min-w-[220px] rounded-2xl border ${data.root ? "border-transparent bg-gradient-primary text-primary-foreground shadow-elegant" : "border-border bg-card shadow-soft"} p-5`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${data.root ? "bg-white/20" : "bg-gradient-primary text-primary-foreground"}`}>
          {data.name[0]?.toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-base font-bold">{data.name}</div>
          {showDetails && (
            <div className={`truncate font-mono text-xs ${data.root ? "opacity-90" : "text-muted-foreground"}`}>{data.code ?? "—"}</div>
          )}
        </div>
      </div>
      {showDetails && data.mobile && (
        <div className={`mt-3 text-sm font-semibold ${data.root ? "opacity-90" : "text-foreground"}`}>
          {data.mobile}
        </div>
      )}
      <div className={`mt-4 flex items-center justify-between text-xs ${data.root ? "opacity-90" : "text-muted-foreground"}`}>
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className={`h-2.5 w-2.5 rounded-full ${statusColor}`} />
          {data.status}
        </span>
        <span className="font-medium">{data.refs} network members</span>
      </div>
      {showDetails && (
        <div className={`mt-2 text-[10px] uppercase tracking-widest font-semibold ${data.root ? "opacity-75" : "text-muted-foreground"}`}>
          Member since {new Date(data.date).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { customer: CustomerNode };

export function GenealogyTree({ rootId }: { rootId?: string }) {
  const { apiBase } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiBase}/api/dashboard/stats`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        const customerProfiles = data.allUsers.filter((u: any) => u.user_type === "customer");
        setCustomers(customerProfiles);
      } catch (error) {
        console.error("Error fetching network:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [apiBase]);

  const { nodes, edges } = useMemo(() => {
    if (!customers.length) return { nodes: [] as Node[], edges: [] as Edge[] };
    const byParent = new Map<string | null, Customer[]>();
    customers.forEach((c) => {
      const key = c.referred_by || null;
      if (!byParent.has(key)) byParent.set(key, []);
      byParent.get(key)!.push(c);
    });
    const refCount = (id: string) => (byParent.get(id)?.length ?? 0);

    // Determine roots: if rootId, just that user; else all with no parent (top of tree)
    const roots: Customer[] = rootId
      ? customers.filter((c) => c.id === rootId)
      : customers.filter((c) => !c.referred_by);

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const HSPACE = 250;
    const VSPACE = 170;

    function layout(node: Customer, depth: number, xOffset: number, isRoot: boolean): number {
      const children = byParent.get(node.id) ?? [];
      let width = 0;
      const childPositions: number[] = [];
      
      if (children.length === 0) {
        width = 1.2; // Increase width for leaf nodes
      } else {
        let currentX = xOffset;
        for (const ch of children) {
          const w = layout(ch, depth + 1, currentX, false);
          childPositions.push(currentX + w / 2);
          currentX += w;
          width += w;
        }
      }

      const myX = children.length === 0 ? xOffset + width / 2 : (childPositions[0] + childPositions[childPositions.length - 1]) / 2;
      
      nodes.push({
        id: node.id,
        type: "customer",
        position: { x: myX * 280, y: depth * 220 }, // Increased spacing
        data: {
          name: node.full_name,
          code: node.referral_code,
          refs: refCount(node.id),
          status: node.status,
          date: node.created_at,
          root: isRoot,
          mobile: node.mobile,
          depth: depth,
        },
      });

      for (const ch of children) {
        edges.push({
          id: `${node.id}-${ch.id}`,
          source: node.id,
          target: ch.id,
          type: "step", // Changed to 'step' for a more classic tree look
          animated: true,
          style: { stroke: "oklch(0.6 0.2 295)", strokeWidth: 3 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "oklch(0.6 0.2 295)", width: 20, height: 20 },
        });
      }
      return width;
    }

    let x = 0;
    for (const r of roots) {
      const w = layout(r, 0, x, true);
      x += w + 1;
    }
    return { nodes, edges };
  }, [customers, rootId]);

  if (loading) return <div className="flex h-full items-center justify-center text-muted-foreground">Loading network…</div>;
  if (!nodes.length)
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
        <div className="text-lg font-medium text-foreground">No referrals yet</div>
        <div className="text-sm">Share your referral code to start growing your network.</div>
      </div>
    );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      proOptions={{ hideAttribution: true }}
      minZoom={0.2}
    >
      <Background gap={24} size={1.5} color="oklch(0.9 0.01 290)" />
      <Controls className="!bg-background/80 !backdrop-blur-md !border-border/50 !shadow-soft !rounded-xl" />
      <MiniMap pannable zoomable className="!bg-transparent !border-transparent" nodeColor={() => "oklch(0.6 0.2 295)"} />
    </ReactFlow>
  );
}
