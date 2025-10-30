import React, { useState, useMemo } from 'react';
import { User, Target, ArrowRight, ArrowLeft, CheckSquare, ChevronRight, Pause, AlertTriangle, Briefcase, Code, TestTube, Palette, Building, Users, FileText, Info, Shield, Rocket, CheckCircle, GitBranch, GitMerge } from 'lucide-react';
import Layout from '../components/Layout';
import PhaseDetailModal from '../components/PhaseDetailModal';
import { fullLifecyclePhases } from '../data/lifecycleData';

interface PhaseDetails {
  owner: string;
  processFocus: string;
  inputs: string[];
  outputs: string[];
  keyTasks: string[];
  phaseGateCriteria: string[];
  raciMatrix: { role: string; description: string; }[];
}

interface Phase {
  id: number;
  name: string;
  shortName: string;
  description: string;
  gradient: string;
  position: { row: number; col: number };
  details: PhaseDetails;
}

interface ExceptionPhase {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  details: PhaseDetails;
}

interface LegendItem {
  name: string;
  icon: React.ReactNode;
  color?: string;
  description?: string;
  type?: string;
}

// Release Management data
const releaseManagementInfo = {
  id: 'release-management',
  name: 'Release Management',
  shortName: 'RELEASE',
  description: 'Coordinated release activities and deployment logistics',
  gradient: 'from-cyan-500 to-cyan-600',
  details: {
    owner: 'PMO + Engineering + Application Support',
    processFocus: 'Coordinate release activities, manage deployment logistics, and ensure production readiness',
    inputs: ['Approved solution from QA', 'Go-live readiness checklist', 'Deployment procedures'],
    outputs: ['Release Deployment Report', 'Post-Release Monitoring Plan', 'Production Deployment Confirmation'],
    keyTasks: [
      'Coordinate release activities and schedules',
      'Perform final release readiness checks',
      'Manage production deployment logistics',
      'Execute deployment procedures',
      'Monitor initial system performance',
      'Coordinate with Application Support team',
      'Document deployment outcomes'
    ],
    phaseGateCriteria: [
      'All deployment procedures validated',
      'Production environment ready',
      'Rollback procedures confirmed',
      'Application Support team briefed',
      'Monitoring systems active'
    ],
    raciMatrix: [
      { role: 'PMO', description: 'Accountable for release coordination and governance' },
      { role: 'Engineering', description: 'Responsible for technical deployment execution' },
      { role: 'Application Support', description: 'Responsible for post-deployment support and monitoring' },
      { role: 'Product', description: 'Consulted for release validation and business impact' }
    ]
  }
};

// Criteria Assessment Decision Node data
const criteriaAssessmentInfo = {
  id: 'criteria-assessment',
  name: 'Criteria Assessment',
  shortName: 'CRITERIA',
  description: 'Scientific scoring system to determine optimal path',
  gradient: 'from-yellow-400 to-yellow-500',
  details: {
    owner: 'Product + PMO',
    processFocus: 'Assessment based on Customer Impact (1-5) + Market Demand (1-5) + Features (1-5)',
    inputs: ['PRD Brief from Phase 1'],
    outputs: ['Path determination for next phase'],
    keyTasks: [
      'Score Customer Impact (1-5)',
      'Score Market Demand (1-5)', 
      'Score Request Features (1-5)',
      'Calculate total score',
      'Apply decision logic',
      'Document decision rationale'
    ],
    phaseGateCriteria: [
      'All three criteria scored',
      'Total score calculated',
      'Decision logic applied',
      'PMO validation obtained'
    ],
    raciMatrix: [
      { role: 'Product', description: 'Responsible for completing criteria assessment' },
      { role: 'PMO', description: 'Accountable for validating assessment and approving path' },
      { role: 'BA', description: 'Consulted for criteria interpretation when needed' }
    ]
  }
};

