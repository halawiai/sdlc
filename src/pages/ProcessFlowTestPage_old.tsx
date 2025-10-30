import React, { useState, useMemo } from 'react';
import { User, Target, ArrowRight, ArrowLeft, CheckSquare, ChevronRight, Pause, AlertTriangle, Briefcase, Code, TestTube, Palette, Building, Users, FileText, Info, Shield, Rocket, CheckCircle, GitBranch, GitMerge } from 'lucide-react';
import PhaseDetailModal from '../components/PhaseDetailModal';
import { fullLifecyclePhases } from '../data/lifecycleData';

type PhaseID = '0'|'1'|'E2'|'E3'|'E4'|'P2'|'P3'|'P4'|'SA'|'QA1'|'QA2'|'QA3'|'5'|'5.1'|'6'|'7'|'8'|'9';

const v25: Record<PhaseID, {
  name: string; short: string; desc: string; gradient: string;
  details: PhaseDetails;
}> = {
  '0':  { name:'Discovery', short:'DISC', desc:'Identify scope & objectives', gradient:'from-purple-600 to-purple-500',
          details:{ owner:'Product + Business', processFocus:'Identify scope, objectives, stakeholders, success criteria',
            inputs:['Problem statement','Market/user signals'], outputs:['Project Charter / Discovery Brief'],
            keyTasks:['Frame problem & goals','Identify stakeholders','Define success metrics','Draft hi-level scope'],
            phaseGateCriteria:['Charter approved','Stakeholder alignment'], raciMatrix:[
              { role:'Product', description:'Accountable for discovery outcome' },
              { role:'Business', description:'Responsible for domain input' },
              { role:'PMO', description:'Consulted for governance' }
            ] } },
  '1':  { name:'Initiation', short:'INIT', desc:'Formal project start', gradient:'from-blue-500 to-blue-600',
          details:{ owner:'PMO + Product', processFocus:'Formal project kickoff and initial resource allocation',
            inputs:['Project Charter / Discovery Brief'], outputs:['Resource allocation', 'Project team assignment'],
            keyTasks:['Assign project team','Set up project infrastructure','Initial stakeholder communication'],
            phaseGateCriteria:['Team assigned','Infrastructure ready'], raciMatrix:[
              { role:'PMO', description:'Accountable for project initiation' },
              { role:'Product', description:'Responsible for product context' }
            ] } },
  'E2': { name:'Enterprise Requirements', short:'REQ', desc:'Requirements', gradient:'from-amber-100 to-amber-300',
          details:{ owner:'BA + Business', processFocus:'Detailed business requirements analysis and documentation',
            inputs:['Project Charter','Business context'], outputs:['Business Requirements Document (BRD)','Requirements traceability'],
            keyTasks:['Gather detailed requirements','Analyze business processes','Document functional requirements','Validate with stakeholders'],
            phaseGateCriteria:['BRD completed','Requirements validated'], raciMatrix:[
              { role:'BA', description:'Responsible for requirements gathering' },
              { role:'Business', description:'Accountable for requirement approval' }
            ] } },
  'E3': { name:'Business Review', short:'BIZ REV', desc:'Business review & approval', gradient:'from-amber-100 to-amber-300',
          details:{ owner:'Business + PMO', processFocus:'Business stakeholder review and formal approval of requirements',
            inputs:['BRD document','Requirements package'], outputs:['Formal business approval','Approved requirements package'],
            keyTasks:['Review business requirements','Validate business case','Assess impact and risks','Provide formal sign-off'],
            phaseGateCriteria:['Business approval obtained','Requirements signed off'], raciMatrix:[
              { role:'Business', description:'Accountable for approval decision' },
              { role:'PMO', description:'Responsible for approval process' }
            ] } },
  'E4': { name:'Planning', short:'PLAN', desc:'Planning & early QA test cases', gradient:'from-amber-100 to-amber-300',
          details:{ owner:'PMO + Product + QA', processFocus:'Comprehensive project planning and early test case development',
            inputs:['Approved requirements package','Business approval'], outputs:['Project plan','Timeline','Test cases','Risk register'],
            keyTasks:['Create project timeline','Allocate resources','Develop test strategy','Plan risk mitigation'],
            phaseGateCriteria:['Project plan approved','Test cases ready'], raciMatrix:[
              { role:'PMO', description:'Accountable for planning process' },
              { role:'Product', description:'Responsible for product planning' },
              { role:'QA', description:'Responsible for test planning' }
            ] } },
  'P2': { name:'Product Requirements', short:'REQ', desc:'Requirements', gradient:'from-emerald-200 to-emerald-500',
          details:{ owner:'Product + BA', processFocus:'Product requirements gathering and user story creation',
            inputs:['Project Charter','Product context'], outputs:['User stories','Product requirements'],
            keyTasks:['Define user stories','Prioritize features','Document acceptance criteria','Validate with stakeholders'],
            phaseGateCriteria:['User stories completed','Requirements validated'], raciMatrix:[
              { role:'Product', description:'Accountable for product requirements' },
              { role:'BA', description:'Responsible for documentation' }
            ] } },
  'P3': { name:'Design', short:'DESIGN', desc:'UX/UI design', gradient:'from-emerald-200 to-emerald-500',
          details:{ owner:'Design + Product', processFocus:'User experience and interface design development',
            inputs:['User stories','Product requirements'], outputs:['UX/UI designs','Design prototypes','Style guide'],
            keyTasks:['Create wireframes','Design user interface','Develop prototypes','Validate with users'],
            phaseGateCriteria:['Designs approved','Prototypes validated'], raciMatrix:[
              { role:'Design', description:'Responsible for design creation' },
              { role:'Product', description:'Accountable for design approval' }
            ] } },
  'P4': { name:'Grooming', short:'GROOM', desc:'Backlog refinement', gradient:'from-emerald-200 to-emerald-500',
          details:{ owner:'Product + PMO', processFocus:'Backlog refinement and sprint preparation',
            inputs:['User stories','UX/UI designs'], outputs:['Refined backlog','Sprint-ready stories','Definition of done'],
            keyTasks:['Refine user stories','Estimate story points','Prioritize backlog','Define acceptance criteria'],
            phaseGateCriteria:['Backlog refined','Stories estimated'], raciMatrix:[
              { role:'Product', description:'Accountable for backlog prioritization' },
              { role:'PMO', description:'Responsible for process facilitation' }
            ] } },
  'SA': { name:'Solution Architecture', short:'ARCH', desc:'Align design & constraints, define technical approach', gradient:'from-indigo-400 to-indigo-600',
          details:{ owner:'Engineering + Product + QA', processFocus:'Architecture decisions, interfaces, data, security, NFRs',
            inputs:['Enterprise/Prod. requirements','Designs','Constraints'], outputs:['Architecture decision record','System context & interfaces','Tech stack & NFRs'],
            keyTasks:[
              'Review requirements and designs',
              'Define service boundaries & contracts',
              'Select stack & patterns',
              'Model data & integrations',
              'Capture NFRs (perf, sec, resiliency)'
            ],
            phaseGateCriteria:['ADR approved','Risks identified & mitigations planned'], raciMatrix:[
              { role:'Engineering', description:'Accountable for architecture quality' },
              { role:'Product', description:'Responsible for business alignment' },
              { role:'QA', description:'Consulted for testability & NFRs' },
              { role:'PMO', description:'Consulted for governance' }
            ] } },
  'QA1': { name:'QA: Test Case Preparation', short:'QA PREP', desc:'Prepare test cases during Solution Architecture', gradient:'from-red-200 to-red-400',
           details:{ owner:'QA', processFocus:'Design test cases from requirements and architecture',
             inputs:['Requirements','Architecture specs'], outputs:['Test cases','Traceability matrix'],
             keyTasks:['Design test cases','Review coverage','Align with Dev & Business'],
             phaseGateCriteria:['Test cases ready','Coverage approved'], raciMatrix:[
               { role:'QA', description:'Responsible for preparation' }
             ] } },
  'QA2': { name:'QA: SIT', short:'SIT', desc:'System Integration Testing', gradient:'from-red-300 to-red-500',
           details:{ owner:'QA', processFocus:'Validate integrated modules during development',
             inputs:['Working code','Test cases'], outputs:['SIT reports','Defect logs'],
             keyTasks:['Run SIT','Log defects','Support fixes'],
             phaseGateCriteria:['No critical SIT defects'], raciMatrix:[
               { role:'QA', description:'Responsible for SIT execution' }
             ] } },
  'QA2': { name:'QA: SIT', short:'SIT', desc:'System Integration Testing', gradient:'from-red-300 to-red-500',
           details:{ owner:'QA', processFocus:'Validate integrated modules during development',
             inputs:['Working code','Test cases'], outputs:['SIT reports','Defect logs'],
             keyTasks:['Run SIT','Log defects','Support fixes'],
             phaseGateCriteria:['No critical SIT defects'], raciMatrix:[
               { role:'QA', description:'Responsible for SIT execution' }
             ] } },
  'QA3': { name:'QA: UAT', short:'QA UAT', desc:'Simulate user testing before business acceptance', gradient:'from-red-400 to-red-600',
           details:{ owner:'QA', processFocus:'Run end-to-end scenarios to validate readiness',
             inputs:['SIT-passed build','User scenarios'], outputs:['UAT reports','Defect logs'],
             keyTasks:['Run UAT','Log defects','Support fixes'],
             phaseGateCriteria:['All UAT defects resolved'], raciMatrix:[
               { role:'QA', description:'Responsible for UAT execution' }
             ] } },
  '5':  { name:'Development', short:'DEV', desc:'Solution development', gradient:'from-sky-300 to-sky-500',
          details:{ owner:'Engineering', processFocus:'Solution development and implementation',
            inputs:['Refined backlog','Technical architecture','UX/UI designs'], outputs:['Working code','Technical documentation','Demo'],
            keyTasks:['Implement features','Code reviews','Unit testing','Integration'],
            phaseGateCriteria:['Core functionality complete','Code quality standards met'], raciMatrix:[
              { role:'Engineering', description:'Responsible for development execution' },
              { role:'Product', description:'Consulted for feature validation' }
            ] } },
  '5.1':{ name:'QA', short:'QA', desc:'QA testing (parallel)', gradient:'from-sky-300 to-sky-500',
          details:{ owner:'QA + PMO', processFocus:'Comprehensive testing and quality validation',
            inputs:['Test cases','Working code','Requirements'], outputs:['Test results','Bug reports','Quality metrics'],
            keyTasks:['Execute test cases','Report defects','Validate requirements','Performance testing'],
            phaseGateCriteria:['All tests executed','Critical bugs resolved'], raciMatrix:[
              { role:'QA', description:'Responsible for test execution' },
              { role:'PMO', description:'Accountable for quality governance' }
            ] } },
  '6':  { name:'Business/Product Acceptance', short:'ACCEPT', desc:'Final happy-path validation', gradient:'from-sky-400 to-sky-600',
          details:{ owner:'Business + Product', processFocus:'Business confirms solution readiness',
            inputs:['QA UAT sign-off'], outputs:['Formal acceptance sign-off'],
            keyTasks:['Validate happy path','Confirm usability','Sign-off'],
            phaseGateCriteria:['Acceptance sign-off obtained'], raciMatrix:[
              { role:'Business', description:'Accountable for acceptance' },
              { role:'Product', description:'Responsible for validation' }
            ] } },
  '7':  { name:'Release Management', short:'RELEASE', desc:'Production deployment', gradient:'from-sky-300 to-sky-600',
          details:{ owner:'Engineering + PMO + Application Support', processFocus:'Coordinate deployment & readiness',
            inputs:['UAT approval','Deployment procedures'], outputs:['Release report','Deployment confirmation'],
            keyTasks:['Readiness checks','Execute deployment','Initial monitoring'],
            phaseGateCriteria:['Rollback validated','Support briefed','Monitoring active'], raciMatrix:[
              { role:'Engineering', description:'Responsible for deployment execution' },
              { role:'PMO', description:'Accountable for release coordination' },
              { role:'Application Support', description:'Responsible for post-deployment monitoring' }
            ] } },
  '8':  { name:'Post Implementation', short:'POST IMPL', desc:'Stabilization & metrics', gradient:'from-sky-300 to-sky-600',
          details:{ owner:'PMO + Support', processFocus:'System stabilization and performance measurement',
            inputs:['Deployment confirmation','User feedback','System logs'], outputs:['Performance metrics','Stabilization report','Success measurement'],
            keyTasks:['Monitor system performance','Gather user feedback','Measure success criteria','Document lessons learned'],
            phaseGateCriteria:['System stable','Success metrics achieved'], raciMatrix:[
              { role:'PMO', description:'Accountable for success measurement' },
              { role:'Application Support', description:'Responsible for system monitoring' }
            ] } },
  '9':  { name:'Closure', short:'CLOSURE', desc:'Lessons learned & closure', gradient:'from-emerald-500 to-emerald-600',
          details:{ owner:'PMO + Product', processFocus:'Project closure and knowledge transfer',
            inputs:['Performance metrics','Project deliverables','Stakeholder feedback'], outputs:['Lessons learned','Closure report','Knowledge transfer'],
            keyTasks:['Document lessons learned','Archive project materials','Release resources','Conduct closure meeting'],
            phaseGateCriteria:['All deliverables complete','Lessons documented'], raciMatrix:[
              { role:'PMO', description:'Responsible for closure process' },
              { role:'Product', description:'Consulted for product outcomes' }
            ] } }
};

