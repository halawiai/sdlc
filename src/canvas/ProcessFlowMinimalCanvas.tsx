import React from "react";

/* ======= Types ======= */
type Phase = {
  id: string | number;
  name: string;
  shortName?: string;
  description?: string;
  gradient?: string;
  details?: any;
};

export interface ProcessFlowMinimalCanvasProps {
  getPhase: (id: string) => Phase;        // your toPhase()
  onSelect: (phase: Phase) => void;       // opens modal
}

/* ======= Visual tokens (tight + consistent) ======= */
const T = {
  W: 980,
  H: 760,

  NODE: 78,
  DIAMOND: 58,
  STROKE: 2,

  // rows (y) – tuned to match your PDF’s vertical rhythm
  R0: 110,  // 0 / 1
  R1: 190,  // Owner
  R2: 280,  // Lanes (E2-E4, P2-P4)
  R3: 400,  // SA / QA1
  R4: 490,  // Dev / QA2
  R5: 580,  // QA3
  R6: 665,  // 6 Acceptance
  R7: 725,  // 7/8/9 row

  // columns (x) – tuned for symmetry
  C0: 200,  // 0
  C1: 320,  // 1 + owner
  C2: 220,  // E2 / trunk
  C3: 340,  // E3 / SA / 5 / QA3 / 6 / 8
  C4: 460,  // E4 / QA1 / QA2
  C5: 640,  // P2
  C6: 760,  // P3
  C7: 880,  // P4
  C7a: 410, // 7 (left bottom)
  C9: 560,  // 9 (right bottom)
};

const stroke = "#5f6b7a";
const dash   = "6 6";

/* ======= Helpers ======= */
const pt = (x:number,y:number) => ({x,y});

const ArrowDefs = () => (
  <svg width="0" height="0">
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
        <polygon points="0 0,10 5,0 10" fill={stroke}/>
      </marker>
    </defs>
  </svg>
);

const L = ({a,b}:{a:{x:number;y:number}; b:{x:number;y:number}}) => (
  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
        stroke={stroke} strokeWidth={T.STROKE} strokeLinecap="round" markerEnd="url(#arrow)" />
);

const Q = ({a,c,b,dashed=false}:{a:any;c:any;b:any; dashed?:boolean}) => (
  <path d={`M ${a.x} ${a.y} Q ${c.x} ${c.y} ${b.x} ${b.y}`}
        stroke={stroke} strokeWidth={T.STROKE} fill="none" markerEnd="url(#arrow)"
        strokeDasharray={dashed ? dash : undefined}/>
);

const bubble =
  "rounded-full border border-white/40 bg-gradient-to-br text-white shadow " +
  "flex items-center justify-center font-bold select-none";

const Node = ({p,phase,onClick}:{p:{x:number;y:number};phase:Phase;onClick:()=>void}) => (
  <div className="absolute text-center cursor-pointer"
       style={{left:p.x - T.NODE/2, top:p.y - T.NODE/2, width:T.NODE}}>
    <div className={`${bubble} ${phase.gradient || "from-blue-500 to-blue-600"}`}
         style={{width:T.NODE,height:T.NODE}}>
      <div className="leading-none">
        <div className="text-sm font-extrabold">{String(phase.id)}</div>
        <div className="text-[10px] tracking-wide uppercase">{phase.shortName}</div>
      </div>
    </div>
    <div className="mt-2 w-[140px] -ml-[31px]">
      <div className="text-[12px] font-semibold text-gray-800">{phase.name}</div>
      {phase.description && <div className="text-[10px] text-gray-600">{phase.description}</div>}
    </div>
  </div>
);

const OwnerDiamond = ({p,onClick}:{p:{x:number;y:number};onClick:()=>void}) => (
  <div className="absolute cursor-pointer"
       onClick={onClick}
       style={{
         left:p.x - T.DIAMOND/2, top:p.y - T.DIAMOND/2,
         width:T.DIAMOND, height:T.DIAMOND, transform:"rotate(45deg)"
       }}>
    <div className="w-full h-full bg-amber-50 border-4 border-amber-500 rounded-md flex items-center justify-center shadow">
      <div className="text-[10px] font-bold text-amber-800 -rotate-45 leading-tight text-center">
        Owner<br/>Decision
      </div>
    </div>
  </div>
);

