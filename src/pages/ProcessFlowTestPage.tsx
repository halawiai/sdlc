import React, { useState, useMemo } from 'react';
import { Pause, AlertTriangle, Info, Briefcase, Target, Users, Palette, Code, TestTube, Building, User, ArrowRight, ArrowLeft, FileText, Printer, Download, Image } from 'lucide-react';
import html2canvas from 'html2canvas';
import PhaseDetailModal from '../components/PhaseDetailModal';
import ProcessFlowMinimalCanvas2 from "../canvas/ProcessFlowMinimalCanvas2";
import { v25 } from '../data/lifecycleDataV25Details';

type PhaseID = '0'|'1'|'E2'|'E3'|'E4'|'P2'|'P3'|'P4'|'SA'|'5'|'5.1'|'6'|'7'|'8'|'9';

interface PhaseDetails {
  owner: string;
  processFocus: string;
  inputs: string[];
  outputs: string[];
  keyTasks: string[];
  phaseGateCriteria: string[];
  raciMatrix: { role: string; description: string; }[];
}

interface LegendItem {
  name: string;
  icon: React.ReactNode;
  color?: string;
  description?: string;
  type?: string;
}

const v25Phases: Record<string, {
  name: string; short: string; desc: string; gradient: string;
  details: PhaseDetails;
}> = {
  ...Object.fromEntries(
    Object.entries(v25).map(([id, phase]) => [
      id,
      {
        name: phase.name,
        short: phase.short,
        desc: phase.desc,
        gradient: phase.gradient,
        details: phase.details
      }
    ])
  ),
  // Add NOC phase for the toPhase function
  'NOC': {
    name: 'Central Bank NOC Check',
    short: 'NOC',
    desc: 'Central Bank No Objection Certificate validation',
    gradient: 'from-red-500 to-red-600',
    details: {
      owner: 'Risk and Compliance + PMO',
      processFocus: 'Determine if change requires Central Bank No Objection Certificate and obtain approval if needed',
      inputs: ['Project Charter / Discovery Brief', 'Change impact assessment', 'Regulatory requirements'],
      outputs: ['NOC determination', 'Central Bank approval (if required)', 'Compliance clearance'],
      keyTasks: [
        'Assess regulatory impact',
        'Determine NOC requirement',
        'Submit NOC application to Central Bank (if required)',
        'Track approval status',
        'Document compliance clearance'
      ],
      phaseGateCriteria: [
        'NOC requirement determined',
        'Central Bank approval obtained (if required)',
        'Compliance documentation complete'
      ],
      raciMatrix: [
        { role: 'Risk and Compliance', description: 'Responsible for NOC assessment and Central Bank coordination' },
        { role: 'PMO', description: 'Accountable for ensuring compliance process completion' },
        { role: 'Business', description: 'Consulted for business impact assessment' },
        { role: 'Product', description: 'Informed of NOC requirements and timeline impact' }
      ]
    }
  }
};

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