const toPhase = (id: PhaseID): Phase => ({
  id, name: v25[id].name, shortName: v25[id].short, description: v25[id].desc,
  gradient: v25[id].gradient, position: { row: 1, col: 1 }, // unused in our inline layout
  details: v25[id].details
} as any);

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

// ---- Visual tokens inspired by pmo-process-redesign.html ----
const TOKENS = {
  NODE: { size: 80 },             // circle diameter
  ARROW: { w: 40, h: 12 },        // horizontal arrow line length
  ARROW_DOWN: { h: 40 },          // vertical arrow
  GAP: { row: 40, col: 40 },      // base spacing between items in a row
  LANE: { minWidth: 500, gap: 40 },
  DIAMOND: { size: 100 }          // Owner decision
};

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

const ProcessFlowTestPage: React.FC = () => {
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
    ...additionalSpecialElements.filter(e => e.id !== 'go-live')
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

  // Compact arrow primitives
  const Arrow = () => (
    <div className="w-12 h-[2px] bg-gray-400 relative self-center"
         style={{ width: TOKENS.ARROW.w }}>
      <span className="absolute -right-2 -top-1
                       border-l-[10px] border-l-gray-400
                       border-y-[5px] border-y-transparent" />
    </div>
  );

  const ArrowDown = ({ height=TOKENS.ARROW_DOWN.h }:{height?:number}) => (
    <div className="w-[2px] bg-gray-400 relative mx-auto"
         style={{ height }}>
      <span className="absolute -bottom-2 -left-[4px]
                       border-t-[10px] border-t-gray-400
                       border-x-[5px] border-x-transparent" />
    </div>
  );

  // Reusable dashed arrow component for iteration loops
  const DashedArrow = ({
    w = 120, h = 60, variant = 'curve-right', // 'curve-right' | 'curve-left' | 'straight-right'
  }: { w?: number; h?: number; variant?: 'curve-right'|'curve-left'|'straight-right' }) => {
    const stroke = '#6B7280'; // gray-500
    const markerId = 'loop-arrow';
    return (
      <svg width={w} height={h} style={{ overflow: 'visible' }}>
        <defs>
          <marker id={markerId} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <polygon points="0 0, 10 5, 0 10" fill={stroke} />
          </marker>
        </defs>
        {variant === 'curve-right' && (
          <path
            d={`M 4 ${h-4} C ${w*0.15} ${h*0.15}, ${w*0.85} ${h*0.15}, ${w-14} ${h/2}`}
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeDasharray="6 4"
            markerEnd={`url(#${markerId})`}
            strokeLinecap="round"
          />
        )}
        {variant === 'curve-left' && (
          <path
            d={`M ${w-4} ${h-4} C ${w*0.85} ${h*0.15}, ${w*0.15} ${h*0.15}, 14 ${h/2}`}
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeDasharray="6 4"
            markerEnd={`url(#${markerId})`}
            strokeLinecap="round"
          />
        )}
        {variant === 'straight-right' && (
          <line
            x1="0" y1={h/2} x2={w-14} y2={h/2}
            stroke={stroke} strokeWidth="2" strokeDasharray="6 4"
            markerEnd={`url(#${markerId})`} strokeLinecap="round"
          />
        )}
      </svg>
    );
  };

  // Decision diamond
  const DecisionDiamond = ({ onClick }:{onClick:()=>void}) => (
    <button
      onClick={onClick}
      className="mx-auto flex items-center justify-center"
      style={{ width: TOKENS.DIAMOND.size, height: TOKENS.DIAMOND.size }}>
      <div className="w-full h-full rotate-45 bg-white border-[3px] border-amber-500 
                      shadow-[0_4px_12px_rgba(245,158,11,.3)] 
                      hover:scale-110 transition-transform rounded-sm flex items-center justify-center">
        <div className="-rotate-45 text-amber-900 font-bold leading-tight text-sm text-center">
          Owner<br/>Decision
        </div>
      </div>
    </button>
  );

  // Phase bubble (bigger & more readable)
  const PhaseBubble = ({ phase, extraClass="" }:{phase:Phase; extraClass?:string}) => (
    <div className="flex flex-col items-center cursor-pointer"
         onClick={()=>handlePhaseClick(phase)}>
      <div className={`shadow-lg text-white font-bold rounded-full w-16 h-16
                       flex flex-col items-center justify-center
                       bg-gradient-to-br ${phase.gradient} ${extraClass}
                       hover:scale-110 transition-transform`}
           >
        <div className="text-xl font-black">{String(phase.id)}</div>
        <div className="text-[9px] uppercase mt-[1px]">{phase.shortName}</div>
      </div>
      <div className="mt-3 text-center max-w-[120px]">
        <div className="text-base font-bold text-gray-900">{phase.name}</div>
        <div className="text-sm text-gray-600 leading-snug">{phase.description}</div>
      </div>
    </div>
  );

  // Lane cards (equal width, soft gradient)
  const Lane = ({ title, tone, children }:{
    title:string; tone:'enterprise'|'product'; children:React.ReactNode;
  }) => {
    const classes = tone==='enterprise'
      ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100'
      : 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100';
    const titleClasses = tone==='enterprise'
      ? 'bg-amber-400 text-amber-900'
      : 'bg-emerald-400 text-emerald-900';

    return (
      <div className={`rounded-2xl border-2 p-6 shadow-sm ${classes}`}>
        <div className={`inline-block text-xs font-bold uppercase px-3 py-1 rounded ${titleClasses}`}>
          {title}
        </div>
        <div className="mt-5 flex items-center justify-center gap-6">
          {children}
        </div>
      </div>
    );
  };

  // Solution Development box (compact, dashed, pink)
  const SDBox: React.FC<{children:React.ReactNode}> = ({children}) => (
    <div className="mx-auto rounded-2xl border-[3px] border-dashed border-pink-500 
                    bg-gradient-to-br from-pink-50 to-rose-100 p-6"
         style={{ maxWidth: 600 }}>
      <div className="text-center text-base font-bold text-pink-800 mb-3">
        5 — Solution Development
      </div>
      <div className="flex justify-center" style={{ gap: 60 }}>
        {children}
      </div>
    </div>
  );

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
        fixed top-4 right-4 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-xl border border-gray-200 p-6 z-30
        transform transition-all duration-300 ease-out max-w-lg max-h-[32rem] overflow-y-auto legend-container
        ${showLegend ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
      `}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 text-xl">Legend</h3>
          <button
            onClick={() => setShowLegend(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl font-bold"
          >
            ×
          </button>
        </div>
        
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
        <div className="mb-8">
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

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showLegend]);

  return (
    <div className="p-6">
      {/* View Path Controls */}
      <div className="flex justify-end mb-6 sticky top-2 z-30">
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur rounded-lg p-2 border border-gray-200 shadow-sm">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="ml-1 flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs font-medium legend-toggle"
          >
            Legend
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="mb-12 relative overflow-x-auto bg-white rounded-2xl border border-gray-200 bg-[radial-gradient(#eef2f7_1px,transparent_1px)] [background-size:12px_12px]">
        <div className="mx-auto p-10">
          {/* Row 1: 0 → 1 */}
          <div className="flex items-center justify-center" style={{ gap: TOKENS.GAP.col }}>
            <PhaseBubble phase={toPhase('0' as any)} />
            <Arrow />
            <PhaseBubble phase={toPhase('1' as any)} />
          </div>

          {/* Owner Decision */}
          <div style={{ marginTop: TOKENS.GAP.row }}><ArrowDown /></div>
          <div style={{ marginTop: TOKENS.GAP.row }}><DecisionDiamond onClick={()=>handlePhaseClick(criteriaAssessmentInfo)} /></div>

          {/* Lanes */}
          <div className="flex justify-center gap-6" style={{ marginTop: TOKENS.GAP.row }}>
            <Lane title="Enterprise Path" tone="enterprise">
              <PhaseBubble phase={toPhase('E2' as any)} />
              <Arrow />
              <PhaseBubble phase={toPhase('E3' as any)} />
              <Arrow />
              <PhaseBubble phase={toPhase('E4' as any)} />
            </Lane>

            <Lane title="Product Path" tone="product">
              <PhaseBubble phase={toPhase('P2' as any)} />
              <Arrow />
              <PhaseBubble phase={toPhase('P3' as any)} />
              <Arrow />
              <PhaseBubble phase={toPhase('P4' as any)} />
            </Lane>
          </div>

          {/* Converge */}
          <div style={{ marginTop: 60 }}><ArrowDown height={60} /></div>

          {/* SA + QA Prep row with sub-container */}
          <div className="flex flex-col items-center" style={{ marginTop: 40 }}>
            <div className="bg-indigo-50 rounded-xl border-2 border-indigo-200 p-4 shadow-sm">
              <div className="text-center text-sm font-bold text-indigo-800 mb-3">
                Architecture & Early QA
              </div>
              <div className="flex items-center justify-center gap-6">
                <PhaseBubble phase={toPhase('SA' as any)} extraClass="ring-2 ring-indigo-400" />
                <Arrow />
                <PhaseBubble phase={toPhase('QA1' as any)} />
              </div>
            </div>
          </div>

          {/* SA → SD */}
          <div style={{ marginTop: 40 }}><ArrowDown /></div>
          <div style={{ marginTop: TOKENS.GAP.row }}>
            <SDBox>
              {/* SD: Dev || SIT */}
              <div className="relative flex items-start justify-center gap-6 mb-2">
                <div className="relative">
                  <PhaseBubble phase={toPhase('5' as any)} /> {/* Development */}
                  {/* Optional small spacer below the chip so loop doesn't collide */}
                  <div className="h-2" />
                </div>

                <div className="relative">
                  <PhaseBubble phase={toPhase('QA2' as any)} /> {/* SIT */}
                  <div className="h-2" />
                </div>
              </div>

              {/* Iteration loops under the two nodes, centered */}
              <div className="flex items-center justify-center gap-10 -mt-2 mb-6 relative z-10">
                {/* Dev -> SIT (forward loop) */}
                <DashedArrow w={130} h={60} variant="curve-right" />
                {/* SIT -> Dev (backward loop) */}
                <DashedArrow w={130} h={60} variant="curve-left" />
              </div>
            </SDBox>
          </div>

          {/* Final row */}
          <div style={{ marginTop: TOKENS.GAP.row }}>
            <ArrowDown />
          </div>
          
          {/* QA: UAT -> Business Acceptance chain */}
          <div className="flex items-center justify-center gap-3 mb-2" style={{ marginTop: TOKENS.GAP.row }}>
            <PhaseBubble phase={toPhase('QA3' as any)} /> {/* QA: UAT */}
            <Arrow />
            <PhaseBubble phase={toPhase('6' as any)} />   {/* Business/Product Acceptance */}
          </div>

          {/* UAT loops back to SIT */}
          <div className="flex items-center justify-center -mt-1 mb-8">
            <DashedArrow w={160} h={70} variant="curve-left" />
          </div>
          
          <div className="flex items-center justify-center" style={{ gap: TOKENS.GAP.col }}>
            <Arrow />
            <PhaseBubble phase={toPhase('7' as any)} />
            <Arrow />
            <PhaseBubble phase={toPhase('8' as any)} />
            <Arrow />
            <PhaseBubble phase={toPhase('9' as any)} />
          </div>
        </div>
      </div>
      */

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
          ))}
        </div>
      </div>

      {/* Legend */}
      {renderLegend()}

      {/* Phase Detail Modal */}
      {showModal && selectedPhaseInfo && (
        <PhaseDetailModal
          isOpen={showModal}
          onClose={handleCloseModal}
          phaseInfo={selectedPhaseInfo}
        />
      )}

      {/* Instructions */}
      <div className="mt-8 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2 font-medium">
            🖱️ Click on any phase circle or decision diamond to view detailed information • 📋 Professional layout optimized for normal zoom levels
          </p>
          <p className="text-xs text-gray-500">
            Clean visual system with consistent sizing, straight arrows, and centered architecture flow
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-medium">
              📋 Layout System: This implementation uses consistent visual tokens (80px nodes, 40px arrows, uniform spacing) 
              for a professional appearance. The layout follows a clear row-based structure with straight connectors 
              and centered convergence points for optimal readability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessFlowTestPage;