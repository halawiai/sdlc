export interface FullLifecyclePhase {
  id: number;
  name: string;
  owner: string;
  focus: string;
  input: string[];
  output: string[];
  keyTasks: string[];
  gateCriteria: string[];
  specialLogic?: string | string[];
  specialNote?: {
    type: 'warning' | 'info' | 'success';
    icon: string;
    title: string;
    content: string;
  };
  additionalActivities?: string[];
  gradient: string;
  raciMatrix: { role: string; description: string; }[];
}

export const fullLifecyclePhases: FullLifecyclePhase[] = [
  {
    id: 1,
    name: 'INITIATION',
    owner: 'PMO + Product + Business + BA',
    focus: 'Identifying the problem, target audience, and competitive landscape and scope',
    input: ['Customer Interviews', 'Market Analysis', 'Pain Points'],
    output: ['PRD Brief'],
    keyTasks: [
      'Overview development',
      'Objective definition',
      'Benefits identification (For Customers & HALA)',
      'Scope determination',
      'Target Audience identification',
      'Key Features definition',
      'Success Measures establishment',
      'Risk identification and initial assessment',
      'Stakeholder mapping',
      'Resource estimation',
      'Submit CAB (Change Advisory Board) request',
      'Coordinate with Risk and Compliance team'
    ],
    gateCriteria: [
      'Clear problem statement defined',
      'Business case outlined',
      'Scope boundaries established',
      'PMO approval to proceed',
      'CAB approval obtained',
      'Risk and Compliance sign-off'
    ],
    gradient: 'from-blue-500 to-blue-600',
    raciMatrix: [
      { role: 'PMO', description: 'Accountable for governance and process compliance' },
      { role: 'Product', description: 'Responsible for product vision and strategy' },
      { role: 'Business', description: 'Responsible for business requirements and justification' },
      { role: 'BA', description: 'Consulted for requirement gathering and analysis' },
      { role: 'Application Support', description: 'Informed of project initiation and scope for future support planning' },
      { role: 'Risk and Compliance', description: 'Consulted for CAB approval and compliance baseline review' }
    ]
  },
  {
    id: 2,
    name: 'REQUIREMENTS + DESIGN',
    owner: 'PMO + Product + BA + Design (when applicable)',
    focus: 'Develop detailed requirements and create UX/UI design in parallel (when applicable)',
    input: ['PRD Brief'],
    output: [
      'Product Requirement Document (PRD) - when applicable',
      'User Stories',
      'Business Requirements Document (BRD)',
      'UX/UI Design Document (when applicable)',
      'Post-implementation Review',
      'Release Deployment Report',
      'Post-Release Monitoring Plan'
    ],
    keyTasks: [
      'Determine if PRD is required based on feature type',
      'Create PRD for new features with business justification',
      'Develop User Stories for all features',
      'Complete comprehensive BRD with detailed business requirements',
      'Create wireframes and mockups (when UX/UI applicable)',
      'Develop prototypes for user validation (when applicable)',
      'Design user interface and experience (when applicable)',
      'Requirements validation and traceability',
      'Acceptance criteria definition',
      'Design validation with stakeholders (when applicable)',
      'Facilitate and document meeting minutes (MoM) and action items'
    ],
    gateCriteria: [
      'All requirements documented and validated',
      'PRD completed (when applicable)',
      'BRD completed and reviewed',
      'UX/UI designs approved (when applicable)',
      'Design prototypes validated (when applicable)',
      'Requirements traceability established',
      'PMO approval for requirements and design completeness'
    ],
    specialLogic: [
      'Requirements Track (BA + Product): PRD creation (when needed) → User Stories → BRD',
      'Design Track (Design + Product): Wireframes → Mockups → Prototypes → UX/UI Design', 
      'Conditional Logic: If UX/UI required, both tracks run in parallel. If not required, only requirements track runs',
      'Both tracks feed into Business Review for integrated approval'
    ],
    gradient: 'from-blue-600 to-teal-500',
    raciMatrix: [
      { role: 'PMO', description: 'Accountable for requirements and design governance' },
      { role: 'Product', description: 'Responsible for product requirements and design validation' },
      { role: 'BA', description: 'Responsible for BRD creation, requirements analysis, and managing meeting minutes/action items' },
      { role: 'Design', description: 'Responsible for UX/UI design work (when applicable)' },
      { role: 'Application Support', description: 'Informed of technical requirements and architecture decisions affecting support operations' }
    ]
  },
  {
    id: 3,
    name: 'BUSINESS REVIEW',
    owner: 'PMO + Business + Product + BA',
    focus: 'Business approval and validation of requirements',
    input: ['PRD (when applicable)', 'User Stories', 'BRD', 'UX/UI Design Document (when applicable)'],
    output: ['Business Approval', 'Approved Requirements Package', 'Risk Assessment Update'],
    keyTasks: [
      'Business stakeholder review of BRD',
      'Requirements validation against business objectives',
      'Design validation against business needs (when applicable)',
      'Risk assessment and mitigation planning',
      'Budget and resource approval',
      'Timeline validation',
      'Change impact analysis',
      'Formal business sign-off'
    ],
    gateCriteria: [
      'Business approval obtained',
      'All requirements validated by business stakeholders',
      'Risk mitigation strategies approved',
      'Budget and resources confirmed',
      'PMO approval to proceed to planning'
    ],
    specialNote: {
      type: 'warning',
      icon: '⚠️',
      title: 'Reiterate until Approved',
      content: 'This phase may require multiple iterations until all stakeholders provide formal approval. The process continues until consensus is reached and formal sign-off is obtained.'
    },
    gradient: 'from-teal-500 to-green-500',
    raciMatrix: [
      { role: 'PMO', description: 'Accountable for approval process governance' },
      { role: 'Business', description: 'Accountable for business approval and validation' },
      { role: 'Product', description: 'Responsible for product validation (when they raised the change)' },
      { role: 'Product', description: 'Consulted for requirement clarifications' },
      { role: 'BA', description: 'Consulted for facilitating review and addressing feedback' },
      { role: 'Application Support', description: 'Informed of approved requirements and scope for support preparation' }
    ]
  },
  {
    id: 4,
    name: 'PLANNING',
    owner: 'PMO + Product + QA',
    focus: 'Project planning, resource allocation, timeline development, grooming, execution preparation, and test case development',
    input: ['FROM REQUIREMENTS PATH: Approved Requirements Package (PRD + BRD), User Stories, Business Approval', 'FROM PRODUCT PATH: PRD Brief, Simplified Requirements, Direct Product Approval', 'Decision Path Documentation', 'Complexity Assessment Results'],
    output: ['Project Plan and Timeline', 'Resource Allocation Plan', 'Budget Plan', 'Risk Register', 'Quality Assurance Plan', 'Communication Plan', 'Technical Architecture Plan', 'Groomed and Prioritized Backlog', 'Sprint Planning Documentation', 'Test Case Documentation', 'Test Strategy Document', 'Test Environment Requirements', 'Test Data Requirements', 'Testing Timeline and Milestones'],
    keyTasks: [
      'Development timeline planning and scheduling',
      'Resource allocation and capacity planning',
      'Budget planning and cost estimation',
      'Risk register creation and mitigation planning',
      'Quality assurance planning and test strategy',
      'Communication and stakeholder management planning',
      'Technical architecture planning',
      'Backlog grooming and prioritization',
      'User story refinement and sizing',
      'Sprint planning and iteration setup',
      'Definition of Done (DoD) criteria establishment',
      'Acceptance criteria definition and validation',
      'Milestone and deliverable definition',
      'Dependency mapping and critical path analysis',
      'Change management planning',
      'Test case development and design',
      'Test strategy definition and validation',
      'Test environment planning and requirements',
      'Path-specific planning (Requirements vs Product track)',
      'Simplified planning for Product path projects',
      'Enhanced planning for Requirements path projects',
      'Retroactive requirements documentation (Product path)',
      'Stakeholder communication on chosen approach',
      'Test data requirements identification',
      'Testing timeline integration with development',
      'Test automation strategy planning',
      'Collaborate with QA team on comprehensive test planning'
    ],
    gateCriteria: [
      'Project timeline approved by all stakeholders',
      'Resource allocation confirmed and available',
      'Budget approved and allocated',
      'Risk mitigation strategies defined',
      'Quality assurance plan established',
      'Technical architecture validated',
      'Backlog groomed and prioritized',
      'Sprint structure defined',
      'PMO approval for execution phase',
      'Test cases developed and reviewed',
      'Test strategy approved and documented',
      'Test environment requirements defined',
      'Testing timeline integrated with project plan',
      'Definition of Done (DoD) criteria established',
      'Acceptance criteria defined and validated',
      'QA test strategy approved'
    ],
    gradient: 'from-green-500 to-green-600',
    raciMatrix: [
      { role: 'PMO', description: 'Responsible for project planning governance and resource management' },
      { role: 'Product', description: 'Consulted for timeline validation and priorities' },
      { role: 'QA', description: 'Responsible for test planning, strategy development, and Definition of Done validation' },
      { role: 'Engineering', description: 'Consulted for estimates and architecture' },
      { role: 'Design', description: 'Consulted for design timeline integration (when applicable)' },
      { role: 'Business', description: 'Consulted for business planning requirements' },
      { role: 'BA', description: 'Consulted for requirements planning' },
      { role: 'Application Support', description: 'Consulted for support infrastructure planning and operational readiness requirements' }
    ]
  },
  {
    id: 5,
    name: 'DEVELOPMENT',
    owner: 'Engineering',
    focus: 'Solution Development under Engineering ownership with PMO governance',
    input: ['Approved Requirements Package (PRD + BRD)', 'UX/UI Design Document (when applicable)', 'Technical Architecture Plan', 'Groomed and Prioritized Backlog'],
    output: ['Workable Demo', 'Ready for Test Solution', 'Technical Documentation'],
    keyTasks: [
      'Solution development',
      'Code reviews and quality checks',
      'Demo preparation',
      'Test readiness preparation',
      'Documentation creation',
      'Progress tracking and reporting',
      'Risk mitigation implementation',
      'Change request management',
      'Validate Definition of Done (DoD) criteria',
      'Ensure acceptance criteria are met',
      'Test case refinement and updates (QA parallel work)',
      'Test environment setup and configuration',
      'Test data preparation and validation',
      'Test automation script development',
      'Continuous test case review with development team'
    ],
    gateCriteria: [
      'Core functionality completed',
      'Code quality standards met',
      'Unit testing completed',
      'Demo successfully demonstrated',
      'PMO gate approval for QA phase',
      'Definition of Done criteria validated',
      'Acceptance criteria confirmed'
    ],
    gradient: 'from-green-600 to-emerald-500',
    raciMatrix: [
      { role: 'Engineering', description: 'Responsible for solution development and code quality' },
      { role: 'PMO', description: 'Accountable for gating access to QA phase and ensuring development quality standards' },
      { role: 'QA', description: 'Consulted for parallel test preparation' },
      { role: 'Product', description: 'Consulted for feature validation and acceptance' },
      { role: 'Application Support', description: 'Informed of development progress and technical changes requiring future support' }
    ]
  },
  {
    id: 6,
    name: 'QA',
    owner: 'PMO + QA + Product + BA',
    focus: 'Execute pre-developed test cases to validate solution meets requirements and is user-friendly',
    input: ['All previous phase outputs', 'Approved Requirements Package (PRD + BRD)', 'Workable Demo'],
    output: ['Product Testing Report', 'User Feedback', 'Bug Reports', 'Business Acceptance Sign-off'],
    keyTasks: [
      'Execute comprehensive test cases (developed in Planning phase)',
      'Performance and security testing execution',
      'User acceptance testing coordination',
      'Bug identification, logging, and tracking',
      'Test results analysis and reporting',
      'Business acceptance testing (BA-led)',
      'Business logic validation (BA responsibility)',
      'Regression testing execution',
      'Final approval documentation and sign-off',
      'Validate Definition of Done (DoD) criteria',
      'Confirm all acceptance criteria are met'
    ],
    gateCriteria: [
      'All test cases executed successfully',
      'Test results documented and analyzed',
      'All critical bugs resolved',
      'Critical bugs resolved or accepted',
      'Business acceptance criteria met',
      'Performance benchmarks achieved',
      'BA sign-off on business logic',
      'PMO approval for implementation',
      'Test execution timeline met',
      'Definition of Done (DoD) validated',
      'All acceptance criteria confirmed'
    ],
    gradient: 'from-emerald-500 to-teal-600',
    raciMatrix: [
      { role: 'PMO', description: 'Accountable for QA process governance and final approval' },
      { role: 'QA', description: 'Responsible for comprehensive testing and execution' },
      { role: 'Product', description: 'Accountable for product validation and user acceptance criteria' },
      { role: 'Business', description: 'Accountable for business acceptance testing and sign-off' },
      { role: 'BA', description: 'Accountable for requirement validation and acceptance criteria verification' },
      { role: 'Design', description: 'Accountable for design implementation validation and UX testing' },
      { role: 'Engineering', description: 'Accountable for bug fixes and technical issue resolution' },
      { role: 'Application Support', description: 'Informed of testing results and system performance for support preparation' }
    ]
  },
  {
    id: 7,
    name: 'POST IMPLEMENTATION',
    owner: 'PMO + Engineering + Product',
    focus: 'Change Management, Deployment, and Success Measurement',
    input: ['Approved solution from QA', 'Go-live readiness checklist', 'Approved Requirements Package (PRD + BRD)'],
    output: ['Go to Market Plan', 'Marketing Strategies', 'Customer Acquisition Plans', 'Product Rollout Timelines', 'Success Metrics', 'Go Live Confirmation', 'Post-implementation Review'],
    keyTasks: [
      'Change management implementation',
      'Go-to-market planning',
      'Marketing strategy development',
      'Customer acquisition planning',
      'Rollout timeline execution',
      'Success measurement',
      'Performance monitoring',
      'Metrics analysis',
      'User training and support',
      'Issue resolution and support',
      'Coordinate release activities and schedules',
      'Perform final release readiness checks',
      'Manage production deployment logistics'
    ],
    gateCriteria: [
      'Successful deployment completed',
      'User acceptance achieved',
      'Success metrics baseline established',
      'Support processes operational',
      'PMO approval for closure phase'
    ],
    gradient: 'from-teal-600 to-blue-500',
    raciMatrix: [
      { role: 'PMO', description: 'Accountable for implementation governance and success tracking' },
      { role: 'Business', description: 'Responsible for business change management and user adoption' },
      { role: 'Engineering', description: 'Consulted for deployment and technical support' },
      { role: 'Product', description: 'Responsible for go-to-market execution and success measurement' },
      { role: 'Application Support', description: 'Responsible for post-implementation support, incident management, and system stability' },
    ]
  },
  {
    id: 8,
    name: 'CLOSED',
    owner: 'PMO + Product',
    focus: 'Project Closure, Documentation, and Lessons Learned',
    input: ['All previous phase deliverables', 'Success metrics and performance data'],
    output: ['Project Closure Report', 'Lessons Learned Document', 'Final Success Metrics', 'Knowledge Transfer Documentation', 'Archive Package'],
    keyTasks: [
      'Project review and evaluation',
      'Lessons learned capture',
      'Final success metrics analysis',
      'Knowledge transfer completion',
      'Resource release',
      'Documentation archival',
      'Stakeholder communication of closure',
      'Continuous improvement recommendations',
      'Project closure documentation'
    ],
    gateCriteria: [
      'All deliverables completed and accepted',
      'Success metrics achieved and documented',
      'Lessons learned captured',
      'All resources released',
      'PMO final approval and closure'
    ],
    additionalActivities: [
      'Product Iteration / Review',
      'Release Management'
    ],
    gradient: 'from-blue-500 to-indigo-600',
    raciMatrix: [
      { role: 'PMO', description: 'Responsible for project closure governance and lessons learned' },
      { role: 'Product', description: 'Consulted for final evaluation and knowledge transfer' },
      { role: 'Application Support', description: 'Consulted for knowledge transfer and formal support handover activities' }
    ]
  }
];