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

export interface ProcessFlowV4CanvasProps {
  getPhase: (id: string) => PhaseLike;
  onSelect: (phase: PhaseLike) => void;
}

/** =========================================
 *   Visual tokens (improved spacing)
 *  ========================================= */
const TOKENS = {
  NODE: 96,
  DIAMOND: 72,
  GAP: 60,        // Increased from 40
  STROKE: 2.5,
};

/** Grid with much better spacing */
const GRID = {
  y: {
    r0: 140,   // Discovery/Initiation
    r1: 320,   // Owner Decision - much more space
    r2: 500,   // Lanes - more space  
    r3: 680,   // SA/QA1 - more space
    r4: 860,   // Development - more space
    r5: 1040,  // QA3 - more space
    r6: 1220,  // Acceptance - more space
    r7: 1400,  // Final phases - more space
  },
  x: {
    c0: 420, c1: 580,                  // slightly more space
    e2: 160, e3: 340, e4: 520,         
    p2: 740, p3: 920, p4: 1100,        
    sa: 630,
    qa1: 800,       // move QA1 even further right
    d5: 530, q2: 710,                  
    q3: 630,
    a6: 630,
    r7: 480, p8: 630, c9: 780          
  }
};

type Pt = { x:number; y:number };
const pt = (x:number,y:number):Pt => ({x,y});

