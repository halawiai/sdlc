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
import SpecialElementNode from '../components/SpecialElementNode';
import ExceptionNode from '../components/ExceptionNode';
import PhaseDetailModal from '../components/PhaseDetailModal';
import { fullLifecyclePhases } from '../data/lifecycleData';

const VisualProcessPage: React.FC = () => {
  const [selectedPhaseInfo, setSelectedPhaseInfo] = React.useState<any>(null);
  const [showModal, setShowModal] = React.useState(false);

  // Phase data with exact names as specified
  const phaseData = [
    {
      id: 1,
      name: 'INITIATION',
      gradientStart: '#3B82F6',
      gradientEnd: '#2563EB',
      owner: 'Product, Business, Others',
      process: 'Identifying the problem, target audience, and competitive landscape and scope',
      inputs: ['Customer Interviews', 'Market Analysis', 'Pain Points, etc.'],
      outputs: ['PRD Brief']
    },
    {
      id: 2,
      name: 'REQUIREMENTS',
      gradientStart: '#2563EB',
      gradientEnd: '#14B8A6',
      owner: 'Business, BA',
      process: 'Business approval and validation of requirements',
      inputs: ['PRD Brief'],
      outputs: ['BRD', 'Business Approval']
    },
    {
      id: 3,
      name: 'DESIGN',
      gradientStart: '#14B8A6',
      gradientEnd: '#10B981',
      owner: 'Product, BA, Design (when applicable)',
      process: 'Develop detailed requirements, Create UX/UI design in parallel',
      inputs: ['BRD', 'User Stories'],
      outputs: ['UX/UI Design Document (when applicable)', 'User Stories', 'Full Requirements']
    },
    {
      id: 4,
      name: 'PLANNING',
      gradientStart: '#10B981',
      gradientEnd: '#059669',
      owner: 'PMO, Product',
      process: 'Project planning, resource allocation, timeline development',
      inputs: ['Approved Requirements Package', 'User Stories'],
      outputs: ['Project Plan', 'Resource Plan', 'Budget Plan', 'Risk Register']
    },
    {
      id: 5,
      name: 'DEVELOPMENT',
      gradientStart: '#059669',
      gradientEnd: '#10B981',
      owner: 'Engineering, Product',
      process: 'Solution Development',
      inputs: ['Approved Requirements, Technical Architecture, Backlog'],
      outputs: ['Workable Demo, Technical Documentation']
    },
    {
      id: 6,
      name: 'QA',
      gradientStart: '#10B981',
      gradientEnd: '#0D9488',
      owner: 'QA, BA, PMO',
      process: 'Test solution to ensure it meets requirements',
      inputs: ['All previous phase deliverables, Workable Demo'],
      outputs: ['Product Testing Report, User Feedback, Business Sign-off']
    },
    {
      id: 7,
      name: 'DEPLOYMENT',
      gradientStart: '#0D9488',
      gradientEnd: '#3B82F6',
      owner: 'PMO, Engineering',
      process: 'Change Management, Deployment, and Success Measurement',
      inputs: ['Approved solution from QA'],
      outputs: ['Go Live Confirmation, Product Rollout']
    },
    {
      id: 8,
      name: 'CLOSURE',
      gradientStart: '#3B82F6',
      gradientEnd: '#4F46E5',
      owner: 'PMO, Product',
      process: 'Project Closure, Documentation, Lessons Learned',
      inputs: ['Success metrics, All deliverables'],
      outputs: ['Closure Report', 'Lessons Learned', 'Knowledge Transfer']
    }
  ];

  // Click handlers for different node types
  const handleNodeClick = useCallback((nodeId: string) => {
    const phaseNumber = parseInt(nodeId.split('-')[1]);
    const phaseData = fullLifecyclePhases.find(p => p.id === phaseNumber);
    
    if (phaseData) {
      setSelectedPhaseInfo({
        id: phaseData.id,
        name: phaseData.name,
        description: phaseData.focus,
        gradient: phaseData.gradient,
        details: {
          owner: phaseData.owner,
          processFocus: phaseData.focus,
          inputs: phaseData.input,
          outputs: phaseData.output,
          keyTasks: phaseData.keyTasks,
          phaseGateCriteria: phaseData.gateCriteria,
          raciMatrix: phaseData.raciMatrix
        }
      });
      setShowModal(true);
    }
  }, []);

  const handleInfoBoxClick = useCallback((nodeId: string) => {
    const [type, phaseId] = nodeId.split('-');
    const phaseNumber = parseInt(phaseId);
    const phaseData = fullLifecyclePhases.find(p => p.id === phaseNumber);
    
    if (phaseData) {
      let content = '';
      switch (type) {
        case 'owner':
          content = phaseData.owner;
          break;
        case 'process':
          content = phaseData.focus;
          break;
        case 'input':
          content = phaseData.input.join(', ');
          break;
        case 'output':
          content = phaseData.output.join(', ');
          break;
      }
      
      setSelectedPhaseInfo({
        id: `${type}-${phaseNumber}`,
        name: `${type.toUpperCase()} - Phase ${phaseNumber}`,
        description: content,
        gradient: phaseData.gradient,
        details: {
          owner: phaseData.owner,
          processFocus: phaseData.focus,
          inputs: phaseData.input,
          outputs: phaseData.output,
          keyTasks: phaseData.keyTasks,
          phaseGateCriteria: phaseData.gateCriteria,
          raciMatrix: phaseData.raciMatrix
        }
      });
      setShowModal(true);
    }
  }, []);

  const handleSpecialElementClick = useCallback((nodeId: string) => {
    let elementInfo = {
      id: nodeId,
      name: 'Special Element',
      description: 'Special process element',
      gradient: 'from-blue-500 to-blue-600',
      details: {
        owner: 'Various stakeholders',
        processFocus: 'Special process activities',
        inputs: ['Various inputs'],
        outputs: ['Various outputs'],
        keyTasks: ['Special tasks'],
        phaseGateCriteria: ['Special criteria'],
        raciMatrix: []
      }
    };

    switch (nodeId) {
      case 'business-approval':
        elementInfo = {
          ...elementInfo,
          name: 'Business Approval',
          description: 'Business stakeholder approval process',
          gradient: 'from-green-500 to-green-600'
        };
        break;
      case 'release-management':
        elementInfo = {
          ...elementInfo,
          name: 'Release Management',
          description: 'Coordinated release activities and deployment logistics',
          gradient: 'from-cyan-500 to-cyan-600'
        };
        break;
      case 'go-live':
        elementInfo = {
          ...elementInfo,
          name: 'Go Live',
          description: 'Production deployment and go-live activities',
          gradient: 'from-blue-500 to-blue-600'
        };
        break;
    }

    setSelectedPhaseInfo(elementInfo);
    setShowModal(true);
  }, []);

  const handleExceptionClick = useCallback((nodeId: string) => {
    let elementInfo = {
      id: nodeId,
      name: 'Exception State',
      description: 'Project exception handling',
      gradient: 'from-red-500 to-red-600',
      details: {
        owner: 'PMO + Business Leadership',
        processFocus: 'Exception handling and resolution',
        inputs: ['Exception triggers'],
        outputs: ['Resolution actions'],
        keyTasks: ['Exception management'],
        phaseGateCriteria: ['Resolution criteria'],
        raciMatrix: []
      }
    };

    switch (nodeId) {
      case 'dropped':
        elementInfo = {
          ...elementInfo,
          name: 'Project Dropped',
          description: 'Project cancelled or terminated'
        };
        break;
      case 'on-hold':
        elementInfo = {
          ...elementInfo,
          name: 'Project On Hold',
          description: 'Project temporarily suspended',
          gradient: 'from-orange-500 to-orange-600'
        };
        break;
    }

    setSelectedPhaseInfo(elementInfo);
    setShowModal(true);
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPhaseInfo(null);
  };

  // Create nodes
  const createNodes = (): Node[] => {
    const nodes: Node[] = [];

    // Phase nodes with exact positioning
    phaseData.forEach((phase, index) => {
      const x = 200 + (index * 400);
      const y = 400;

      // Phase circle node
      nodes.push({
        id: `phase-${phase.id}`,
        type: 'phaseNode',
        position: { x, y },
        data: {
          number: phase.id,
          name: phase.name,
          gradientStart: phase.gradientStart,
          gradientEnd: phase.gradientEnd,
          onClick: handleNodeClick
        }
      });

      // Information boxes for each phase with exact positioning
      // Phase 1 (INITIATION) boxes
      if (phase.id === 1) {
        // Owner box
        nodes.push({
          id: `owner-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 150, y: y - 200 },
          data: {
            type: 'owner' as const,
            label: 'OWNER',
            content: phase.owner,
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
            onClick: handleInfoBoxClick
          }
        });

        // Process box
        nodes.push({
          id: `process-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 200, y: y - 50 },
          data: {
            type: 'process' as const,
            label: 'PROCESS',
            content: phase.process,
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            onClick: handleInfoBoxClick
          }
        });

        // Input box
        nodes.push({
          id: `input-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 200, y: y + 80 },
          data: {
            type: 'input' as const,
            label: 'INPUT',
            content: phase.inputs.join(', '),
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            onClick: handleInfoBoxClick
          }
        });

        // Output box
        nodes.push({
          id: `output-${phase.id}`,
          type: 'infoBox',
          position: { x: x, y: y + 150 },
          data: {
            type: 'output' as const,
            label: 'OUTPUT',
            content: phase.outputs.join(', '),
            sourcePosition: Position.Top,
            targetPosition: Position.Bottom,
            onClick: handleInfoBoxClick
          }
        });
      }

      // Phase 2 (REQUIREMENTS) boxes
      if (phase.id === 2) {
        // Owner box
        nodes.push({
          id: `owner-${phase.id}`,
          type: 'infoBox',
          position: { x: x, y: y - 200 },
          data: {
            type: 'owner' as const,
            label: 'OWNER',
            content: phase.owner,
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
            onClick: handleInfoBoxClick
          }
        });

        // Process box
        nodes.push({
          id: `process-${phase.id}`,
          type: 'infoBox',
          position: { x: x + 150, y: y - 150 },
          data: {
            type: 'process' as const,
            label: 'PROCESS',
            content: phase.process,
            sourcePosition: Position.Left,
            targetPosition: Position.Right,
            onClick: handleInfoBoxClick
          }
        });

        // Input box
        nodes.push({
          id: `input-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 200, y: y },
          data: {
            type: 'input' as const,
            label: 'INPUT',
            content: phase.inputs.join(', '),
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            onClick: handleInfoBoxClick
          }
        });

        // Output box
        nodes.push({
          id: `output-${phase.id}`,
          type: 'infoBox',
          position: { x: x, y: y + 150 },
          data: {
            type: 'output' as const,
            label: 'OUTPUT',
            content: phase.outputs.join(', '),
            sourcePosition: Position.Top,
            targetPosition: Position.Bottom,
            onClick: handleInfoBoxClick
          }
        });
      }

      // Phase 3 (DESIGN) boxes
      if (phase.id === 3) {
        // Owner box
        nodes.push({
          id: `owner-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 150, y: y - 200 },
          data: {
            type: 'owner' as const,
            label: 'OWNER',
            content: phase.owner,
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
            onClick: handleInfoBoxClick
          }
        });

        // Process box
        nodes.push({
          id: `process-${phase.id}`,
          type: 'infoBox',
          position: { x: x + 150, y: y - 50 },
          data: {
            type: 'process' as const,
            label: 'PROCESS',
            content: phase.process,
            sourcePosition: Position.Left,
            targetPosition: Position.Right,
            onClick: handleInfoBoxClick
          }
        });

        // Input box
        nodes.push({
          id: `input-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 200, y: y + 80 },
          data: {
            type: 'input' as const,
            label: 'INPUT',
            content: phase.inputs.join(', '),
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            onClick: handleInfoBoxClick
          }
        });

        // Output box
        nodes.push({
          id: `output-${phase.id}`,
          type: 'infoBox',
          position: { x: x, y: y + 150 },
          data: {
            type: 'output' as const,
            label: 'OUTPUT',
            content: phase.outputs.join(', '),
            sourcePosition: Position.Top,
            targetPosition: Position.Bottom,
            onClick: handleInfoBoxClick
          }
        });
      }

      // Phase 4 (PLANNING) boxes
      if (phase.id === 4) {
        // Owner box
        nodes.push({
          id: `owner-${phase.id}`,
          type: 'infoBox',
          position: { x: x + 50, y: y - 200 },
          data: {
            type: 'owner' as const,
            label: 'OWNER',
            content: phase.owner,
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
            onClick: handleInfoBoxClick
          }
        });

        // Process box
        nodes.push({
          id: `process-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 200, y: y - 50 },
          data: {
            type: 'process' as const,
            label: 'PROCESS',
            content: phase.process,
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            onClick: handleInfoBoxClick
          }
        });

        // Input box
        nodes.push({
          id: `input-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 200, y: y + 80 },
          data: {
            type: 'input' as const,
            label: 'INPUT',
            content: phase.inputs.join(', '),
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            onClick: handleInfoBoxClick
          }
        });

        // Output box
        nodes.push({
          id: `output-${phase.id}`,
          type: 'infoBox',
          position: { x: x, y: y + 150 },
          data: {
            type: 'output' as const,
            label: 'OUTPUT',
            content: phase.outputs.join(', '),
            sourcePosition: Position.Top,
            targetPosition: Position.Bottom,
            onClick: handleInfoBoxClick
          }
        });
      }

      // Phase 5 (DEVELOPMENT) boxes
      if (phase.id === 5) {
        // Owner box
        nodes.push({
          id: `owner-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 150, y: y - 200 },
          data: {
            type: 'owner' as const,
            label: 'OWNER',
            content: phase.owner,
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
            onClick: handleInfoBoxClick
          }
        });

        // Process box
        nodes.push({
          id: `process-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 200, y: y - 50 },
          data: {
            type: 'process' as const,
            label: 'PROCESS',
            content: phase.process,
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            onClick: handleInfoBoxClick
          }
        });

        // Input box
        nodes.push({
          id: `input-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 200, y: y + 80 },
          data: {
            type: 'input' as const,
            label: 'INPUT',
            content: phase.inputs.join(', '),
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            onClick: handleInfoBoxClick
          }
        });

        // Output box
        nodes.push({
          id: `output-${phase.id}`,
          type: 'infoBox',
          position: { x: x, y: y + 150 },
          data: {
            type: 'output' as const,
            label: 'OUTPUT',
            content: phase.outputs.join(', '),
            sourcePosition: Position.Top,
            targetPosition: Position.Bottom,
            onClick: handleInfoBoxClick
          }
        });
      }

      // Phase 6 (QA) boxes
      if (phase.id === 6) {
        // Owner box
        nodes.push({
          id: `owner-${phase.id}`,
          type: 'infoBox',
          position: { x: x + 50, y: y - 200 },
          data: {
            type: 'owner' as const,
            label: 'OWNER',
            content: phase.owner,
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
            onClick: handleInfoBoxClick
          }
        });

        // Process box
        nodes.push({
          id: `process-${phase.id}`,
          type: 'infoBox',
          position: { x: x + 150, y: y - 150 },
          data: {
            type: 'process' as const,
            label: 'PROCESS',
            content: phase.process,
            sourcePosition: Position.Left,
            targetPosition: Position.Right,
            onClick: handleInfoBoxClick
          }
        });

        // Input box
        nodes.push({
          id: `input-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 200, y: y },
          data: {
            type: 'input' as const,
            label: 'INPUT',
            content: phase.inputs.join(', '),
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            onClick: handleInfoBoxClick
          }
        });

        // Output box
        nodes.push({
          id: `output-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 200, y: y + 150 },
          data: {
            type: 'output' as const,
            label: 'OUTPUT',
            content: phase.outputs.join(', '),
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            onClick: handleInfoBoxClick
          }
        });
      }

      // Phase 7 (DEPLOYMENT) boxes
      if (phase.id === 7) {
        // Owner box
        nodes.push({
          id: `owner-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 150, y: y - 200 },
          data: {
            type: 'owner' as const,
            label: 'OWNER',
            content: phase.owner,
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
            onClick: handleInfoBoxClick
          }
        });

        // Process box
        nodes.push({
          id: `process-${phase.id}`,
          type: 'infoBox',
          position: { x: x + 150, y: y - 50 },
          data: {
            type: 'process' as const,
            label: 'PROCESS',
            content: phase.process,
            sourcePosition: Position.Left,
            targetPosition: Position.Right,
            onClick: handleInfoBoxClick
          }
        });

        // Input box
        nodes.push({
          id: `input-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 200, y: y + 80 },
          data: {
            type: 'input' as const,
            label: 'INPUT',
            content: phase.inputs.join(', '),
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            onClick: handleInfoBoxClick
          }
        });

        // Output box
        nodes.push({
          id: `output-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 200, y: y + 150 },
          data: {
            type: 'output' as const,
            label: 'OUTPUT',
            content: phase.outputs.join(', '),
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            onClick: handleInfoBoxClick
          }
        });
      }

      // Phase 8 (CLOSURE) boxes
      if (phase.id === 8) {
        // Owner box
        nodes.push({
          id: `owner-${phase.id}`,
          type: 'infoBox',
          position: { x: x + 50, y: y - 200 },
          data: {
            type: 'owner' as const,
            label: 'OWNER',
            content: phase.owner,
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
            onClick: handleInfoBoxClick
          }
        });

        // Process box
        nodes.push({
          id: `process-${phase.id}`,
          type: 'infoBox',
          position: { x: x + 150, y: y - 150 },
          data: {
            type: 'process' as const,
            label: 'PROCESS',
            content: phase.process,
            sourcePosition: Position.Left,
            targetPosition: Position.Right,
            onClick: handleInfoBoxClick
          }
        });

        // Input box
        nodes.push({
          id: `input-${phase.id}`,
          type: 'infoBox',
          position: { x: x - 200, y: y },
          data: {
            type: 'input' as const,
            label: 'INPUT',
            content: phase.inputs.join(', '),
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            onClick: handleInfoBoxClick
          }
        });

        // Output box
        nodes.push({
          id: `output-${phase.id}`,
          type: 'infoBox',
          position: { x: x, y: y + 150 },
          data: {
            type: 'output' as const,
            label: 'OUTPUT',
            content: phase.outputs.join(', '),
            sourcePosition: Position.Top,
            targetPosition: Position.Bottom,
            onClick: handleInfoBoxClick
          }
        });
      }
    });

    // Special elements with exact positioning
    nodes.push({
      id: 'business-approval',
      type: 'specialElement',
      position: { x: 850, y: 250 },
      data: {
        name: 'Business with Approval',
        type: 'approval' as const,
        onClick: handleSpecialElementClick
      }
    });

    nodes.push({
      id: 'release-management',
      type: 'specialElement',
      position: { x: 2850, y: 150 },
      data: {
        name: 'Release Management',
        type: 'release' as const,
        onClick: handleSpecialElementClick
      }
    });

    nodes.push({
      id: 'go-live',
      type: 'specialElement',
      position: { x: 2850, y: 350 },
      data: {
        name: 'Go Live',
        type: 'golive' as const,
        onClick: handleSpecialElementClick
      }
    });

    // Exception states with exact positioning
    nodes.push({
      id: 'dropped',
      type: 'exception',
      position: { x: 850, y: 700 },
      data: {
        name: 'DROPPED',
        type: 'dropped' as const,
        onClick: handleExceptionClick
      }
    });

    nodes.push({
      id: 'on-hold',
      type: 'exception',
      position: { x: 1650, y: 700 },
      data: {
        name: 'ON HOLD',
        type: 'onhold' as const,
        onClick: handleExceptionClick
      }
    });

    return nodes;
  };

  // Create edges
  const createEdges = (): Edge[] => {
    const edges: Edge[] = [];

    // MAIN PROCESS FLOW EDGES - Connect phases 1→2→3→4→5→6→7→8
    const processFlowEdges = [
      {
        id: 'e1-2',
        source: 'phase-1',
        target: 'phase-2',
        type: 'smoothstep',
        style: {
          stroke: '#6B7280',
          strokeWidth: 2
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#6B7280'
        }
      },
      {
        id: 'e2-3',
        source: 'phase-2',
        target: 'phase-3',
        type: 'smoothstep',
        style: {
          stroke: '#6B7280',
          strokeWidth: 2
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#6B7280'
        }
      },
      {
        id: 'e3-4',
        source: 'phase-3',
        target: 'phase-4',
        type: 'smoothstep',
        style: {
          stroke: '#6B7280',
          strokeWidth: 2
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#6B7280'
        }
      },
      {
        id: 'e4-5',
        source: 'phase-4',
        target: 'phase-5',
        type: 'smoothstep',
        style: {
          stroke: '#6B7280',
          strokeWidth: 2
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#6B7280'
        }
      },
      {
        id: 'e5-6',
        source: 'phase-5',
        target: 'phase-6',
        type: 'smoothstep',
        style: {
          stroke: '#6B7280',
          strokeWidth: 2
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#6B7280'
        }
      },
      {
        id: 'e6-7',
        source: 'phase-6',
        target: 'phase-7',
        type: 'smoothstep',
        style: {
          stroke: '#6B7280',
          strokeWidth: 2
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#6B7280'
        }
      },
      {
        id: 'e7-8',
        source: 'phase-7',
        target: 'phase-8',
        type: 'smoothstep',
        style: {
          stroke: '#6B7280',
          strokeWidth: 2
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#6B7280'
        }
      }
    ];

    edges.push(...processFlowEdges);

    // INFORMATION BOX CONNECTIONS - Connect each box to its phase with color-coded edges
    const infoBoxEdges = [
      // Phase 1 connections
      {
        id: 'e-p1-owner',
        source: 'owner-1',
        target: 'phase-1',
        type: 'smoothstep',
        targetHandle: 'top',
        style: {
          stroke: '#9333EA', // Purple for owner
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p1-process',
        source: 'process-1',
        target: 'phase-1',
        type: 'smoothstep',
        targetHandle: 'left',
        style: {
          stroke: '#3B82F6', // Blue for process
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p1-input',
        source: 'input-1',
        target: 'phase-1',
        type: 'smoothstep',
        targetHandle: 'left',
        style: {
          stroke: '#10B981', // Green for input
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p1-output',
        source: 'output-1',
        target: 'phase-1',
        type: 'smoothstep',
        targetHandle: 'bottom',
        style: {
          stroke: '#F59E0B', // Orange for output
          strokeWidth: 1.5
        }
      },
      // Phase 2 connections
      {
        id: 'e-p2-owner',
        source: 'owner-2',
        target: 'phase-2',
        type: 'smoothstep',
        targetHandle: 'top',
        style: {
          stroke: '#9333EA',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p2-process',
        source: 'process-2',
        target: 'phase-2',
        type: 'smoothstep',
        targetHandle: 'right',
        style: {
          stroke: '#3B82F6',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p2-input',
        source: 'input-2',
        target: 'phase-2',
        type: 'smoothstep',
        targetHandle: 'left',
        style: {
          stroke: '#10B981',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p2-output',
        source: 'output-2',
        target: 'phase-2',
        type: 'smoothstep',
        targetHandle: 'bottom',
        style: {
          stroke: '#F59E0B',
          strokeWidth: 1.5
        }
      },
      // Phase 3 connections
      {
        id: 'e-p3-owner',
        source: 'owner-3',
        target: 'phase-3',
        type: 'smoothstep',
        targetHandle: 'top',
        style: {
          stroke: '#9333EA',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p3-process',
        source: 'process-3',
        target: 'phase-3',
        type: 'smoothstep',
        targetHandle: 'right',
        style: {
          stroke: '#3B82F6',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p3-input',
        source: 'input-3',
        target: 'phase-3',
        type: 'smoothstep',
        targetHandle: 'left',
        style: {
          stroke: '#10B981',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p3-output',
        source: 'output-3',
        target: 'phase-3',
        type: 'smoothstep',
        targetHandle: 'bottom',
        style: {
          stroke: '#F59E0B',
          strokeWidth: 1.5
        }
      },
      // Phase 4 connections
      {
        id: 'e-p4-owner',
        source: 'owner-4',
        target: 'phase-4',
        type: 'smoothstep',
        targetHandle: 'top',
        style: {
          stroke: '#9333EA',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p4-process',
        source: 'process-4',
        target: 'phase-4',
        type: 'smoothstep',
        targetHandle: 'left',
        style: {
          stroke: '#3B82F6',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p4-input',
        source: 'input-4',
        target: 'phase-4',
        type: 'smoothstep',
        targetHandle: 'left',
        style: {
          stroke: '#10B981',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p4-output',
        source: 'output-4',
        target: 'phase-4',
        type: 'smoothstep',
        targetHandle: 'bottom',
        style: {
          stroke: '#F59E0B',
          strokeWidth: 1.5
        }
      },
      // Phase 5 connections
      {
        id: 'e-p5-owner',
        source: 'owner-5',
        target: 'phase-5',
        type: 'smoothstep',
        targetHandle: 'top',
        style: {
          stroke: '#9333EA',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p5-process',
        source: 'process-5',
        target: 'phase-5',
        type: 'smoothstep',
        targetHandle: 'left',
        style: {
          stroke: '#3B82F6',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p5-input',
        source: 'input-5',
        target: 'phase-5',
        type: 'smoothstep',
        targetHandle: 'left',
        style: {
          stroke: '#10B981',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p5-output',
        source: 'output-5',
        target: 'phase-5',
        type: 'smoothstep',
        targetHandle: 'bottom',
        style: {
          stroke: '#F59E0B',
          strokeWidth: 1.5
        }
      },
      // Phase 6 connections
      {
        id: 'e-p6-owner',
        source: 'owner-6',
        target: 'phase-6',
        type: 'smoothstep',
        targetHandle: 'top',
        style: {
          stroke: '#9333EA',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p6-process',
        source: 'process-6',
        target: 'phase-6',
        type: 'smoothstep',
        targetHandle: 'right',
        style: {
          stroke: '#3B82F6',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p6-input',
        source: 'input-6',
        target: 'phase-6',
        type: 'smoothstep',
        targetHandle: 'left',
        style: {
          stroke: '#10B981',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p6-output',
        source: 'output-6',
        target: 'phase-6',
        type: 'smoothstep',
        targetHandle: 'left',
        style: {
          stroke: '#F59E0B',
          strokeWidth: 1.5
        }
      },
      // Phase 7 connections
      {
        id: 'e-p7-owner',
        source: 'owner-7',
        target: 'phase-7',
        type: 'smoothstep',
        targetHandle: 'top',
        style: {
          stroke: '#9333EA',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p7-process',
        source: 'process-7',
        target: 'phase-7',
        type: 'smoothstep',
        targetHandle: 'right',
        style: {
          stroke: '#3B82F6',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p7-input',
        source: 'input-7',
        target: 'phase-7',
        type: 'smoothstep',
        targetHandle: 'left',
        style: {
          stroke: '#10B981',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p7-output',
        source: 'output-7',
        target: 'phase-7',
        type: 'smoothstep',
        targetHandle: 'left',
        style: {
          stroke: '#F59E0B',
          strokeWidth: 1.5
        }
      },
      // Phase 8 connections
      {
        id: 'e-p8-owner',
        source: 'owner-8',
        target: 'phase-8',
        type: 'smoothstep',
        targetHandle: 'top',
        style: {
          stroke: '#9333EA',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p8-process',
        source: 'process-8',
        target: 'phase-8',
        type: 'smoothstep',
        targetHandle: 'right',
        style: {
          stroke: '#3B82F6',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p8-input',
        source: 'input-8',
        target: 'phase-8',
        type: 'smoothstep',
        targetHandle: 'left',
        style: {
          stroke: '#10B981',
          strokeWidth: 1.5
        }
      },
      {
        id: 'e-p8-output',
        source: 'output-8',
        target: 'phase-8',
        type: 'smoothstep',
        targetHandle: 'bottom',
        style: {
          stroke: '#F59E0B',
          strokeWidth: 1.5
        }
      }
    ];

    edges.push(...infoBoxEdges);

    // FEEDBACK LOOP - QA to Development with red styling and label
    const feedbackEdge = {
      id: 'e-feedback',
      source: 'phase-6',
      target: 'phase-5',
      type: 'smoothstep',
      sourceHandle: 'top',
      targetHandle: 'top',
      style: {
        stroke: '#EF4444',
        strokeWidth: 2
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#EF4444'
      },
      label: 'Reiterate until Approved',
      labelStyle: {
        fill: '#EF4444',
        fontWeight: 700,
        fontSize: '12px'
      },
      labelBgStyle: {
        fill: '#FEF2F2',
        fillOpacity: 0.9
      }
    };

    edges.push(feedbackEdge);

    // EXCEPTION STATE CONNECTIONS - Dotted lines from relevant phases
    const exceptionEdges = [
      // Connections to DROPPED state
      {
        id: 'e-drop-1',
        source: 'phase-2',
        target: 'dropped',
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: '#EF4444',
          strokeWidth: 2,
          strokeDasharray: '5 5'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#EF4444'
        }
      },
      {
        id: 'e-drop-2',
        source: 'phase-3',
        target: 'dropped',
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: '#EF4444',
          strokeWidth: 2,
          strokeDasharray: '5 5'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#EF4444'
        }
      },
      // Connections to ON HOLD state
      {
        id: 'e-hold-1',
        source: 'phase-4',
        target: 'on-hold',
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: '#F97316',
          strokeWidth: 2,
          strokeDasharray: '5 5'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#F97316'
        }
      },
      {
        id: 'e-hold-2',
        source: 'phase-5',
        target: 'on-hold',
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: '#F97316',
          strokeWidth: 2,
          strokeDasharray: '5 5'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#F97316'
        }
      }
    ];

    edges.push(...exceptionEdges);

    // SPECIAL ELEMENT CONNECTIONS - Connect special elements to relevant phases
    const specialEdges = [
      {
        id: 'e-business-approval',
        source: 'business-approval',
        target: 'phase-3',
        type: 'smoothstep',
        style: {
          stroke: '#10B981',
          strokeWidth: 2,
          strokeDasharray: '3 3'
        }
      },
      {
        id: 'e-release-management',
        source: 'phase-7',
        target: 'release-management',
        type: 'smoothstep',
        style: {
          stroke: '#06B6D4',
          strokeWidth: 2,
          strokeDasharray: '3 3'
        }
      },
      {
        id: 'e-go-live',
        source: 'release-management',
        target: 'go-live',
        type: 'smoothstep',
        style: {
          stroke: '#3B82F6',
          strokeWidth: 2,
          strokeDasharray: '3 3'
        }
      }
    ];

    edges.push(...specialEdges);

    return edges;
  };

  // Node types registration
  const nodeTypes = {
    phaseNode: PhaseNode,
    infoBox: InfoBoxNode,
    specialElement: SpecialElementNode,
    exception: ExceptionNode
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(createNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(createEdges());

  return (
    <div className="w-full p-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Eye className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
            Product Development Lifecycle Process Flow
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
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          fitViewOptions={{
            padding: 0.1,
            includeHiddenNodes: false
          }}
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
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
          </Panel>
        </ReactFlow>
      </div>

      {/* Phase Detail Modal */}
      <PhaseDetailModal
        isOpen={showModal}
        onClose={handleCloseModal}
        phaseInfo={selectedPhaseInfo}
      />

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
    </div>
  );
};

export default VisualProcessPage;