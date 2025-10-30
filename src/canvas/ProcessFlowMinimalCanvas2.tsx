import React, { useRef, useLayoutEffect, useState } from "react";
import { PhaseDetails } from "../data/lifecycleDataV25Details";

/* =========================================================
   Types
   ========================================================= */
type Phase = {
  id: string | number;
  name: string;
  shortName?: string;
  description?: string;
  gradient?: string;
  details?: PhaseDetails;
};

export interface ProcessFlowMinimalCanvas2Props {
  getPhase: (id: string) => Phase;   // your existing toPhase()
  onSelect: (phase: Phase) => void;  // open modal/details
}

/* =========================================================
   Small helpers (arrow overlay)
   ========================================================= */
type XY = { x: number; y: number };

const ArrowDefs = () => (
  <svg width="0" height="0">
    <defs>
      <marker id="pfmc2-arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
        <polygon points="0 0, 12 6, 0 12" fill="#94a3b8" />
      </marker>
      <marker id="pfmc2-arrow-dark" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
        <polygon points="0 0, 12 6, 0 12" fill="#6b7280" />
      </marker>
      <marker id="pfmc2-arrow-red" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
        <polygon points="0 0, 12 6, 0 12" fill="#ef4444" />
      </marker>
    </defs>
  </svg>
);

/** Get an anchor point relative to container (so overlay aligns even on resize) */
function useAnchor(
  ref: React.RefObject<HTMLElement>,
  containerRef: React.RefObject<HTMLElement>,
  edge: "center" | "top" | "bottom" | "left" | "right" = "center",
  pad = 0
): XY | null {
  const el = ref.current;
  const container = containerRef.current;
  if (!el || !container) return null;
  const a = el.getBoundingClientRect();
  const c = container.getBoundingClientRect();

  const cx = a.left - c.left + a.width / 2;
  const cy = a.top - c.top + a.height / 2;

  switch (edge) {
    case "top": return { x: cx, y: a.top - c.top - pad };
    case "bottom": return { x: cx, y: a.bottom - c.top + pad };
    case "left": return { x: a.left - c.left - pad, y: cy };
    case "right": return { x: a.right - c.left + pad, y: cy };
    default: return { x: cx, y: cy };
  }
}

const CurvedConnector: React.FC<{
  from: XY | null;
  to: XY | null;
  curvature?: number;              // 0..1; bigger = wider sweep
  dashed?: boolean;
  color?: string;
  arrow?: "none" | "light" | "dark";
  ease?: "h" | "v" | "auto";       // choose main axis for bezier handles
  width?: number;
}> = ({
  from,
  to,
  curvature = 0.45,
  dashed = false,
  color = "#94a3b8",
  arrow = "light",
  ease = "auto",
  width = 2.5,
}) => {
  if (!from || !to) return null;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const horiz = ease === "h" || (ease === "auto" && Math.abs(dx) >= Math.abs(dy));

  const c1: XY = horiz
    ? { x: from.x + dx * curvature, y: from.y }
    : { x: from.x, y: from.y + dy * curvature };
  const c2: XY = horiz
    ? { x: to.x - dx * curvature, y: to.y }
    : { x: to.x, y: to.y - dy * curvature };

  const markerEnd =
    arrow === "none" ? undefined : arrow === "dark" ? "url(#pfmc2-arrow-dark)" : "url(#pfmc2-arrow)";

  return (
    <path
      d={`M ${from.x} ${from.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`}
      stroke={color}
      strokeWidth={width}
      fill="none"
      strokeDasharray={dashed ? "6 6" : undefined}
      markerEnd={markerEnd}
    />
  );
};

/* =========================================================
   Local phases (QA1/QA2/QA3) – keep your getPhase for the rest
   ========================================================= */
