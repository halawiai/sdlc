import React, { useEffect } from "react";
import { v25 } from '../data/lifecycleDataV25Details';

type PhaseLike = {
  id: string | number;
  name: string;
  shortName?: string;
  description?: string;
  gradient?: string;
  details?: any;
};

export interface ProcessFlowV2_3CanvasProps {
  getPhase: (id: string) => PhaseLike;
  onSelect: (phase: PhaseLike) => void;
}

/** =========================================
 *   Visual tokens (consistent sizing)
 *  ========================================= */
const TOKENS = {
  NODE: 96,       // was 88
  DIAMOND: 72,    // was 64
  GAP: 40,
  STROKE: 2.5,    // slightly thicker for readability
};

/** Grid (node centers). Adjust x-values as you wish */
const GRID = {
  y: {
    r0: 90,   // 0/1
    r1: 210,  // Owner
    r2: 350,  // Lanes
    r3: 480,  // SA + QA1
    r4: 600,  // Dev + QA2
    r5: 700,  // QA3
    r6: 790,  // Acceptance (6)
    r7: 890,  // 7,8,9
  },
  x: {
    c0: 420, c1: 560,                  // 0,1 (+ Owner)
    e2: 200, e3: 340, e4: 480,
    p2: 700, p3: 840, p4: 980,
    sa: 590,
    qa1: 740,       // pull closer to SA
    d5: 520, q2: 660,
    q3: 590,
    a6: 590,
    r7: 490, p8: 590, c9: 690
  }
};

type Pt = { x:number; y:number };
const pt = (x:number,y:number):Pt => ({x,y});

/** =========================================
 *   Arrow marker defs (once per canvas)
 *  ========================================= */
const ArrowDefs = () => (
  <svg width="0" height="0">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
        <polygon points="0 0,10 5,0 10" fill="#64748B" />
      </marker>
      <marker id="arrow-bold" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
        <polygon points="0 0,10 5,0 10" fill="#2563EB" />
      </marker>
    </defs>
  </svg>
);

const stroke = "#64748B";
const dashed = "6 6";

const L = ({a,b,bold=false}:{a:Pt;b:Pt;bold?:boolean}) => (
  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        stroke={bold ? "#2563EB" : stroke}
        strokeWidth={TOKENS.STROKE}
        strokeLinecap="round"
        markerEnd={`url(#${bold ? "arrow-bold" : "arrow"})`} />
);

const Q = ({a,c,b,isDashed=false}:{a:Pt;c:Pt;b:Pt;isDashed?:boolean}) => (
  <path d={`M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`}
        stroke={stroke}
        strokeWidth={TOKENS.STROKE}
        fill="none"
        markerEnd="url(#arrow)"
        strokeDasharray={isDashed ? dashed : undefined}/>
);

const bubbleClass =
  "mx-auto rounded-full border-2 border-white/40 shadow-lg " +
  "flex items-center justify-center text-white font-bold " +
  "bg-gradient-to-br cursor-pointer hover:scale-110 transition-all duration-200 " +
  "hover:shadow-xl hover:border-white/60";

const NodeBubble = ({ phase, onClick }: { phase: any; onClick: () => void }) => (
  <div className="text-center select-none cursor-pointer" onClick={onClick}>
    <div
      className={`${bubbleClass} ${phase.gradient || "from-blue-500 to-blue-600"}`}
      style={{ width: TOKENS.NODE, height: TOKENS.NODE }}
      title={phase.name}
    >
      <div className="text-center leading-tight">
        <div className="text-lg font-black">{String(phase.id)}</div>
        <div className="text-[9px] font-semibold uppercase tracking-wide">{phase.shortName}</div>
      </div>
    </div>
    <div className="mt-3 max-w-[120px] mx-auto">
      <div className="text-xs font-bold text-gray-800 leading-tight">{phase.name}</div>
      {phase.description && (
        <div className="text-[10px] text-gray-600 leading-tight mt-1">{phase.description}</div>
      )}
    </div>
  </div>
);

