import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

/** ===== Types ===== */
type Phase = {
  id: string | number;
  name: string;
  shortName?: string;
  description?: string;
  gradient?: string;
  details?: any;
};

export interface ProcessFlowMinimalCanvas1Props {
  getPhase: (id: string) => Phase;   // your toPhase()
  onSelect: (phase: Phase) => void;  // opens modal
}

/** ===== Small helpers ===== */
type Pt = { x: number; y: number };

function centerOf(el: HTMLElement | null, frame: DOMRect): Pt | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left - frame.left + r.width / 2, y: r.top - frame.top + r.height / 2 };
}
function topOf(el: HTMLElement | null, frame: DOMRect): Pt | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left - frame.left + r.width / 2, y: r.top - frame.top };
}
function bottomOf(el: HTMLElement | null, frame: DOMRect): Pt | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left - frame.left + r.width / 2, y: r.bottom - frame.top };
}
function leftOf(el: HTMLElement | null, frame: DOMRect): Pt | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left - frame.left, y: r.top - frame.top + r.height / 2 };
}
function rightOf(el: HTMLElement | null, frame: DOMRect): Pt | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.right - frame.left, y: r.top - frame.top + r.height / 2 };
}

/** ===== Sample QA phases (keep your v25 for the rest) ===== */
const samplePhases: Record<string, Phase> = {
  QA1: {
    id: "QA1",
    shortName: "QA PREP",
    name: "QA: Test Case Preparation",
    description: "Prepare test cases during Solution Architecture",
    gradient: "from-pink-400 to-pink-500",
  },
  QA2: {
    id: "QA2",
    shortName: "SIT",
    name: "QA: SIT",
    description: "System Integration Testing",
    gradient: "from-pink-400 to-pink-500",
  },
  QA3: {
    id: "QA3",
    shortName: "QA UAT",
    name: "QA: UAT",
    description: "Simulate user testing before business acceptance",
    gradient: "from-red-400 to-red-500",
  },
};

/** ===== Tiny node components (unchanged visuals) ===== */
const NodeCircle: React.FC<{
  phase: Phase;
  size?: number;
  className?: string;
  onClick?: () => void;
  nodeRef?: React.Ref<HTMLDivElement>;
}> = ({ phase, size = 80, className = "", onClick, nodeRef }) => (
  <div ref={nodeRef} className={`cursor-pointer hover:scale-110 transition-all duration-200 ${className}`} onClick={onClick}>
    <div
      className={`rounded-full border-2 border-white shadow-lg bg-gradient-to-br ${phase.gradient} text-white flex flex-col items-center justify-center font-bold`}
      style={{ width: size, height: size }}
      title={phase.name}
    >
      <div className="text-lg font-black">{phase.id}</div>
      <div className="text-xs uppercase text-center leading-tight px-1">{phase.shortName}</div>
    </div>
    <div className="mt-2 text-center max-w-32 mx-auto">
      <div className="text-sm font-semibold text-gray-800">{phase.name}</div>
      {phase.description && <div className="text-xs text-gray-600 mt-1">{phase.description}</div>}
    </div>
  </div>
);

const OwnerDecisionDiamond: React.FC<{ onClick: () => void; nodeRef?: React.Ref<HTMLDivElement> }> = ({ onClick, nodeRef }) => (
  <div ref={nodeRef} className="cursor-pointer hover:scale-110 transition-all duration-200 flex flex-col items-center" onClick={onClick}>
    <div className="w-16 h-16 bg-orange-400 border-4 border-orange-500 transform rotate-45 flex items-center justify-center shadow-lg">
      <div className="transform -rotate-45 text-white text-xs font-bold text-center leading-tight">
        Owner
        <br />
        Decision
      </div>
    </div>
    <div className="mt-4 text-center">
      <div className="text-sm font-semibold text-gray-800">Owner Decision</div>
    </div>
  </div>
);

const ArrowInline = () => (
  <div className="flex items-center">
    <div className="w-8 h-0.5 bg-gray-400" />
    <div className="w-2 h-2 border-r-2 border-t-2 border-gray-400 transform rotate-45 -ml-1" />
  </div>
);

/** ===== Overlay SVG that auto-aligns to real DOM positions ===== */
const ConnectorLayer: React.FC<{
  containerRef: React.RefObject<HTMLDivElement>;
  ownerRef: React.RefObject<HTMLDivElement>;
  entBoxRef: React.RefObject<HTMLDivElement>;
  prodBoxRef: React.RefObject<HTMLDivElement>;
  devRef: React.RefObject<HTMLDivElement>;
  sitRef: React.RefObject<HTMLDivElement>;
  uatRef: React.RefObject<HTMLDivElement>;
  uaSectionRef: React.RefObject<HTMLDivElement>;
  sdSectionRef: React.RefObject<HTMLDivElement>;
}> = ({ containerRef, ownerRef, entBoxRef, prodBoxRef, devRef, sitRef, uatRef, uaSectionRef, sdSectionRef }) => {
  const [frame, setFrame] = useState<DOMRect | null>(null);
  const [pts, setPts] = useState<any>(null);

  const measure = () => {
    const root = containerRef.current;
    if (!root) return;
    const fr = root.getBoundingClientRect();
    const data = {
      owner_bottom: bottomOf(ownerRef.current!, fr),
      ent_topLeft: leftOf(entBoxRef.current!, fr),
      prod_topRight: rightOf(prodBoxRef.current!, fr),
      dev: centerOf(devRef.current!, fr),
      sit: centerOf(sitRef.current!, fr),
      uat: centerOf(uatRef.current!, fr),
      sd_bottom: bottomOf(sdSectionRef.current!, fr),
      ua_top: topOf(uaSectionRef.current!, fr),
    };
    setFrame(fr);
    setPts(data);
  };

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!frame || !pts) return null;

  const w = frame.width;
  const h = frame.height;
  const stroke = "#94a3b8";

  const qPath = (a: Pt, b: Pt, k = 0.3): string => {
    const c = { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
    return `M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`;
  };

  return (
    <svg className="absolute inset-0 pointer-events-none" width={w} height={h}>
      <defs>
        <marker id="arrow" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
          <polygon points="0 0, 12 4, 0 8" fill={stroke} />
        </marker>
        <marker id="arrow-strong" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
          <polygon points="0 0, 12 4, 0 8" fill="#475569" />
        </marker>
      </defs>

      {/* Owner -> Enterprise (curve to left of yellow box) */}
      {pts.owner_bottom && pts.ent_topLeft && (
        <path d={qPath(pts.owner_bottom, { x: pts.ent_topLeft.x + 20, y: pts.ent_topLeft.y + 20 }, 0.2)} stroke={stroke} strokeWidth={2.5} fill="none" markerEnd="url(#arrow)" />
      )}

      {/* Owner -> Product (curve to right of green box) */}
      {pts.owner_bottom && pts.prod_topRight && (
        <path d={qPath(pts.owner_bottom, { x: pts.prod_topRight.x - 20, y: pts.prod_topRight.y + 20 }, 0.2)} stroke={stroke} strokeWidth={2.5} fill="none" markerEnd="url(#arrow)" />
      )}

      {/* Dev -> SIT (forward) dashed */}
      {pts.dev && pts.sit && (
        <path d={qPath({ x: pts.dev.x + 10, y: pts.dev.y - 10 }, { x: pts.sit.x - 10, y: pts.sit.y - 10 }, 0.5)} stroke={stroke} strokeWidth={2} fill="none" strokeDasharray="6 6" markerEnd="url(#arrow)" />
      )}
      {/* SIT -> Dev (back) dashed */}
      {pts.dev && pts.sit && (
        <path d={qPath({ x: pts.sit.x - 10, y: pts.sit.y + 10 }, { x: pts.dev.x + 10, y: pts.dev.y + 10 }, 0.5)} stroke={stroke} strokeWidth={2} fill="none" strokeDasharray="6 6" markerEnd="url(#arrow)" />
      )}

      {/* SD section bottom -> UA section top (solid down) */}
      {pts.sd_bottom && pts.ua_top && (
        <path d={`M ${pts.sd_bottom.x} ${pts.sd_bottom.y + 4} L ${pts.ua_top.x} ${pts.ua_top.y - 8}`} stroke="#475569" strokeWidth={2.5} fill="none" markerEnd="url(#arrow-strong)" />
      )}

      {/* UAT -> back into SD section (dashed, up-left curve to SD top) */}
      {pts.uat && pts.sd_bottom && (
        <path d={qPath({ x: pts.uat.x - 4, y: pts.uat.y + 6 }, { x: pts.sd_bottom.x - 80, y: pts.sd_bottom.y - 80 }, 0.3)} stroke={stroke} strokeWidth={2} fill="none" strokeDasharray="6 6" markerEnd="url(#arrow)" />
      )}
    </svg>
  );
};