const ProcessFlowPage: React.FC = () => {
  const [selectedPhaseInfo, setSelectedPhaseInfo] = useState<{
    id: string | number;
    name: string;
    shortName?: string;
    description: string;
    gradient: string;
    details: PhaseDetails;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activePhase, setActivePhase] = useState<number | null>(null);
  const [hoveredPhase, setHoveredPhase] = useState<number | string | null>(null);
  const [selectedPath, setSelectedPath] = useState<'both' | 'ba-business' | 'product'>('both');
  const [showLegend, setShowLegend] = useState(false);
  // Helper function to extract RACI roles
  const extractRACIRoles = (raciMatrix: { role: string; description: string; }[]) => {
    const accountable: string[] = [];
    const responsible: string[] = [];
    
    raciMatrix.forEach(item => {
      const description = item.description.toLowerCase();
      if (description.includes('accountable')) {
        accountable.push(item.role);
      }
      if (description.includes('responsible')) {
        responsible.push(item.role);
      }
    });
    
    const parts: string[] = [];
    if (accountable.length > 0) {
      parts.push(`A: ${accountable.join(', ')}`);
    }
    if (responsible.length > 0) {
      parts.push(`R: ${responsible.join(', ')}`);
    }
    
    return parts.join('; ');
  };

  // Visual Summary Component
  const VisualSummary = () => (
    <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-6xl mx-auto">
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700 leading-relaxed">
          This clean visual flowchart displays the complete PMO project lifecycle with organized phase information. 
          Each phase shows key details in a structured layout with clear connections between phases. 
          The design emphasizes readability and logical flow through the development process.
        </p>
      </div>
    </div>
  );

  // Generate phases from fullLifecyclePhases data with RACI-based owners
  const phases: Phase[] = useMemo(() => {
    const positionMap = [
      { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
      { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 }
    ];
    
    const shortNameMap = ['INIT', 'REQ+DESIGN', 'BIZ REVIEW', 'PLAN', 'DEV', 'QA', 'POST IMPL', 'CLOSED'];
    
    return fullLifecyclePhases.map((phase, index) => ({
      id: phase.id,
      name: phase.name,
      shortName: shortNameMap[index] || phase.name.substring(0, 8),
      description: phase.focus,
      gradient: phase.gradient,
      position: positionMap[index] || { row: 1, col: 1 },
      details: {
        owner: extractRACIRoles(phase.raciMatrix),
        processFocus: phase.focus,
        inputs: phase.input,
        outputs: phase.output,
        keyTasks: phase.keyTasks,
        phaseGateCriteria: phase.gateCriteria,
        raciMatrix: phase.raciMatrix
      }
    }));
  }, []);

  const exceptionPhases: ExceptionPhase[] = [
    {
      id: 'dropped',
      name: 'DROPPED',
      icon: <AlertTriangle className="w-5 h-5" />,
      description: 'Project cancelled or terminated',
      details: {
        owner: 'PMO + Business Leadership',
        processFocus: 'Project termination and resource reallocation',
        inputs: ['Cancellation decision', 'Current project state', 'Resource commitments'],
        outputs: ['Closure documentation', 'Resource release', 'Stakeholder notification'],
        keyTasks: [
          'Document cancellation reasons',
          'Release allocated resources',
          'Notify all stakeholders',
          'Archive completed work',
          'Conduct closure meeting'
        ],
        phaseGateCriteria: [],
        raciMatrix: []
      }
    },
    {
      id: 'onhold',
      name: 'ON HOLD',
      icon: <Pause className="w-5 h-5" />,
      description: 'Project temporarily suspended',
      details: {
        owner: 'PMO + Business Leadership',
        processFocus: 'Project suspension and resource management',
        inputs: ['Suspension decision', 'Current deliverables', 'Timeline constraints'],
        outputs: ['Hold documentation', 'Resource reallocation', 'Restart criteria'],
        keyTasks: [
          'Document suspension reasons',
          'Preserve current project state',
          'Reallocate resources temporarily',
          'Define restart conditions',
          'Maintain stakeholder communication'
        ],
        phaseGateCriteria: [],
        raciMatrix: []
      }
    }
  ];

  // Additional special elements
  const additionalSpecialElements = [
    {
      id: 'business-approval',
      name: 'Business Approval',
      shortName: 'APPROVAL',
      description: 'Formal business stakeholder approval process',
      gradient: 'from-green-500 to-green-600',
      details: {
        owner: 'Business Stakeholders + PMO',
        processFocus: 'Formal approval and sign-off from business stakeholders',
        inputs: ['Requirements documentation', 'Business case', 'Impact assessment'],
        outputs: ['Formal approval', 'Sign-off documentation', 'Go-ahead authorization'],
        keyTasks: [
          'Review business requirements',
          'Assess business impact and value',
          'Validate alignment with business objectives',
          'Provide formal approval or rejection',
          'Document approval decision and rationale'
        ],
        phaseGateCriteria: [
          'Business requirements validated',
          'Business case approved',
          'Stakeholder consensus achieved',
          'Formal sign-off obtained'
        ],
        raciMatrix: [
          { role: 'Business', description: 'Accountable for approval decision' },
          { role: 'PMO', description: 'Responsible for facilitating approval process' },
          { role: 'Product', description: 'Consulted for product alignment' }
        ]
      }
    },
    {
      id: 'go-live',
      name: 'Go Live',
      shortName: 'GO-LIVE',
      description: 'Production deployment and system activation',
      gradient: 'from-blue-500 to-blue-600',
      details: {
        owner: 'Engineering + PMO + Application Support',
        processFocus: 'Production deployment, system activation, and initial monitoring',
        inputs: ['Approved release package', 'Deployment procedures', 'Rollback plan'],
        outputs: ['Live system', 'Deployment confirmation', 'Initial performance metrics'],
        keyTasks: [
          'Execute production deployment',
          'Activate system in production environment',
          'Monitor initial system performance',
          'Validate system functionality',
          'Communicate go-live status to stakeholders'
        ],
        phaseGateCriteria: [
          'Successful deployment completed',
          'System functionality validated',
          'Performance metrics within acceptable range',
          'Stakeholders notified of go-live'
        ],
        raciMatrix: [
          { role: 'Engineering', description: 'Responsible for deployment execution' },
          { role: 'PMO', description: 'Accountable for go-live coordination' },
          { role: 'Application Support', description: 'Responsible for monitoring and support' }
        ]
      }
    }
  ];

  const legendItems: LegendItem[] = [
    // Roles
    {
      name: 'Project Management Office',
      icon: <Briefcase className="w-4 h-4" />,
      color: 'text-blue-600',
      description: 'Project Management Office - Oversees project governance and standards',
      type: 'role'
    },
    {
      name: 'Product Management',
      icon: <Target className="w-4 h-4" />,
      color: 'text-green-600',
      description: 'Product Management - Defines product strategy and requirements',
      type: 'role'
    },
    {
      name: 'Business Analyst',
      icon: <Users className="w-4 h-4" />,
      color: 'text-purple-600',
      description: 'Business Analyst - Gathers and analyzes business requirements',
      type: 'role'
    },
    {
      name: 'Design Team',
      icon: <Palette className="w-4 h-4" />,
      color: 'text-pink-600',
      description: 'Design Team - Creates user experience and interface designs',
      type: 'role'
    },
    {
      name: 'Engineering Team',
      icon: <Code className="w-4 h-4" />,
      color: 'text-orange-600',
      description: 'Development Team - Builds and implements technical solutions',
      type: 'role'
    },
    {
      name: 'Quality Assurance',
      icon: <TestTube className="w-4 h-4" />,
      color: 'text-red-600',
      description: 'Quality Assurance - Tests and validates solution quality',
      type: 'role'
    },
    {
      name: 'Business Stakeholders',
      icon: <Building className="w-4 h-4" />,
      color: 'text-indigo-600',
      description: 'Business Stakeholders - Provide requirements and approval',
      type: 'role'
    },
    // Categories
    {
      name: 'Owner',
      icon: <User className="w-4 h-4" />,
      color: 'text-purple-600',
      description: 'Process Owner - Who is responsible for the overall phase execution',
      type: 'category'
    },
    {
      name: 'Process',
      icon: <Target className="w-4 h-4" />,
      color: 'text-blue-600',
      description: 'Process Focus - The main activities and objectives of the phase',
      type: 'category'
    },
    {
      name: 'Input',
      icon: <ArrowRight className="w-4 h-4" />,
      color: 'text-green-600',
      description: 'Input - Required deliverables and information to start the phase',
      type: 'category'
    },
    {
      name: 'Output',
      icon: <ArrowLeft className="w-4 h-4" />,
      color: 'text-orange-600',
      description: 'Output - Deliverables and results produced by the phase',
      type: 'category'
    },
    {
      name: 'Special/Notes',
      icon: <Info className="w-4 h-4" />,
      color: 'text-yellow-600',
      description: 'Special Logic - Additional notes, conditions, or special considerations',
      type: 'category'
    }
  ];

  // Define specialProcessElements array combining all special elements
  const specialProcessElements = [
    criteriaAssessmentInfo,
    releaseManagementInfo,
    ...additionalSpecialElements
  ];

  // Helper functions for path filtering
  const getPhaseOpacity = (phaseId: number) => {
    if (selectedPath === 'product' && [2, 3].includes(phaseId)) {
      return 'opacity-30';
    }
    return 'opacity-100';
  };

  const getArrowOpacity = (fromPhase: number, toPhase: number) => {
    if (selectedPath === 'product' && 
        ((fromPhase === 1 && toPhase === 2) || 
         (fromPhase === 2 && toPhase === 3) || 
         (fromPhase === 3 && toPhase === 4))) {
      return 'opacity-30';
    }
    return 'opacity-100';
  };

  const handlePhaseClick = (phase: Phase | ExceptionPhase) => {
    setSelectedPhaseInfo({
      id: phase.id,
      name: phase.name,
      shortName: 'shortName' in phase ? phase.shortName : undefined,
      description: phase.description,
      gradient: 'gradient' in phase ? phase.gradient : 'from-red-500 to-red-600',
      details: phase.details
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPhaseInfo(null);
    setActivePhase(null);
  };

  const renderArrow = (fromPhase: number, toPhase: number, isVertical: boolean = false) => {
    const key = `arrow-${fromPhase}-${toPhase}`;
    const opacityClass = getArrowOpacity(fromPhase, toPhase);
    
    if (isVertical) {
      return (
        <div key={key} className={`flex justify-center transition-opacity duration-300 ${opacityClass}`}>
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-8 bg-gradient-to-b from-gray-400 to-gray-600"></div>
            <ChevronRight className="w-6 h-6 text-gray-600 rotate-90 transform -mt-1" />
          </div>
        </div>
      );
    }

    return (
      <div key={key} className={`flex items-center justify-center transition-opacity duration-300 ${opacityClass}`}>
        <div className="flex items-center">
          <div className="w-8 h-0.5 bg-gradient-to-r from-gray-400 to-gray-600"></div>
          <ChevronRight className="w-6 h-6 text-gray-600 -ml-1" />
        </div>
      </div>
    );
  };

  const renderPhase = (phase: Phase) => {
    const isHovered = hoveredPhase === phase.id;
    const opacityClass = getPhaseOpacity(phase.id);
    
    return (
      <div
        key={phase.id}
        className={`flex flex-col items-center group cursor-pointer relative w-48 transition-opacity duration-300 ${opacityClass}`}
        onClick={() => handlePhaseClick(phase)}
        onMouseEnter={() => setHoveredPhase(phase.id)}
        onMouseLeave={() => setHoveredPhase(null)}
      >
        <div
          className={`
            relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${phase.gradient}
            flex flex-col items-center justify-center text-white font-bold
            shadow-lg transform transition-all duration-300 ease-out cursor-pointer border-2 border-white/20
            ${isHovered ? 'scale-110 shadow-2xl shadow-blue-500/30 border-white/40' : ''}
            hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/30 hover:border-white/40
          `}
        >
          <span className="text-lg md:text-xl font-black drop-shadow-sm">{phase.id}</span>
          <span className="text-xs md:text-sm text-center leading-tight px-1 font-semibold drop-shadow-sm">
            {phase.shortName}
          </span>
        </div>
        
        <div className="mt-3 text-center">
          <h3 className="text-sm md:text-base font-bold text-gray-800 mb-2 tracking-wide">
            {phase.name}
          </h3>
          
          {/* Basic description (always visible) */}
          <div className="max-w-32 mx-auto">
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-medium">
              {phase.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderExceptionPhase = (exceptionPhase: ExceptionPhase) => {
    const isHovered = hoveredPhase === exceptionPhase.id;
    
    return (
      <div
        key={exceptionPhase.id}
        className="flex flex-col items-center group cursor-pointer relative"
        onClick={() => handlePhaseClick(exceptionPhase)}
        onMouseEnter={() => setHoveredPhase(exceptionPhase.id)}
        onMouseLeave={() => setHoveredPhase(null)}
      >
        <div
          className={`
            relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600
            flex flex-col items-center justify-center text-white font-bold border-2 border-white/20
            shadow-lg transform transition-all duration-300 ease-out cursor-pointer
            ${isHovered ? 'scale-110 shadow-xl shadow-red-500/30 border-white/40' : ''}
            hover:scale-110 hover:shadow-xl hover:shadow-red-500/30 hover:border-white/40
          `}
        >
          {exceptionPhase.icon}
        </div>
        
        <div className="mt-2 text-center">
          <h3 className="text-xs md:text-sm font-bold text-red-700 mb-1 tracking-wide">
            {exceptionPhase.name}
          </h3>
          
          <div className="max-w-24 mx-auto">
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              {exceptionPhase.description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderLegend = () => {
    const roleItems = legendItems.filter(item => item.type === 'role');
    const categoryItems = legendItems.filter(item => item.type === 'category');

    return (
      <div className={`
        fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4
        ${showLegend ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        transition-opacity duration-300
      `}>
        <div className={`
          bg-white rounded-xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-hidden
          transform transition-all duration-300 legend-container
          ${showLegend ? 'scale-100' : 'scale-95'}
        `}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="font-bold text-gray-800 text-xl">Process Legend</h3>
            <button
              onClick={() => setShowLegend(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Close legend"
            >
              <span className="text-xl font-bold">×</span>
            </button>
          </div>
          
          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
            {/* Roles Section */}
            <div className="mb-8">
              <h4 className="font-semibold text-gray-700 text-base mb-4 uppercase tracking-wide">Roles</h4>
              <div className="space-y-3">
                {roleItems.map((item) => (
                  <div key={item.name} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`${item.color} mt-0.5`}>
                      {item.icon}
                    </div>
                    <div>
                      <span className="font-bold text-gray-800 text-base">{item.name}</span>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories Section */}
            <div>
              <h4 className="font-semibold text-gray-700 text-base mb-4 uppercase tracking-wide">Categories</h4>
              <div className="space-y-3">
                {categoryItems.map((item) => (
                  <div key={item.name} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className={`${item.color} mt-0.5`}>
                      {item.icon}
                    </div>
                    <div>
                      <span className="font-bold text-gray-800 text-base">{item.name}</span>
                      <p className="text-sm text-gray-600 mt-1 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={() => setShowLegend(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Close Legend
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Click outside to close legend
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showLegend && !target.closest('.legend-container') && !target.closest('.legend-toggle')) {
        setShowLegend(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showLegend) {
        setShowLegend(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [showLegend]);

  return (
    <div className="p-6">
      {/* View Path Controls */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">View Path:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedPath('both')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedPath === 'both'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Both Paths
            </button>
            <button
              onClick={() => setSelectedPath('ba-business')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedPath === 'ba-business'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              BA + Business
            </button>
            <button
              onClick={() => setSelectedPath('product')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                selectedPath === 'product'
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Product
            </button>
          </div>
          
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium legend-toggle"
          >
            <Info className="w-4 h-4" />
            Legend
          </button>
        </div>
      </div>

      {/* Decision Criteria Flow Header */}
      <div className="mb-8 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200 shadow-sm">
        <div className="flex items-center justify-center space-x-8">
          <div className="flex items-center space-x-3">
            <GitBranch className="w-6 h-6 text-amber-600" />
            <span className="text-lg font-bold text-amber-800">Decision Criteria Flow:</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 rounded-lg px-4 py-2 border border-blue-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-bold text-blue-700">BA + Business Path:</span>
                <span className="text-sm text-blue-600 font-mono">1→2→3→4</span>
              </div>
            </div>
            
            <span className="text-amber-600 font-bold text-lg">OR</span>
            
            <div className="bg-green-100 rounded-lg px-4 py-2 border border-green-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-bold text-green-700">Product Path:</span>
                <span className="text-sm text-green-600 font-mono">1→4</span>
                <span className="text-xs text-green-500">(Skip 2,3)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Process Flow */}
      <div className="mb-12 relative">
        {/* Top Row: Phases 1-4 */}
        <div className="flex justify-center items-start gap-8 mb-8">
          {phases.slice(0, 4).map((phase, index) => (
            <React.Fragment key={phase.id}>
              <div className="flex flex-col items-center w-48">
                {/* Phase Indicators */}
                <div className="mb-2 flex justify-center h-6">
                  {phase.id === 1 && (
                    <div className="bg-amber-100 rounded-full p-1">
                      <GitBranch className="w-4 h-4 text-amber-600" />
                    </div>
                  )}
                  {[2, 3].includes(phase.id) && (
                    <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                      REQ
                    </div>
                  )}
                  {phase.id === 4 && (
                    <div className="bg-green-100 rounded-full p-1">
                      <GitMerge className="w-4 h-4 text-green-600" />
                    </div>
                  )}
                </div>
                
                {/* Phase Circle */}
                <div
                  className={`
                    relative w-24 h-24 rounded-full bg-gradient-to-br ${phase.gradient}
                    flex flex-col items-center justify-center text-white font-bold
                    shadow-lg transform transition-all duration-300 ease-out cursor-pointer border-2 border-white/20
                    ${hoveredPhase === phase.id ? 'scale-110 shadow-2xl shadow-blue-500/30 border-white/40' : ''}
                    hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/30 hover:border-white/40
                  `}
                  onClick={() => handlePhaseClick(phase)}
                  onMouseEnter={() => setHoveredPhase(phase.id)}
                  onMouseLeave={() => setHoveredPhase(null)}
                >
                  <span className="text-xl font-black drop-shadow-sm">{phase.id}</span>
                  <span className="text-sm text-center leading-tight px-1 font-semibold drop-shadow-sm">
                    {phase.shortName}
                  </span>
                </div>
                
                {/* Phase Title and Description */}
                <div className="mt-4 text-center w-full">
                  <h3 className="text-base font-bold text-gray-800 mb-2 tracking-wide">
                    {phase.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed min-h-[3rem] flex items-center justify-center">
                    {phase.description}
                  </p>
                </div>
              </div>
              
              {/* Arrow between phases */}
              {index < 3 && (
                <div className="flex items-center mt-12">
                  <ChevronRight className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Vertical Arrow */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-col items-center">
            <div className="w-0.5 h-12 bg-gradient-to-b from-gray-400 to-gray-600"></div>
            <ChevronRight className="w-8 h-8 text-gray-600 rotate-90 transform -mt-1" />
          </div>
        </div>

        {/* Bottom Row: Phases 5-8 */}
        <div className="flex justify-center items-start gap-8">
          {phases.slice(4, 8).map((phase, index) => (
            <React.Fragment key={phase.id}>
              <div className="flex flex-col items-center w-48">
                {/* Phase Circle */}
                <div
                  className={`
                    relative w-24 h-24 rounded-full bg-gradient-to-br ${phase.gradient}
                    flex flex-col items-center justify-center text-white font-bold
                    shadow-lg transform transition-all duration-300 ease-out cursor-pointer border-2 border-white/20
                    ${hoveredPhase === phase.id ? 'scale-110 shadow-2xl shadow-blue-500/30 border-white/40' : ''}
                    hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/30 hover:border-white/40
                  `}
                  onClick={() => handlePhaseClick(phase)}
                  onMouseEnter={() => setHoveredPhase(phase.id)}
                  onMouseLeave={() => setHoveredPhase(null)}
                >
                  <span className="text-xl font-black drop-shadow-sm">{phase.id}</span>
                  <span className="text-sm text-center leading-tight px-1 font-semibold drop-shadow-sm">
                    {phase.shortName}
                  </span>
                </div>
                
                {/* Phase Title and Description */}
                <div className="mt-4 text-center w-full">
                  <h3 className="text-base font-bold text-gray-800 mb-2 tracking-wide">
                    {phase.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed min-h-[3rem] flex items-center justify-center">
                    {phase.description}
                  </p>
                </div>
              </div>
              
              {/* Arrow between phases */}
              {index < 3 && (
                <div className={`flex items-center mt-12 transition-opacity duration-300 ${getArrowOpacity(phases[index + 4].id, phases[index + 5]?.id || 0)}`}>
                  <ChevronRight className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* QA Parallel Track */}
      <div className="mb-12 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 shadow-sm">
        <div className="flex items-center justify-center space-x-8">
          <div className="flex items-center space-x-3">
            <TestTube className="w-6 h-6 text-purple-600" />
            <span className="text-lg font-bold text-purple-800">QA Parallel Track:</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-green-100 rounded-lg px-3 py-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-bold text-green-700">Phase 4: Test Cases</span>
            </div>
            <ChevronRight className="w-5 h-5 text-purple-600" />
            <div className="flex items-center space-x-2 bg-yellow-100 rounded-lg px-3 py-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm font-bold text-yellow-700">Phase 5: Refinement</span>
            </div>
            <ChevronRight className="w-5 h-5 text-purple-600" />
            <div className="flex items-center space-x-2 bg-blue-100 rounded-lg px-3 py-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-bold text-blue-700">Phase 6: Execution</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exception States */}
      <div className="mb-12">
        <div className="flex justify-center items-center gap-12">
          {exceptionPhases.map((exceptionPhase) => (
            <div
              key={exceptionPhase.id}
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => handlePhaseClick(exceptionPhase)}
              onMouseEnter={() => setHoveredPhase(exceptionPhase.id)}
              onMouseLeave={() => setHoveredPhase(null)}
            >
              <div
                className={`
                  relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600
                  flex flex-col items-center justify-center text-white font-bold border-2 border-white/20
                  shadow-lg transform transition-all duration-300 ease-out cursor-pointer
                  ${hoveredPhase === exceptionPhase.id ? 'scale-110 shadow-xl shadow-red-500/30 border-white/40' : ''}
                  hover:scale-110 hover:shadow-xl hover:shadow-red-500/30 hover:border-white/40
                `}
              >
                <span className="text-xs font-bold">{exceptionPhase.name}</span>
              </div>
              
              <div className="mt-3 text-center">
                <h3 className="text-sm font-bold text-red-700 mb-1">
                  {exceptionPhase.name === 'DROPPED' ? 'Project Terminated' : 'Temporarily Suspended'}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Process Elements for Exception States */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-gray-800 text-center mb-8">Special Process Elements</h3>
        {/* Special Process Elements positioned horizontally */}
        <div className="flex justify-center items-center gap-8 flex-wrap">
          {specialProcessElements.map((element) => (
            <div
              key={element.id}
              className="flex flex-col items-center group cursor-pointer"
              onClick={() => handlePhaseClick(element)}
              onMouseEnter={() => setHoveredPhase(element.id)}
              onMouseLeave={() => setHoveredPhase(null)}
            >
              <div
                className={`
                  relative w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gradient-to-br ${element.gradient}
                  flex flex-col items-center justify-center text-white font-bold border-2 border-white/20
                  shadow-lg transform transition-all duration-300 ease-out cursor-pointer
                  ${hoveredPhase === element.id ? 'scale-110 shadow-xl border-white/40' : ''}
                  hover:scale-110 hover:shadow-xl hover:border-white/40
                `}
              >
                <span className="text-xs md:text-sm text-center leading-tight px-1 font-bold drop-shadow-sm">
                  {element.shortName}
                </span>
              </div>
              
              <div className="mt-3 text-center max-w-36">
                <h4 className="text-sm font-bold text-gray-800 mb-1 tracking-wide">
                  {element.name}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {element.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Criteria Legend */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold mb-6 text-gray-800">Decision Criteria Legend</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-lg font-bold text-blue-700">BA + Business Path (1→2→3→4):</span>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• New features requiring business justification</li>
              <li>• Complex technical implementations</li>
              <li>• High business impact or risk</li>
              <li>• Regulatory or compliance requirements</li>
            </ul>
          </div>
          
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-lg font-bold text-green-700">Product Path (1→4):</span>
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>• Simple enhancements or bug fixes</li>
              <li>• Clear product requirements without financial metrics</li>
              <li>• Low technical complexity</li>
              <li>• Well-understood scope and impact</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-sm max-w-4xl mx-auto">
          <p className="text-sm text-gray-600 mb-2 font-medium">
            🖱️ Click on any phase circle or special element to view detailed information • 🎯 Decision flow shows two possible paths based on project complexity • ⚠️ Exception states include special process elements
          </p>
          <p className="text-xs text-gray-500">
            Requirements Path for complex projects • Product Path for simple enhancements • QA runs in parallel during phases 4-6 • Special elements handle unique process scenarios
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-medium">
              📋 Process Overview: This clean visual flowchart displays the complete PMO project lifecycle with organized phase information. 
              Each phase shows key details in a structured layout with clear connections between phases. 
              The design emphasizes readability and logical flow through the development process.
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      {renderLegend()}

      {/* Phase Detail Modal */}
      <PhaseDetailModal
        isOpen={showModal}
        onClose={handleCloseModal}
        phaseInfo={selectedPhaseInfo}
      />
    </div>
  );
};

export default ProcessFlowPage;