const QA1 = (): Phase => ({
  id: "QA1",
  shortName: "QA PREP",
  name: "QA: Test Case Preparation",
  description: "Prepare test cases during Solution Architecture",
  gradient: "from-pink-400 to-pink-500",
  details: {
    owner: "QA + Engineering + Product",
    processFocus: "Design comprehensive test cases and acceptance criteria in parallel with Solution Architecture",
    inputs: ["Solution Architecture Document", "Requirements Documentation", "Design Specifications"],
    outputs: ["Test Case Suite", "Test Strategy Document", "Acceptance Criteria Matrix", "Test Coverage Report"],
    keyTasks: [
      "Design test cases from requirements and architecture",
      "Create acceptance criteria matrix",
      "Develop test strategy and approach",
      "Review coverage with development team",
      "Validate test cases with business requirements",
      "Establish Definition of Done criteria with development team"
    ],
    phaseGateCriteria: [
      "Test cases cover all functional requirements",
      "Test strategy approved by stakeholders",
      "Acceptance criteria validated with business",
      "Test coverage analysis completed and approved",
      "Definition of Done criteria established"
    ],
    raciMatrix: [
      { role: "QA", description: "Responsible for test case design and strategy development" },
      { role: "Engineering", description: "Consulted for technical feasibility and architecture alignment" },
      { role: "Product", description: "Consulted for business requirement validation" },
      { role: "PMO", description: "Informed of test strategy and timeline impact" }
    ]
  }
});
const QA2 = (): Phase => ({
  id: "QA2",
  shortName: "SIT",
  name: "QA: SIT",
  description: "System Integration Testing",
  gradient: "from-pink-400 to-pink-500",
  details: {
    owner: "QA + Engineering + Product",
    processFocus: "Execute system integration testing to validate component interactions and data flow",
    inputs: ["Working Code from Development", "Test Cases", "Test Data", "Integration Environment"],
    outputs: ["SIT Test Results", "Defect Reports", "Integration Validation Report", "Performance Metrics"],
    keyTasks: [
      "Execute system integration test cases",
      "Validate component interactions and data flow",
      "Log and track integration defects",
      "Coordinate defect resolution with development team",
      "Execute regression testing for bug fixes"
    ],
    phaseGateCriteria: [
      "All critical integration defects resolved",
      "System integration tests pass successfully",
      "Performance benchmarks met",
      "Data integrity validated across all components"
    ],
    raciMatrix: [
      { role: "QA", description: "Responsible for test execution and defect management" },
      { role: "Engineering", description: "Responsible for defect resolution and system fixes" },
      { role: "Product", description: "Consulted for business logic validation" },
      { role: "PMO", description: "Informed of testing progress and quality metrics" }
    ]
  }
});
const QA3 = (getPhase: (id: string) => Phase): Phase => ({
  // Now using global QA3 from getPhase
  ...getPhase("QA3")
});

const NOC = (): Phase => ({
  id: "NOC",
  shortName: "NOC",
  name: "Central Bank NOC Check",
  description: "Central Bank No Objection Certificate validation",
  gradient: "from-red-500 to-red-600",
  details: {
    owner: "Risk and Compliance + PMO",
    processFocus: "Determine if change requires Central Bank No Objection Certificate and obtain approval if needed",
    inputs: ["Project Charter / Discovery Brief", "Change impact assessment", "Regulatory requirements"],
    outputs: ["NOC determination", "Central Bank approval (if required)", "Compliance clearance"],
    keyTasks: [
      "Assess regulatory impact",
      "Determine NOC requirement", 
      "Submit NOC application to Central Bank (if required)",
      "Track approval status",
      "Document compliance clearance"
    ],
    phaseGateCriteria: [
      "NOC requirement determined",
      "Central Bank approval obtained (if required)",
      "Compliance documentation complete"
    ],
    raciMatrix: [
      { role: "Risk and Compliance", description: "Responsible for NOC assessment and Central Bank coordination" },
      { role: "PMO", description: "Accountable for ensuring compliance process completion" },
      { role: "Business", description: "Consulted for business impact assessment" },
      { role: "Product", description: "Informed of NOC requirements and timeline impact" }
    ]
  }
});
/* =========================================================
   UI atoms
   ========================================================= */
