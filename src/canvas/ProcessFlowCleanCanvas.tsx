import React, { useEffect } from "react";

type PhaseLike = {
  id: string | number;
  name: string;
  shortName?: string;
  description?: string;
  gradient?: string;
  details?: any;
};

export interface ProcessFlowCleanCanvasProps {
  getPhase: (id: string) => PhaseLike;
  onSelect: (phase: PhaseLike) => void;
}

/* ---------- VISUAL TOKENS (centered, crisp) ---------- */
const TOKENS = {
  NODE: 80,
  DIAMOND: 64,
  STROKE: 2,
  ROW_Y: [90, 190, 330, 460, 580, 690, 780, 870] as const, // R0..R7
  CANVAS_W: 1100,
  CANVAS_H: 980,
  MARGIN_X: 80,
};

const stroke = "#64748B";
const dashed = "6 6";

/* ---------- Grid helpers (even columns) ---------- */
const COL = (i: number, total = 6) => {
  const usable = TOKENS.CANVAS_W - TOKENS.MARGIN_X * 2;
  const step = usable / (total - 1);
  return TOKENS.MARGIN_X + i * step;
};
const ROW = (i: number) => TOKENS.ROW_Y[i];

type Pt = { x: number; y: number };
const pt = (x: number, y: number): Pt => ({ x, y });

/* ---------- SVG primitives ---------- */
const ArrowDefs = () => (
  <svg width="0" height="0">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
        <polygon points="0 0,10 5,0 10" fill={stroke} />
      </marker>
    </defs>
  </svg>
);

const L = ({ a, b }: { a: Pt; b: Pt }) => (
  <line
    x1={a.x}
    y1={a.y}
    x2={b.x}
    y2={b.y}
    stroke={stroke}
    strokeWidth={TOKENS.STROKE}
    strokeLinecap="round"
    markerEnd="url(#arrow)"
  />
);

const Q = ({ a, c, b, isDashed = false }: { a: Pt; c: Pt; b: Pt; isDashed?: boolean }) => (
  <path
    d={`M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`}
    stroke={stroke}
    strokeWidth={TOKENS.STROKE}
    fill="none"
    markerEnd="url(#arrow)"
    strokeDasharray={isDashed ? dashed : undefined}
  />
);

/* ---------- Nodes ---------- */
const bubbleBase =
  "rounded-full border-2 border-white/40 shadow-md bg-gradient-to-br text-white " +
  "flex items-center justify-center font-bold select-none hover:scale-105 transition-transform";

const NodeBubble = ({ phase, onClick }: { phase: PhaseLike; onClick: () => void }) => (
  <div className="text-center cursor-pointer" onClick={onClick} style={{ width: 160 }}>
    <div
      className={`${bubbleBase} ${phase.gradient || "from-blue-500 to-blue-600"}`}
      style={{ width: TOKENS.NODE, height: TOKENS.NODE, margin: "0 auto" }}
      title={phase.name}
    >
      <div className="leading-tight">
        <div className="text-base font-black">{String(phase.id)}</div>
        <div className="text-[10px] uppercase tracking-wide">{phase.shortName}</div>
      </div>
    </div>
    <div className="mt-2 mx-auto">
      <div className="text-[13px] font-semibold text-gray-800">{phase.name}</div>
      {phase.description && <div className="text-[11px] text-gray-600">{phase.description}</div>}
    </div>
  </div>
);

const OwnerDiamond = ({ center, onClick }: { center: Pt; onClick: () => void }) => (
  <div
    onClick={onClick}
    className="absolute cursor-pointer hover:scale-105 transition-transform"
    style={{
      left: center.x - TOKENS.DIAMOND / 2,
      top: center.y - TOKENS.DIAMOND / 2,
      width: TOKENS.DIAMOND,
      height: TOKENS.DIAMOND,
      transform: "rotate(45deg)",
    }}
  >
    <div className="w-full h-full border-4 border-amber-500 bg-amber-50 rounded-md shadow-sm flex items-center justify-center">
      <div style={{ transform: "rotate(-45deg)" }} className="text-[10px] text-amber-800 font-bold leading-tight text-center">
        Owner<br />Decision
      </div>
    </div>
  </div>
);

