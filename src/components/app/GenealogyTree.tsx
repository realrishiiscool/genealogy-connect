import { useEffect, useMemo, useState } from "react";
import { ReactFlow, Background, Controls, MiniMap, type Node, type Edge, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import type { Profile } from "@/contexts/AuthContext";

type Customer = Pick<Profile, "id" | "full_name" | "referral_code" | "referred_by" | "status" | "created_at" | "mobile">;

function CustomerNode({ data }: { data: { name: string; code: string | null; refs: number; status: string; date: string; root?: boolean; mobile?: string | null; depth: number } }) {
  const statusColor =
    data.status === "active" ? "bg-emerald-500" : data.status === "pending" ? "bg-amber-500" : "bg-rose-500";

  if (data.depth >= 2) {
    return (
      <div className="min-w-[210px] rounded-2xl border border-border bg-card shadow-soft p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold bg-gradient-primary text-primary-foreground">
            {data.name[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{data.name}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-w-[210px] rounded-2xl border ${data.root ? "border-transparent bg-gradient-primary text-primary-foreground shadow-elegant" : "border-border bg-card shadow-soft"} p-4`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${data.root ? "bg-white/20" : "bg-gradient-primary text-primary-foreground"}`}>
          {data.name[0]?.toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{data.name}</div>
          <div className={`truncate font-mono text-xs ${data.root ? "opacity-90" : "text-muted-foreground"}`}>{data.code ?? "—"}</div>
        </div>
      </div>
      {data.mobile && (
        <div className={`mt-2 text-sm font-medium ${data.root ? "opacity-90" : "text-foreground"}`}>
          {data.mobile}
        </div>
      )}
      <div className={`mt-3 flex items-center justify-between text-xs ${data.root ? "opacity-90" : "text-muted-foreground"}`}>
        <span className="inline-flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${statusColor}`} />
          {data.status}
        </span>
        <span>{data.refs} refs</span>
      </div>
      <div className={`mt-1 text-[10px] uppercase tracking-wide ${data.root ? "opacity-75" : "text-muted-foreground"}`}>
        Joined {new Date(data.date).toLocaleDateString()}
      </div>
    </div>
  );
}

const nodeTypes = { customer: CustomerNode };

export function GenealogyTree({ rootId }: { rootId?: string }) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, "profiles"), where("user_type", "==", "customer"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer));
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching network:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

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
      const children = depth < 3 ? (byParent.get(node.id) ?? []) : [];
      let width = 0;
      const childPositions: number[] = [];
      if (children.length === 0) width = 1;
      else {
        for (const ch of children) {
          const w = layout(ch, depth + 1, xOffset + width, false);
          childPositions.push(xOffset + width + w / 2 - 0.5);
          width += w;
        }
      }
      const myX = children.length === 0 ? xOffset : (childPositions[0] + childPositions[childPositions.length - 1]) / 2;
      nodes.push({
        id: node.id,
        type: "customer",
        position: { x: myX * HSPACE, y: depth * VSPACE },
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
          type: "smoothstep",
          animated: true,
          style: { stroke: "oklch(0.6 0.2 295)", strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: "oklch(0.6 0.2 295)" },
        });
      }
      return Math.max(width, 1);
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
      <Background gap={24} size={1.5} color="oklch(0.85 0.04 290)" />
      <Controls className="!bg-card !border-border" />
      <MiniMap pannable zoomable className="!bg-card !border-border" nodeColor={() => "oklch(0.6 0.2 295)"} />
    </ReactFlow>
  );
}