interface ExceptionPhase {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  details: PhaseDetails;
}

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
  const [showLegend, setShowLegend] = useState(false);
  
  const defaultPhaseDetails: PhaseDetails = {
    owner: 'Not specified',
    processFocus: 'Not specified',
    inputs: [],
    outputs: [],
    keyTasks: [],
    phaseGateCriteria: [],
    raciMatrix: []
  };

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

  const handlePhaseClick = (phase: ExceptionPhase | any) => {
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
  };

  // Print only the process flow component
  const handlePrintFlow = async () => {
    try {
      const element = document.getElementById('process-flow-canvas');
      if (!element) {
        alert('Process flow not found');
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Create new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>PMO Process Flow - V2</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  min-height: 100vh;
                  background: white;
                }
                img { 
                  max-width: 100%; 
                  height: auto; 
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  border-radius: 8px;
                }
                @media print {
                  body { padding: 0; }
                  img { box-shadow: none; border-radius: 0; }
                }
              </style>
            </head>
            <body>
              <img src="${imgData}" alt="PMO Process Flow V2" />
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        
        // Wait for image to load then print
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 1000);
      }
    } catch (error) {
      console.error('Error printing process flow:', error);
      alert('Error printing process flow. Please try again.');
    }
  };

  // Save process flow as image
  const handleSaveFlowAsImage = async () => {
    try {
      const element = document.getElementById('process-flow-canvas');
      if (!element) {
        alert('Process flow not found');
        return;
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `pmo-process-flow-v2-${new Date().toISOString().split('T')[0]}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error saving process flow as image:', error);
      alert('Error saving process flow as image. Please try again.');
    }
  };

  const renderLegend = () => {
    const roleItems = legendItems.filter(item => item.type === 'role');
    const categoryItems = legendItems.filter(item => item.type === 'category');

    return (
    <div 
      className={`
        fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end p-4
        ${showLegend ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        transition-opacity duration-300
      `}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowLegend(false);
        }
      }}
    >
      <div 
        className={`
          bg-white rounded-xl shadow-2xl border border-gray-200 w-96 max-h-[90vh] overflow-hidden
          transform transition-all duration-300 legend-container mt-16
          ${showLegend ? 'scale-100 translate-x-0' : 'scale-95 translate-x-4'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
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
          <div className="space-y-6">
            {/* Roles Section */}
            <div>
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

            <div>
              <h4 className="font-semibold text-gray-700 mb-3 text-base">Phase Types</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-purple-500 rounded"></div>
                  <div>
                    <span className="font-semibold text-gray-800">Discovery Phase</span>
                    <p className="text-sm text-gray-600">Initial scope identification and project charter</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded"></div>
                  <div>
                    <span className="font-semibold text-gray-800">Core Process Phases</span>
                    <p className="text-sm text-gray-600">Standard lifecycle phases for all projects</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-amber-100 to-amber-300 rounded border border-amber-400"></div>
                  <div>
                    <span className="font-semibold text-gray-800">Enterprise Path</span>
                    <p className="text-sm text-gray-600">Complex features requiring detailed business analysis</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-200 to-emerald-500 rounded"></div>
                  <div>
                    <span className="font-semibold text-gray-800">Product Path</span>
                    <p className="text-sm text-gray-600">Streamlined path for straightforward enhancements</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-6 h-6 bg-gradient-to-r from-sky-300 to-sky-500 rounded"></div>
                  <div>
                    <span className="font-semibold text-gray-800">Development & Testing</span>
                    <p className="text-sm text-gray-600">Solution development and quality assurance phases</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-3 text-base">How to Use</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700">Click any phase circle to view detailed information</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700">Diamond shape represents decision points</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700">Dashed lines show iteration loops</span>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700">Follow arrows for process flow</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-3 text-base">Decision Criteria</h4>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-sm text-blue-800 leading-relaxed">
                  The Owner Decision diamond uses a scientific scoring system: Customer Impact + Market Demand + Features. 
                  Scores &lt;9 route to Product track, =9 requires discussion, &gt;9 follows Enterprise track.
                </p>
              </div>
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

  const toPhase = (id: string) => {
    const phase = v25Phases[id];
    if (!phase) {
      return {
        id,
        name: `Phase ${id}`,
        shortName: id,
        description: '',
        gradient: 'from-gray-500 to-gray-600',
        details: defaultPhaseDetails
      };
    }
    return {
      id,
      name: phase.name,
      shortName: phase.short,
      description: phase.desc,
      gradient: phase.gradient,
      details: phase.details
    };
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
            Process Flow – V2
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
          Enhanced process flow with improved layout, decision criteria integration, and streamlined visual design
        </p>
      </div>

      {/* View Path Controls */}
      <div className="flex justify-end mb-6 sticky top-2 z-30">
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur rounded-lg p-2 border border-gray-200 shadow-sm">
          <button
            onClick={handlePrintFlow}
            className="flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-xs font-medium"
            title="Print Process Flow"
          >
            <Printer className="w-3 h-3" />
            Print Flow
          </button>
          <button
            onClick={handleSaveFlowAsImage}
            className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-xs font-medium"
            title="Save Process Flow as Image"
          >
            <Image className="w-3 h-3" />
            Save Image
          </button>
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="ml-1 flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs font-medium legend-toggle"
          >
            Legend
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div id="process-flow-canvas" className="mb-12 relative">
        <ProcessFlowMinimalCanvas2
          getPhase={(id) => toPhase(id)}
          onSelect={(p) => handlePhaseClick(p as any)}
        />
      </div>

      {/* Exception States */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Exception States</h2>
        <div className="flex justify-center items-center gap-12">
          {exceptionPhases.map((exceptionPhase) => (
            <div
              key={exceptionPhase.id}
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => handlePhaseClick(exceptionPhase)}
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600
                           flex items-center justify-center text-white font-bold
                           shadow-lg hover:scale-110 transition-transform">
                {exceptionPhase.icon}
              </div>
              <div className="mt-2 text-center">
                <h3 className="text-sm font-bold text-red-700">{exceptionPhase.name}</h3>
                <p className="text-xs text-gray-600 max-w-24">{exceptionPhase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      {showLegend && renderLegend()}

      {/* Phase Detail Modal */}
      <PhaseDetailModal
        isOpen={showModal}
        onClose={handleCloseModal}
        phaseInfo={selectedPhaseInfo}
      />

      {/* Instructions */}
      <div className="mt-8 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm max-w-4xl mx-auto">
          <p className="text-sm text-gray-600 mb-2">
            🖱️ Click on any phase circle or decision diamond to view detailed information
          </p>
          <p className="text-xs text-gray-500">
            Professional layout optimized for enterprise project management workflows with Central Bank NOC compliance validation
          </p>
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-800 font-medium">
              🏛️ Central Bank NOC: The red NOC check runs parallel to Discovery when regulatory approval is required. 
              This ensures compliance validation occurs early in the process without blocking initial project activities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessFlowTestPage;