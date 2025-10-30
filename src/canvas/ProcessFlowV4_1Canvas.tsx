import React, { useEffect, useRef, useState } from "react";

type PhaseLike = {
  id: string | number;
  name: string;
  shortName?: string;
  description?: string;
  gradient?: string;
  details?: any;
};

export interface ProcessFlowV4_1CanvasProps {
  getPhase: (id: string) => PhaseLike;
  onSelect: (phase: PhaseLike) => void;
}

/** ------------------ TOKENS ------------------ */
const TOKENS = {
  NODE: 92,
  DIAMOND: 68,
  STROKE: 2.25,
  GAP_X: 180,     // horizontal column spacing
  GAP_Y: 120,     // vertical row spacing
  LABEL_W: 160,   // label column width
};

const stroke = "#5B677A";
const dashed = "6 6";

/** Fit-to-width responsive frame */
const DESIGN_SIZE = { w: 1300, h: 1200 }; // your canvas logical size

const FitToWidth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [zoomOverride, setZoomOverride] = useState(1);

  useEffect(() => {
    if (!hostRef.current) return;
    const update = () => {
      const w = hostRef.current!.clientWidth;
      const next = Math.min(w / DESIGN_SIZE.w, 1); // never upscale above 1
      setScale(next);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(hostRef.current);
    return () => ro.disconnect();
  }, []);

  const finalScale = scale * zoomOverride;
  // Reserve vertical space so the page doesn't collapse when scaled
  const height = Math.round(DESIGN_SIZE.h * finalScale);

  const handleZoomIn = () => setZoomOverride(prev => Math.min(prev * 1.2, 2));
  const handleZoomOut = () => setZoomOverride(prev => Math.max(prev / 1.2, 0.3));
  const handleFitToWidth = () => setZoomOverride(1);

  return (
    <div ref={hostRef} className="w-full relative">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur rounded-lg p-2 border border-gray-200 shadow-sm">
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-bold transition-colors"
          title="Zoom Out"
        >
          −
        </button>
        <span className="text-xs font-medium text-gray-600 min-w-[3rem] text-center">
          {Math.round(finalScale * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-bold transition-colors"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleFitToWidth}
          className="px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 rounded font-medium transition-colors"
          title="Fit to Width"
        >
          Fit
        </button>
      </div>
      
      <div style={{ height }} className="flex justify-center">
        <div
          style={{
            width: DESIGN_SIZE.w,
            height: DESIGN_SIZE.h,
            transform: `scale(${finalScale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

/** Grid helpers: we place columns/rows then compute px */
const COL = (n:number) => 200 + n * TOKENS.GAP_X;
const ROW = (n:number) => 110 + n * TOKENS.GAP_Y;

type Pt = { x:number; y:number };
const pt = (x:number,y:number):Pt => ({x,y});

/** Arrow defs */
const ArrowDefs = () => (
  <svg width="0" height="0">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
        <polygon points="0 0,10 5,0 10" fill={stroke} />
      </marker>
      <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
        <polygon points="0 0,10 5,0 10" fill="#2563EB" />
      </marker>
    </defs>
  </svg>
);

const L = ({a,b,blue=false}:{a:Pt;b:Pt;blue?:boolean}) => (
  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        stroke={blue ? "#2563EB" : stroke}
        strokeWidth={TOKENS.STROKE}
        strokeLinecap="round"
        markerEnd={`url(#${blue ? "arrow-blue" : "arrow"})`} />
);

const Q = ({a,c,b,isDashed=false}:{a:Pt;c:Pt;b:Pt;isDashed?:boolean}) => (
  <path d={`M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`}
        stroke={stroke}
        strokeWidth={TOKENS.STROKE}
        fill="none"
        markerEnd="url(#arrow)"
        strokeDasharray={isDashed ? dashed : undefined}/>
);

/** Basic bubbles + diamond */
const bubbleBase =
  "rounded-full border-2 border-white/40 shadow-md bg-gradient-to-br text-white " +
  "flex items-center justify-center font-bold select-none hover:scale-105 transition-transform";

const NodeBubble = ({ phase, onClick }: { phase: PhaseLike; onClick: () => void }) => (
  <div className="text-center cursor-pointer" onClick={onClick} style={{ width: TOKENS.LABEL_W }}>
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
      {phase.description && (
        <div className="text-[11px] text-gray-600">{phase.description}</div>
      )}
    </div>
  </div>
);

const OwnerDiamond = ({center,onClick}:{center:Pt; onClick:()=>void}) => (
  <div
    onClick={onClick}
    className="absolute cursor-pointer hover:scale-105 transition-transform"
    style={{
      left: center.x - TOKENS.DIAMOND/2,
      top:  center.y - TOKENS.DIAMOND/2,
      width: TOKENS.DIAMOND,
      height: TOKENS.DIAMOND,
      transform: "rotate(45deg)"
    }}
  >
    <div className="w-full h-full border-4 border-amber-500 bg-amber-50 rounded-md shadow-sm flex items-center justify-center">
      <div style={{transform:"rotate(-45deg)"}} className="text-[10px] text-amber-800 font-bold leading-tight text-center">
        Owner<br/>Decision
      </div>
    </div>
  </div>
);

const Abs = ({center, children}:{center:Pt; children:React.ReactNode}) => (
  <div className="absolute" style={{ left: center.x - TOKENS.LABEL_W/2, top: center.y - TOKENS.NODE/2 }}>
    {children}
  </div>
);

/** Synthetic QA nodes (short + neutral) */
const QA1 = ():PhaseLike => ({
  id: "QA1", shortName: "QA1", name:"QA: Test Case Prep",
  description:"Design test cases & acceptance", gradient:"from-indigo-500 to-indigo-600"
});
const QA3 = ():PhaseLike => ({
  id:"QA3", shortName:"QA3", name:"QA: UAT",
  description:"Formal user acceptance testing", gradient:"from-sky-500 to-sky-600"
});

const ProcessFlowV4_1Canvas: React.FC<ProcessFlowV4_1CanvasProps> = ({ getPhase, onSelect }) => {
  useEffect(() => {
    console.log("%c[ProcessFlowV4_1Canvas] mounted", "color:#10b981;font-weight:bold");
  }, []);
  const P = (id:string)=>getPhase(id);

  // Grid positions (columns left→right; rows top→bottom)
  const C0 = COL(0), C1 = COL(1), C2 = COL(2), C3 = COL(3), C4 = COL(4), C5 = COL(5);
  const R0 = ROW(0), R1 = ROW(1), R2 = ROW(2), R3 = ROW(3), R4 = ROW(4), R5 = ROW(5), R6 = ROW(6);

  const owner = pt(C1, R1);
  const sa    = pt(C2, R3);
  const qa1   = pt(C3, R3);
  const dev5  = pt(C2, R4);
  const qa2   = pt(C3, R4);
  const qa3   = pt(C2, R5);
  const acc6  = pt(C2, R6);
  const r7    = pt(C1, R6);
  const p8    = pt(C2, R6+TOKENS.GAP_Y*0.8);
  const c9    = pt(C3, R6+TOKENS.GAP_Y*0.8);

  const acceptance = { ...P("6"), name:"Business / Product Acceptance", shortName:"ACPT" };

  const ownerPhase = {
    id:"Owner", name:"Owner Decision", shortName:"OWNER",
    description:"Choose Enterprise vs Product path", gradient:"from-amber-400 to-amber-500"
  };

  return (
    <FitToWidth>
      <div
        className="relative overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm"
        style={{ width: DESIGN_SIZE.w, height: DESIGN_SIZE.h }}
      >
        <ArrowDefs/>

        {/* LANE CARDS */}
        <div className="absolute rounded-2xl border border-amber-200 bg-amber-50/40"
             style={{ left: C0-80, top:R2 - TOKENS.NODE, width:(C2 - (C0-80)) + 120, height: TOKENS.NODE + 140 }} />
        <div className="absolute rounded-2xl border border-emerald-200 bg-emerald-50/40"
             style={{ left: C3-80, top:R2 - TOKENS.NODE, width:(C5 - (C3-80)) + 120, height: TOKENS.NODE + 140 }} />

        {/* LANE HEADERS */}
        <div className="absolute left-[160px]" style={{ top:R2 - TOKENS.NODE - 38 }}>
          <span className="px-3 py-1 rounded-full text-white text-xs font-bold bg-amber-500 shadow">Enterprise Path</span>
        </div>
        <div className="absolute" style={{ left:C3-40, top:R2 - TOKENS.NODE - 38 }}>
          <span className="px-3 py-1 rounded-full text-white text-xs font-bold bg-emerald-500 shadow">Product Path</span>
        </div>

        {/* CONNECTORS */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* 0 → 1 → Owner */}
          <L a={pt(C0, R0)} b={pt(C1, R0)} />
          <L a={pt(C1, R0 + TOKENS.NODE/2)} b={pt(C1, R1 - TOKENS.DIAMOND/2)} />

          {/* Owner → E2 & P2 (clean mirrored curves) */}
          <Q a={owner} c={pt(C0+40, R1+40)} b={pt(C0, R2 - 40)} />
          <Q a={owner} c={pt(C4-40, R1+40)} b={pt(C4, R2 - 40)} />

          {/* Enterprise straight chain */}
          <L a={pt(C0, R2)} b={pt(C1, R2)} />
          <L a={pt(C1, R2)} b={pt(C2, R2)} />

          {/* Product straight chain */}
          <L a={pt(C4, R2)} b={pt(C5- (TOKENS.GAP_X/2), R2)} />
          <L a={pt(C5- (TOKENS.GAP_X/2), R2)} b={pt(C5, R2)} />

          {/* E4 & P4 → SA */}
          <Q a={pt(C2, R2)} c={pt(C2+40, R2+50)} b={pt(C2, R3 - 28)} />
          <Q a={pt(C5, R2)} c={pt(C5-40, R2+50)} b={pt(C2, R3 - 28)} />

          {/* SA trunk down to DEV rail */}
          <L a={pt(C2, R3 + 28)} b={pt(C2, R4 - 28)} />
          {/* Dev → QA2 */}
          <L a={pt(C2, R4)} b={pt(C3, R4)} />

          {/* SA → QA3 → Acceptance → 7 → 8 → 9 */}
          <L a={pt(C2, R4 + 28)} b={pt(C2, R5 - 28)} />
          <L a={qa3} b={acc6} />
          <L a={acc6} b={r7} />
          <L a={r7} b={p8} />
          <L a={p8} b={c9} />

          {/* Loops */}
          <Q a={pt(C3 - 26, R3 + 6)} c={pt(C3 - 60, R3 - 60)} b={pt(C2, R3 - 6)} isDashed />
          <Q a={pt(C3, R4 + 8)} c={pt(C3 - 18, R4 + 60)} b={pt(C2, R4 + 8)} isDashed />
          <Q a={pt(C2, R5 + 8)} c={pt(C2 - 20, R5 + 70)} b={pt(C2, R4 + 8)} isDashed />
        </svg>

        {/* NODES */}
        <Abs center={pt(C0,R0)}><NodeBubble phase={P("0")} onClick={()=>onSelect(P("0"))}/></Abs>
        <Abs center={pt(C1,R0)}><NodeBubble phase={P("1")} onClick={()=>onSelect(P("1"))}/></Abs>

        <OwnerDiamond center={owner} onClick={()=>onSelect(ownerPhase as any)} />

        {/* Enterprise E2-E4 */}
        <Abs center={pt(C0,R2)}><NodeBubble phase={P("E2")} onClick={()=>onSelect(P("E2"))}/></Abs>
        <Abs center={pt(C1,R2)}><NodeBubble phase={P("E3")} onClick={()=>onSelect(P("E3"))}/></Abs>
        <Abs center={pt(C2,R2)}><NodeBubble phase={P("E4")} onClick={()=>onSelect(P("E4"))}/></Abs>

        {/* Product P2-P4 */}
        <Abs center={pt(C4,R2)}><NodeBubble phase={P("P2")} onClick={()=>onSelect(P("P2"))}/></Abs>
        <Abs center={pt(C5 - (TOKENS.GAP_X/2),R2)}><NodeBubble phase={P("P3")} onClick={()=>onSelect(P("P3"))}/></Abs>
        <Abs center={pt(C5,R2)}><NodeBubble phase={P("P4")} onClick={()=>onSelect(P("P4"))}/></Abs>

        {/* SA + QA1 */}
        <Abs center={sa}><NodeBubble phase={P("SA")} onClick={()=>onSelect(P("SA"))}/></Abs>
        <Abs center={qa1}><NodeBubble phase={QA1()} onClick={()=>onSelect(QA1())}/></Abs>

        {/* Dev + QA2 */}
        <Abs center={dev5}><NodeBubble phase={P("5")} onClick={()=>onSelect(P("5"))}/></Abs>
        <Abs center={qa2}><NodeBubble phase={{...P("5.1"), shortName:"QA2", name:"QA: SIT"}} onClick={()=>onSelect({...P("5.1"), shortName:"QA2", name:"QA: SIT"})}/></Abs>

        {/* QA3 + Acceptance + 7/8/9 */}
        <Abs center={qa3}><NodeBubble phase={QA3()} onClick={()=>onSelect(QA3())}/></Abs>
        <Abs center={acc6}><NodeBubble phase={acceptance as any} onClick={()=>onSelect(acceptance as any)}/></Abs>
        <Abs center={r7}><NodeBubble phase={P("7")} onClick={()=>onSelect(P("7"))}/></Abs>
        <Abs center={p8}><NodeBubble phase={P("8")} onClick={()=>onSelect(P("8"))}/></Abs>
        <Abs center={c9}><NodeBubble phase={P("9")} onClick={()=>onSelect(P("9"))}/></Abs>

        {/* Footer tag */}
        <div className="absolute bottom-2 right-3 text-[10px] text-gray-500">Canvas v4.1 — grid/spacing cleanup</div>
      </div>
    </FitToWidth>
  );
};

export default ProcessFlowV4_1Canvas;