const NodeCircle: React.FC<{
  phase: Phase;
  onClick: (p: Phase) => void;
  size?: number;
  className?: string;
}> = ({ phase, onClick, size = 80, className = "" }) => (
  <div
    className={`cursor-pointer hover:scale-110 transition-all duration-200 ${className}`}
    onClick={() => onClick(phase)}
  >
    <div
      className={`rounded-full border-2 border-white shadow-lg bg-gradient-to-br ${phase.gradient || "from-gray-400 to-gray-500"} text-white flex flex-col items-center justify-center font-bold`}
      style={{ width: size, height: size }}
    >
      <div className="text-lg font-black">{phase.id}</div>
      {phase.shortName && <div className="text-[10px] uppercase leading-tight px-1">{phase.shortName}</div>}
    </div>
    <div
      className="mt-2 text-center mx-auto"
      style={{ width: `${Math.max(size, 70) + 20}px` }}
    >
      <div className="text-sm font-semibold text-gray-800 min-h-[28px] flex items-center justify-center leading-snug px-1">
        {phase.name}
      </div>
      {phase.description && (
        <div className="text-xs text-gray-600 mt-1 leading-snug">
          {phase.description}
        </div>
      )}
    </div>
  </div>
);

const OwnerDiamond: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
    <div className="w-16 h-16 bg-orange-400 border-4 border-orange-500 rotate-45 shadow-lg flex items-center justify-center">
      <div className="-rotate-45 text-white text-[11px] font-bold text-center leading-tight cursor-pointer">
        Owner<br />Decision
      </div>
    </div>
    <div className="mt-3 text-sm font-semibold text-gray-800">Owner Decision</div>
  </div>
);

const ThinArrow = () => (
  <div className="flex items-center mx-6">
    <div className="w-8 h-0.5 bg-gray-400" />
    <div className="w-2 h-2 border-r-2 border-t-2 border-gray-400 rotate-45 -ml-1" />
  </div>
);

/* =========================================================
   MAIN COMPONENT (standalone)
   ========================================================= */
const ProcessFlowMinimalCanvas2: React.FC<ProcessFlowMinimalCanvas2Props> = ({ getPhase, onSelect }) => {
  // container & anchor refs
  const cardRef = useRef<HTMLDivElement>(null);

  const ownerRef = useRef<HTMLDivElement>(null);
  const enterpriseRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);

  const devRef = useRef<HTMLDivElement>(null);
  const sitRef = useRef<HTMLDivElement>(null);
  const uatRef = useRef<HTMLDivElement>(null);

  const sdBoxRef = useRef<HTMLDivElement>(null);
  const uavBoxRef = useRef<HTMLDivElement>(null);

  // re-measure on resize/font layout
  const [, setTick] = useState(0);
  useLayoutEffect(() => {
    const reflow = () => setTick((x) => x + 1);
    window.addEventListener("resize", reflow);
    const id = setInterval(reflow, 250);
    return () => {
      window.removeEventListener("resize", reflow);
      clearInterval(id);
    };
  }, []);

  const P = (id: string) => getPhase(id);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div
          ref={cardRef}
          className="relative bg-white rounded-2xl shadow-lg p-8 overflow-x-auto"
          style={{ minWidth: "1200px" }}
        >
          {/* Row 1: 0 → 1 */}
          <div className="flex items-center justify-center mb-12">
            <NodeCircle phase={P("0")} onClick={onSelect} />
            <ThinArrow />
            <NodeCircle phase={P("1")} onClick={onSelect} />
          </div>

          {/* Row 2: Owner */}
          <div className="flex justify-center mb-6">
            <div className="w-0.5 h-8 bg-gray-300" />
          </div>
          <div className="flex justify-center mb-12">
            <div ref={ownerRef}>
              <OwnerDiamond onClick={() => onSelect(P("D"))} />
            </div>
          </div>

          {/* Row 3: Paths (Enterprise / Product) */}
          <div className="grid grid-cols-2 gap-16 mb-12">
            <div ref={enterpriseRef} className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
              <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4 mx-auto inline-flex justify-center">
                ENTERPRISE PATH
              </div>
              <div className="flex items-center justify-between">
                <NodeCircle phase={P("E2")} onClick={onSelect} size={70} />
                <ThinArrow />
                <NodeCircle phase={P("E3")} onClick={onSelect} size={70} />
                <ThinArrow />
                <NodeCircle phase={P("E4")} onClick={onSelect} size={70} />
              </div>
            </div>

            <div ref={productRef} className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
              <div className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold mb-4 mx-auto inline-flex justify-center">
                PRODUCT PATH
              </div>
              <div className="flex items-center justify-between">
                <NodeCircle phase={P("P2")} onClick={onSelect} size={70} />
                <ThinArrow />
                <NodeCircle phase={P("P3")} onClick={onSelect} size={70} />
                <ThinArrow />
                <NodeCircle phase={P("P4")} onClick={onSelect} size={70} />
              </div>
            </div>
          </div>

          {/* Row 4: Architecture & Early QA */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-12">
            <div className="text-center text-blue-700 font-bold mb-4">Architecture & Early QA</div>
            <div className="flex items-center justify-center space-x-16">
              <NodeCircle phase={P("SA")} onClick={onSelect} />
              <ThinArrow />
              <NodeCircle phase={QA1()} onClick={onSelect} />
            </div>
          </div>

          {/* Row 5: Solution Development */}
          <div ref={sdBoxRef} className="bg-pink-50 border-2 border-pink-300 border-dashed rounded-2xl p-6 mb-12">
            <div className="text-center text-pink-700 font-bold mb-4">5 — Solution Development</div>
            <div className="flex items-center justify-center space-x-16">
              <div ref={devRef}>
                <NodeCircle phase={P("5")} onClick={onSelect} />
              </div>
              <div ref={sitRef}>
                <NodeCircle phase={QA2()} onClick={onSelect} />
              </div>
            </div>
          </div>

          {/* Row 6: User Acceptance & Validation */}
          <div ref={uavBoxRef} className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-12">
            <div className="text-center text-purple-700 font-bold mb-4">User Acceptance & Validation</div>
            <div className="flex items-center justify-center space-x-16">
              <div ref={uatRef}>
                <NodeCircle phase={QA3(getPhase)} onClick={onSelect} />
              </div>
              <ThinArrow />
              <NodeCircle phase={P("6")} onClick={onSelect} />
            </div>
          </div>

          {/* Row 7: 7 → 8 → 9 */}
          <div className="flex items-center justify-center space-x-16 mb-2">
            <NodeCircle phase={P("7")} onClick={onSelect} />
            <ThinArrow />
            <NodeCircle phase={P("8")} onClick={onSelect} />
            <ThinArrow />
            <NodeCircle phase={P("9")} onClick={onSelect} />
          </div>

          {/* NOC Check - Positioned on the right side */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 shadow-lg">
              <div className="text-center text-red-700 font-bold mb-2 text-sm">Central Bank NOC Check</div>
              <div className="flex justify-center">
                <NodeCircle phase={NOC()} onClick={onSelect} size={60} />
              </div>
              <div className="text-xs text-red-600 max-w-40 text-center mt-2">
                Parallel validation for regulatory compliance when required
              </div>
            </div>
          </div>

          {/* ====== Curved Arrow Overlay ====== */}
          <ArrowDefs />
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {(() => {
              const ownerBottom = useAnchor(ownerRef, cardRef, "bottom", 6);
              const entTop = useAnchor(enterpriseRef, cardRef, "top", 10);
              const prodTop = useAnchor(productRef, cardRef, "top", 10);

              const devC = useAnchor(devRef, cardRef, "center");
              const sitC = useAnchor(sitRef, cardRef, "center");
              const uatC = useAnchor(uatRef, cardRef, "center");

              const sdBottom = useAnchor(sdBoxRef, cardRef, "bottom", 8);
              const uavTop = useAnchor(uavBoxRef, cardRef, "top", 8);

              return (
                <>
                  {/* Owner → Enterprise (wide left arc) */}
                  <CurvedConnector
                    from={ownerBottom}
                    to={entTop}
                    curvature={0.55}
                    ease="h"
                    color="#94a3b8"
                    arrow="light"
                  />
                  {/* Owner → Product (wide right arc) */}
                  <CurvedConnector
                    from={ownerBottom}
                    to={prodTop}
                    curvature={0.55}
                    ease="h"
                    color="#94a3b8"
                    arrow="light"
                  />

                  {/* Dev ↔ SIT (iteration, dashed) */}

                  {/* Section handoff: SD → UAV (short, darker) */}
                  <CurvedConnector
                    from={sdBottom}
                    to={uavTop}
                    curvature={0.18}
                    ease="v"
                    color="#6b7280"
                    arrow="dark"
                    width={2.8}
                  />
                </>
              );
            })()}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProcessFlowMinimalCanvas2;