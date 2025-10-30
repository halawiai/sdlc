import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, RefreshCw, CheckCircle, Search, Download, FileText, Users, Calendar, Clock, Target, Shield, ChevronDown, ChevronRight, ExternalLink, Printer, Settings, BarChart3, GitBranch, Building } from 'lucide-react';
import { v25, PhaseID } from '../data/lifecycleDataV25Details';
import { exportToPDF, downloadTemplate } from '../utils/exportUtils';

interface GovernanceSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  items: GovernanceItem[];
  templates: Template[];
  workflows: Workflow[];
}

interface GovernanceItem {
  title: string;
  description: string;
  details: string[];
  frequency?: string;
  participants?: string[];
  deliverables?: string[];
}

interface Template {
  name: string;
  type: string;
  description: string;
}

interface Workflow {
  name: string;
  steps: string[];
  timeline: string;
}

// Dynamic governance data generation from v25 phases
const generateDynamicGovernanceData = () => {
  const phaseIds = Object.keys(v25) as PhaseID[];
  
  // Extract communication-related roles and tasks
  const communicationRoles = new Set<string>();
  const communicationTasks: string[] = [];
  const stakeholderRoles = new Set<string>();
  
  // Extract risk-related roles and tasks
  const riskRoles = new Set<string>();
  const riskTasks: string[] = [];
  
  // Extract change-related roles and tasks
  const changeRoles = new Set<string>();
  const changeTasks: string[] = [];
  
  // Extract quality-related roles and tasks
  const qualityRoles = new Set<string>();
  const qualityTasks: string[] = [];
  const qualityCriteria: string[] = [];
  
  phaseIds.forEach(phaseId => {
    const phase = v25[phaseId];
    
    // Process RACI matrix for governance roles
    phase.details.raciMatrix.forEach(raci => {
      const role = raci.role;
      const description = raci.description.toLowerCase();
      
      // Communication-related roles
      if (description.includes('communication') || description.includes('reporting') || 
          description.includes('stakeholder') || description.includes('update') ||
          role === 'PMO' || role === 'Business') {
        communicationRoles.add(`${role} (${phase.name})`);
        if (role === 'Business' || role === 'PMO') {
          stakeholderRoles.add(`${role} (${phase.name})`);
        }
      }
      
      // Risk-related roles
      if (description.includes('risk') || description.includes('mitigation') ||
          role === 'PMO') {
        riskRoles.add(`${role} (${phase.name})`);
      }
      
      // Change-related roles
      if (description.includes('change') || description.includes('approval') ||
          role === 'PMO' || role === 'Business') {
        changeRoles.add(`${role} (${phase.name})`);
      }
      
      // Quality-related roles
      if (description.includes('quality') || description.includes('testing') ||
          description.includes('validation') || role === 'QA' || role === 'PMO') {
        qualityRoles.add(`${role} (${phase.name})`);
      }
    });
    
    // Process key tasks for governance activities
    phase.details.keyTasks.forEach(task => {
      const taskLower = task.toLowerCase();
      
      if (taskLower.includes('communication') || taskLower.includes('report') || 
          taskLower.includes('stakeholder') || taskLower.includes('update')) {
        communicationTasks.push(`${task} (${phase.name})`);
      }
      
      if (taskLower.includes('risk') || taskLower.includes('mitigation')) {
        riskTasks.push(`${task} (${phase.name})`);
      }
      
      if (taskLower.includes('change') || taskLower.includes('approval')) {
        changeTasks.push(`${task} (${phase.name})`);
      }
      
      if (taskLower.includes('quality') || taskLower.includes('test') || 
          taskLower.includes('validation') || taskLower.includes('review')) {
        qualityTasks.push(`${task} (${phase.name})`);
      }
    });
    
    // Process gate criteria for quality standards
    phase.details.phaseGateCriteria.forEach(criteria => {
      qualityCriteria.push(`${criteria} (${phase.name})`);
    });
  });
  
  return {
    communication: {
      roles: Array.from(communicationRoles),
      tasks: communicationTasks,
      stakeholderRoles: Array.from(stakeholderRoles)
    },
    risk: {
      roles: Array.from(riskRoles),
      tasks: riskTasks
    },
    change: {
      roles: Array.from(changeRoles),
      tasks: changeTasks
    },
    quality: {
      roles: Array.from(qualityRoles),
      tasks: qualityTasks,
      criteria: qualityCriteria
    }
  };
};

const GovernanceFrameworkPage: React.FC = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');

  // Generate dynamic governance data from v25
  const dynamicData = generateDynamicGovernanceData();

  const governanceSections: GovernanceSection[] = [
    {
      id: 'communication',
      title: 'Communication Matrix',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'blue',
      items: [
        {
          title: 'Weekly Status Reports',
          description: 'Regular progress updates from all project phases to PMO',
          details: [
            'Standardized reporting format across all phases and process tracks',
            'Key metrics and milestone progress tracking',
            'Risk and issue identification and status',
            'Resource utilization and capacity planning',
            'Next week priorities and dependencies',
            'Track-specific reporting requirements (Enterprise vs Product path)',
            ...dynamicData.communication.tasks.slice(0, 3).map(task => `Dynamic: ${task}`)
          ],
          frequency: 'Weekly - Every Friday by 5 PM',
          participants: ['All Phase Leads', 'PMO Team', 'Product Managers', ...dynamicData.communication.roles.slice(0, 3)],
          deliverables: ['Status Report Template', 'Metrics Dashboard', 'Action Items Log']
        },
        {
          title: 'Phase Gate Reviews',
          description: 'Comprehensive reviews led by PMO with all stakeholders',
          details: [
            'Formal review of phase deliverables and outcomes',
            'Go/No-Go decision making for next phase',
            'Track-specific gate criteria validation',
            'Stakeholder alignment and sign-off collection',
            'Risk assessment and mitigation planning',
            'Resource allocation and timeline validation',
            'Path convergence validation at Solution Architecture phase'
          ],
          frequency: 'At the end of each project phase',
          participants: ['PMO', 'Business Stakeholders', 'Product Team', 'Engineering', 'QA', 'Design'],
          deliverables: ['Gate Review Checklist', 'Decision Log', 'Phase Sign-off Document']
        },
        {
          title: 'Escalation Path',
          description: 'Structured escalation hierarchy for issue resolution',
          details: [
            'Level 1: Team Lead resolution (24 hours)',
            'Level 2: Business Analyst coordination (48 hours) - Enhanced for Enterprise track',
            'Level 3: Product Manager decision (72 hours)',
            'Level 4: PMO intervention and guidance (96 hours)',
            'Level 5: Business Leadership final decision (1 week)',
            'Track-specific escalation paths based on complexity and stakeholder involvement'
          ],
          frequency: 'As needed - immediate escalation for critical issues',
          participants: ['Team Members', 'BA', 'Product Manager', 'PMO', 'Business Leadership'],
          deliverables: ['Escalation Matrix', 'Issue Tracking Template', 'Resolution Timeline']
        },
        {
          title: 'Stakeholder Updates',
          description: 'Regular communication to keep stakeholders informed',
          details: [
            'Executive summary of project progress',
            'Key achievements and milestone completions',
            'Process track status and convergence points',
            'Upcoming deliverables and timeline updates',
            'Budget and resource status reporting',
            'Strategic alignment and business value delivery',
            'Track-specific stakeholder communication (Enterprise vs Product focus)',
            ...dynamicData.communication.stakeholderRoles.slice(0, 2).map(role => `Key stakeholder: ${role}`)
          ],
          frequency: 'Bi-weekly during active phases',
          participants: ['PMO', 'Business Stakeholders', 'Executive Sponsors', ...dynamicData.communication.stakeholderRoles.slice(0, 2)],
          deliverables: ['Stakeholder Newsletter', 'Executive Dashboard', 'Business Value Report']
        }
      ],
      templates: [
        { name: 'Weekly Status Report Template', type: 'Excel', description: 'Standardized format for weekly progress reporting' },
        { name: 'Phase Gate Review Checklist', type: 'PDF', description: 'Comprehensive checklist for phase gate reviews' },
        { name: 'Escalation Matrix Template', type: 'Word', description: 'Template for documenting escalation procedures' },
        { name: 'Stakeholder Communication Plan', type: 'PowerPoint', description: 'Template for stakeholder communication planning' }
      ],
      workflows: [
        {
          name: 'Weekly Reporting Workflow',
          steps: ['Data Collection', 'Report Compilation', 'Review & Validation', 'Distribution', 'Follow-up Actions'],
          timeline: '5 business days'
        },
        {
          name: 'Phase Gate Review Process',
          steps: ['Pre-review Preparation', 'Stakeholder Review', 'Decision Making', 'Documentation', 'Next Phase Planning'],
          timeline: '2 weeks'
        }
      ]
    },
    {
      id: 'risk',
      title: 'Risk Management',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'orange',
      items: [
        {
          title: 'Risk Register Maintenance',
          description: 'Comprehensive risk tracking throughout all project phases',
          details: [
            'Centralized risk repository with unique risk IDs',
            'Risk categorization by type, impact, probability, and process track',
            'Ownership assignment and accountability tracking',
            'Mitigation strategy documentation and progress',
            'Regular risk status updates and trend analysis',
            'Track-specific risk profiles (Enterprise track complexity vs Product track simplicity)',
            ...dynamicData.risk.tasks.slice(0, 3).map(task => `Phase-specific: ${task}`)
          ],
          frequency: 'Continuous updates, formal review monthly',
          participants: ['Risk Owners', 'PMO', 'Project Teams', 'Business Stakeholders', ...dynamicData.risk.roles.slice(0, 3)],
          deliverables: ['Risk Register Database', 'Risk Assessment Matrix', 'Mitigation Plans']
        },
        {
          title: 'Monthly Risk Review Sessions',
          description: 'Regular comprehensive risk assessment meetings',
          details: [
            'Review of all active risks and their current status',
            'Assessment of new risks identified during the period',
            'Track-specific risk evaluation and mitigation strategies',
            'Evaluation of mitigation strategy effectiveness',
            'Risk trend analysis and pattern identification',
            'Escalation of high-priority risks to leadership',
            'Cross-track risk impact assessment at convergence points'
          ],
          frequency: 'Monthly - First Tuesday of each month',
          participants: ['PMO', 'Risk Owners', 'Project Managers', 'Business Leaders'],
          deliverables: ['Risk Review Minutes', 'Updated Risk Register', 'Action Plans']
        },
        {
          title: 'Escalation Triggers and Response',
          description: 'Defined criteria and procedures for risk escalation',
          details: [
            'High impact risks (business critical) - Immediate escalation',
            'Medium impact risks with increasing probability - 48 hour escalation',
            'Risks affecting multiple projects - Weekly escalation',
            'Budget impact >10% of project cost - Immediate escalation',
            'Timeline impact >2 weeks - 24 hour escalation'
          ],
          frequency: 'Triggered by risk threshold breaches',
          participants: ['Risk Owners', 'PMO', 'Business Leadership', 'Executive Sponsors'],
          deliverables: ['Escalation Criteria Matrix', 'Response Procedures', 'Communication Templates']
        },
        {
          title: 'Risk Mitigation Tracking',
          description: 'Systematic tracking and reporting of risk mitigation efforts',
          details: [
            'Mitigation action plan development and approval',
            'Progress tracking against mitigation timelines',
            'Effectiveness measurement and validation',
            'Resource allocation for mitigation activities',
            'Continuous monitoring and adjustment of strategies',
            ...dynamicData.risk.tasks.slice(3, 5).map(task => `Process integration: ${task}`)
          ],
          frequency: 'Weekly progress updates, monthly effectiveness review',
          participants: ['Risk Owners', 'PMO', 'Implementation Teams', ...dynamicData.risk.roles.slice(3, 5)],
          deliverables: ['Mitigation Progress Reports', 'Effectiveness Metrics', 'Resource Allocation Plans']
        }
      ],
      templates: [
        { name: 'Risk Assessment Template', type: 'Excel', description: 'Standardized risk evaluation and scoring template' },
        { name: 'Risk Register Template', type: 'Excel', description: 'Comprehensive risk tracking spreadsheet' },
        { name: 'Mitigation Plan Template', type: 'Word', description: 'Template for documenting risk mitigation strategies' },
        { name: 'Risk Review Meeting Template', type: 'PowerPoint', description: 'Agenda and format for risk review sessions' }
      ],
      workflows: [
        {
          name: 'Risk Identification Process',
          steps: ['Risk Discovery', 'Impact Assessment', 'Probability Analysis', 'Risk Registration', 'Owner Assignment'],
          timeline: '1 week'
        },
        {
          name: 'Risk Escalation Workflow',
          steps: ['Threshold Breach Detection', 'Stakeholder Notification', 'Response Planning', 'Implementation', 'Monitoring'],
          timeline: '24-48 hours'
        }
      ]
    },
    {
      id: 'change',
      title: 'Change Management',
      icon: <RefreshCw className="w-6 h-6" />,
      color: 'purple',
      items: [
        {
          title: 'Formal Change Request Process',
          description: 'Structured approach to managing project changes',
          details: [
            'Standardized change request form submission',
            'Track-specific change impact assessment procedures',
            'Initial impact assessment and feasibility analysis',
            'Stakeholder review and consultation process',
            'Formal approval workflow based on change magnitude',
            'Implementation planning and execution tracking',
            'Change routing based on Enterprise vs Product track requirements',
            ...dynamicData.change.tasks.slice(0, 3).map(task => `Process-driven: ${task}`)
          ],
          frequency: 'As needed - continuous process',
          participants: ['Change Requestor', 'BA', 'Product Manager', 'PMO', 'Approval Committee', ...dynamicData.change.roles.slice(0, 3)],
          deliverables: ['Change Request Form', 'Impact Assessment', 'Approval Decision']
        },
        {
          title: 'Impact Assessment Requirements',
          description: 'Comprehensive evaluation of proposed changes',
          details: [
            'Technical impact analysis on system architecture',
            'Process track impact evaluation (Enterprise vs Product path)',
            'Business process impact and workflow changes',
            'Resource requirements and capacity implications',
            'Timeline impact and milestone adjustments',
            'Cost analysis and budget impact assessment',
            'Cross-track dependency analysis for changes affecting both paths'
          ],
          frequency: 'For each change request within 5 business days',
          participants: ['Technical Leads', 'Business Analysts', 'PMO', 'Finance Team'],
          deliverables: ['Technical Impact Report', 'Business Impact Analysis', 'Cost-Benefit Analysis']
        },
        {
          title: 'Approval Hierarchy',
          description: 'Tiered approval structure based on change magnitude',
          details: [
            'Minor changes (<$5K, <1 week) - Team Lead approval',
            'Medium changes ($5K-$25K, 1-4 weeks) - Product Manager approval',
            'Major changes ($25K-$100K, 1-2 months) - PMO approval',
            'Critical changes (>$100K, >2 months) - Business Leadership approval',
            'Emergency changes - Expedited approval with post-implementation review'
          ],
          frequency: 'Based on change request submission',
          participants: ['Team Leads', 'Product Managers', 'PMO', 'Business Leadership'],
          deliverables: ['Approval Matrix', 'Decision Records', 'Authorization Documents']
        },
        {
          title: 'Change Log Maintenance',
          description: 'Comprehensive tracking of all project changes',
          details: [
            'Centralized change repository with unique change IDs',
            'Status tracking from request to implementation',
            'Version control and change history documentation',
            'Impact realization and benefits tracking',
            'Lessons learned capture and knowledge sharing',
            ...dynamicData.change.tasks.slice(3, 5).map(task => `Lifecycle integration: ${task}`)
          ],
          frequency: 'Real-time updates, weekly summary reports',
          participants: ['Change Coordinators', 'PMO', 'Project Teams', ...dynamicData.change.roles.slice(3, 5)],
          deliverables: ['Change Log Database', 'Status Reports', 'Change Analytics']
        }
      ],
      templates: [
        { name: 'Change Request Form', type: 'Word', description: 'Standardized form for submitting change requests' },
        { name: 'Impact Assessment Template', type: 'Excel', description: 'Template for evaluating change impacts' },
        { name: 'Change Approval Matrix', type: 'PDF', description: 'Visual guide to approval requirements' },
        { name: 'Change Log Template', type: 'Excel', description: 'Template for tracking change requests' }
      ],
      workflows: [
        {
          name: 'Change Request Workflow',
          steps: ['Request Submission', 'Initial Review', 'Impact Assessment', 'Approval Process', 'Implementation Planning'],
          timeline: '2-3 weeks'
        },
        {
          name: 'Emergency Change Process',
          steps: ['Emergency Declaration', 'Rapid Assessment', 'Expedited Approval', 'Implementation', 'Post-Review'],
          timeline: '24-48 hours'
        }
      ]
    },
    {
      id: 'quality',
      title: 'Quality Gates',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'green',
      items: [
        {
          title: 'Deliverable Review Checkpoints',
          description: 'Systematic quality checkpoints at each project phase',
          details: [
            'Pre-defined quality criteria for each deliverable type and process track',
            'Peer review process with designated reviewers',
            'Track-specific quality standards (Enterprise rigor vs Product efficiency)',
            'Quality checklist validation and sign-off',
            'Defect identification and resolution tracking',
            'Continuous improvement feedback integration',
            'Quality convergence validation at Solution Architecture phase',
            ...dynamicData.quality.tasks.slice(0, 4).map(task => `Phase activity: ${task}`)
          ],
          frequency: 'At completion of each deliverable',
          participants: ['Deliverable Authors', 'Peer Reviewers', 'Quality Leads', 'PMO', ...dynamicData.quality.roles.slice(0, 3)],
          deliverables: ['Quality Checklists', 'Review Reports', 'Sign-off Documents']
        },
        {
          title: 'Compliance Validation',
          description: 'Ensuring adherence to organizational and industry standards',
          details: [
            'Regulatory compliance verification and documentation',
            'Track-specific compliance requirements and validation',
            'Internal policy and procedure adherence checks',
            'Industry best practice implementation validation',
            'Security and privacy requirement compliance',
            'Audit trail maintenance and documentation',
            'Compliance convergence validation for both process tracks'
          ],
          frequency: 'Phase gate reviews and final delivery',
          participants: ['Compliance Officers', 'Legal Team', 'Security Team', 'PMO'],
          deliverables: ['Compliance Reports', 'Audit Documentation', 'Certification Records']
        },
        {
          title: 'Performance Benchmarks',
          description: 'Measurable criteria for deliverable acceptance',
          details: [
            'Quantitative performance metrics and thresholds',
            'User experience and usability benchmarks',
            'System performance and scalability requirements',
            'Business value and ROI measurement criteria',
            'Customer satisfaction and feedback metrics'
          ],
          frequency: 'Established at project initiation, measured at delivery',
          participants: ['Business Analysts', 'Technical Leads', 'QA Team', 'End Users'],
          deliverables: ['Performance Criteria', 'Benchmark Reports', 'Acceptance Documentation']
        },
        {
          title: 'Quality Metrics Tracking',
          description: 'Continuous monitoring and reporting of quality indicators',
          details: [
            'Defect density and resolution time tracking',
            'Code quality metrics and technical debt monitoring',
            'User acceptance test pass rates and feedback',
            'Process adherence and compliance scoring',
            'Customer satisfaction and Net Promoter Score tracking',
            ...dynamicData.quality.criteria.slice(0, 4).map(criteria => `Gate criteria: ${criteria}`)
          ],
          frequency: 'Weekly metrics collection, monthly trend analysis',
          participants: ['QA Team', 'Development Teams', 'PMO', 'Business Stakeholders', ...dynamicData.quality.roles.slice(3, 5)],
          deliverables: ['Quality Dashboards', 'Trend Reports', 'Improvement Recommendations']
        }
      ],
      templates: [
        { name: 'Quality Gate Checklist', type: 'Excel', description: 'Comprehensive checklist for quality gate reviews' },
        { name: 'Deliverable Review Template', type: 'Word', description: 'Template for conducting deliverable reviews' },
        { name: 'Compliance Validation Form', type: 'PDF', description: 'Form for documenting compliance validation' },
        { name: 'Quality Metrics Dashboard', type: 'Excel', description: 'Template for tracking quality metrics' }
      ],
      workflows: [
        {
          name: 'Quality Gate Review Process',
          steps: ['Pre-review Preparation', 'Quality Assessment', 'Stakeholder Review', 'Decision Making', 'Documentation'],
          timeline: '1 week'
        },
        {
          name: 'Defect Resolution Workflow',
          steps: ['Defect Identification', 'Impact Assessment', 'Resolution Planning', 'Implementation', 'Verification'],
          timeline: '3-5 days'
        }
      ]
    }
  ];

  // Handle summary click to expand and scroll to section
  const handleSummaryClick = (sectionId: string) => {
    // Expand the section if not already expanded
    if (!expandedSections.includes(sectionId)) {
      setExpandedSections(prev => [...prev, sectionId]);
    }
    
    // Scroll to the section after a brief delay to allow expansion
    setTimeout(() => {
      const element = document.getElementById(`section-${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-900',
        accent: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      orange: {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-900',
        accent: 'text-orange-600',
        button: 'bg-orange-600 hover:bg-orange-700'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        text: 'text-purple-900',
        accent: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-900',
        accent: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const filteredSections = governanceSections.filter(section => {
    if (selectedSection !== 'all' && section.id !== selectedSection) return false;
    if (searchTerm === '') return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      section.title.toLowerCase().includes(searchLower) ||
      section.items.some(item => 
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.details.some(detail => detail.toLowerCase().includes(searchLower))
      )
    );
  });

  const exportToPDF = () => {
    import('../utils/exportUtils').then(({ exportToPDF }) => {
      exportToPDF('root', 'governance-framework');
    });
  };

  const printSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>PMO Governance - ${sectionId}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .section { margin-bottom: 20px; }
                .header { background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
                .content { padding: 10px; }
              </style>
            </head>
            <body>
              <div class="section">
                ${element.innerHTML}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
            Governance Framework
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
          Dynamic governance framework integrated with PMO lifecycle phases and RACI assignments
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search governance content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Section Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Sections</option>
              {governanceSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.title}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Governance Sections */}
      <div className="space-y-8">
        {filteredSections.map((section) => {
          const colors = getColorClasses(section.color);
          const isExpanded = expandedSections.includes(section.id);

          return (
            <div key={section.id} id={`section-${section.id}`} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Section Header */}
              <div 
                className={`${colors.bg} ${colors.border} border-b p-6 cursor-pointer hover:opacity-90 transition-opacity`}
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`${colors.accent} p-2 rounded-lg bg-white shadow-sm`}>
                      {section.icon}
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${colors.text}`}>
                        {section.title}
                      </h2>
                      <p className={`${colors.text} opacity-80 mt-1`}>
                        {section.items.length} governance items • {section.templates.length} templates • {section.workflows.length} workflows
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        printSection(section.id);
                      }}
                      className={`p-2 ${colors.button} text-white rounded-lg transition-colors`}
                      title="Print Section"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronDown className={`w-6 h-6 ${colors.accent}`} />
                    ) : (
                      <ChevronRight className={`w-6 h-6 ${colors.accent}`} />
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Content */}
              {isExpanded && (
                <div className="p-6 space-y-8">
                  {/* Governance Items */}
                  <div className="space-y-6">
                    {section.items.map((item, index) => (
                      <div key={index} className={`${colors.bg} rounded-lg p-6 border ${colors.border}`}>
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className={`text-lg font-bold ${colors.text} mb-2`}>
                              {item.title}
                            </h3>
                            <p className={`${colors.text} opacity-80 text-sm`}>
                              {item.description}
                            </p>
                          </div>
                          {item.frequency && (
                            <div className="flex items-center gap-2 text-xs bg-white px-3 py-1 rounded-full border">
                              <Clock className="w-3 h-3" />
                              {item.frequency}
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="mb-4">
                          <h4 className={`font-semibold ${colors.text} mb-2 text-sm`}>Key Components:</h4>
                          <ul className="space-y-2">
                            {item.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className={`w-1.5 h-1.5 ${colors.accent.replace('text-', 'bg-')} rounded-full mt-2 flex-shrink-0`}></span>
                                <span className={`text-sm ${colors.text} opacity-90 ${detail.startsWith('Dynamic:') || detail.startsWith('Phase activity:') || detail.startsWith('Gate criteria:') || detail.startsWith('Process-driven:') || detail.startsWith('Lifecycle integration:') || detail.startsWith('Phase-specific:') || detail.startsWith('Process integration:') || detail.startsWith('Key stakeholder:') ? 'font-medium bg-white/50 px-2 py-1 rounded' : ''}`}>
                                  {detail}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Participants and Deliverables */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {item.participants && (
                            <div>
                              <h4 className={`font-semibold ${colors.text} mb-2 text-sm flex items-center gap-2`}>
                                <Users className="w-4 h-4" />
                                Participants:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {item.participants.map((participant, idx) => (
                                  <span key={idx} className={`text-xs px-2 py-1 rounded border ${participant.includes('(') ? 'bg-blue-50 border-blue-200 text-blue-800' : 'bg-white'}`}>
                                    {participant}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {item.deliverables && (
                            <div>
                              <h4 className={`font-semibold ${colors.text} mb-2 text-sm flex items-center gap-2`}>
                                <Target className="w-4 h-4" />
                                Deliverables:
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {item.deliverables.map((deliverable, idx) => (
                                  <span key={idx} className="text-xs bg-white px-2 py-1 rounded border">
                                    {deliverable}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Dynamic Phase Integration Section */}
                  <div className={`${colors.bg} rounded-lg p-6 border-2 ${colors.border}`}>
                    <h3 className={`text-lg font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                      <GitBranch className="w-5 h-5" />
                      Phase Integration Summary
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className={`font-semibold ${colors.text} mb-3 text-sm`}>Key Roles Across Phases:</h4>
                        <div className="space-y-1">
                          {(section.id === 'communication' ? dynamicData.communication.roles :
                            section.id === 'risk' ? dynamicData.risk.roles :
                            section.id === 'change' ? dynamicData.change.roles :
                            dynamicData.quality.roles).slice(0, 5).map((role, idx) => (
                            <div key={idx} className="text-xs bg-white/70 px-2 py-1 rounded border">
                              {role}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className={`font-semibold ${colors.text} mb-3 text-sm`}>Related Phase Activities:</h4>
                        <div className="space-y-1">
                          {(section.id === 'communication' ? dynamicData.communication.tasks :
                            section.id === 'risk' ? dynamicData.risk.tasks :
                            section.id === 'change' ? dynamicData.change.tasks :
                            section.id === 'quality' ? dynamicData.quality.tasks :
                            []).slice(0, 3).map((task, idx) => (
                            <div key={idx} className="text-xs bg-white/70 px-2 py-1 rounded border">
                              {task}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Quality-specific gate criteria */}
                    {section.id === 'quality' && (
                      <div className="mt-4">
                        <h4 className={`font-semibold ${colors.text} mb-3 text-sm`}>Gate Criteria Across Phases:</h4>
                        <div className="grid md:grid-cols-2 gap-2">
                          {dynamicData.quality.criteria.slice(0, 6).map((criteria, idx) => (
                            <div key={idx} className="text-xs bg-white/70 px-2 py-1 rounded border">
                              {criteria}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Templates Section */}
                  <div>
                    <h3 className={`text-lg font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                      <FileText className="w-5 h-5" />
                      Available Templates & Checklists
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {section.templates.map((template, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800">{template.name}</h4>
                            <span className={`text-xs px-2 py-1 ${colors.bg} ${colors.text} rounded`}>
                              {template.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                          <button 
                            onClick={() => downloadTemplate(template.name, template.type)}
                            className={`text-xs ${colors.button} text-white px-3 py-1 rounded hover:opacity-90 transition-opacity flex items-center gap-1`}
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Workflows Section */}
                  <div>
                    <h3 className={`text-lg font-bold ${colors.text} mb-4 flex items-center gap-2`}>
                      <Calendar className="w-5 h-5" />
                      Process Workflows
                    </h3>
                    <div className="space-y-4">
                      {section.workflows.map((workflow, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-800">{workflow.name}</h4>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {workflow.timeline}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            {workflow.steps.map((step, idx) => (
                              <React.Fragment key={idx}>
                                <div className={`flex-shrink-0 px-3 py-2 ${colors.bg} ${colors.text} rounded-lg text-sm font-medium border ${colors.border}`}>
                                  {step}
                                </div>
                                {idx < workflow.steps.length - 1 && (
                                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related Links */}
                  <div className={`${colors.bg} rounded-lg p-4 border ${colors.border}`}>
                    <h4 className={`font-semibold ${colors.text} mb-3 flex items-center gap-2`}>
                      <ExternalLink className="w-4 h-4" />
                      Related Governance Areas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {governanceSections
                        .filter(s => s.id !== section.id)
                        .map((relatedSection) => (
                          <button
                            key={relatedSection.id}
                            onClick={() => {
                              setSelectedSection(relatedSection.id);
                              if (!expandedSections.includes(relatedSection.id)) {
                                toggleSection(relatedSection.id);
                              }
                            }}
                            className="text-xs bg-white px-3 py-1 rounded border hover:shadow-sm transition-shadow"
                          >
                            {relatedSection.title}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="mt-12 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2 font-medium">
            📋 Click on any section header to expand detailed procedures • 🔍 Use search to find specific governance content • 📄 Download templates and checklists
          </p>
          <p className="text-xs text-gray-500">
            This governance framework ensures consistent project execution and stakeholder alignment across all PMO initiatives
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-medium">
              📋 Framework Overview: This comprehensive governance framework ensures consistent project execution through structured processes. 
              It covers communication protocols, risk management, change control, and quality assurance with detailed 
              procedures, templates, and workflows. Each section provides practical guidance for implementing 
              professional project governance in your organization.
            </p>
          </div>
        </div>
        
        {/* Process Track Integration Notice */}
        <div className="bg-gradient-to-r from-amber-50 to-green-50 rounded-xl p-6 border-2 border-dashed border-gray-300 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center justify-center gap-2">
              <GitBranch className="w-5 h-5 text-blue-600" />
              Dynamic Phase Integration
            </h3>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-medium">
                🔄 This governance framework now dynamically integrates with your PMO lifecycle phases. 
                Role assignments, key tasks, and gate criteria are automatically extracted from the v25 phase data 
                and integrated into relevant governance sections.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-amber-100 rounded-lg p-4 border border-amber-200">
                <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Enterprise Track Governance
                </h4>
                <p className="text-sm text-amber-700">
                  Enhanced governance for complex features requiring formal business analysis (E2→E3→E4), 
                  comprehensive risk assessment, and detailed change management procedures.
                </p>
              </div>
              <div className="bg-green-100 rounded-lg p-4 border border-green-200">
                <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Product Track Governance
                </h4>
                <p className="text-sm text-green-700">
                  Streamlined governance for straightforward enhancements following the product path (P2→P3→P4), 
                  with simplified approval processes while maintaining quality standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceFrameworkPage;