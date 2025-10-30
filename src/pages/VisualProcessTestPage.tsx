import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  MarkerType,
  Position,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Eye } from 'lucide-react';
import PhaseNode from '../components/PhaseNode';
import InfoBoxNode from '../components/InfoBoxNode';
import DecisionNode from '../components/DecisionNode';
import GroupContainerNode from '../components/GroupContainerNode';
import LegendModal from '../components/LegendModal';
import { lifecycleV25 } from '../data/lifecycleDataV25';

const VisualProcessTestPage: React.FC = () => {
  const [showLegend, setShowLegend] = React.useState(false);
  
  // New state
  const [mode, setMode] = React.useState<'classic'|'compact'>('classic');
  const [layoutUnlocked, setLayoutUnlocked] = React.useState(false);
  const [pinned, setPinned] = React.useState<Set<string>>(() => new Set());

  // Helpers: persistence
  const LS_KEY = (m:string) => `vp-test-layout-${m}`;
  const savePos = (m:string, n:Node) => {
    const map = JSON.parse(localStorage.getItem(LS_KEY(m)) || '{}');
    map[n.id] = n.position; 
    localStorage.setItem(LS_KEY(m), JSON.stringify(map));
  };
  const loadPos = (m:string) => JSON.parse(localStorage.getItem(LS_KEY(m)) || '{}');

  // Info text helpers (keeps content consistent with V25 data)
  const byId = (id:string) => lifecycleV25.find(p => p.id === id);
  const getContent = (id:string, kind:'owner'|'process'|'input'|'output') => {
    const p = byId(id); if (!p) return '';
    if (kind==='owner') return p.owner;
    if (kind==='process') return p.focus;
    if (kind==='input') return (p.input||[]).join(', ');
    if (kind==='output') return (p.output||[]).join(', ');
    return '';
  };
  const getCompactText = (id:string) => {
    const p = byId(id); if (!p) return '';
    return `Owner: ${p.owner} • Process: ${p.focus} • Output: ${(p.output||[]).join(', ')}`;
  };

  // Standard positions
  const basePos = {
    discovery:{x: 40,  y: 280}, initiation:{x: 230, y: 280}, decision:{x: 400, y: 280},
    E2:{x: 560, y: 110}, E3:{x: 760, y: 110}, E4:{x: 960, y: 110},
    P2:{x: 560, y: 450}, P3:{x: 760, y: 450}, P4:{x: 960, y: 450},
    sd:{x: 1060, y: 190, w: 460, h: 260}, dev:{x: 1080, y: 220}, qa:{x: 1080, y: 320},
    uat:{x: 1550, y: 280}, rel:{x: 1680, y: 280}, post:{x: 1810, y: 280}, close:{x: 1940, y: 280},
  };
  
  const withSaved = (m:string, id:string, def:{x:number,y:number}) => {
    const saved = loadPos(m)[id]; 
    return saved ? saved : def;
  };

  // Classic builder (phase + 4 info nodes)
  const addClassicInfo = (nodes:Node[], id:string, pos:{x:number,y:number}, colors:{owner:string,process:string,input:string,output:string}) => {
    const mk = (suffix:string, dx:number, dy:number, label:string, color:string) => nodes.push({
      id: `${suffix}-${id}`, type:'infoBox', position:{ x: pos.x+dx, y: pos.y+dy },
      data:{ type:suffix as any, label: label.toUpperCase(), content: getContent(id, suffix),
        pinId:`${suffix}-${id}`,
        onTogglePin:(pid:string)=> setPinned(p=>{ const n=new Set(p); n.has(pid)?n.delete(pid):n.add(pid); return n; }),
        pinned: pinned.has(`${suffix}-${id}`), accentColor: color }
    } as Node);
    mk('owner',  -170,-110,'Owner',  colors.owner);
    mk('process', 140,-40,'Process', colors.process);
    mk('input',  -190, 60,'Input',   colors.input);
    mk('output',  30, 110,'Output',  colors.output);
  };

  // Compact builder (single card)
  const addCompactInfo = (nodes:Node[], id:string, pos:{x:number,y:number}, accent:string) => {
    nodes.push({
      id:`info-${id}`, type:'infoBox', position:{ x: pos.x-10, y: pos.y-110 },
      data:{ type:'process' as any, label:'INFO', accentColor:accent, pinId:`info-${id}`,
        pinned: pinned.has(`info-${id}`),
        onTogglePin:(pid:string)=> setPinned(p=>{ const n=new Set(p); n.has(pid)?n.delete(pid):n.add(pid); return n; }),
        content: getCompactText(id) }
    } as Node);
  };
  // Click handlers for different node types
  const toggleIdsForPhase = (phaseId:string) => {
    return mode==='classic'
      ? [`owner-${phaseId}`, `process-${phaseId}`, `input-${phaseId}`, `output-${phaseId}`]
      : [`info-${phaseId}`];
  };

  const handleNodeClick = React.useCallback((nodeId: string) => {
    const id = nodeId.replace('phase-',''); // '0','1','E2','P3',...
    const ids = toggleIdsForPhase(id);
    setNodes(ns => ns.map(n => ids.includes(n.id) ? ({ ...n, hidden: !n.hidden }) : n));
  }, [mode]);

  const handleInfoBoxClick = useCallback((nodeId: string) => {
    // No-op for now
  }, []);

  // Create nodes (mode-aware)
  const createNodes = (m:'classic'|'compact' = mode, fresh=false): Node[] => {
    const nodes: Node[] = [];
    const pos = (id:string, def:any)=> fresh?def:withSaved(m, id, def);
    
    // 0 Discovery
    nodes.push({ id:'phase-0', type:'phaseNode', position: pos('phase-0',basePos.discovery),
      data:{ number:'0', name:'DISCOVERY', gradientStart:'#9333ea', gradientEnd:'#7c3aed', onClick: handleNodeClick }});
    m==='classic'
      ? addClassicInfo(nodes,'0', pos('phase-0',basePos.discovery), {owner:'#9333EA',process:'#3B82F6',input:'#10B981',output:'#F59E0B'})
      : addCompactInfo(nodes,'0', pos('phase-0',basePos.discovery), '#9333ea');

    // 1 Initiation
    nodes.push({ id:'phase-1', type:'phaseNode', position: pos('phase-1',basePos.initiation),
      data:{ number:'1', name:'INITIATION', gradientStart:'#3b82f6', gradientEnd:'#2563eb', onClick: handleNodeClick }});
    m==='classic'
      ? addClassicInfo(nodes,'1', pos('phase-1',basePos.initiation), {owner:'#9333EA',process:'#3B82F6',input:'#10B981',output:'#F59E0B'})
      : addCompactInfo(nodes,'1', pos('phase-1',basePos.initiation), '#3b82f6');

    // Decision diamond
    nodes.push({ id:'decision', type:'decisionNode', position: pos('decision',basePos.decision), data:{} });
    m==='classic'
      ? addClassicInfo(nodes,'D', pos('decision',basePos.decision), {owner:'#9333EA',process:'#3B82F6',input:'#10B981',output:'#F59E0B'})
      : addCompactInfo(nodes,'D', pos('decision',basePos.decision), '#6b7280');

    // Enterprise lane
    nodes.push({ id:'phase-E2', type:'phaseNode', position: pos('phase-E2',basePos.E2),
      data:{ number:'2', name:'ENTERPRISE REQUIREMENTS', gradientStart:'#fef3c7', gradientEnd:'#fbbf24', onClick: handleNodeClick }});
    m==='classic'
      ? addClassicInfo(nodes,'E2', pos('phase-E2',basePos.E2), {owner:'#9333EA',process:'#3B82F6',input:'#10B981',output:'#F59E0B'})
      : addCompactInfo(nodes,'E2', pos('phase-E2',basePos.E2), '#fbbf24');
    
    nodes.push({ id:'phase-E3', type:'phaseNode', position: pos('phase-E3',basePos.E3),
      data:{ number:'3', name:'BUSINESS REVIEW', gradientStart:'#fef3c7', gradientEnd:'#fbbf24', onClick: handleNodeClick }});
    m==='classic'
      ? addClassicInfo(nodes,'E3', pos('phase-E3',basePos.E3), {owner:'#9333EA',process:'#3B82F6',input:'#10B981',output:'#F59E0B'})
      : addCompactInfo(nodes,'E3', pos('phase-E3',basePos.E3), '#fbbf24');
    
    nodes.push({ id:'phase-E4', type:'phaseNode', position: pos('phase-E4',basePos.E4),
      data:{ number:'4', name:'PLANNING', gradientStart:'#fef3c7', gradientEnd:'#fbbf24', onClick: handleNodeClick }});
    m==='classic'
      ? addClassicInfo(nodes,'E4', pos('phase-E4',basePos.E4), {owner:'#9333EA',process:'#3B82F6',input:'#10B981',output:'#F59E0B'})
      : addCompactInfo(nodes,'E4', pos('phase-E4',basePos.E4), '#fbbf24');

    // Product lane
    nodes.push({ id:'phase-P2', type:'phaseNode', position: pos('phase-P2',basePos.P2),
      data:{ number:'2', name:'PRODUCT REQUIREMENTS', gradientStart:'#bbf7d0', gradientEnd:'#10b981', onClick: handleNodeClick }});
    m==='classic'
      ? addClassicInfo(nodes,'P2', pos('phase-P2',basePos.P2), {owner:'#9333EA',process:'#3B82F6',input:'#10B981',output:'#F59E0B'})
      : addCompactInfo(nodes,'P2', pos('phase-P2',basePos.P2), '#10b981');
    
    nodes.push({ id:'phase-P3', type:'phaseNode', position: pos('phase-P3',basePos.P3),
      data:{ number:'3', name:'DESIGN', gradientStart:'#bbf7d0', gradientEnd:'#10b981', onClick: handleNodeClick }});
    m==='classic'
      ? addClassicInfo(nodes,'P3', pos('phase-P3',basePos.P3), {owner:'#9333EA',process:'#3B82F6',input:'#10B981',output:'#F59E0B'})
      : addCompactInfo(nodes,'P3', pos('phase-P3',basePos.P3), '#10b981');
    
    nodes.push({ id:'phase-P4', type:'phaseNode', position: pos('phase-P4',basePos.P4),
      data:{ number:'4', name:'GROOMING', gradientStart:'#bbf7d0', gradientEnd:'#10b981', onClick: handleNodeClick }});
    m==='classic'
      ? addClassicInfo(nodes,'P4', pos('phase-P4',basePos.P4), {owner:'#9333EA',process:'#3B82F6',input:'#10B981',output:'#F59E0B'})
      : addCompactInfo(nodes,'P4', pos('phase-P4',basePos.P4), '#10b981');

    // Solution Development container + parallel Dev & QA
    nodes.push({ id:'sd-container', type:'groupContainer', position:{ x: basePos.sd.x, y: basePos.sd.y }, data:{ width: basePos.sd.w, height: basePos.sd.h }});
    nodes.push({ id:'phase-5', type:'phaseNode', position: pos('phase-5',basePos.dev), parentId:'sd-container', extent:'parent',
      data:{ number:'5', name:'DEVELOPMENT', gradientStart:'#93c5fd', gradientEnd:'#60a5fa', onClick: handleNodeClick }});
    m==='classic'
      ? addClassicInfo(nodes,'5', pos('phase-5',basePos.dev), {owner:'#9333EA',process:'#3B82F6',input:'#10B981',output:'#F59E0B'})
      : addCompactInfo(nodes,'5', pos('phase-5',basePos.dev), '#3b82f6');
    
    nodes.push({ id:'phase-5.1', type:'phaseNode', position: pos('phase-5.1',basePos.qa), parentId:'sd-container', extent:'parent',
      data:{ number:'5.1', name:'QA', gradientStart:'#93c5fd', gradientEnd:'#60a5fa', onClick: handleNodeClick }});
    m==='classic'
      ? addClassicInfo(nodes,'5.1', pos('phase-5.1',basePos.qa), {owner:'#9333EA',process:'#3B82F6',input:'#10B981',output:'#F59E0B'})
      : addCompactInfo(nodes,'5.1', pos('phase-5.1',basePos.qa), '#3b82f6');

    // Right column
    nodes.push({ id:'phase-6', type:'phaseNode', position: pos('phase-6',basePos.uat),
      data:{ number:'6', name:'UAT', gradientStart:'#93c5fd', gradientEnd:'#3b82f6', onClick: handleNodeClick }});
    m==='classic'
      ? addClassicInfo(nodes,'6', pos('phase-6',basePos.uat), {owner:'#9333EA',process:'#3B82F6',input:'#10B981',output:'#F59E0B'})
      : addCompactInfo(nodes,'6', pos('phase-6',basePos.uat), '#3b82f6');
    
    nodes.push({ id:'phase-7', type:'phaseNode', position: pos('phase-7',basePos.rel),
      data:{ number:'7', name:'RELEASE MANAGEMENT', gradientStart:'#93c5fd', gradientEnd:'#3b82f6', onClick: handleNodeClick }});
    m==='classic'
      ? addClassicInfo(nodes,'7', pos('phase-7',basePos.rel), {owner:'#9333EA',process:'#3B82F6',input:'#10B981',output:'#F59E0B'})
      : addCompactInfo(nodes,'7', pos('phase-7',basePos.rel), '#3b82f6');
    
    nodes.push({ id:'phase-8', type:'phaseNode', position: pos('phase-8',basePos.post),
      data:{ number:'8', name:'POST IMPLEMENTATION', gradientStart:'#93c5fd', gradientEnd:'#3b82f6', onClick: handleNodeClick }});
    m==='classic'
      ? addClassicInfo(nodes,'8', pos('phase-8',basePos.post), {owner:'#9333EA',process:'#3B82F6',input:'#10B981',output:'#F59E0B'})
      : addCompactInfo(nodes,'8', pos('phase-8',basePos.post), '#3b82f6');
    
    nodes.push({ id:'phase-9', type:'phaseNode', position: pos('phase-9',basePos.close),
      data:{ number:'9', name:'CLOSURE', gradientStart:'#10b981', gradientEnd:'#059669', onClick: handleNodeClick }});
    m==='classic'
      ? addClassicInfo(nodes,'9', pos('phase-9',basePos.close), {owner:'#9333EA',process:'#3B82F6',input:'#10B981',output:'#F59E0B'})
      : addCompactInfo(nodes,'9', pos('phase-9',basePos.close), '#10b981');

    return nodes;
  };

  // Create edges
  const createEdges = (): Edge[] => {
    const E = (id:string, source:string, target:string, targetHandle?:string) => ({
      id, source, target, type:'step',
      ...(targetHandle && { targetHandle }),
      style:{ stroke:'#6b7280', strokeWidth:2 },
      markerEnd:{ type: MarkerType.ArrowClosed, color:'#6b7280' }
    });
    const edges: Edge[] = [];
    edges.push(E('e0-1','phase-0','phase-1'));
    edges.push(E('e1-D','phase-1','decision'));
    // Decision → Enterprise lane
    edges.push(E('eD-E2','decision','phase-E2'));
    edges.push(E('eE2-E3','phase-E2','phase-E3'));
    edges.push(E('eE3-E4','phase-E3','phase-E4'));
    // Decision → Product lane
    edges.push(E('eD-P2','decision','phase-P2'));
    edges.push(E('eP2-P3','phase-P2','phase-P3'));
    edges.push(E('eP3-P4','phase-P3','phase-P4'));
    // Lanes → Solution Development container
    edges.push(E('eE4-sd','phase-E4','sd-container','left'));
    edges.push(E('eP4-sd','phase-P4','sd-container','left'));
    // Container → Development node (internal)
    edges.push(E('esd-5','sd-container','phase-5','left'));
    // Parallel Dev & QA → UAT
    edges.push(E('e5-6','sd-container','phase-6','right'));
    // QA → Dev feedback loop
    edges.push({
      id:'e-feedback', source:'phase-5.1', target:'phase-5', type:'step',
      style:{ stroke:'#EF4444', strokeWidth:2 }, markerEnd:{ type: MarkerType.ArrowClosed, color:'#EF4444' },
      label:'Reiterate until Approved', labelStyle:{ fill:'#EF4444', fontWeight:700, fontSize:12 }, labelBgStyle:{ fill:'#FEF2F2', fillOpacity:0.9 }
    });
    // Right column
    edges.push(E('e6-7','phase-6','phase-7'));
    edges.push(E('e7-8','phase-7','phase-8'));
    edges.push(E('e8-9','phase-8','phase-9'));
    return edges;
  };

  // Node types registration
  const nodeTypes = {
    phaseNode: PhaseNode,
    infoBox: InfoBoxNode,
    decisionNode: DecisionNode,
    groupContainer: GroupContainerNode,
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(createNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(createEdges());

  // Panel controls
  const expandAllInfo = () => setNodes(ns => ns.map(n => n.type === 'infoBox' ? ({ ...n, hidden: false }) : n));
  const collapseAllInfo = () => setNodes(ns => ns.map(n => {
    if (n.type!=='infoBox') return n;
    const isPinned = (n.data?.pinId && pinned.has(n.data.pinId));
    return isPinned ? n : ({ ...n, hidden: true });
  }) );

  return (
    <div className="w-full p-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Eye className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
            Visual Process – Test (React Flow)
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
          Interactive React Flow diagram with navigation controls and minimap
        </p>
      </div>

      {/* React Flow Container */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden" style={{ height: '800px' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          connectionLineType={ConnectionLineType.Step}
          nodesDraggable={layoutUnlocked}
          snapToGrid
          snapGrid={[20,20]}
          onNodeDragStop={(_, node) => savePos(mode, node)}
          fitView
          fitViewOptions={{
            padding: 0.1,
          }}
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.65 }}
        >
          <Background />
          <Controls />
          <MiniMap 
            nodeColor="#3B82F6"
            maskColor="rgba(0, 0, 0, 0.1)"
            position="bottom-right"
          />
          <Panel position="top-left" className="bg-white p-2 rounded shadow-sm border">
            <div className="text-xs text-gray-600">
              Use controls to navigate • Drag to pan • Scroll to zoom
            </div>
            <button className="text-xs px-2 py-1 border rounded mr-2"
              onClick={()=>setMode(m=> m==='classic'?'compact':'classic')}>
              View: {mode==='classic'?'Classic (4 cards)':'Compact (1 card)'}
            </button>
            <button className="text-xs px-2 py-1 border rounded mr-2"
              onClick={()=>setLayoutUnlocked(v=>!v)}>
              {layoutUnlocked?'🔒 Lock layout':'🔓 Unlock layout'}
            </button>
            <button className="text-xs px-2 py-1 border rounded" onClick={expandAllInfo}>📂 Expand All</button>
            <button className="text-xs px-2 py-1 border rounded ml-2" onClick={collapseAllInfo}>📁 Collapse All</button>
            <button className="text-xs px-2 py-1 border rounded ml-2"
              onClick={()=>{ localStorage.removeItem(LS_KEY(mode)); setNodes(createNodes(mode, true)); }}>
              ♻️ Reset layout
            </button>
            <button className="text-xs px-2 py-1 border rounded mr-2"
              onClick={()=>setMode(m=> m==='classic'?'compact':'classic')}>
              View: {mode==='classic'?'Classic (4 cards)':'Compact (1 card)'}
            </button>
            <button className="text-xs px-2 py-1 border rounded mr-2"
              onClick={()=>setLayoutUnlocked(v=>!v)}>
              {layoutUnlocked?'🔒 Lock layout':'🔓 Unlock layout'}
            </button>
            <button className="text-xs px-2 py-1 border rounded" onClick={expandAllInfo}>📂 Expand All</button>
            <button className="text-xs px-2 py-1 border rounded ml-2" onClick={collapseAllInfo}>📁 Collapse All</button>
            <button className="text-xs px-2 py-1 border rounded ml-2"
              onClick={()=>{ localStorage.removeItem(LS_KEY(mode)); setNodes(createNodes(mode, true)); }}>
              ♻️ Reset layout
            </button>
            <button onClick={() => setShowLegend(true)} className="text-xs px-2 py-1 border rounded ml-2">❓ Help & Legend</button>
          </Panel>
        </ReactFlow>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2 font-medium">
            🖱️ Drag to pan the diagram • 🔍 Use mouse wheel to zoom • 📍 Click minimap to navigate • 🎛️ Use controls for precise navigation
          </p>
          <p className="text-xs text-gray-500">
            This React Flow implementation provides enhanced interactivity and navigation capabilities
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-medium">
              📋 Technical Overview: This React Flow implementation displays the complete PMO project lifecycle with interactive nodes. 
              Navigate using the controls, zoom in/out, and interact with the flow diagram. The minimap provides 
              an overview of the entire process flow for easy navigation.
            </p>
          </div>
        </div>
      </div>

      {/* Legend Modal */}
      <LegendModal isOpen={showLegend} onClose={() => setShowLegend(false)} />
    </div>
  );
};

export default VisualProcessTestPage;