/* ======= Component ======= */
const ProcessFlowMinimalCanvas: React.FC<ProcessFlowMinimalCanvasProps> = ({ getPhase, onSelect }) => {

  const P = (id:string)=>getPhase(id);
  const acceptance = {...P("6"), name:"Business / Product Acceptance", shortName:"ACPT"};

  // Key points
  const p0 = pt(T.C0, T.R0);
  const p1 = pt(T.C1, T.R0);
  const owner = pt(T.C1, T.R1);

  const e2 = pt(T.C2, T.R2), e3 = pt(T.C3, T.R2), e4 = pt(T.C4, T.R2);
  const p2 = pt(T.C5, T.R2), p3 = pt(T.C6, T.R2), p4 = pt(T.C7, T.R2);

  const sa  = pt(T.C3, T.R3), qa1 = pt(T.C4, T.R3);
  const d5  = pt(T.C3, T.R4), qa2 = pt(T.C4, T.R4);
  const qa3 = pt(T.C3, T.R5);
  const a6  = pt(T.C3, T.R6);

  const r7  = pt(T.C7a, T.R7);
  const p8b = pt(T.C3,  T.R7);
  const c9  = pt(T.C9,  T.R7);

  // Lightweight QA pseudo phases (so you keep your modal)
  const QA1 = {id:"QA1", shortName:"QA1", name:"QA: Test Case Prep", description:"Design test cases & acceptance", gradient:"from-indigo-500 to-indigo-600"};
  const QA3 = {id:"QA3", shortName:"QA3", name:"QA: UAT", description:"Formal user acceptance testing", gradient:"from-sky-500 to-sky-600"};

  return (
    <div className="relative mx-auto rounded-2xl bg-white border border-gray-200 shadow"
         style={{width:T.W, height:T.H}}>
      <ArrowDefs/>

      {/* Lane cards */}
      <div className="absolute rounded-xl border border-amber-200 bg-amber-50/40"
           style={{left:T.C2-200, top:T.R2 - T.NODE/2 - 26, width: (T.C4 - (T.C2-200)) + 120, height:T.NODE+90}}/>
      <div className="absolute rounded-xl border border-emerald-200 bg-emerald-50/40"
           style={{left:T.C5-120, top:T.R2 - T.NODE/2 - 26, width: (T.C7 - (T.C5-120)) + 120, height:T.NODE+90}}/>

      {/* Connectors */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* 0 → 1 → Owner */}
        <L a={p0} b={p1}/>
        <L a={pt(p1.x, p1.y + T.NODE/2)} b={pt(owner.x, owner.y - T.DIAMOND/2)}/>

        {/* Owner to lanes */}
        <Q a={owner} c={pt(T.C2-40, T.R1+30)} b={pt(e2.x, e2.y - 30)}/>
        <Q a={owner} c={pt(T.C6+10, T.R1+30)} b={pt(p2.x, p2.y - 30)}/>

        {/* Lane straight chains */}
        <L a={e2} b={e3}/><L a={e3} b={e4}/>
        <L a={p2} b={p3}/><L a={p3} b={p4}/>

        {/* Lane exits to SA */}
        <Q a={e4} c={pt(e4.x+28, e4.y+42)} b={pt(sa.x, sa.y-18)}/>
        <Q a={p4} c={pt(p4.x-28, p4.y+42)} b={pt(sa.x, sa.y-18)}/>

        {/* SA trunk */}
        <L a={pt(sa.x, sa.y+18)} b={pt(d5.x, d5.y-18)}/>
        <L a={d5} b={qa2}/>        {/* Dev → QA2 */}
        <L a={pt(d5.x, d5.y+18)} b={pt(qa3.x, qa3.y-18)}/>  {/* trunk down */}
        <L a={qa3} b={a6}/>
        <L a={a6} b={r7}/>
        <L a={r7} b={p8b}/>
        <L a={p8b} b={c9}/>

        {/* Iteration bubble (dashed oval) around SA/QA1/5/5.1 */}
        <ellipse cx={(sa.x+qa1.x)/2} cy={(sa.y+d5.y)/2} rx={150} ry={62}
                 fill="none" stroke={stroke} strokeWidth={1.5} strokeDasharray={dash}/>
      </svg>

      {/* Nodes */}
      <Node p={p0} phase={P("0")} onClick={()=>onSelect(P("0"))}/>
      <Node p={p1} phase={P("1")} onClick={()=>onSelect(P("1"))}/>
      <OwnerDiamond p={owner} onClick={()=>onSelect({id:"Owner",name:"Owner Decision",shortName:"OWNER",description:"Choose Enterprise vs Product path",gradient:"from-amber-400 to-amber-500"})}/>

      {/* Enterprise */}
      <Node p={e2} phase={P("E2")} onClick={()=>onSelect(P("E2"))}/>
      <Node p={e3} phase={P("E3")} onClick={()=>onSelect(P("E3"))}/>
      <Node p={e4} phase={P("E4")} onClick={()=>onSelect(P("E4"))}/>

      {/* Product */}
      <Node p={p2} phase={P("P2")} onClick={()=>onSelect(P("P2"))}/>
      <Node p={p3} phase={P("P3")} onClick={()=>onSelect(P("P3"))}/>
      <Node p={p4} phase={P("P4")} onClick={()=>onSelect(P("P4"))}/>

      {/* SA + QA1 */}
      <Node p={sa}  phase={P("SA")}      onClick={()=>onSelect(P("SA"))}/>
      <Node p={qa1} phase={QA1 as any}  onClick={()=>onSelect(QA1 as any)}/>

      {/* Dev + QA2 */}
      <Node p={d5}  phase={P("5")}       onClick={()=>onSelect(P("5"))}/>
      <Node p={qa2} phase={{...P("5.1"), shortName:"QA2", name:"QA: SIT"}} onClick={()=>onSelect({...P("5.1"), shortName:"QA2", name:"QA: SIT"})}/>

      {/* QA3 / Acceptance / 7-8-9 */}
      <Node p={qa3} phase={QA3 as any}  onClick={()=>onSelect(QA3 as any)}/>
      <Node p={a6}  phase={acceptance}  onClick={()=>onSelect(acceptance)}/>
      <Node p={r7}  phase={P("7")}       onClick={()=>onSelect(P("7"))}/>
      <Node p={p8b} phase={P("8")}       onClick={()=>onSelect(P("8"))}/>
      <Node p={c9}  phase={P("9")}       onClick={()=>onSelect(P("9"))}/>
    </div>
  );
};

export default ProcessFlowMinimalCanvas;