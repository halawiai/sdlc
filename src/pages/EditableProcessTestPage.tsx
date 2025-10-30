import React, { useCallback, useRef, useState, useEffect, useMemo } from 'react';
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
  addEdge,
  Connection,
  updateEdge,
  Panel,
  ReactFlowProvider,
  BackgroundVariant,
  useReactFlow,
  EdgeChange,
  NodeChange
} from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import { 
  Settings, Save, Upload, RefreshCw, Info, Plus, Trash2, 
  Edit2, Copy, Undo, Redo, ZoomIn, ZoomOut, Download,
  MousePointer, Move, Link, Square, Circle, Palette,
  Target, Play, GitBranch, CheckCircle, Users, Code, Bug,
  UserCheck, Rocket, Monitor, Archive, ChevronDown, ChevronUp, X
} from 'lucide-react';
import EditablePhaseNode from '../components/editable/EditablePhaseNode';
import EditableInfoBoxNode from '../components/editable/EditableInfoBoxNode';
import EditableConnectionLine from '../components/editable/EditableConnectionLine';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

interface LegendPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegendPopup: React.FC<LegendPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Process Flow Legend - v25</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Process Paths */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Process Paths</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="font-semibold text-green-800">Product Path</span>
                </div>
                <p className="text-sm text-green-700">For simple product enhancements and features</p>
                <div className="mt-2 text-xs text-green-600">
                  Discovery → Initiation → Owner Decision → Requirements → Design → Grooming → Development
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="font-semibold text-blue-800">Enterprise Path</span>
                </div>
                <p className="text-sm text-blue-700">For complex enterprise initiatives</p>
                <div className="mt-2 text-xs text-blue-600">
                  Discovery → Initiation → Owner Decision → Requirements → Business Approval → Planning → Development
                </div>
              </div>
            </div>
          </div>

          {/* Phase Types */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Phase Types</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded">
                <Target className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-800">Discovery</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                <Play className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800">Initiation</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-amber-50 rounded">
                <GitBranch className="w-4 h-4 text-amber-600" />
                <span className="text-sm text-amber-800">Decision Point</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Settings className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-800">Requirements</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-teal-50 rounded">
                <Code className="w-4 h-4 text-teal-600" />
                <span className="text-sm text-teal-800">Development</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                <Monitor className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">Post-Implementation</span>
              </div>
            </div>
          </div>

          {/* Decision Criteria */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Decision Criteria</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-800">Choose Product Path When:</h4>
                <ul className="text-sm text-green-700 mt-1 space-y-1">
                  <li>• Simple product enhancements or bug fixes</li>
                  <li>• Clear requirements with minimal complexity</li>
                  <li>• Low business risk and impact</li>
                  <li>• Well-understood technical scope</li>
                </ul>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-800">Choose Enterprise Path When:</h4>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  <li>• Complex enterprise-wide initiatives</li>
                  <li>• Requires formal business approval</li>
                  <li>• High business impact or regulatory requirements</li>
                  <li>• Significant resource allocation needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Interaction Guide */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">How to Use</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">Phase Interaction:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Click phase circles to expand/collapse details</li>
                  <li>• Double-click to edit phase names</li>
                  <li>• Drag to reposition phases</li>
                  <li>• Right-click for context menu</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">Editing Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Double-click info boxes to edit content</li>
                  <li>• Double-click connections to add labels</li>
                  <li>• Use toolbar for save/load/export</li>
                  <li>• Undo/Redo with Ctrl+Z/Y</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditableProcessTestPage: React.FC = () => {
  const edgeUpdateSuccessful = useRef(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'move' | 'connect'>('select');
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [clipboard, setClipboard] = useState<Node | null>(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedPhases, setExpandedPhases] = useState<string[]>([]);
  const [showLegend, setShowLegend] = useState(false);
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    type: 'node' | 'edge';
    id: string;
  }>({ show: false, x: 0, y: 0, type: 'node', id: '' });

  // Toggle phase expansion
  const togglePhaseExpansion = useCallback((phaseId: string) => {
    setExpandedPhases(prev => 
      prev.includes(phaseId) 
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  }, []);

  // Process data for v25
  const processDataV25 = useMemo(() => {
    const phases = [
      {
        id: '0',
        name: 'DISCOVERY',
        icon: Target,
        color: '#7C2D92',
        gradient: 'from-purple-600 to-purple-700',
        description: 'Initial phase to identify and define project scope, objectives, and key stakeholders',
        owner: 'Product, Business, Stakeholders',
        process: 'Initial phase to identify and define project scope, objectives, and key stakeholders',
        inputs: ['Business needs', 'Market research', 'Stakeholder input'],
        outputs: ['Project scope', 'Objectives definition', 'Key stakeholder identification'],
        position: { x: 200, y: 400 }
      },
      {
        id: '1',
        name: 'INITIATION',
        icon: Play,
        color: '#3B82F6',
        gradient: 'from-blue-500 to-blue-600',
        description: 'Formal project start with charter creation and initial resource allocation',
        owner: 'Product, Business, PMO',
        process: 'Formal project start with charter creation and initial resource allocation',
        inputs: ['Project scope', 'Objectives', 'Stakeholder requirements'],
        outputs: ['Project charter', 'Initial resource allocation', 'Project classification decision'],
        position: { x: 500, y: 400 }
      },
      {
        id: '1.1',
        name: 'OWNER DECISION',
        icon: GitBranch,
        color: '#F59E0B',
        gradient: 'from-amber-500 to-amber-600',
        description: 'Critical branching point: Product vs Enterprise initiative classification',
        owner: 'Product, PMO',
        process: 'Critical branching point: Product vs Enterprise initiative classification',
        inputs: ['Project charter', 'Complexity assessment', 'Resource requirements'],
        outputs: ['Path determination', 'Classification decision', 'Next phase routing'],
        position: { x: 800, y: 400 }
      },
      // Product Path
      {
        id: '2',
        name: 'REQUIREMENTS',
        icon: Settings,
        color: '#10B981',
        gradient: 'from-green-500 to-green-600',
        description: 'Detailed product requirements gathering and documentation',
        owner: 'Product, BA',
        process: 'Detailed product requirements gathering and documentation',
        inputs: ['Project charter', 'Product vision'],
        outputs: ['Product requirements document', 'User stories', 'Acceptance criteria'],
        position: { x: 1100, y: 200 },
        path: 'product'
      },
      {
        id: '3',
        name: 'DESIGN',
        icon: Settings,
        color: '#10B981',
        gradient: 'from-green-500 to-green-600',
        description: 'Product architecture, UI/UX, and system design creation',
        owner: 'Design, Product, Engineering',
        process: 'Product architecture, UI/UX, and system design creation',
        inputs: ['Product requirements', 'User stories'],
        outputs: ['Design documents', 'UI/UX prototypes', 'Technical architecture'],
        position: { x: 1400, y: 200 },
        path: 'product'
      },
      {
        id: '4',
        name: 'GROOMING',
        icon: CheckCircle,
        color: '#10B981',
        gradient: 'from-green-500 to-green-600',
        description: 'Final review and refinement of project backlog and requirements',
        owner: 'Product, Engineering, BA',
        process: 'Final review and refinement of project backlog and requirements',
        inputs: ['Design documents', 'Requirements', 'Technical architecture'],
        outputs: ['Refined backlog', 'Sprint-ready stories', 'Implementation plan'],
        position: { x: 1700, y: 200 },
        path: 'product'
      },
      // Enterprise Path
      {
        id: '2.1',
        name: 'REQUIREMENTS',
        icon: Settings,
        color: '#3B82F6',
        gradient: 'from-blue-500 to-blue-600',
        description: 'Enterprise-level requirements gathering and documentation',
        owner: 'BA, Enterprise Architecture, Business',
        process: 'Enterprise-level requirements gathering and documentation',
        inputs: ['Project charter', 'Enterprise standards'],
        outputs: ['Business requirements document', 'Enterprise requirements', 'Compliance requirements'],
        position: { x: 1100, y: 600 },
        path: 'enterprise'
      },
      {
        id: '3.1',
        name: 'BUSINESS APPROVAL',
        icon: Users,
        color: '#3B82F6',
        gradient: 'from-blue-500 to-blue-600',
        description: 'Formal approval from key business stakeholders and leadership',
        owner: 'Business Leadership, Stakeholders',
        process: 'Formal approval from key business stakeholders and leadership',
        inputs: ['Business requirements', 'Enterprise requirements', 'Budget estimates'],
        outputs: ['Business approval', 'Budget approval', 'Go/No-go decision'],
        position: { x: 1400, y: 600 },
        path: 'enterprise'
      },
      {
        id: '4.1',
        name: 'PLANNING',
        icon: CheckCircle,
        color: '#3B82F6',
        gradient: 'from-blue-500 to-blue-600',
        description: 'Detailed implementation planning including timelines, resources, and dependencies',
        owner: 'PMO, Product, QA',
        process: 'Detailed implementation planning including timelines, resources, and dependencies',
        inputs: ['Approved requirements', 'Business approval', 'Resource constraints'],
        outputs: ['Project plan', 'Resource allocation', 'Test strategy', 'Timeline', 'Risk register'],
        position: { x: 1700, y: 600 },
        path: 'enterprise'
      },
      // Common Process Steps
      {
        id: '5',
        name: 'DEVELOPMENT',
        icon: Code,
        color: '#06B6D4',
        gradient: 'from-cyan-500 to-cyan-600',
        description: 'Coding and building of the solution',
        owner: 'Engineering, Product',
        process: 'Coding and building of the solution',
        inputs: ['Requirements', 'Design specs', 'Implementation plan'],
        outputs: ['Working solution', 'Technical documentation', 'Unit tests'],
        position: { x: 2000, y: 400 }
      },
      {
        id: '5.1',
        name: 'QA',
        icon: Bug,
        color: '#06B6D4',
        gradient: 'from-cyan-500 to-cyan-600',
        description: 'Quality assurance testing to identify and fix defects',
        owner: 'QA, Engineering',
        process: 'Quality assurance testing to identify and fix defects',
        inputs: ['Working solution', 'Test cases', 'Requirements'],
        outputs: ['Test results', 'Bug reports', 'Quality certification'],
        position: { x: 2000, y: 200 }
      },
      {
        id: '6',
        name: 'UAT',
        icon: UserCheck,
        color: '#8B5CF6',
        gradient: 'from-purple-500 to-purple-600',
        description: 'End-user testing to ensure solution meets business requirements',
        owner: 'Business Users, BA, QA',
        process: 'End-user testing to ensure solution meets business requirements',
        inputs: ['Tested solution', 'Business requirements', 'User scenarios'],
        outputs: ['User acceptance', 'Business sign-off', 'Go-live approval'],
        position: { x: 2300, y: 400 }
      },
      {
        id: '7',
        name: 'RELEASE MANAGEMENT',
        icon: Rocket,
        color: '#F59E0B',
        gradient: 'from-orange-500 to-orange-600',
        description: 'Planning, scheduling, and controlling release into production',
        owner: 'Release Management, Engineering, PMO',
        process: 'Planning, scheduling, and controlling release into production',
        inputs: ['Approved solution', 'Release plan', 'Deployment checklist'],
        outputs: ['Production deployment', 'Release notes', 'Rollback plan'],
        position: { x: 2600, y: 400 }
      },
      {
        id: '8',
        name: 'POST IMPLEMENTATION',
        icon: Monitor,
        color: '#EF4444',
        gradient: 'from-red-500 to-red-600',
        description: 'Support, monitoring, and addressing initial issues post-deployment',
        owner: 'Engineering, PMO, Support',
        process: 'Support, monitoring, and addressing initial issues post-deployment',
        inputs: ['Deployed solution', 'Monitoring tools', 'Support procedures'],
        outputs: ['Performance metrics', 'Issue resolution', 'Optimization recommendations'],
        position: { x: 2900, y: 400 }
      },
      {
        id: '9',
        name: 'CLOSURE',
        icon: Archive,
        color: '#6B7280',
        gradient: 'from-gray-500 to-gray-600',
        description: 'Final project completion, resource release, and review',
        owner: 'PMO, Product, Business',
        process: 'Final project completion, resource release, and review',
        inputs: ['Project deliverables', 'Performance data', 'Lessons learned'],
        outputs: ['Project closure report', 'Resource release', 'Knowledge transfer', 'Archive package'],
        position: { x: 3200, y: 400 }
      }
    ];

    const edges = [
      // Main flow
      { id: 'e0-1', source: '0', target: '1' },
      { id: 'e1-1.1', source: '1', target: '1.1' },
      
      // Product path
      { id: 'e1.1-2', source: '1.1', target: '2', label: 'Product Path' },
      { id: 'e2-3', source: '2', target: '3' },
      { id: 'e3-4', source: '3', target: '4' },
      { id: 'e4-5', source: '4', target: '5' },
      
      // Enterprise path
      { id: 'e1.1-2.1', source: '1.1', target: '2.1', label: 'Enterprise Path' },
      { id: 'e2.1-3.1', source: '2.1', target: '3.1' },
      { id: 'e3.1-4.1', source: '3.1', target: '4.1' },
      { id: 'e4.1-5', source: '4.1', target: '5' },
      { id: 'e4.1-6', source: '4.1', target: '6', label: 'Direct to UAT' },
      
      // Common flow
      { id: 'e5-5.1', source: '5', target: '5.1', label: 'Parallel QA' },
      { id: 'e5.1-5', source: '5.1', target: '5', label: 'Feedback Loop' },
      { id: 'e5-6', source: '5', target: '6' },
      { id: 'e6-7', source: '6', target: '7' },
      { id: 'e7-8', source: '7', target: '8' },
      { id: 'e8-9', source: '8', target: '9' }
    ];

    return { phases, edges };
  }, []);

  // Stable initial data using useMemo to prevent recreation on every render
  const initialData = useMemo(() => {
    const { phases, edges } = processDataV25;
    const nodes: Node[] = [];

    // Create phase nodes
    phases.forEach((phase) => {
      // Main phase node
      nodes.push({
        id: `phase-${phase.id}`,
        type: 'editablePhaseNode',
        position: phase.position,
        data: {
          number: phase.id,
          name: phase.name,
          gradientStart: phase.color,
          gradientEnd: phase.color,
          onTextChange: null, // Will be set after initialization
          onClick: () => togglePhaseExpansion(`phase-${phase.id}`),
          isExpanded: false,
          expandIcon: ChevronDown
        }
      });

      // Info boxes (initially hidden)
      const baseX = phase.position.x;
      const baseY = phase.position.y;

      // Owner box
      nodes.push({
        id: `owner-${phase.id}`,
        type: 'editableInfoBoxNode',
        position: { x: baseX - 250, y: baseY - 150 },
        data: {
          type: 'owner' as const,
          label: 'OWNER',
          content: phase.owner,
          onTextChange: null, // Will be set after initialization
          isVisible: false
        },
        hidden: true
      });

      // Process box
      nodes.push({
        id: `process-${phase.id}`,
        type: 'editableInfoBoxNode',
        position: { x: baseX + 150, y: baseY - 150 },
        data: {
          type: 'process' as const,
          label: 'PROCESS',
          content: phase.process,
          onTextChange: null, // Will be set after initialization
          isVisible: false
        },
        hidden: true
      });

      // Input box
      nodes.push({
        id: `input-${phase.id}`,
        type: 'editableInfoBoxNode',
        position: { x: baseX - 250, y: baseY + 100 },
        data: {
          type: 'input' as const,
          label: 'INPUT',
          content: phase.inputs.join(', '),
          onTextChange: null, // Will be set after initialization
          isVisible: false
        },
        hidden: true
      });

      // Output box
      nodes.push({
        id: `output-${phase.id}`,
        type: 'editableInfoBoxNode',
        position: { x: baseX + 150, y: baseY + 100 },
        data: {
          type: 'output' as const,
          label: 'OUTPUT',
          content: phase.outputs.join(', '),
          onTextChange: null, // Will be set after initialization
          isVisible: false
        },
        hidden: true
      });
    });

    // Create edges
    const edgeNodes: Edge[] = edges.map(edge => ({
      id: edge.id,
      source: `phase-${edge.source}`,
      target: `phase-${edge.target}`,
      type: 'editableConnection',
      data: {
        label: edge.label || '',
        color: '#6B7280',
        width: 2,
        dashed: false,
        onLabelChange: null // Will be set after initialization
      }
    }));

    return { nodes, edges: edgeNodes };
  }, [processDataV25, togglePhaseExpansion]);

  // Initialize nodes and edges state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update node visibility based on expanded phases
  useEffect(() => {
    if (!isInitialized) return;

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id.startsWith('owner-') || node.id.startsWith('process-') || 
            node.id.startsWith('input-') || node.id.startsWith('output-')) {
          const phaseId = node.id.split('-').slice(1).join('-');
          const isExpanded = expandedPhases.includes(`phase-${phaseId}`);
          return {
            ...node,
            hidden: !isExpanded,
            data: {
              ...node.data,
              isVisible: isExpanded
            }
          };
        }
        
        // Update phase nodes with expansion state
        if (node.id.startsWith('phase-')) {
          const isExpanded = expandedPhases.includes(node.id);
          return {
            ...node,
            data: {
              ...node.data,
              isExpanded,
              expandIcon: isExpanded ? ChevronUp : ChevronDown
            }
          };
        }
        
        return node;
      })
    );
  }, [expandedPhases, isInitialized, setNodes]);

  // Debounced history save function
  const debouncedSaveToHistory = useCallback((newNodes?: Node[], newEdges?: Edge[]) => {
    if (!isInitialized) return;
    
    if (historyTimeoutRef.current) {
      clearTimeout(historyTimeoutRef.current);
    }
    
    historyTimeoutRef.current = setTimeout(() => {
      const currentNodes = newNodes || nodes;
      const currentEdges = newEdges || edges;
      
      const newState = { 
        nodes: JSON.parse(JSON.stringify(currentNodes)), 
        edges: JSON.parse(JSON.stringify(currentEdges)) 
      };
      
      setHistory(prev => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push(newState);
        return newHistory;
      });
      
      setHistoryIndex(prev => prev + 1);
    }, 300); // 300ms debounce
  }, [nodes, edges, historyIndex, isInitialized]);

  // Stable text change handlers
  const handleNodeTextChange = useCallback((nodeId: string, newText: string) => {
    if (!isInitialized) return;
    
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          if (node.type === 'editablePhaseNode') {
            return { ...node, data: { ...node.data, name: newText } };
          } else {
            return { ...node, data: { ...node.data, content: newText } };
          }
        }
        return node;
      })
    );
    
    debouncedSaveToHistory();
  }, [isInitialized, setNodes, debouncedSaveToHistory]);

  const handleEdgeLabelChange = useCallback((edgeId: string, newLabel: string) => {
    if (!isInitialized) return;
    
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return { ...edge, data: { ...edge.data, label: newLabel } };
        }
        return edge;
      })
    );
    
    debouncedSaveToHistory();
  }, [isInitialized, setEdges, debouncedSaveToHistory]);

  // Node types
  const nodeTypes = useMemo(() => ({
    editablePhaseNode: EditablePhaseNode,
    editableInfoBoxNode: EditableInfoBoxNode
  }), []);

  // Edge types
  const edgeTypes = useMemo(() => ({
    editableConnection: EditableConnectionLine
  }), []);

  // Initialize component only once
  useEffect(() => {
    if (isInitialized) return;
    
    setIsLoading(true);
    
    // Check if there's saved data first
    let nodesWithCallbacks, edgesWithCallbacks;
    
    try {
      const savedFlow = localStorage.getItem('editable-process-v25');
      
      if (savedFlow) {
        // Load saved data
        const flow = JSON.parse(savedFlow);
        console.log('Loading saved flow from localStorage');
        
        nodesWithCallbacks = flow.nodes.map((node: Node) => ({
          ...node,
          data: {
            ...node.data,
            onTextChange: handleNodeTextChange,
            onClick: node.id.startsWith('phase-') ? () => togglePhaseExpansion(node.id) : undefined
          }
        }));
        
        edgesWithCallbacks = flow.edges.map((edge: Edge) => ({
          ...edge,
          data: {
            ...edge.data,
            onLabelChange: handleEdgeLabelChange
          }
        }));
      } else {
        // Use initial data if no saved data
        console.log('No saved flow found, using initial data');
        
        nodesWithCallbacks = initialData.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onTextChange: handleNodeTextChange,
            onClick: node.id.startsWith('phase-') ? () => togglePhaseExpansion(node.id) : undefined
          }
        }));
        
        edgesWithCallbacks = initialData.edges.map(edge => ({
          ...edge,
          data: {
            ...edge.data,
            onLabelChange: handleEdgeLabelChange
          }
        }));
      }
    } catch (error) {
      console.error('Error loading saved flow, using initial data:', error);
      
      // Fallback to initial data if loading fails
      nodesWithCallbacks = initialData.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onTextChange: handleNodeTextChange,
          onClick: node.id.startsWith('phase-') ? () => togglePhaseExpansion(node.id) : undefined
        }
      }));
      
      edgesWithCallbacks = initialData.edges.map(edge => ({
        ...edge,
        data: {
          ...edge.data,
          onLabelChange: handleEdgeLabelChange
        }
      }));
    }
    
    setNodes(nodesWithCallbacks);
    setEdges(edgesWithCallbacks);
    
    // Calculate the maximum node ID to set the counter correctly
    const maxId = Math.max(
      ...nodesWithCallbacks.map(node => {
        // Extract numeric part from node IDs like 'phase-1', 'owner-2', etc.
        const match = node.id.match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
    );
    setNodeIdCounter(maxId + 1);
    
    // Initialize history with first state
    const initialState = { 
      nodes: JSON.parse(JSON.stringify(nodesWithCallbacks)), 
      edges: JSON.parse(JSON.stringify(edgesWithCallbacks)) 
    };
    setHistory([initialState]);
    setHistoryIndex(0);
    
    setIsInitialized(true);
    setIsLoading(false);
  }, [isInitialized, initialData, handleNodeTextChange, handleEdgeLabelChange, setNodes, setEdges, togglePhaseExpansion]);

  // Stable undo/redo functions
  const undo = useCallback(() => {
    if (!isInitialized || historyIndex <= 0) return;
    
    const prevState = history[historyIndex - 1];
    const nodesWithCallbacks = prevState.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onTextChange: handleNodeTextChange,
        onClick: node.id.startsWith('phase-') ? () => togglePhaseExpansion(node.id) : undefined
      }
    }));
    
    const edgesWithCallbacks = prevState.edges.map(edge => ({
      ...edge,
      data: {
        ...edge.data,
        onLabelChange: handleEdgeLabelChange
      }
    }));
    
    setNodes(nodesWithCallbacks);
    setEdges(edgesWithCallbacks);
    setHistoryIndex(historyIndex - 1);
  }, [history, historyIndex, isInitialized, handleNodeTextChange, handleEdgeLabelChange, setNodes, setEdges, togglePhaseExpansion]);

  const redo = useCallback(() => {
    if (!isInitialized || historyIndex >= history.length - 1) return;
    
    const nextState = history[historyIndex + 1];
    const nodesWithCallbacks = nextState.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onTextChange: handleNodeTextChange,
        onClick: node.id.startsWith('phase-') ? () => togglePhaseExpansion(node.id) : undefined
      }
    }));
    
    const edgesWithCallbacks = nextState.edges.map(edge => ({
      ...edge,
      data: {
        ...edge.data,
        onLabelChange: handleEdgeLabelChange
      }
    }));
    
    setNodes(nodesWithCallbacks);
    setEdges(edgesWithCallbacks);
    setHistoryIndex(historyIndex + 1);
  }, [history, historyIndex, isInitialized, handleNodeTextChange, handleEdgeLabelChange, setNodes, setEdges, togglePhaseExpansion]);

  // Node operations
  const addNode = useCallback((type: 'phase' | 'box') => {
    if (!isInitialized) return;
    
    const newNode: Node = {
      id: `node-${nodeIdCounter}`,
      type: type === 'phase' ? 'editablePhaseNode' : 'editableInfoBoxNode',
      position: { x: 400, y: 300 },
      data: type === 'phase' ? {
        number: nodeIdCounter,
        name: 'NEW PHASE',
        gradientStart: '#8B5CF6',
        gradientEnd: '#7C3AED',
        onTextChange: handleNodeTextChange,
        onClick: () => togglePhaseExpansion(`node-${nodeIdCounter}`),
        isExpanded: false,
        expandIcon: ChevronDown
      } : {
        type: 'process' as const,
        label: 'NEW BOX',
        content: 'New content',
        onTextChange: handleNodeTextChange,
        isVisible: true
      }
    };
    
    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter(nodeIdCounter + 1);
    debouncedSaveToHistory();
  }, [nodeIdCounter, isInitialized, handleNodeTextChange, setNodes, debouncedSaveToHistory, togglePhaseExpansion]);

  const deleteSelected = useCallback(() => {
    if (!isInitialized) return;
    
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedEdges = edges.filter(edge => edge.selected);
    
    if (selectedNodes.length > 0) {
      const nodeIds = selectedNodes.map(node => node.id);
      const newNodes = nodes.filter(node => !nodeIds.includes(node.id));
      const newEdges = edges.filter(edge => 
        !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
      );
      setNodes(newNodes);
      setEdges(newEdges);
      debouncedSaveToHistory();
    } else if (selectedEdges.length > 0) {
      const edgeIds = selectedEdges.map(edge => edge.id);
      const newEdges = edges.filter(edge => !edgeIds.includes(edge.id));
      setEdges(newEdges);
      debouncedSaveToHistory();
    }
  }, [nodes, edges, isInitialized, setNodes, setEdges, debouncedSaveToHistory]);

  // Copy/Paste functionality
  const copyNode = useCallback(() => {
    if (!isInitialized) return;
    
    const selectedNode = nodes.find(node => node.selected);
    if (selectedNode) {
      setClipboard(selectedNode);
    }
  }, [nodes, isInitialized]);

  const pasteNode = useCallback(() => {
    if (!isInitialized || !clipboard) return;
    
    const newNode: Node = {
      ...clipboard,
      id: `node-${nodeIdCounter}`,
      position: { x: clipboard.position.x + 50, y: clipboard.position.y + 50 },
      selected: false,
      data: {
        ...clipboard.data,
        onTextChange: handleNodeTextChange,
        onClick: clipboard.id.startsWith('phase-') ? () => togglePhaseExpansion(`node-${nodeIdCounter}`) : undefined
      }
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter(nodeIdCounter + 1);
    debouncedSaveToHistory();
  }, [clipboard, nodeIdCounter, isInitialized, handleNodeTextChange, setNodes, debouncedSaveToHistory, togglePhaseExpansion]);

  // Connection handlers
  const onConnect = useCallback(
    (params: Connection) => {
      if (!isInitialized) return;
      
      const newEdge: Edge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'editableConnection',
        data: {
          label: 'New Connection',
          color: '#10B981',
          width: 2,
          dashed: false,
          onLabelChange: handleEdgeLabelChange
        }
      };
      setEdges((eds) => addEdge(newEdge, eds));
      debouncedSaveToHistory();
    },
    [isInitialized, handleEdgeLabelChange, setEdges, debouncedSaveToHistory]
  );

  // Edge update handlers
  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      if (!isInitialized) return;
      
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
      debouncedSaveToHistory();
    },
    [isInitialized, setEdges, debouncedSaveToHistory]
  );

  const onEdgeUpdateEnd = useCallback(
    (_: any, edge: Edge) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }
      edgeUpdateSuccessful.current = true;
    },
    [setEdges]
  );

  // Context menu handlers
  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setContextMenu({
      show: true,
      x: event.clientX,
      y: event.clientY,
      type: 'node',
      id: node.id
    });
  }, []);

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    setContextMenu({
      show: true,
      x: event.clientX,
      y: event.clientY,
      type: 'edge',
      id: edge.id
    });
  }, []);

  const closeContextMenu = useCallback(() => {
    setContextMenu({ show: false, x: 0, y: 0, type: 'node', id: '' });
  }, []);

  // Edge styling functions
  const changeEdgeColor = useCallback((edgeId: string, color: string) => {
    if (!isInitialized) return;
    
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return { ...edge, data: { ...edge.data, color } };
        }
        return edge;
      })
    );
    closeContextMenu();
    debouncedSaveToHistory();
  }, [isInitialized, setEdges, closeContextMenu, debouncedSaveToHistory]);

  const toggleEdgeDashed = useCallback((edgeId: string) => {
    if (!isInitialized) return;
    
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === edgeId) {
          return { ...edge, data: { ...edge.data, dashed: !edge.data?.dashed } };
        }
        return edge;
      })
    );
    closeContextMenu();
    debouncedSaveToHistory();
  }, [isInitialized, setEdges, closeContextMenu, debouncedSaveToHistory]);

  const deleteEdge = useCallback((edgeId: string) => {
    if (!isInitialized) return;
    
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    closeContextMenu();
    debouncedSaveToHistory();
  }, [isInitialized, setEdges, closeContextMenu, debouncedSaveToHistory]);

  // Save/Load functions
  const saveFlow = useCallback(() => {
    if (!isInitialized) return;
    
    try {
      const flow = { 
        nodes: nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            // Remove callback functions before saving
            onTextChange: undefined,
            onClick: undefined
          }
        })), 
        edges: edges.map(edge => ({
          ...edge,
          data: {
            ...edge.data,
            // Remove callback functions before saving
            onLabelChange: undefined
          }
        })),
        expandedPhases,
        timestamp: Date.now(),
        version: 'v25'
      };
      
      localStorage.setItem('editable-process-v25', JSON.stringify(flow));
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.innerHTML = `
        <div style="
          position: fixed; 
          top: 20px; 
          right: 20px; 
          background: #10B981; 
          color: white; 
          padding: 12px 20px; 
          border-radius: 8px; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          font-family: system-ui;
          font-size: 14px;
          font-weight: 500;
        ">
          ✅ Flow v25 saved to browser storage!
        </div>
      `;
      document.body.appendChild(successMessage);
      
      // Remove success message after 3 seconds
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error saving flow:', error);
      alert('Error saving flow. Please try again.');
    }
  }, [nodes, edges, expandedPhases, isInitialized]);

  const loadFlow = useCallback(() => {
    if (!isInitialized) return;
    
    try {
      const savedFlow = localStorage.getItem('editable-process-v25');
      
      if (!savedFlow) {
        alert('No saved flow found. Please save a flow first.');
        return;
      }
      
      const flow = JSON.parse(savedFlow);
      
      const loadedNodes = flow.nodes.map((node: Node) => ({
        ...node,
        data: {
          ...node.data,
          onTextChange: handleNodeTextChange,
          onClick: node.id.startsWith('phase-') ? () => togglePhaseExpansion(node.id) : undefined
        }
      }));
      
      const loadedEdges = flow.edges.map((edge: Edge) => ({
        ...edge,
        data: {
          ...edge.data,
          onLabelChange: handleEdgeLabelChange
        }
      }));
      
      setNodes(loadedNodes);
      setEdges(loadedEdges);
      if (flow.expandedPhases) {
        setExpandedPhases(flow.expandedPhases);
      }
      debouncedSaveToHistory();
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.innerHTML = `
        <div style="
          position: fixed; 
          top: 20px; 
          right: 20px; 
          background: #3B82F6; 
          color: white; 
          padding: 12px 20px; 
          border-radius: 8px; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 1000;
          font-family: system-ui;
          font-size: 14px;
          font-weight: 500;
        ">
          📁 Flow v25 loaded from browser storage!
        </div>
      `;
      document.body.appendChild(successMessage);
      
      // Remove success message after 3 seconds
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error loading flow:', error);
      alert('Error loading flow. The saved data might be corrupted.');
    }
  }, [isInitialized, setNodes, setEdges, handleNodeTextChange, handleEdgeLabelChange, debouncedSaveToHistory, togglePhaseExpansion]);

  const resetFlow = useCallback(() => {
    if (!isInitialized) return;
    
    const nodesWithCallbacks = initialData.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onTextChange: handleNodeTextChange,
        onClick: node.id.startsWith('phase-') ? () => togglePhaseExpansion(node.id) : undefined
      }
    }));
    
    const edgesWithCallbacks = initialData.edges.map(edge => ({
      ...edge,
      data: {
        ...edge.data,
        onLabelChange: handleEdgeLabelChange
      }
    }));
    
    setNodes(nodesWithCallbacks);
    setEdges(edgesWithCallbacks);
    setExpandedPhases([]);
    debouncedSaveToHistory();
  }, [isInitialized, initialData, setNodes, setEdges, handleNodeTextChange, handleEdgeLabelChange, debouncedSaveToHistory, togglePhaseExpansion]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInitialized) return;
      
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            undo();
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 'c':
            e.preventDefault();
            copyNode();
            break;
          case 'v':
            e.preventDefault();
            pasteNode();
            break;
          case 's':
            e.preventDefault();
            saveFlow();
            break;
        }
      } else if (e.key === 'Delete') {
        deleteSelected();
      } else if (e.key === 'Escape') {
        closeContextMenu();
        setShowLegend(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInitialized, undo, redo, copyNode, pasteNode, saveFlow, deleteSelected, closeContextMenu]);

  // Click outside to close context menu and legend
  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.show) {
        closeContextMenu();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [contextMenu.show, closeContextMenu]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current);
      }
    };
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Enhanced Process Editor v25...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product + PMO + BA Process - HALA 2025 - v25</h1>
            <p className="text-sm text-gray-600 mt-1">Enhanced process editor with collapsible info boxes and decision paths</p>
          </div>
          
          {/* Enhanced Toolbar */}
          <div className="flex items-center space-x-2">
            {/* Tools */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTool('select')}
                className={`p-2 rounded ${tool === 'select' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                title="Select Tool"
              >
                <MousePointer className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTool('move')}
                className={`p-2 rounded ${tool === 'move' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                title="Move Tool"
              >
                <Move className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTool('connect')}
                className={`p-2 rounded ${tool === 'connect' ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                title="Connect Tool"
              >
                <Link className="w-4 h-4" />
              </button>
            </div>
            
            <div className="w-px h-6 bg-gray-300" />
            
            {/* History */}
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300" />
            
            {/* Node operations */}
            <button
              onClick={() => addNode('phase')}
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              title="Add Phase Node"
            >
              <Circle className="w-4 h-4" />
            </button>
            <button
              onClick={() => addNode('box')}
              className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
              title="Add Info Box"
            >
              <Square className="w-4 h-4" />
            </button>
            <button
              onClick={deleteSelected}
              className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
              title="Delete Selected (Delete)"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300" />
            
            {/* Clipboard */}
            <button
              onClick={copyNode}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
              title="Copy (Ctrl+C)"
            >
              <Copy className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300" />
            
            {/* Save/Load */}
            <button
              onClick={saveFlow}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
              title="Save (Ctrl+S)"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={loadFlow}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
              title="Load"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={resetFlow}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
              title="Reset"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300" />
            
            {/* Legend */}
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              title="Show Legend"
            >
              <Info className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
              title="Toggle Instructions"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Instructions */}
      {showInstructions && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Phase Interaction</h3>
              <ul className="text-blue-800 text-xs space-y-1">
                <li>• Click phase circles to expand/collapse info boxes</li>
                <li>• Double-click to edit phase names</li>
                <li>• Drag to move phases</li>
                <li>• Right-click for context menu</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Process Paths</h3>
              <ul className="text-blue-800 text-xs space-y-1">
                <li>• Green path: Product initiatives</li>
                <li>• Blue path: Enterprise initiatives</li>
                <li>• Decision point at Owner Decision phase</li>
                <li>• Both paths converge at Development</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Keyboard Shortcuts</h3>
              <ul className="text-blue-800 text-xs space-y-1">
                <li>• Ctrl+Z/Y: Undo/Redo</li>
                <li>• Ctrl+C/V: Copy/Paste</li>
                <li>• Ctrl+S: Save</li>
                <li>• Delete: Remove selected</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">New Features v25</h3>
              <ul className="text-blue-800 text-xs space-y-1">
                <li>• Collapsible info boxes (click phases)</li>
                <li>• Legend popup (purple button)</li>
                <li>• Decision-based process paths</li>
                <li>• Enhanced phase structure</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* React Flow Canvas */}
      <div className="h-full" style={{ height: 'calc(100% - 140px)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          fitViewOptions={{
            padding: 0.2,
            includeHiddenNodes: false
          }}
          deleteKeyCode="Delete"
          multiSelectionKeyCode="Shift"
          snapToGrid={true}
          snapGrid={[15, 15]}
          connectionMode="loose"
          defaultEdgeOptions={{
            type: 'editableConnection',
            data: {
              label: '',
              color: '#6B7280',
              width: 2,
              dashed: false,
              onLabelChange: handleEdgeLabelChange
            }
          }}
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls showInteractive={false} />
          <MiniMap 
            nodeColor={(node) => {
              if (node.type === 'editablePhaseNode') return '#3B82F6';
              return '#E5E7EB';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
            position="bottom-right"
          />
          
          {/* Legend Panel - Bottom Center - Collapsible */}
          <Panel position="bottom-center" className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-4xl">
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-t-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Info className="w-4 h-4" />
              {showLegend ? 'Hide Legend' : 'Show Legend'}
              <ChevronDown className={`w-4 h-4 transition-transform ${showLegend ? 'rotate-180' : ''}`} />
            </button>
            
            {showLegend && (
              <div className="p-4 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
                  {/* Phase Interaction */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-sm">Phase Interaction</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Decision-based process paths</li>
                      <li>• Click phase circles to expand/collapse info boxes</li>
                      <li>• Double-click to edit phase names</li>
                      <li>• Drag to move phases</li>
                      <li>• Right-click for context menu</li>
                    </ul>
                  </div>

                  {/* Process Paths */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-sm">Process Paths</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Green path: Product initiatives</li>
                      <li>• Blue path: Enterprise initiatives</li>
                      <li>• Decision point at Owner Decision phase</li>
                      <li>• Both paths converge at Development</li>
                    </ul>
                  </div>

                  {/* Keyboard Shortcuts */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-sm">Keyboard Shortcuts</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Ctrl+Z/Y: Undo/Redo</li>
                      <li>• Ctrl+C/V: Copy/Paste</li>
                      <li>• Ctrl+S: Save</li>
                      <li>• Delete: Remove selected</li>
                    </ul>
                  </div>

                  {/* New Features v25 */}
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-sm">New Features v25</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Collapsible info boxes (click phases)</li>
                      <li>• Legend popup (purple button)</li>
                      <li>• Decision-based process paths</li>
                      <li>• Enhanced phase structure</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Panel>
        </ReactFlow>
      </div>

      {/* Legend Popup */}
      <LegendPopup isOpen={showLegend} onClose={() => setShowLegend(false)} />

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          className="fixed bg-white shadow-lg rounded-lg border border-gray-200 py-2 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === 'edge' ? (
            <>
              <div className="px-4 py-2 text-sm font-semibold border-b text-gray-700">Connection Settings</div>
              
              {/* Color options */}
              <div className="px-4 py-2">
                <label className="text-xs text-gray-600 block mb-2">Color</label>
                <div className="flex space-x-1">
                  {['#6B7280', '#3B82F6', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6'].map(color => (
                    <button
                      key={color}
                      onClick={() => changeEdgeColor(contextMenu.id, color)}
                      className="w-6 h-6 rounded border-2 border-white shadow-sm hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={`Change to ${color}`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Style options */}
              <div className="px-4 py-2 border-t">
                <button
                  onClick={() => toggleEdgeDashed(contextMenu.id)}
                  className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded"
                >
                  Toggle Dashed Style
                </button>
              </div>
              
              <div className="border-t">
                <button
                  onClick={() => deleteEdge(contextMenu.id)}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete Connection
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="px-4 py-2 text-sm font-semibold border-b text-gray-700">Node Options</div>
              <button
                onClick={() => {
                  copyNode();
                  closeContextMenu();
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Copy Node
              </button>
              <button
                onClick={() => {
                  deleteSelected();
                  closeContextMenu();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Delete Node
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// Wrap with Provider
const EditableProcessTestPageWithProvider: React.FC = () => (
  <ReactFlowProvider>
    <EditableProcessTestPage />
  </ReactFlowProvider>
);

export default EditableProcessTestPageWithProvider;