/** ===== Main Canvas ===== */
const ProcessFlowMinimalCanvas1: React.FC<ProcessFlowMinimalCanvas1Props> = ({ getPhase, onSelect }) => {
  const P = (id: string) => getPhase(id);

  // Refs for measuring
  const canvasRef = useRef<HTMLDivElement>(null);

  const ownerRef = useRef<HTMLDivElement>(null);

  const entBoxRef = useRef<HTMLDivElement>(null);
  const prodBoxRef = useRef<HTMLDivElement>(null);

  const saRef = useRef<HTMLDivElement>(null);
  const qa1Ref = useRef<HTMLDivElement>(null);

  const devRef = useRef<HTMLDivElement>(null);
  const sitRef = useRef<HTMLDivElement>(null);

  const uatRef = useRef<HTMLDivElement>(null);
  const acceptRef = useRef<HTMLDivElement>(null);

  const sdSectionRef = useRef<HTMLDivElement>(null);
  const uaSectionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div ref={canvasRef} className="relative bg-white rounded-2xl shadow-lg p-8 overflow-x-auto" style={{ minWidth: "1200px" }}>
          {/* === Overlay connectors (always aligned) === */}
          <ConnectorLayer
            containerRef={canvasRef}
            ownerRef={ownerRef}
            entBoxRef={entBoxRef}
            prodBoxRef={prodBoxRef}
            devRef={devRef}
            sitRef={sitRef}
            uatRef={uatRef}
            uaSectionRef={uaSectionRef}
            sdSectionRef={sdSectionRef}
          />

          {/* Row 1: Discovery and Initiation */}
          <div className="flex items-center justify-center mb-12">
            <NodeCircle phase={P("0")} onClick={() => onSelect(P("0"))} />
            <div className="mx-8">
              <ArrowInline />
            </div>
            <NodeCircle phase={P("1")} onClick={() => onSelect(P("1"))} />
          </div>

          {/* Row 2: Owner Decision */}
          <div className="flex justify-center mb-8">
            <div className="w-0.5 h-8 bg-gray-400 mb-4" />
          </div>
          <div className="flex justify-center mb-12">
            <OwnerDecisionDiamond nodeRef={ownerRef} onClick={() => onSelect(P("D"))} />
          </div>

          {/* Row 3: Two path cards */}
          <div className="grid grid-cols-2 gap-16 mb-12">
            {/* Enterprise Path */}
            <div ref={entBoxRef} className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
              <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4 inline-block">ENTERPRISE PATH</div>
              <div className="flex items-center justify-between">
                <NodeCircle phase={P("E2")} size={70} onClick={() => onSelect(P("E2"))} />
                <ArrowInline />
                <NodeCircle phase={P("E3")} size={70} onClick={() => onSelect(P("E3"))} />
                <ArrowInline />
                <NodeCircle phase={P("E4")} size={70} onClick={() => onSelect(P("E4"))} />
              </div>
            </div>

            {/* Product Path */}
            <div ref={prodBoxRef} className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
              <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4 inline-block">PRODUCT PATH</div>
              <div className="flex items-center justify-between">
                <NodeCircle phase={P("P2")} size={70} onClick={() => onSelect(P("P2"))} />
                <ArrowInline />
                <NodeCircle phase={P("P3")} size={70} onClick={() => onSelect(P("P3"))} />
                <ArrowInline />
                <NodeCircle phase={P("P4")} size={70} onClick={() => onSelect(P("P4"))} />
              </div>
            </div>
          </div>

          {/* Row 4: Architecture & Early QA */}
          <div ref={sdSectionRef} className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-12">
            <div className="text-center text-blue-700 font-bold mb-4">Architecture & Early QA</div>
            <div className="flex items-center justify-center space-x-16">
              <NodeCircle nodeRef={saRef} phase={P("SA")} onClick={() => onSelect(P("SA"))} />
              <ArrowInline />
              <NodeCircle nodeRef={qa1Ref} phase={samplePhases["QA1"]} onClick={() => onSelect(samplePhases["QA1"])} />
            </div>
          </div>

          {/* Row 5: Solution Development */}
          <div ref={sdSectionRef} className="bg-pink-50 border-2 border-pink-300 border-dashed rounded-2xl p-6 mb-12">
            <div className="text-center text-pink-700 font-bold mb-4">5 — Solution Development</div>
            <div className="flex items-center justify-center space-x-16">
              <NodeCircle nodeRef={devRef} phase={P("5")} onClick={() => onSelect(P("5"))} />
              <NodeCircle nodeRef={sitRef} phase={samplePhases["QA2"]} onClick={() => onSelect(samplePhases["QA2"])} />
            </div>
          </div>

          {/* Row 6: User Acceptance & Validation */}
          <div ref={uaSectionRef} className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-12">
            <div className="text-center text-purple-700 font-bold mb-4">User Acceptance & Validation</div>
            <div className="flex items-center justify-center space-x-16">
              <NodeCircle nodeRef={uatRef} phase={samplePhases["QA3"]} onClick={() => onSelect(samplePhases["QA3"])} />
              <ArrowInline />
              <NodeCircle nodeRef={acceptRef} phase={P("6")} onClick={() => onSelect(P("6"))} />
            </div>
          </div>

          {/* Row 7: Final Phases */}
          <div className="flex items-center justify-center space-x-16 mb-8">
            <NodeCircle phase={P("7")} onClick={() => onSelect(P("7"))} />
            <ArrowInline />
            <NodeCircle phase={P("8")} onClick={() => onSelect(P("8"))} />
            <ArrowInline />
            <NodeCircle phase={P("9")} onClick={() => onSelect(P("9"))} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessFlowMinimalCanvas1;