const Abs = ({ center, children }: { center: Pt; children: React.ReactNode }) => (
  <div className="absolute" style={{ left: center.x - 80, top: center.y - TOKENS.NODE / 2 }}>
    {children}
  </div>
);

/* ---------- Synthetic QA chips ---------- */
const QA1 = (): PhaseLike => ({
  id: "QA1",
  shortName: "QA1",
  name: "QA: Test Case Prep",
  description: "Design test cases & acceptance",
  gradient: "from-indigo-500 to-indigo-600",
});
const QA3 = (): PhaseLike => ({
  id: "QA3",
  shortName: "QA3",
  name: "QA: UAT",
  description: "Formal user acceptance testing",
  gradient: "from-sky-500 to-sky-600",
});

/* ---------- Component ---------- */
const ProcessFlowCleanCanvas: React.FC<ProcessFlowCleanCanvasProps> = ({ getPhase, onSelect }) => {
  useEffect(() => {
    console.log("%c[ProcessFlowCleanCanvas] mounted", "color:#2563eb;font-weight:bold");
  }, []);

  const P = (id: string) => getPhase(id);
  const acceptance = { ...P("6"), name: "Business / Product Acceptance", shortName: "ACPT" };
  const ownerPhase: PhaseLike = {
    id: "Owner",
    name: "Owner Decision",
    shortName: "OWNER",
    description: "Choose Enterprise vs Product path",
    gradient: "from-amber-400 to-amber-500",
  };

  // Columns 0..5, Rows 0..7
  const C = (i: number) => COL(i);
  const R = (i: number) => ROW(i);

  const owner = pt(C(1), R(1));
  const sa = pt(C(2), R(3));
  const qa1 = pt(C(3), R(3));
  const dev5 = pt(C(2), R(4));
  const qa2 = pt(C(3), R(4));
  const qa3 = pt(C(2), R(5));
  const acc6 = pt(C(2), R(6));
  const r7 = pt(C(1), R(7));
  const p8 = pt(C(2), R(7));
  const c9 = pt(C(3), R(7));

  return (
    <div
      className="relative mx-auto rounded-xl bg-white border border-gray-200 shadow-sm"
      style={{ width: TOKENS.CANVAS_W, height: TOKENS.CANVAS_H }}
    >
      <ArrowDefs />

      {/* Lane cards */}
      <div
        className="absolute rounded-2xl border border-amber-200/70 bg-amber-50/50"
        style={{
          left: C(0) - TOKENS.NODE / 2 - 24,
          top: R(2) - TOKENS.NODE / 2 - 28,
          width: C(2) - C(0) + TOKENS.NODE + 48,
          height: TOKENS.NODE + 96,
        }}
      />
      <div
        className="absolute rounded-2xl border border-emerald-200/70 bg-emerald-50/50"
        style={{
          left: C(3) - TOKENS.NODE / 2 - 24,
          top: R(2) - TOKENS.NODE / 2 - 28,
          width: C(5) - C(3) + TOKENS.NODE + 48,
          height: TOKENS.NODE + 96,
        }}
      />

      {/* Connectors */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* 0 → 1 → Owner */}
        <L a={pt(C(0), R(0))} b={pt(C(1), R(0))} />
        <L a={pt(C(1), R(0) + TOKENS.NODE / 2)} b={pt(C(1), R(1) - TOKENS.DIAMOND / 2)} />

        {/* Owner → E2 & P2 */}
        <Q a={owner} c={pt(C(0) + 40, R(1) + 28)} b={pt(C(0), R(2) - 30)} />
        <Q a={owner} c={pt(C(4) - 40, R(1) + 28)} b={pt(C(3), R(2) - 30)} />

        {/* Enterprise straight chain */}
        <L a={pt(C(0), R(2))} b={pt(C(1), R(2))} />
        <L a={pt(C(1), R(2))} b={pt(C(2), R(2))} />

        {/* Product straight chain */}
        <L a={pt(C(3), R(2))} b={pt(C(4), R(2))} />
        <L a={pt(C(4), R(2))} b={pt(C(5), R(2))} />

        {/* E4 & P4 → SA */}
        <Q a={pt(C(2), R(2))} c={pt(C(2) + 28, R(2) + 40)} b={pt(C(2), R(3) - 18)} />
        <Q a={pt(C(5), R(2))} c={pt(C(5) - 28, R(2) + 40)} b={pt(C(2), R(3) - 18)} />

        {/* SA ↓ to DEV; DEV → QA2 */}
        <L a={pt(C(2), R(3) + 18)} b={pt(C(2), R(4) - 18)} />
        <L a={pt(C(2), R(4))} b={pt(C(3), R(4))} />

        {/* Downstream trunk */}
        <L a={pt(C(2), R(4) + 18)} b={pt(C(2), R(5) - 18)} />
        <L a={qa3} b={acc6} />
        <L a={acc6} b={r7} />
        <L a={r7} b={p8} />
        <L a={p8} b={c9} />

        {/* Iteration loops (compact dashed) */}
        <Q a={pt(C(3) - 22, R(3) + 6)} c={pt(C(3) - 50, R(3) - 44)} b={pt(C(2), R(3) - 6)} isDashed />
        <Q a={pt(C(3), R(4) + 6)} c={pt(C(3) - 16, R(4) + 52)} b={pt(C(2), R(4) + 6)} isDashed />
        <Q a={pt(C(2), R(5) + 6)} c={pt(C(2) - 18, R(5) + 62)} b={pt(C(2), R(4) + 6)} isDashed />
      </svg>

      {/* Nodes (rows/columns) */}
      <Abs center={pt(C(0), R(0))}>
        <NodeBubble phase={P("0")} onClick={() => onSelect(P("0"))} />
      </Abs>
      <Abs center={pt(C(1), R(0))}>
        <NodeBubble phase={P("1")} onClick={() => onSelect(P("1"))} />
      </Abs>

      <OwnerDiamond center={owner} onClick={() => onSelect(ownerPhase)} />

      {/* Enterprise */}
      <Abs center={pt(C(0), R(2))}>
        <NodeBubble phase={P("E2")} onClick={() => onSelect(P("E2"))} />
      </Abs>
      <Abs center={pt(C(1), R(2))}>
        <NodeBubble phase={P("E3")} onClick={() => onSelect(P("E3"))} />
      </Abs>
      <Abs center={pt(C(2), R(2))}>
        <NodeBubble phase={P("E4")} onClick={() => onSelect(P("E4"))} />
      </Abs>

      {/* Product */}
      <Abs center={pt(C(3), R(2))}>
        <NodeBubble phase={P("P2")} onClick={() => onSelect(P("P2"))} />
      </Abs>
      <Abs center={pt(C(4), R(2))}>
        <NodeBubble phase={P("P3")} onClick={() => onSelect(P("P3"))} />
      </Abs>
      <Abs center={pt(C(5), R(2))}>
        <NodeBubble phase={P("P4")} onClick={() => onSelect(P("P4"))} />
      </Abs>

      {/* SA + QA1 */}
      <Abs center={sa}>
        <NodeBubble phase={P("SA")} onClick={() => onSelect(P("SA"))} />
      </Abs>
      <Abs center={qa1}>
        <NodeBubble phase={QA1()} onClick={() => onSelect(QA1())} />
      </Abs>

      {/* Dev + QA2 */}
      <Abs center={dev5}>
        <NodeBubble phase={P("5")} onClick={() => onSelect(P("5"))} />
      </Abs>
      <Abs center={qa2}>
        <NodeBubble
          phase={{ ...P("5.1"), shortName: "QA2", name: "QA: SIT" }}
          onClick={() => onSelect({ ...P("5.1"), shortName: "QA2", name: "QA: SIT" })}
        />
      </Abs>

      {/* QA3 / Acceptance / 7,8,9 */}
      <Abs center={qa3}>
        <NodeBubble phase={QA3()} onClick={() => onSelect(QA3())} />
      </Abs>
      <Abs center={acc6}>
        <NodeBubble phase={acceptance} onClick={() => onSelect(acceptance)} />
      </Abs>
      <Abs center={r7}>
        <NodeBubble phase={P("7")} onClick={() => onSelect(P("7"))} />
      </Abs>
      <Abs center={p8}>
        <NodeBubble phase={P("8")} onClick={() => onSelect(P("8"))} />
      </Abs>
      <Abs center={c9}>
        <NodeBubble phase={P("9")} onClick={() => onSelect(P("9"))} />
      </Abs>
    </div>
  );
};

export default ProcessFlowCleanCanvas;