/** Arrow marker definitions */
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
    {/* Improved text positioning with better word wrapping */}
    <div className="mt-6 max-w-[160px] mx-auto px-2">
      <div className="text-sm font-bold text-gray-800 leading-tight mb-2 break-words text-center">
        {phase.name}
      </div>
      <div className="text-sm font-bold text-gray-800 leading-tight mb-2">{phase.name}</div>
      {phase.description && (
        <div className="text-xs text-gray-600 leading-relaxed break-words text-center">
          {phase.description}
        </div>
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
  <div className="absolute flex flex-col items-center" style={{
    left: center.x - 80,  // Slightly wider centering
    top:  center.y - TOKENS.NODE/2,
    width: 160,           // Wider fixed width for better text flow
    minHeight: TOKENS.NODE + 120
  }}>
    {children}
  </div>
);

const ProcessFlowV4Canvas: React.FC<ProcessFlowV4CanvasProps> = ({
  getPhase,
  onSelect,
}) => {
  useEffect(() => {
    console.log("%c[ProcessFlowV4Canvas] mounted v4.0 - IMPROVED LAYOUT", "color:#10b981;font-weight:bold");
  }, []);

  const y = GRID.y, x = GRID.x;

  const qa1Phase = () => ({
    id: "QA1",
    name: "QA: Test Case Prep",
    shortName: "QA1",
    description: "Design test cases & acceptance criteria",
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
    description: "Formal user acceptance testing",
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
    description: "Determine project path based on complexity",
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
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 shadow-lg" style={{ height: '1700px', minWidth: '1500px' }}>
      {/* Professional header */}
      <div className="absolute top-4 left-6 text-gray-700">
        <h2 className="text-lg font-bold mb-1">PMO Process Flow v4.0</h2>
        <p className="text-sm text-gray-500">Product + PMO + BA Process - HALA 2025</p>
      </div>
      
      <div className="absolute bottom-4 right-4 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        Canvas v4.0 — IMPROVED LAYOUT
      </div>
      
      <ArrowDefs/>

      {/* Enterprise Path Background */}
      <div
        className="absolute rounded-2xl border border-amber-200/70 bg-amber-50/30"
        style={{
          left: GRID.x.e2 - TOKENS.NODE/2 - 50,
          top:  GRID.y.r2 - TOKENS.NODE/2 - 60,
          width: (GRID.x.e4 - GRID.x.e2) + TOKENS.NODE + 100,
          height: TOKENS.NODE + 120
        }}
      />
      
      {/* Product Path Background */}
      <div
        className="absolute rounded-2xl border border-emerald-200/70 bg-emerald-50/30"
        style={{
          left: GRID.x.p2 - TOKENS.NODE/2 - 50,
          top:  GRID.y.r2 - TOKENS.NODE/2 - 60,
          width: (GRID.x.p4 - GRID.x.p2) + TOKENS.NODE + 100,
          height: TOKENS.NODE + 120
        }}
      />

      {/* Solution Development Background */}
      <div
        className="absolute rounded-2xl border-2 border-dashed border-pink-400/70 bg-pink-50/30"
        style={{
          left: GRID.x.d5 - TOKENS.NODE/2 - 50,
          top:  GRID.y.r4 - TOKENS.NODE/2 - 60,
          width: (GRID.x.q2 - GRID.x.d5) + TOKENS.NODE + 100,
          height: TOKENS.NODE + 120
        }}
      />

      {/* SVG Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <L a={pt(x.c0,y.r0)} b={pt(x.c1,y.r0)} />
        <L a={pt(x.c1,y.r0 + TOKENS.NODE/2)} b={pt(x.c1,y.r1 - TOKENS.DIAMOND/2)} />
        <Q a={pt(x.c1,y.r1)} c={pt(x.e3, y.r1+40)} b={pt(x.e2,y.r2-60)} />
        <Q a={pt(x.c1,y.r1)} c={pt(x.p3, y.r1+40)} b={pt(x.p2,y.r2-60)} />
        <L a={pt(x.e2,y.r2)} b={pt(x.e3,y.r2)} />
        <L a={pt(x.e3,y.r2)} b={pt(x.e4,y.r2)} />
        <L a={pt(x.p2,y.r2)} b={pt(x.p3,y.r2)} />
        <L a={pt(x.p3,y.r2)} b={pt(x.p4,y.r2)} />
        <Q a={pt(x.e4,y.r2)} c={pt(x.e4+40, y.r2+60)} b={pt(x.sa,y.r3-40)} />
        <Q a={pt(x.p4,y.r2)} c={pt(x.p4-40, y.r2+60)} b={pt(x.sa,y.r3-40)} />
        <L a={pt(x.sa,y.r3+40)} b={pt(x.sa,y.r4-40)} />
        <L a={pt(x.sa,y.r4-40)} b={pt(x.d5,y.r4-40)} />
        <L a={pt(x.d5,y.r4)} b={pt(x.q2,y.r4)} />
        <L a={pt(x.sa,y.r4+40)} b={pt(x.q3,y.r5-40)} />
        <L a={pt(x.q3,y.r5)} b={pt(x.a6,y.r6)} />
        <L a={pt(x.a6,y.r6)} b={pt(x.r7,y.r7)} />
        <L a={pt(x.r7,y.r7)} b={pt(x.p8,y.r7)} />
        <L a={pt(x.p8,y.r7)} b={pt(x.c9,y.r7)} />
        <Q a={pt(x.qa1-40, y.r3+10)} c={pt(x.qa1-80, y.r3-80)} b={pt(x.sa, y.r3-10)} isDashed />
        <Q a={pt(x.q2, y.r4+10)} c={pt(x.q2-20, y.r4+100)} b={pt(x.d5, y.r4+10)} isDashed />
        <Q a={pt(x.q3, y.r5+10)} c={pt(x.q3-40, y.r5+120)} b={pt(x.d5, y.r4+10)} isDashed />
      </svg>

      {/* Path Labels with better styling */}
      <div className="absolute left-[100px] top-[450px]">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold rounded-full px-4 py-2 shadow-lg border-2 border-white">
          Enterprise Path
        </div>
      </div>
      <div className="absolute left-[780px] top-[450px]">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-bold rounded-full px-4 py-2 shadow-lg border-2 border-white">
          Product Path
        </div>
      </div>

      {/* Solution Development Label with better styling */}
      <div className="absolute left-[500px] top-[850px]">
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white text-sm font-bold rounded-full px-4 py-2 shadow-lg border-2 border-white">
          5 — Solution Development
        </div>
      </div>

      {/* Phase Nodes */}
      <AbsNode center={pt(x.c0,y.r0)}>
        <NodeBubble phase={P("0")} onClick={()=>onSelect(P("0"))} />
      </AbsNode>
      <AbsNode center={pt(x.c1,y.r0)}>
        <NodeBubble phase={P("1")} onClick={()=>onSelect(P("1"))} />
      </AbsNode>

      <OwnerDiamond onClick={()=>onSelect(ownerDecisionPhase())} />

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

export default ProcessFlowV4Canvas;
