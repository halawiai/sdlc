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
  BackgroundVariant
} from 'reactflow';
import { 
  Settings, Save, Upload, RefreshCw, Info, Plus, Trash2, 
  Edit2, Copy, Undo, Redo, Download, MousePointer, Move, 
  Link, Square, Circle, GitBranch, AlertTriangle, Rocket
} from 'lucide-react';
import EditablePhaseNode from '../components/editable/EditablePhaseNode';
import EditableInfoBoxNode from '../components/editable/EditableInfoBoxNode';
import EditableConnectionLine from '../components/editable/EditableConnectionLine';
import DecisionNode from '../components/editable/DecisionNode';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

const EditableProcessPage: React.FC = () => {
  const edgeUpdateSuccessful = useRef(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [tool, setTool] = useState<'select' | 'move' | 'connect'>('select');
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [clipboard, setClipboard] = useState<Node | null>(null);
  const [nodeIdCounter, setNodeIdCounter] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    type: 'node' | 'edge';
    id: string;
  }>({ show: false, x: 0, y: 0, type: 'node', id: '' });

  // HALA 2025 v24 Process Data
  const processDataV24 = useMemo(() => ({
    phases: [
      {
        id: 1,
        name: 'INITIATION',
        owners: ['Product', 'Business', 'Others', 'PMO'],
        process: 'Identifying the problem, target audience, and competitive landscape and scope',
        inputs: ['Customer Interviews', 'Market Analysis', 'Pain Points, etc.'],
        outputs: ['PRD Brief'],
        keyTasks: ['Define Requirements Criteria'],
        color: '#3B82F6',
        position: { row: 1, col: 1 }
      },
      {
        id: 2,
        name: 'REQUIREMENTS + DESIGN',
        owners: ['Product', 'BA', 'Design (when applicable)'],
        process: 'Develop detailed requirements, Create UX/UI design in parallel (when applicable)',
        inputs: ['PRD Brief'],
        outputs: ['Business Requirement Document (BRD)', 'User Stories', 'UX/UI Design Document (when applicable)', 'Full Requirements'],
        notes: 'This phase can be skipped if requirements are clear and complexity is minor',
        color: '#10B981',
        position: { row: 1, col: 2 }
      },
      {
        id: 3,
        name: 'BUSINESS REVIEW',
        owners: ['Business', 'Product', 'BA'],
        process: 'Business approval and validation of requirements',
        inputs: ['User Stories', 'UX/UI Design Document (when applicable)'],
        outputs: ['Business Approval', 'Formal business sign-off'],
        specialNote: 'Reiterate until Approved',
        color: '#14B8A6',
        position: { row: 1, col: 3 }
      },
      {
        id: 4,
        name: 'PLANNING',
        owners: ['PMO', 'Product'],
        process: 'Project planning, resource allocation, timeline development, and execution preparation',
        inputs: ['Approved Requirements Package (PRD + BRD)', 'User Stories', 'Detailed & Updated User Stories (If applicable)'],
        outputs: [
          'Project Plan and Timeline',
          'Resource Allocation Plan',
          'Budget Plan',
          'Risk Register',
          'Quality Assurance Plan',
          'Communication Plan',
          'Technical Architecture Plan',
          'Groomed and Prioritized Backlog',
          'Sprint Planning Documentation'
        ],
        keyTasks: [
          'Backlog grooming and prioritization',
          'Sprint planning and iteration setup',
          'Definition of Done criteria establishment'
        ],
        color: '#06B6D4',
        position: { row: 1, col: 4 }
      },
      {
        id: 5,
        name: 'DEVELOPMENT',
        owners: ['Engineering', 'Product', 'PMO'],
        process: 'Solution Development',
        inputs: [
          'Approved Requirements Package (PRD + BRD)',
          'UX/UI Design Document (when applicable)',
          'Technical Architecture Plan',
          'Groomed and Prioritized Backlog'
        ],
        outputs: ['Ready for Test/Workable Demo', 'Technical Documentation'],
        keyTasks: ['Code Review from Tech Lead'],
        color: '#8B5CF6',
        position: { row: 2, col: 1 }
      },
      {
        id: 6,
        name: 'QA',
        owners: ['PMO', 'QA', 'BA'],
        process: 'Test solution to ensure it meets requirements and is user-friendly',
        inputs: ['All previous phase deliverables', 'Workable Demo', 'Approved Requirements Package (PRD + BRD)'],
        outputs: [
          'Product Testing Report',
          'User Feedback',
          'Bug Reports',
          'Business Acceptance Sign-off',
          'UAT Sign off',
          'CS Sign off (If PT applicable)'
        ],
        keyTasks: ['Business acceptance testing', 'Infrastructure Approval'],
        color: '#EC4899',
        position: { row: 2, col: 2 }
      },
      {
        id: 7,
        name: 'POST IMPLEMENTATION',
        owners: ['Engineering', 'PMO'],
        process: 'Change Management, Deployment, and Success Measurement',
        inputs: ['Approved solution from QA', 'Go-live readiness checklist'],
        outputs: [
          'Product Rollout Timelines',
          'Go Live Confirmation',
          'Release Preparation',
          'CAB approval',
          'MoM/Action items'
        ],
        additionalInfo: 'Release Management',
        color: '#F59E0B',
        position: { row: 2, col: 3 }
      },
      {
        id: 8,
        name: 'CLOSED',
        owners: ['PMO', 'Product'],
        process: 'Project Closure, Documentation, and Lessons Learned',
        inputs: ['All previous phase deliverables', 'Success metrics and performance data'],
        outputs: [
          'Project Closure Report',
          'Lessons Learned Document',
          'Final Success Metrics',
          'Knowledge Transfer Documentation',
          'Handover to Application Support'
        ],
        additionalInfo: 'Product Iteration/Review',
        color: '#6366F1',
        position: { row: 2, col: 4 }
      }
    ]
  }), []);

  // Stable initial data using useMemo
  const initialData = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Create phase nodes with v24 data
    processDataV24.phases.forEach((phase) => {
      const x = 200 + ((phase.position.col - 1) * 450);
      const y = 200 + ((phase.position.row - 1) * 500);

      // Main phase node
      nodes.push({
        id: `phase-${phase.id}`,
        type: 'editablePhaseNode',
        position: { x, y },
        data: {
          number: phase.id,
          name: phase.name,
          gradientStart: phase.color,
          gradientEnd: phase.color,
          onTextChange: null
        }
      });

      // Owner box
      nodes.push({
        id: `owner-${phase.id}`,
        type: 'editableInfoBoxNode',
        position: { x: x - 250, y: y - 150 },
        data: {
          type: 'owner' as const,
          label: 'OWNER',
          content: phase.owners.join(', '),
          onTextChange: null
        }
      });

      // Process box
      nodes.push({
        id: `process-${phase.id}`,
        type: 'editableInfoBoxNode',
        position: { x: x + 150, y: y - 150 },
        data: {
          type: 'process' as const,
          label: 'PROCESS',
          content: phase.process,
          onTextChange: null
        }
      });

      // Input box
      nodes.push({
        id: `input-${phase.id}`,
        type: 'editableInfoBoxNode',
        position: { x: x - 250, y: y + 100 },
        data: {
          type: 'input' as const,
          label: 'INPUT',
          content: phase.inputs.join(', '),
          onTextChange: null
        }
      });

      // Output box
      nodes.push({
        id: `output-${phase.id}`,
        type: 'editableInfoBoxNode',
        position: { x: x + 150, y: y + 100 },
        data: {
          type: 'output' as const,
          label: 'OUTPUT',
          content: phase.outputs.join(', '),
          onTextChange: null
        }
      });

      // Key Tasks box (if exists)
      if (phase.keyTasks && phase.keyTasks.length > 0) {
        nodes.push({
          id: `tasks-${phase.id}`,
          type: 'editableInfoBoxNode',
          position: { x: x, y: y + 200 },
          data: {
            type: 'special' as const,
            label: 'KEY TASKS',
            content: phase.keyTasks.join(', '),
            onTextChange: null
          }
        });
      }
    });

    // Add decision diamond after Phase 1
    nodes.push({
      id: 'decision-enterprise',
      type: 'decisionNode',
      position: { x: 425, y: 350 },
      data: {
        label: 'Enterprise Criteria met?',
        yesPath: 'Continue to Phase 2',
        noPath: 'Skip to Phase 4',
        onDecisionChange: null
      }
    });

    // Add special process elements
    const specialElements = [
      {
        id: 'release-management',
        name: 'RELEASE',
        description: 'Release Management',
        position: { x: 1750, y: 800 },
        color: '#06B6D4'
      },
      {
        id: 'criteria-assessment',
        name: 'CRITERIA',
        description: 'Criteria Assessment',
        position: { x: 425, y: 100 },
        color: '#F59E0B'
      },
      {
        id: 'business-approval',
        name: 'APPROVAL',
        description: 'Business Approval',
        position: { x: 1100, y: 350 },
        color: '#10B981'
      },
      {
        id: 'go-live',
        name: 'GO-LIVE',
        description: 'Go Live',
        position: { x: 1750, y: 950 },
        color: '#3B82F6'
      }
    ];

    specialElements.forEach(element => {
      nodes.push({
        id: element.id,
        type: 'editableInfoBoxNode',
        position: element.position,
        data: {
          type: 'special' as const,
          label: element.name,
          content: element.description,
          onTextChange: null
        }
      });
    });

    // Add exception states
    nodes.push({
      id: 'dropped',
      type: 'editableInfoBoxNode',
      position: { x: 800, y: 800 },
      data: {
        type: 'special' as const,
        label: 'DROPPED',
        content: 'Project Terminated',
        onTextChange: null
      }
    });

    nodes.push({
      id: 'on-hold',
      type: 'editableInfoBoxNode',
      position: { x: 1200, y: 800 },
      data: {
        type: 'special' as const,
        label: 'ON HOLD',
        content: 'Temporarily Suspended',
        onTextChange: null
      }
    });

    // Create edges with decision logic
    edges.push(
      // Phase 1 to Decision
      {
        id: 'e1-decision',
        source: 'phase-1',
        target: 'decision-enterprise',
        type: 'editableConnection',
        data: { label: '', color: '#6B7280', width: 3, dashed: false, onLabelChange: null }
      },
      // Decision YES to Phase 2
      {
        id: 'e-decision-2',
        source: 'decision-enterprise',
        target: 'phase-2',
        sourceHandle: 'yes',
        type: 'editableConnection',
        data: { label: 'YES - New Features', color: '#3B82F6', width: 3, dashed: false, onLabelChange: null }
      },
      // Decision NO to Phase 4 (skip 2,3)
      {
        id: 'e-decision-4',
        source: 'decision-enterprise',
        target: 'phase-4',
        sourceHandle: 'no',
        type: 'editableConnection',
        data: { label: 'NO - Enhancements', color: '#10B981', width: 3, dashed: true, onLabelChange: null }
      },
      // Phase 2 to 3
      {
        id: 'e2-3',
        source: 'phase-2',
        target: 'phase-3',
        type: 'editableConnection',
        data: { label: '', color: '#6B7280', width: 3, dashed: false, onLabelChange: null }
      },
      // Phase 3 to 4
      {
        id: 'e3-4',
        source: 'phase-3',
        target: 'phase-4',
        type: 'editableConnection',
        data: { label: '', color: '#6B7280', width: 3, dashed: false, onLabelChange: null }
      },
      // Iteration loop from 3 to 2
      {
        id: 'e3-2-iterate',
        source: 'phase-3',
        target: 'phase-2',
        type: 'editableConnection',
        data: { 
          label: 'Reiterate until Approved', 
          color: '#EF4444', 
          width: 2, 
          dashed: true,
          onLabelChange: null
        }
      },
      // Continue with remaining phase connections
      {
        id: 'e4-5',
        source: 'phase-4',
        target: 'phase-5',
        type: 'editableConnection',
        data: { label: '', color: '#6B7280', width: 3, dashed: false, onLabelChange: null }
      },
      {
        id: 'e5-6',
        source: 'phase-5',
        target: 'phase-6',
        type: 'editableConnection',
        data: { label: '', color: '#6B7280', width: 3, dashed: false, onLabelChange: null }
      },
      {
        id: 'e6-7',
        source: 'phase-6',
        target: 'phase-7',
        type: 'editableConnection',
        data: { label: '', color: '#6B7280', width: 3, dashed: false, onLabelChange: null }
      },
      {
        id: 'e7-8',
        source: 'phase-7',
        target: 'phase-8',
        type: 'editableConnection',
        data: { label: '', color: '#6B7280', width: 3, dashed: false, onLabelChange: null }
      },
      // Special element connections
      {
        id: 'e-criteria-1',
        source: 'criteria-assessment',
        target: 'phase-1',
        type: 'editableConnection',
        data: { label: 'Assessment Input', color: '#F59E0B', width: 2, dashed: true, onLabelChange: null }
      },
      {
        id: 'e-approval-3',
        source: 'phase-3',
        target: 'business-approval',
        type: 'editableConnection',
        data: { label: 'Approval Process', color: '#10B981', width: 2, dashed: true, onLabelChange: null }
      },
      {
        id: 'e-release-7',
        source: 'phase-7',
        target: 'release-management',
        type: 'editableConnection',
        data: { label: 'Release Activities', color: '#06B6D4', width: 2, dashed: true, onLabelChange: null }
      },
      {
        id: 'e-golive-release',
        source: 'release-management',
        target: 'go-live',
        type: 'editableConnection',
        data: { label: 'Go Live', color: '#3B82F6', width: 2, dashed: false, onLabelChange: null }
      }
    );

    return { nodes, edges };
  }, []);

  // Initialize nodes and edges state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
    }, 300);
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

  const handleDecisionChange = useCallback((nodeId: string, newText: string) => {
    if (!isInitialized) return;
    
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, label: newText } };
        }
        return node;
      })
    );
    
    debouncedSaveToHistory();
  }, [isInitialized, setNodes, debouncedSaveToHistory]);

  // Node types
  const nodeTypes = useMemo(() => ({
    editablePhaseNode: EditablePhaseNode,
    editableInfoBoxNode: EditableInfoBoxNode,
    decisionNode: DecisionNode
  }), []);

  // Edge types
  const edgeTypes = useMemo(() => ({
    editableConnection: EditableConnectionLine
  }), []);

  // Initialize component only once
  useEffect(() => {
    if (isInitialized) return;
    
    setIsLoading(true);
    
    let nodesWithCallbacks, edgesWithCallbacks;
    
    try {
      const savedFlow = localStorage.getItem('editable-process-v24');
      
      if (savedFlow) {
        const flow = JSON.parse(savedFlow);
        console.log('Loading saved v24 flow from localStorage');
        
        nodesWithCallbacks = flow.nodes.map((node: Node) => ({
          ...node,
          data: {
            ...node.data,
            onTextChange: node.type === 'decisionNode' ? handleDecisionChange : handleNodeTextChange
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
        console.log('No saved v24 flow found, using initial data');
        
        nodesWithCallbacks = initialData.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onTextChange: node.type === 'decisionNode' ? handleDecisionChange : handleNodeTextChange
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
      console.error('Error loading saved v24 flow, using initial data:', error);
      
      nodesWithCallbacks = initialData.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onTextChange: node.type === 'decisionNode' ? handleDecisionChange : handleNodeTextChange
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
    
    const maxId = Math.max(
      ...nodesWithCallbacks.map(node => {
        const match = node.id.match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
    );
    setNodeIdCounter(maxId + 1);
    
    const initialState = { 
      nodes: JSON.parse(JSON.stringify(nodesWithCallbacks)), 
      edges: JSON.parse(JSON.stringify(edgesWithCallbacks)) 
    };
    setHistory([initialState]);
    setHistoryIndex(0);
    
    setIsInitialized(true);
    setIsLoading(false);
  }, [isInitialized, initialData, handleNodeTextChange, handleEdgeLabelChange, handleDecisionChange, setNodes, setEdges]);

  // Undo/Redo functions
  const undo = useCallback(() => {
    if (!isInitialized || historyIndex <= 0) return;
    
    const prevState = history[historyIndex - 1];
    const nodesWithCallbacks = prevState.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onTextChange: node.type === 'decisionNode' ? handleDecisionChange : handleNodeTextChange
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
  }, [history, historyIndex, isInitialized, handleNodeTextChange, handleEdgeLabelChange, handleDecisionChange, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (!isInitialized || historyIndex >= history.length - 1) return;
    
    const nextState = history[historyIndex + 1];
    const nodesWithCallbacks = nextState.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onTextChange: node.type === 'decisionNode' ? handleDecisionChange : handleNodeTextChange
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
  }, [history, historyIndex, isInitialized, handleNodeTextChange, handleEdgeLabelChange, handleDecisionChange, setNodes, setEdges]);

  // Node operations
  const addNode = useCallback((type: 'phase' | 'box' | 'decision') => {
    if (!isInitialized) return;
    
    let newNode: Node;
    
    if (type === 'decision') {
      newNode = {
        id: `decision-${nodeIdCounter}`,
        type: 'decisionNode',
        position: { x: 400, y: 300 },
        data: {
          label: 'New Decision?',
          yesPath: 'Yes path',
          noPath: 'No path',
          onDecisionChange: handleDecisionChange
        }
      };
    } else if (type === 'phase') {
      newNode = {
        id: `phase-${nodeIdCounter}`,
        type: 'editablePhaseNode',
        position: { x: 400, y: 300 },
        data: {
          number: nodeIdCounter,
          name: 'NEW PHASE',
          gradientStart: '#8B5CF6',
          gradientEnd: '#7C3AED',
          onTextChange: handleNodeTextChange
        }
      };
    } else {
      newNode = {
        id: `box-${nodeIdCounter}`,
        type: 'editableInfoBoxNode',
        position: { x: 400, y: 300 },
        data: {
          type: 'process' as const,
          label: 'NEW BOX',
          content: 'New content',
          onTextChange: handleNodeTextChange
        }
      };
    }
    
    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter(nodeIdCounter + 1);
    debouncedSaveToHistory();
  }, [nodeIdCounter, isInitialized, handleNodeTextChange, handleDecisionChange, setNodes, debouncedSaveToHistory]);

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
        onTextChange: clipboard.type === 'decisionNode' ? handleDecisionChange : handleNodeTextChange
      }
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeIdCounter(nodeIdCounter + 1);
    debouncedSaveToHistory();
  }, [clipboard, nodeIdCounter, isInitialized, handleNodeTextChange, handleDecisionChange, setNodes, debouncedSaveToHistory]);

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
        version: 'v24',
        timestamp: Date.now(),
        nodes: nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onTextChange: undefined,
            onDecisionChange: undefined
          }
        })), 
        edges: edges.map(edge => ({
          ...edge,
          data: {
            ...edge.data,
            onLabelChange: undefined
          }
        })),
        metadata: {
          processName: 'Product + PMO + BA Process - HALA 2025 - v24',
          lastModified: new Date().toISOString()
        }
      };
      
      localStorage.setItem('editable-process-v24', JSON.stringify(flow));
      
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
          ✅ v24 Process saved to browser storage!
        </div>
      `;
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error saving v24 flow:', error);
      alert('Error saving flow. Please try again.');
    }
  }, [nodes, edges, isInitialized]);

  const loadFlow = useCallback(() => {
    if (!isInitialized) return;
    
    try {
      const savedFlow = localStorage.getItem('editable-process-v24');
      
      if (!savedFlow) {
        alert('No saved v24 flow found. Please save a flow first.');
        return;
      }
      
      const flow = JSON.parse(savedFlow);
      
      const loadedNodes = flow.nodes.map((node: Node) => ({
        ...node,
        data: {
          ...node.data,
          onTextChange: node.type === 'decisionNode' ? handleDecisionChange : handleNodeTextChange
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
      debouncedSaveToHistory();
      
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
          📁 v24 Process loaded from browser storage!
        </div>
      `;
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error loading v24 flow:', error);
      alert('Error loading flow. The saved data might be corrupted.');
    }
  }, [isInitialized, setNodes, setEdges, handleNodeTextChange, handleEdgeLabelChange, handleDecisionChange, debouncedSaveToHistory]);

  const resetFlow = useCallback(() => {
    if (!isInitialized) return;
    
    const nodesWithCallbacks = initialData.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onTextChange: node.type === 'decisionNode' ? handleDecisionChange : handleNodeTextChange
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
    debouncedSaveToHistory();
  }, [isInitialized, initialData, setNodes, setEdges, handleNodeTextChange, handleEdgeLabelChange, handleDecisionChange, debouncedSaveToHistory]);

  // Export functionality
  const exportFlow = useCallback((format: 'json' | 'png' | 'svg') => {
    if (!isInitialized) return;
    
    if (format === 'json') {
      const flow = {
        version: 'v24',
        timestamp: Date.now(),
        nodes: nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onTextChange: undefined,
            onDecisionChange: undefined
          }
        })),
        edges: edges.map(edge => ({
          ...edge,
          data: {
            ...edge.data,
            onLabelChange: undefined
          }
        })),
        metadata: {
          processName: 'Product + PMO + BA Process - HALA 2025 - v24',
          lastModified: new Date().toISOString()
        }
      };
      
      const blob = new Blob([JSON.stringify(flow, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `hala-2025-v24-process-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert(`Export to ${format.toUpperCase()} not implemented yet`);
    }
  }, [nodes, edges, isInitialized]);

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
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isInitialized, undo, redo, copyNode, pasteNode, saveFlow, deleteSelected, closeContextMenu]);

  // Click outside to close context menu
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
          <p className="text-gray-600">Loading HALA 2025 v24 Process Editor...</p>
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
            <h1 className="text-2xl font-bold text-gray-900">
              Product + PMO + BA Process - HALA 2025 - v24
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Editable Process with Decision Criteria Flow
            </p>
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
              onClick={() => addNode('decision')}
              className="p-2 bg-amber-600 text-white rounded hover:bg-amber-700"
              title="Add Decision Diamond"
            >
              <GitBranch className="w-4 h-4" />
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
              title="Save to Browser (Ctrl+S)"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={loadFlow}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
              title="Load from Browser"
            >
              <Upload className="w-4 h-4" />
            </button>
            <button
              onClick={resetFlow}
              className="p-2 bg-gray-100 rounded hover:bg-gray-200"
              title="Reset to v24 Template"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300" />
            
            {/* Export */}
            <div className="relative group">
              <button className="p-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                <Download className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={() => exportFlow('json')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                >
                  Export JSON
                </button>
                <button
                  onClick={() => exportFlow('png')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Export PNG
                </button>
                <button
                  onClick={() => exportFlow('svg')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg"
                >
                  Export SVG
                </button>
              </div>
            </div>
            
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">v24 Features</h3>
              <ul className="text-blue-800 text-xs space-y-1">
                <li>• Decision criteria flow</li>
                <li>• Phase skip capability</li>
                <li>• Iteration loops</li>
                <li>• Special elements</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Node Editing</h3>
              <ul className="text-blue-800 text-xs space-y-1">
                <li>• Double-click to edit text</li>
                <li>• Drag to move nodes</li>
                <li>• Right-click for context menu</li>
                <li>• Delete key removes selected</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Connections</h3>
              <ul className="text-blue-800 text-xs space-y-1">
                <li>• Drag from handles to connect</li>
                <li>• Double-click labels to edit</li>
                <li>• Right-click for styling options</li>
                <li>• Drag endpoints to reconnect</li>
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
              <h3 className="font-semibold text-blue-900 mb-2">Decision Paths</h3>
              <ul className="text-blue-800 text-xs space-y-1">
                <li>• YES: Phases 1→2→3→4</li>
                <li>• NO: Phases 1→4 (skip 2,3)</li>
                <li>• Iteration: 3→2 loop</li>
                <li>• Exception states available</li>
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
              if (node.type === 'decisionNode') return '#F59E0B';
              return '#E5E7EB';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
            position="bottom-right"
          />
          
          {/* Status Panel */}
          <Panel position="top-right" className="bg-white p-3 rounded-lg shadow-lg m-2 border border-gray-200">
            <div className="text-sm space-y-1">
              <div className="font-semibold text-gray-700">HALA 2025 v24</div>
              <div className="text-gray-600">
                Saved: {localStorage.getItem('editable-process-v24') ? '✅' : '❌'}
              </div>
              <div className="text-gray-600">Tool: {tool}</div>
              <div className="text-gray-600">Nodes: {nodes.length}</div>
              <div className="text-gray-600">Edges: {edges.length}</div>
              <div className="text-gray-600">History: {historyIndex + 1}/{history.length}</div>
            </div>
          </Panel>

          {/* Owner Notes Panel */}
          <Panel position="top-left" className="bg-yellow-50 p-3 rounded-lg shadow-lg m-2 border border-yellow-300">
            <div className="text-sm">
              <div className="font-semibold text-yellow-800 mb-2">Important Notes:</div>
              <ul className="space-y-1 text-yellow-700 text-xs">
                <li>• Owner: BA/Product By Default</li>
                <li>• Owner (Optional): PMO - If applicable</li>
                <li>• BA/Product should follow up and escalate to PMO when needed</li>
              </ul>
            </div>
          </Panel>
        </ReactFlow>
      </div>

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
const EditableProcessPageWithProvider: React.FC = () => (
  <ReactFlowProvider>
    <EditableProcessPage />
  </ReactFlowProvider>
);

export default EditableProcessPageWithProvider;