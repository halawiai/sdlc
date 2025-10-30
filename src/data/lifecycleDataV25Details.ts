export type PhaseID = '0'|'1'|'E2'|'E3'|'E4'|'P2'|'P3'|'P4'|'SA'|'5'|'5.1'|'6'|'7'|'8'|'9'|'NOC';
export type PhaseIDWithDecision = PhaseID | 'D' | 'QA3';

export interface PhaseDetails {
  owner: string;
  processFocus: string;
  inputs: string[];
  outputs: string[];
  keyTasks: string[];
  phaseGateCriteria: string[];
  raciMatrix: { role: string; description: string; }[];
}

export const v25: Record<PhaseIDWithDecision, {
  name: string; short: string; desc: string; gradient: string;
  details: PhaseDetails;
}> = {
  '0':  { name:'Discovery', short:'DISC', desc:'Identify scope & objectives', gradient:'from-purple-600 to-purple-500',
          details:{ owner:'Product + Business', processFocus:'Identify scope, objectives, stakeholders, success criteria',
            inputs:['Problem statement','Market/user signals'], outputs:['Project Charter / Discovery Brief'],
            keyTasks:['Frame problem & goals','Identify stakeholders','Define success metrics','Draft hi-level scope'],
            phaseGateCriteria:['Charter approved','Stakeholder alignment'], raciMatrix:[
              { role:'Product', description:'Responsible for defining product scope and objectives' },
              { role:'Business', description:'Responsible for defining business scope and objectives' },
              { role:'PMO', description:'Consulted for governance and process alignment' },
              { role:'Application Support', description:'Informed of project discovery for future support planning' }
            ] } },
  '1':  { name:'Initiation', short:'INIT', desc:'Formal project start', gradient:'from-blue-500 to-blue-600',
          details:{ owner:'PMO + Product', processFocus:'Formal project kickoff and initial resource allocation',
            inputs:['Project Charter / Discovery Brief','Business Case','Optional Change'], outputs:['PRD Brief (for new features requiring business justification)', 'User Stories (for enhancements without financial metrics)', 'Business Case (for features serving internal stakeholders)'],
            keyTasks:['Assign project team','Set up project infrastructure','Initial stakeholder communication','Submit CAB (Change Advisory Board) request','Coordinate with Risk and Compliance team'],
            phaseGateCriteria:['Team assigned','Infrastructure ready','Initial risk assessment completed','Compliance baseline reviewed','CAB approval obtained','Risk and Compliance sign-off'], raciMatrix:[
              { role:'PMO', description:'Accountable for project initiation and overall process adherence' },
              { role:'Product', description:'Responsible for product context in Product Path; Informed in Enterprise Path' },
              { role:'Business', description:'Responsible for business context in Enterprise Path; Informed in Product Path' },
              { role:'Application Support', description:'Informed of project initiation for future support planning' },
              { role:'Risk and Compliance', description:'Consulted for CAB approval and compliance baseline review' }
            ] } },
  'D':  { name:'Owner Decision', short:'OWNER', desc:'Determine project path based on complexity and requirements', gradient:'from-amber-400 to-amber-500',
          details:{ owner:'Product + PMO', processFocus:'Determine project path based on complexity and requirements',
            inputs:['Project scope','Requirements complexity'], outputs:['Path decision'],
            keyTasks:['Score Customer Impact (1-5)','Score Market Demand (1-5)','Score Request Features (1-5)','Calculate total score','Apply decision logic','Document decision rationale','Assess complexity','Evaluate resources','Choose path'],
            phaseGateCriteria:['Path determined'], raciMatrix:[
              { role:'Product', description:'Responsible for complexity assessment' },
              { role:'PMO', description:'Accountable for path approval' }
            ] } },
  'E2': { name:'Enterprise Requirements', short:'REQ', desc:'Requirements', gradient:'from-amber-100 to-amber-300',
          details:{ owner:'BA + Business', processFocus:'Detailed business requirements analysis and documentation',
            inputs:['Project Charter','Business context'], outputs:['Business Requirements Document (BRD)','Requirements traceability'],
            keyTasks:['Gather detailed requirements','Analyze business processes','Document functional requirements','Validate with stakeholders'],
            phaseGateCriteria:['BRD completed','Requirements validated'], raciMatrix:[
              { role:'BA', description:'Responsible for requirements gathering' },
              { role:'Business', description:'Accountable for requirement approval' },
              { role:'PMO', description:'Informed of requirements progress' },
              { role:'Product', description:'Informed of requirements progress' },
              { role:'Design', description:'Informed of requirements progress' },
              { role:'Engineering', description:'Informed of requirements progress' },
              { role:'QA', description:'Informed of requirements progress' },
              { role:'Application Support', description:'Informed of requirements progress' }
            ] } },
  'E3': { name:'Business Review', short:'BIZ REV', desc:'Business review & approval', gradient:'from-amber-100 to-amber-300',
          details:{ owner:'Business + PMO', processFocus:'Business stakeholder review and formal approval of requirements',
            inputs:['BRD document','Requirements package'], outputs:['Formal business approval','Approved requirements package'],
            keyTasks:['Review business requirements','Validate business case','Assess impact and risks','Provide formal sign-off'],
            phaseGateCriteria:['Business approval obtained','Requirements signed off'], raciMatrix:[
              { role:'BA', description:'Responsible for facilitating review and addressing feedback' },
              { role:'Business', description:'Accountable for approval decision' },
              { role:'PMO', description:'Informed of business review progress' },
              { role:'Product', description:'Informed of business review progress' },
              { role:'Design', description:'Informed of business review progress' },
              { role:'Engineering', description:'Informed of business review progress' },
              { role:'QA', description:'Informed of business review progress' },
              { role:'Application Support', description:'Informed of business review progress' }
            ] } },
  'E4': { name:'Planning', short:'PLAN', desc:'Planning & early QA test cases', gradient:'from-amber-100 to-amber-300',
          details:{ owner:'PMO + Product + QA', processFocus:'Comprehensive project planning and early test case development',
            inputs:['Approved requirements package','Business approval'], outputs:['Project plan','Timeline','Test cases','Risk register'],
            keyTasks:['Create project timeline','Allocate resources','Develop test strategy','Plan risk mitigation','Establish Definition of Done (DoD) criteria','Define acceptance criteria','Develop comprehensive test cases with QA team'],
            phaseGateCriteria:['Project plan approved','Test cases ready','Definition of Done established','Acceptance criteria defined','QA test strategy approved'], raciMatrix:[
              { role:'PMO', description:'Responsible for project planning and governance' },
              { role:'Engineering', description:'Consulted for estimates and technical planning' },
              { role:'QA', description:'Consulted for test planning and strategy' },
              { role:'BA', description:'Consulted for requirements planning' },
              { role:'Product', description:'Informed of planning progress' },
              { role:'Business', description:'Informed of planning progress' },
              { role:'Design', description:'Informed of planning progress' },
              { role:'Application Support', description:'Informed of planning progress' }
            ] } },
  'P2': { name:'Product Requirements', short:'REQ', desc:'Requirements', gradient:'from-emerald-200 to-emerald-500',
          details:{ owner:'Product + BA', processFocus:'Product requirements gathering and user story creation',
            inputs:['Project Charter','Product context'], outputs:['User stories','Product requirements'],
            keyTasks:['Define user stories','Prioritize features','Document acceptance criteria','Validate with stakeholders'],
            phaseGateCriteria:['User stories completed','Requirements validated'], raciMatrix:[
              { role:'Product', description:'Responsible for defining product requirements and user stories' },
              { role:'PMO', description:'Informed of product requirements progress' },
              { role:'Business', description:'Informed of product requirements progress' },
              { role:'BA', description:'Informed of product requirements progress' },
              { role:'Design', description:'Informed of product requirements progress' },
              { role:'Engineering', description:'Informed of product requirements progress' },
              { role:'QA', description:'Informed of product requirements progress' },
              { role:'Application Support', description:'Informed of product requirements progress' }
            ] } },
  'P3': { name:'Design', short:'DESIGN', desc:'UX/UI design', gradient:'from-emerald-200 to-emerald-500',
          details:{ owner:'Design + Product', processFocus:'User experience and interface design development',
            inputs:['User stories','Product requirements'], outputs:['UX/UI designs','Design prototypes','Style guide'],
            keyTasks:['Create wireframes','Design user interface','Develop prototypes','Validate with users'],
            phaseGateCriteria:['Designs approved','Prototypes validated'], raciMatrix:[
              { role:'Product', description:'Responsible for product design validation and approval' },
              { role:'Design', description:'Responsible for design creation' },
              { role:'PMO', description:'Informed of design progress' },
              { role:'Business', description:'Informed of design progress' },
              { role:'BA', description:'Informed of design progress' },
              { role:'Engineering', description:'Informed of design progress' },
              { role:'QA', description:'Informed of design progress' },
              { role:'Application Support', description:'Informed of design progress' }
            ] } },
  'P4': { name:'Grooming', short:'GROOM', desc:'Backlog refinement', gradient:'from-emerald-200 to-emerald-500',
          details:{ owner:'Product + PMO', processFocus:'Backlog refinement and sprint preparation',
            inputs:['User stories','UX/UI designs'], outputs:['Refined backlog','Sprint-ready stories','Definition of done'],
            keyTasks:['Refine user stories','Estimate story points','Prioritize backlog','Define acceptance criteria and Definition of Done (DoD)','Collaborate with QA on testability','Ensure stories are sprint-ready'],
            phaseGateCriteria:['Backlog refined','Stories estimated','Definition of Done established','Acceptance criteria defined','QA testability confirmed'], raciMatrix:[
              { role:'Product', description:'Responsible for backlog prioritization and refinement with full autonomy in product decisions' },
              { role:'Engineering', description:'Consulted for technical feasibility and estimates' },
              { role:'QA', description:'Consulted for testability and acceptance criteria' },
              { role:'PMO', description:'Responsible for governance and assistance to ensure proper presentation to Engineering' },
              { role:'Business', description:'Informed of grooming progress' },
              { role:'BA', description:'Informed of grooming progress' },
              { role:'Design', description:'Informed of grooming progress' },
              { role:'Application Support', description:'Informed of grooming progress' }
            ] } },
  'SA': { name:'Solution Architecture', short:'ARCH', desc:'Align design & constraints, define technical approach', gradient:'from-indigo-400 to-indigo-600',
          details:{ owner:'Engineering + Product + QA', processFocus:'Architecture decisions, interfaces, data, security, NFRs',
            inputs:['Enterprise/Prod. requirements','Designs','Constraints'], outputs:['Architecture decision record','System context & interfaces','Tech stack & NFRs'],
            keyTasks:[
              'Review requirements and designs',
              'Define service boundaries & contracts',
              'Select stack & patterns',
              'Model data & integrations',
              'Capture NFRs (perf, sec, resiliency)',
              'Include security review'
            ],
            phaseGateCriteria:['ADR approved','Risks identified & mitigations planned'], raciMatrix:[
              { role:'Engineering', description:'Accountable for architecture quality' },
              { role:'Product', description:'Responsible for business alignment' },
              { role:'QA', description:'Consulted for testability & NFRs' },
              { role:'PMO', description:'Consulted for governance' }
            ] } },
  '5':  { name:'Development', short:'DEV', desc:'Solution development', gradient:'from-sky-300 to-sky-500',
          details:{ owner:'Engineering', processFocus:'Solution development and implementation under Engineering ownership',
            inputs:['Refined backlog','Technical architecture','UX/UI designs'], outputs:['Working code','Technical documentation','Demo'],
            keyTasks:['Implement features','Code reviews','Unit testing','Integration','Validate Definition of Done criteria','Ensure acceptance criteria are met'],
            phaseGateCriteria:['Core functionality complete','Code quality standards met','Definition of Done criteria validated','PMO gate approval for QA phase'], raciMatrix:[
              { role:'Engineering', description:'Responsible for development execution' },
              { role:'Product', description:'Consulted for feature validation' },
              { role:'PMO', description:'Accountable for gating access to QA phase and ensuring quality standards' }
            ] } },
  '5.1':{ name:'QA', short:'QA', desc:'QA testing (parallel)', gradient:'from-sky-300 to-sky-500',
          details:{ owner:'QA + PMO', processFocus:'Comprehensive testing and quality validation',
            inputs:['Test cases','Working code','Requirements'], outputs:['Test results','Bug reports','Quality metrics'],
            keyTasks:['Execute test cases','Report defects','Validate requirements','Performance testing','Validate Definition of Done criteria','Confirm acceptance criteria are met'],
            phaseGateCriteria:['All tests executed','Critical bugs resolved','Definition of Done validated','Acceptance criteria confirmed'], raciMatrix:[
              { role:'QA', description:'Responsible for test execution' },
              { role:'PMO', description:'Accountable for quality governance' }
            ] } },
  '6':  { name:'Business / Product Acceptance', short:'ACCEPT', desc:'Final happy-path validation', gradient:'from-sky-300 to-sky-600',
          details:{ owner:'Business + Product', processFocus:'Business validation in near-prod',
            inputs:['QA-passed build','UAT plan & env','User scenarios'], outputs:['UAT sign-off','Acceptance report'],
            keyTasks:['Validate happy path','Confirm usability','Sign-off','Validate all acceptance criteria are met','Confirm Definition of Done compliance'],
            phaseGateCriteria:['Acceptance sign-off obtained','All acceptance criteria validated','Definition of Done confirmed'], raciMatrix:[
              { role:'Business', description:'Accountable for acceptance decision' },
              { role:'Product', description:'Responsible for validation' }
            ] } },
  'QA3': { name:'QA: UAT', short:'QA UAT', desc:'User acceptance testing with compliance validation', gradient:'from-red-400 to-red-500',
          details:{ owner:'QA + Business', processFocus:'User acceptance testing with compliance and security validation',
            inputs:['SIT-passed build','User scenarios','Compliance requirements'], outputs:['UAT report','Compliance validation','Security audit results'],
            keyTasks:['Execute user acceptance tests','Validate compliance requirements','Conduct security audit','Log and track defects','Support defect resolution','Validate Definition of Done criteria','Confirm all acceptance criteria are met'],
            phaseGateCriteria:['All UAT tests passed','Compliance checks completed','Security audit passed','All critical defects resolved','Definition of Done (DoD) met'], raciMatrix:[
              { role:'QA', description:'Responsible for UAT execution and compliance validation' },
              { role:'Business', description:'Accountable for user acceptance criteria' }
            ],
            } },
  'NOC': { name:'Central Bank NOC Check', short:'NOC', desc:'Central Bank No Objection Certificate validation for regulatory compliance', gradient:'from-red-500 to-red-600',
          details:{ owner:'Risk and Compliance + PMO', processFocus:'Determine if change requires Central Bank No Objection Certificate and obtain approval if needed',
            inputs:['Project Charter / Discovery Brief','Change impact assessment','Regulatory requirements'], outputs:['NOC determination','Central Bank approval (if required)','Compliance clearance'],
            keyTasks:['Assess regulatory impact','Determine NOC requirement','Submit NOC application to Central Bank (if required)','Track approval status','Document compliance clearance'],
            phaseGateCriteria:['NOC requirement determined','Central Bank approval obtained (if required)','Compliance documentation complete'], raciMatrix:[
              { role:'Risk and Compliance', description:'Responsible for NOC assessment and Central Bank coordination' },
              { role:'PMO', description:'Accountable for ensuring compliance process completion' },
              { role:'Business', description:'Consulted for business impact assessment' },
              { role:'Product', description:'Informed of NOC requirements and timeline impact' }
            ] } },
  '7':  { name:'Release Management', short:'RELEASE', desc:'Production deployment', gradient:'from-sky-300 to-sky-600',
          details:{ owner:'PMO + Product + Business + Engineering + Application Support', processFocus:'Production deployment and release coordination',
            inputs:[
              'SIT sign off',
              'UAT sign off', 
              'Cyber approvals if VAPT requested',
              'Release notes',
              'Application support approvals',
              'Code review',
              'CAB ticket fully approved',
              'SRE approvals on release notes'
            ], outputs:['Release report','Deployment confirmation'],
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