const OwnerDiamond = ({onClick}: {onClick: () => void}) => (
  <div
    onClick={onClick}
    className="absolute cursor-pointer hover:scale-105 transition-transform"
    style={{
      left: GRID.x.c1 - TOKENS.DIAMOND/2,
      top:  GRID.y.r1 - TOKENS.DIAMOND/2,
      width: TOKENS.DIAMOND,
      height: TOKENS.DIAMOND,
      transform: "rotate(45deg)"
    }}
  >
    <div className="w-full h-full border-4 border-amber-500 bg-amber-50/80 rounded-md shadow-sm flex items-center justify-center">
      <div style={{transform:"rotate(-45deg)"}} className="text-[10px] text-amber-800 font-bold leading-tight text-center">
        Owner<br/>Decision
      </div>
    </div>
  </div>
);

const AbsNode = ({center, children}: {center: Pt; children: React.ReactNode}) => (
  <div className="absolute" style={{
    left: center.x - TOKENS.NODE/2,
    top:  center.y - TOKENS.NODE/2
  }}>
    {children}
  </div>
);

const ProcessFlowV2_3Canvas: React.FC<ProcessFlowV2_3CanvasProps> = ({
  getPhase,
  onSelect,
}) => {
  useEffect(() => {
    console.log("%c[ProcessFlowV2_3Canvas] mounted v2.3", "color:#2563eb;font-weight:bold");
  }, []);

  const y = GRID.y, x = GRID.x;

  const qa1Phase = () => ({
    id: "QA1",
    name: "QA: Test Case Prep",
    shortName: "QA1",
    description: "Design test cases & acceptance criteria (parallel w/ SA)",
    gradient: "from-indigo-400 to-indigo-600",
    details: { 
      owner:"QA", 
      processFocus:"Prepare test cases", 
      inputs:["Requirements","Designs"], 
      outputs:["TC suite"],
      keyTasks: ['Design test cases', 'Review coverage', 'Align with Dev & Business'],
      phaseGateCriteria: ['Test cases ready', 'Coverage approved'],
      raciMatrix: [{ role: 'QA', description: 'Responsible for preparation' }]
    }
  });

  const qa3Phase = () => ({
    id: "QA3",
    name: "QA: UAT",
    shortName: "QA3",
    description: "Formal user acceptance testing (QA-led)",
    gradient: "from-sky-400 to-sky-600",
    details: { 
      owner:"QA + Business", 
      processFocus:"UAT", 
      inputs:["SIT-passed build"], 
      outputs:["UAT report"],
      keyTasks: ['Run UAT', 'Log defects', 'Support fixes'],
      phaseGateCriteria: ['All UAT defects resolved'],
      raciMatrix: [{ role: 'QA', description: 'Responsible for UAT execution' }]
    }
  });

  const ownerDecisionPhase = () => ({
    id: "Owner",
    name: "Owner Decision",
    shortName: "OWNER",
    description: "Determine project path based on complexity and requirements",
    gradient: "from-amber-400 to-amber-500",
    details: {
      owner: 'Product + PMO',
      processFocus: 'Determine project path based on complexity and requirements',
      inputs: ['Project scope', 'Requirements complexity'],
      outputs: ['Path decision'],
      keyTasks: ['Assess complexity', 'Evaluate resources', 'Choose path'],
      phaseGateCriteria: ['Path determined'],
      raciMatrix: [
        { role: 'Product', description: 'Responsible for complexity assessment' },
        { role: 'PMO', description: 'Accountable for path approval' }
      ]
    }
  });

  const P = (id: string) => getPhase(id);

  const acceptance = {
    ...P("6"),
    name: "Business / Product Acceptance",
    shortName: "ACPT"
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-[radial-gradient(#e5e7eb_0.7px,transparent_0.7px)] [background-size:14px_14px] bg-white border border-gray-200 shadow-sm" style={{ height: '1200px', minWidth: '1200px' }}>
      <div className="absolute bottom-2 right-3 text-[10px] text-gray-500">
        Canvas v2.3 — live
      </div>
      
      <ArrowDefs/>

      {/* Enterprise Path Background */}
      <div
        className="absolute rounded-2xl border border-amber-200/70 bg-amber-50/50"
        style={{
          left: GRID.x.e2 - TOKENS.NODE/2 - 32,
          top:  GRID.y.r2 - TOKENS.NODE/2 - 36,
          width: (GRID.x.e4 - GRID.x.e2) + TOKENS.NODE + 64,
          height: TOKENS.NODE + 72
        }}
      />
      
      {/* Product Path Background */}
      <div
        className="absolute rounded-2xl border border-emerald-200/70 bg-emerald-50/50"
        style={{
          left: GRID.x.p2 - TOKENS.NODE/2 - 32,
          top:  GRID.y.r2 - TOKENS.NODE/2 - 36,
          width: (GRID.x.p4 - GRID.x.p2) + TOKENS.NODE + 64,
          height: TOKENS.NODE + 72
        }}
      />

      {/* SVG Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <L a={pt(x.c0,y.r0)} b={pt(x.c1,y.r0)} />
        <L a={pt(x.c1,y.r0 + TOKENS.NODE/2)} b={pt(x.c1,y.r1 - TOKENS.DIAMOND/2)} />
        <Q a={pt(x.c1,y.r1)} c={pt(x.e3, y.r1+20)} b={pt(x.e2,y.r2-36)} />
        <Q a={pt(x.c1,y.r1)} c={pt(x.p3, y.r1+20)} b={pt(x.p2,y.r2-36)} />
        <L a={pt(x.e2,y.r2)} b={pt(x.e3,y.r2)} />
        <L a={pt(x.e3,y.r2)} b={pt(x.e4,y.r2)} />
        <L a={pt(x.p2,y.r2)} b={pt(x.p3,y.r2)} />
        <L a={pt(x.p3,y.r2)} b={pt(x.p4,y.r2)} />
        <Q a={pt(x.e4,y.r2)} c={pt(x.e4+30, y.r2+36)} b={pt(x.sa,y.r3-20)} />
        <Q a={pt(x.p4,y.r2)} c={pt(x.p4-30, y.r2+36)} b={pt(x.sa,y.r3-20)} />
        <L a={pt(x.sa,y.r3+20)} b={pt(x.sa,y.r4-24)} />
        <L a={pt(x.sa,y.r4-24)} b={pt(x.d5,y.r4-24)} />
        <L a={pt(x.d5,y.r4)} b={pt(x.q2,y.r4)} />
        <L a={pt(x.sa,y.r4+24)} b={pt(x.q3,y.r5-24)} />
        <L a={pt(x.q3,y.r5)} b={pt(x.a6,y.r6)} />
        <L a={pt(x.a6,y.r6)} b={pt(x.r7,y.r7)} />
        <L a={pt(x.r7,y.r7)} b={pt(x.p8,y.r7)} />
        <L a={pt(x.p8,y.r7)} b={pt(x.c9,y.r7)} />
        <Q a={pt(x.qa1-36, y.r3+6)} c={pt(x.qa1-70, y.r3-58)} b={pt(x.sa, y.r3-6)} isDashed />
        <Q a={pt(x.q2, y.r4+8)} c={pt(x.q2-10, y.r4+62)} b={pt(x.d5, y.r4+8)} isDashed />
        <Q a={pt(x.q3, y.r5+8)} c={pt(x.q3-24, y.r5+76)} b={pt(x.d5, y.r4+8)} isDashed />
      </svg>

      {/* Phase Nodes */}
      <AbsNode center={pt(x.c0,y.r0)}>
        <NodeBubble phase={P("0")} onClick={()=>onSelect(P("0"))} />
      </AbsNode>
      <AbsNode center={pt(x.c1,y.r0)}>
        <NodeBubble phase={P("1")} onClick={()=>onSelect(P("1"))} />
      </AbsNode>

      <OwnerDiamond onClick={()=>onSelect(ownerDecisionPhase())} />

      {/* Path Labels */}
      <div className="absolute left-[150px] top-[320px] text-amber-800 text-sm font-bold bg-amber-100 border border-amber-300 rounded-lg px-3 py-1 shadow-sm">
        Enterprise Path
      </div>
      <div className="absolute left-[750px] top-[320px] text-emerald-800 text-sm font-bold bg-emerald-100 border border-emerald-300 rounded-lg px-3 py-1 shadow-sm">
        Product Path
      </div>

      {/* Enterprise Lane */}
      <AbsNode center={pt(x.e2,y.r2)}><NodeBubble phase={P("E2")} onClick={()=>onSelect(P("E2"))}/></AbsNode>
      <AbsNode center={pt(x.e3,y.r2)}><NodeBubble phase={P("E3")} onClick={()=>onSelect(P("E3"))}/></AbsNode>
      <AbsNode center={pt(x.e4,y.r2)}><NodeBubble phase={P("E4")} onClick={()=>onSelect(P("E4"))}/></AbsNode>

      {/* Product Lane */}
      <AbsNode center={pt(x.p2,y.r2)}><NodeBubble phase={P("P2")} onClick={()=>onSelect(P("P2"))}/></AbsNode>
      <AbsNode center={pt(x.p3,y.r2)}><NodeBubble phase={P("P3")} onClick={()=>onSelect(P("P3"))}/></AbsNode>
      <AbsNode center={pt(x.p4,y.r2)}><NodeBubble phase={P("P4")} onClick={()=>onSelect(P("P4"))}/></AbsNode>

      {/* Solution Architecture */}
      <AbsNode center={pt(x.sa,y.r3)}>
        <NodeBubble phase={P("SA")} onClick={()=>onSelect(P("SA"))}/>
      </AbsNode>
      <AbsNode center={pt(x.qa1,y.r3)}>
        <NodeBubble phase={qa1Phase()} onClick={()=>onSelect(qa1Phase())}/>
      </AbsNode>

      {/* Solution Development Label */}
      <div className="absolute left-[450px] top-[570px] text-pink-800 text-sm font-bold bg-pink-50 border border-pink-200 rounded-lg px-3 py-1">
        5 — Solution Development
      </div>

      {/* Development & QA */}
      <AbsNode center={pt(x.d5,y.r4)}>
        <NodeBubble phase={P("5")} onClick={()=>onSelect(P("5"))}/>
      </AbsNode>
      <AbsNode center={pt(x.q2,y.r4)}>
        <NodeBubble phase={{...P("5.1"), name:"QA: SIT", shortName:"QA2"}} onClick={()=>onSelect({...P("5.1"), name:"QA: SIT", shortName:"QA2"})}/>
      </AbsNode>

      {/* QA UAT */}
      <AbsNode center={pt(x.q3,y.r5)}>
        <NodeBubble phase={qa3Phase()} onClick={()=>onSelect(qa3Phase())}/>
      </AbsNode>

      {/* Acceptance */}
      <AbsNode center={pt(x.a6,y.r6)}>
        <NodeBubble phase={acceptance} onClick={()=>onSelect(acceptance)}/>
      </AbsNode>

      {/* Final Phases */}
      <AbsNode center={pt(x.r7,y.r7)}><NodeBubble phase={P("7")} onClick={()=>onSelect(P("7"))}/></AbsNode>
      <AbsNode center={pt(x.p8,y.r7)}><NodeBubble phase={P("8")} onClick={()=>onSelect(P("8"))}/></AbsNode>
      <AbsNode center={pt(x.c9,y.r7)}><NodeBubble phase={P("9")} onClick={()=>onSelect(P("9"))}/></AbsNode>
    </div>
  );
};

export default ProcessFlowV2_3Canvas;