import React from 'react';
import { Calendar } from 'lucide-react';
import PhaseDetailModal from '../components/PhaseDetailModal';
import { fullLifecyclePhases } from '../data/lifecycleData';

const HorizontalProcessPage: React.FC = () => {
  const [selectedPhaseInfo, setSelectedPhaseInfo] = React.useState<any>(null);
  const [showModal, setShowModal] = React.useState(false);

  const handlePhaseClick = (phaseId: number) => {
    const phaseData = fullLifecyclePhases.find(p => p.id === phaseId);
    
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
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPhaseInfo(null);
  };

  const phaseData = [
    {
      id: 1,
      name: 'INITIATION',
      x: 200,
      y: 400,
      gradient: 'from-blue-500 to-blue-600',
      owner: 'Product, Business, Others',
      process: 'Identifying the problem, target audience, and competitive landscape and scope',
      inputs: ['Customer Interviews', 'Market Analysis', 'Pain Points, etc.'],
      outputs: ['PRD Brief']
    },
    {
      id: 2,
      name: 'REQUIREMENTS',
      x: 500,
      y: 400,
      gradient: 'from-blue-600 to-teal-500',
      owner: 'Business, BA',
      process: 'Business approval and validation of requirements',
      inputs: ['PRD Brief'],
      outputs: ['BRD', 'Business Approval']
    },
    {
      id: 3,
      name: 'DESIGN',
      x: 800,
      y: 400,
      gradient: 'from-teal-500 to-green-500',
      owner: 'Product, BA, Design (when applicable)',
      process: 'Develop detailed requirements, Create UX/UI design in parallel',
      inputs: ['BRD', 'User Stories'],
      outputs: ['UX/UI Design Document (when applicable)', 'User Stories', 'Full Requirements']
    },
    {
      id: 4,
      name: 'PLANNING',
      x: 1100,
      y: 400,
      gradient: 'from-green-500 to-green-600',
      owner: 'PMO, Product',
      process: 'Project planning, resource allocation, timeline development',
      inputs: ['Approved Requirements Package', 'User Stories'],
      outputs: ['Project Plan', 'Resource Plan', 'Budget Plan', 'Risk Register']
    },
    {
      id: 5,
      name: 'DEVELOPMENT',
      x: 1400,
      y: 400,
      gradient: 'from-green-600 to-emerald-500',
      owner: 'Engineering, Product',
      process: 'Solution Development',
      inputs: ['Approved Requirements, Technical Architecture, Backlog'],
      outputs: ['Workable Demo, Technical Documentation']
    },
    {
      id: 6,
      name: 'QA',
      x: 1700,
      y: 400,
      gradient: 'from-emerald-500 to-teal-600',
      owner: 'QA, BA, PMO',
      process: 'Test solution to ensure it meets requirements',
      inputs: ['All previous phase deliverables, Workable Demo'],
      outputs: ['Product Testing Report, User Feedback, Business Sign-off']
    },
    {
      id: 7,
      name: 'DEPLOYMENT',
      x: 2000,
      y: 400,
      gradient: 'from-teal-600 to-blue-500',
      owner: 'PMO, Engineering',
      process: 'Change Management, Deployment, and Success Measurement',
      inputs: ['Approved solution from QA'],
      outputs: ['Go Live Confirmation, Product Rollout']
    },
    {
      id: 8,
      name: 'CLOSURE',
      x: 2300,
      y: 400,
      gradient: 'from-blue-500 to-indigo-600',
      owner: 'PMO, Product',
      process: 'Project Closure, Documentation, Lessons Learned',
      inputs: ['Success metrics, All deliverables'],
      outputs: ['Closure Report, Lessons Learned, Knowledge Transfer']
    }
  ];

  const specialElements = [
    {
      id: 'business-approval',
      name: 'Business with Approval',
      x: 650,
      y: 200,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'release-management',
      name: 'Release Management',
      x: 2150,
      y: 150,
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 'go-live',
      name: 'Go Live',
      x: 2150,
      y: 250,
      color: 'from-blue-500 to-blue-600'
    }
  ];

  const exceptionStates = [
    {
      id: 'dropped',
      name: 'DROPPED',
      x: 650,
      y: 800,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'on-hold',
      name: 'ON HOLD',
      x: 1250,
      y: 800,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="w-full p-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Calendar className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
            Product + PMO + BA Process - HALA 2025 - v 23
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
          Complete horizontal process flow with all 8 phases in a single continuous row
        </p>
      </div>

      {/* Main Container */}
      <div className="relative bg-white rounded-lg shadow-lg p-8 overflow-x-auto w-full">
        <div className="min-w-[3200px] w-full">
          {/* SVG Flowchart */}
          <svg viewBox="0 0 3200 1200" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
            {/* Arrow marker definitions */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
              </marker>
              <marker id="feedbackArrow" markerWidth="10" markerHeight="7" 
                      refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#EF4444" />
              </marker>
            </defs>

            {/* Phase Circles and Content */}
            {phaseData.map((phase, index) => (
              <g key={phase.id}>
                {/* Information Boxes */}
                {/* Owner Box - TOP */}
                <text x={phase.x - 140} y={phase.y - 167} textAnchor="start" fill="#8B5CF6" fontSize="12" fontWeight="bold">OWNER</text>
                <foreignObject x={phase.x - 120} y={phase.y - 160} width="240" height="60">
                  <div className="text-left text-sm text-purple-600 leading-relaxed font-medium p-3 bg-purple-50 rounded border border-purple-200 break-words shadow-sm">{phase.owner}</div>
                </foreignObject>
                {/* Owner connecting line */}
                <path d={`M ${phase.x} ${phase.y - 40} L ${phase.x} ${phase.y - 80} L ${phase.x - 20} ${phase.y - 80} L ${phase.x - 20} ${phase.y - 130} L ${phase.x - 120} ${phase.y - 130}`} stroke="#8B5CF6" strokeWidth="2" fill="none" />

                {/* Process Box - Positioned based on phase */}
                {phase.id <= 2 && (
                  <>
                    <text x={phase.x - 140} y={phase.y - 93} textAnchor="start" fill="#3B82F6" fontSize="12" fontWeight="bold">PROCESS</text>
                    <foreignObject x={phase.x - 120} y={phase.y - 87} width="240" height="80">
                      <div className="text-left text-sm text-blue-600 leading-relaxed p-3 bg-blue-50 rounded border border-blue-200 break-words shadow-sm">{phase.process}</div>
                    </foreignObject>
                    <path d={`M ${phase.x - 40} ${phase.y} L ${phase.x - 60} ${phase.y} L ${phase.x - 60} ${phase.y - 47} L ${phase.x - 120} ${phase.y - 47}`} stroke="#3B82F6" strokeWidth="2" fill="none" />
                  </>
                )}
                {phase.id === 3 && (
                  <>
                    <text x={phase.x + 50} y={phase.y - 93} textAnchor="start" fill="#3B82F6" fontSize="12" fontWeight="bold">PROCESS</text>
                    <foreignObject x={phase.x + 50} y={phase.y - 87} width="240" height="80">
                      <div className="text-left text-sm text-blue-600 leading-relaxed p-3 bg-blue-50 rounded border border-blue-200 break-words shadow-sm">{phase.process}</div>
                    </foreignObject>
                    <path d={`M ${phase.x + 40} ${phase.y} L ${phase.x + 60} ${phase.y} L ${phase.x + 60} ${phase.y - 47} L ${phase.x + 50} ${phase.y - 47}`} stroke="#3B82F6" strokeWidth="2" fill="none" />
                  </>
                )}
                {phase.id === 4 && (
                  <>
                    <text x={phase.x + 50} y={phase.y - 167} textAnchor="start" fill="#3B82F6" fontSize="12" fontWeight="bold">PROCESS</text>
                    <foreignObject x={phase.x + 50} y={phase.y - 160} width="240" height="80">
                      <div className="text-left text-sm text-blue-600 leading-relaxed p-3 bg-blue-50 rounded border border-blue-200 break-words shadow-sm">{phase.process}</div>
                    </foreignObject>
                    <path d={`M ${phase.x} ${phase.y - 40} L ${phase.x} ${phase.y - 80} L ${phase.x + 20} ${phase.y - 80} L ${phase.x + 20} ${phase.y - 120} L ${phase.x + 50} ${phase.y - 120}`} stroke="#3B82F6" strokeWidth="2" fill="none" />
                  </>
                )}
                {phase.id === 5 && (
                  <>
                    <text x={phase.x - 140} y={phase.y - 93} textAnchor="start" fill="#3B82F6" fontSize="12" fontWeight="bold">PROCESS</text>
                    <foreignObject x={phase.x - 120} y={phase.y - 87} width="240" height="80">
                      <div className="text-left text-sm text-blue-600 leading-relaxed p-3 bg-blue-50 rounded border border-blue-200 break-words shadow-sm">{phase.process}</div>
                    </foreignObject>
                    <path d={`M ${phase.x - 40} ${phase.y} L ${phase.x - 60} ${phase.y} L ${phase.x - 60} ${phase.y - 47} L ${phase.x - 120} ${phase.y - 47}`} stroke="#3B82F6" strokeWidth="2" fill="none" />
                  </>
                )}
                {phase.id === 6 && (
                  <>
                    <text x={phase.x + 50} y={phase.y - 167} textAnchor="start" fill="#3B82F6" fontSize="12" fontWeight="bold">PROCESS</text>
                    <foreignObject x={phase.x + 50} y={phase.y - 160} width="240" height="80">
                      <div className="text-left text-sm text-blue-600 leading-relaxed p-3 bg-blue-50 rounded border border-blue-200 break-words shadow-sm">{phase.process}</div>
                    </foreignObject>
                    <path d={`M ${phase.x} ${phase.y - 40} L ${phase.x} ${phase.y - 80} L ${phase.x + 20} ${phase.y - 80} L ${phase.x + 20} ${phase.y - 120} L ${phase.x + 50} ${phase.y - 120}`} stroke="#3B82F6" strokeWidth="2" fill="none" />
                  </>
                )}
                {phase.id === 7 && (
                  <>
                    <text x={phase.x + 50} y={phase.y - 93} textAnchor="start" fill="#3B82F6" fontSize="12" fontWeight="bold">PROCESS</text>
                    <foreignObject x={phase.x + 50} y={phase.y - 87} width="240" height="80">
                      <div className="text-left text-sm text-blue-600 leading-relaxed p-3 bg-blue-50 rounded border border-blue-200 break-words shadow-sm">{phase.process}</div>
                    </foreignObject>
                    <path d={`M ${phase.x + 40} ${phase.y} L ${phase.x + 60} ${phase.y} L ${phase.x + 60} ${phase.y - 47} L ${phase.x + 50} ${phase.y - 47}`} stroke="#3B82F6" strokeWidth="2" fill="none" />
                  </>
                )}
                {phase.id === 8 && (
                  <>
                    <text x={phase.x + 50} y={phase.y - 167} textAnchor="start" fill="#3B82F6" fontSize="12" fontWeight="bold">PROCESS</text>
                    <foreignObject x={phase.x + 50} y={phase.y - 160} width="240" height="80">
                      <div className="text-left text-sm text-blue-600 leading-relaxed p-3 bg-blue-50 rounded border border-blue-200 break-words shadow-sm">{phase.process}</div>
                    </foreignObject>
                    <path d={`M ${phase.x} ${phase.y - 40} L ${phase.x} ${phase.y - 80} L ${phase.x + 20} ${phase.y - 80} L ${phase.x + 20} ${phase.y - 120} L ${phase.x + 50} ${phase.y - 120}`} stroke="#3B82F6" strokeWidth="2" fill="none" />
                  </>
                )}

                {/* Input Box - BOTTOM */}
                <text x={phase.x - 140} y={phase.y + 93} textAnchor="start" fill="#10B981" fontSize="12" fontWeight="bold">INPUT</text>
                <foreignObject x={phase.x - 120} y={phase.y + 100} width="240" height="100">
                  <div className="text-left text-sm text-green-600 leading-relaxed p-3 bg-green-50 rounded border border-green-200 break-words shadow-sm">
                    {phase.inputs.join(', ')}
                  </div>
                </foreignObject>
                <path d={`M ${phase.x} ${phase.y + 40} L ${phase.x} ${phase.y + 80} L ${phase.x - 20} ${phase.y + 80} L ${phase.x - 20} ${phase.y + 150} L ${phase.x - 120} ${phase.y + 150}`} stroke="#10B981" strokeWidth="2" fill="none" />

                {/* Output Box - BOTTOM RIGHT */}
                {phase.id === 6 && (
                  <>
                    <text x={phase.x - 140} y={phase.y + 227} textAnchor="start" fill="#F59E0B" fontSize="12" fontWeight="bold">OUTPUT</text>
                    <foreignObject x={phase.x - 120} y={phase.y + 234} width="240" height="100">
                      <div className="text-left text-sm text-yellow-600 leading-relaxed p-3 bg-yellow-50 rounded border border-yellow-200 break-words shadow-sm">
                        {phase.outputs.join(', ')}
                      </div>
                    </foreignObject>
                    <path d={`M ${phase.x} ${phase.y + 40} L ${phase.x} ${phase.y + 80} L ${phase.x - 20} ${phase.y + 80} L ${phase.x - 20} ${phase.y + 284} L ${phase.x - 120} ${phase.y + 284}`} stroke="#F59E0B" strokeWidth="2" fill="none" />
                  </>
                )}
                {phase.id === 7 && (
                  <>
                    <text x={phase.x - 140} y={phase.y + 227} textAnchor="start" fill="#F59E0B" fontSize="12" fontWeight="bold">OUTPUT</text>
                    <foreignObject x={phase.x - 120} y={phase.y + 234} width="240" height="100">
                      <div className="text-left text-sm text-yellow-600 leading-relaxed p-3 bg-yellow-50 rounded border border-yellow-200 break-words shadow-sm">
                        {phase.outputs.join(', ')}
                      </div>
                    </foreignObject>
                    <path d={`M ${phase.x} ${phase.y + 40} L ${phase.x} ${phase.y + 80} L ${phase.x - 20} ${phase.y + 80} L ${phase.x - 20} ${phase.y + 284} L ${phase.x - 120} ${phase.y + 284}`} stroke="#F59E0B" strokeWidth="2" fill="none" />
                  </>
                )}
                {phase.id !== 6 && phase.id !== 7 && (
                  <>
                    <text x={phase.x + 50} y={phase.y + 160} textAnchor="start" fill="#F59E0B" fontSize="12" fontWeight="bold">OUTPUT</text>
                    <foreignObject x={phase.x + 50} y={phase.y + 167} width="240" height="100">
                      <div className="text-left text-sm text-yellow-600 leading-relaxed p-3 bg-yellow-50 rounded border border-yellow-200 break-words shadow-sm">
                        {phase.outputs.join(', ')}
                      </div>
                    </foreignObject>
                    <path d={`M ${phase.x} ${phase.y + 40} L ${phase.x} ${phase.y + 80} L ${phase.x + 20} ${phase.y + 80} L ${phase.x + 20} ${phase.y + 217} L ${phase.x + 50} ${phase.y + 217}`} stroke="#F59E0B" strokeWidth="2" fill="none" />
                  </>
                )}

                {/* Phase Circle */}
                <circle 
                  cx={phase.x} 
                  cy={phase.y} 
                  r="40" 
                  fill={`url(#gradient${phase.id})`}
                  stroke="#fff" 
                  strokeWidth="3"
                  className="drop-shadow-lg"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handlePhaseClick(phase.id)}
                />
                
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id={`gradient${phase.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={
                      phase.gradient.includes('blue-500') ? '#3B82F6' : 
                      phase.gradient.includes('blue-600') ? '#2563EB' :
                      phase.gradient.includes('teal-500') ? '#14B8A6' :
                      phase.gradient.includes('green-500') ? '#10B981' :
                      phase.gradient.includes('green-600') ? '#059669' :
                      phase.gradient.includes('emerald-500') ? '#10B981' :
                      phase.gradient.includes('teal-600') ? '#0D9488' :
                      phase.gradient.includes('indigo-600') ? '#4F46E5' : '#3B82F6'
                    } />
                    <stop offset="100%" stopColor={
                      phase.gradient.includes('blue-600') ? '#2563EB' :
                      phase.gradient.includes('teal-500') ? '#14B8A6' :
                      phase.gradient.includes('green-500') ? '#10B981' :
                      phase.gradient.includes('green-600') ? '#059669' :
                      phase.gradient.includes('emerald-500') ? '#10B981' :
                      phase.gradient.includes('teal-600') ? '#0D9488' :
                      phase.gradient.includes('blue-500') ? '#3B82F6' :
                      phase.gradient.includes('indigo-600') ? '#4F46E5' : '#2563EB'
                    } />
                  </linearGradient>
                </defs>
                
                {/* Phase Number */}
                <text 
                  x={phase.x} 
                  y={phase.y + 5} 
                  textAnchor="middle" 
                  fill="white" 
                  fontSize="18" 
                  fontWeight="bold"
                >
                  {phase.id}
                </text>
                
                {/* Phase Name */}
                <text 
                  x={phase.x} 
                  y={phase.y + 60} 
                  textAnchor="middle" 
                  fill="#374151" 
                  fontSize="14" 
                  fontWeight="bold"
                >
                  {phase.name}
                </text>

                {/* Connecting Arrows */}
                {index < phaseData.length - 1 && (
                  <path 
                    d={`M ${phase.x + 40} ${phase.y} L ${phaseData[index + 1].x - 40} ${phaseData[index + 1].y}`}
                    stroke="#6B7280" 
                    strokeWidth="2" 
                    fill="none" 
                    markerEnd="url(#arrowhead)"
                  />
                )}
              </g>
            ))}

            {/* Special Elements */}
            {specialElements.map((element) => (
              <g key={element.id}>
                <rect
                  x={element.x - 60}
                  y={element.y - 20}
                  width="120"
                  height="40"
                  fill={`url(#${element.id}Gradient)`}
                  stroke="#fff"
                  strokeWidth="2"
                  rx="20"
                  className="drop-shadow-lg"
                />
                <defs>
                  <linearGradient id={`${element.id}Gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={element.color.includes('green') ? '#10B981' : '#3B82F6'} />
                    <stop offset="100%" stopColor={element.color.includes('green') ? '#059669' : '#2563EB'} />
                  </linearGradient>
                </defs>
                <text
                  x={element.x}
                  y={element.y + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {element.name}
                </text>
              </g>
            ))}

            {/* Exception States */}
            {exceptionStates.map((exception) => (
              <g key={exception.id}>
                <circle
                  cx={exception.x}
                  cy={exception.y}
                  r="30"
                  fill={`url(#${exception.id}Gradient)`}
                  stroke="#fff"
                  strokeWidth="2"
                  className="drop-shadow-lg"
                />
                <defs>
                  <linearGradient id={`${exception.id}Gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={exception.color.includes('red') ? '#EF4444' : '#F97316'} />
                    <stop offset="100%" stopColor={exception.color.includes('red') ? '#DC2626' : '#EA580C'} />
                  </linearGradient>
                </defs>
                <text
                  x={exception.x}
                  y={exception.y + 3}
                  textAnchor="middle"
                  fill="white"
                  fontSize="10"
                  fontWeight="bold"
                >
                  {exception.name}
                </text>
                
                {/* Dotted connections to relevant phases */}
                {exception.id === 'dropped' && (
                  <>
                    <path d={`M 500 440 L 500 600 L ${exception.x} 600 L ${exception.x} 770`} stroke="#EF4444" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                    <path d={`M 800 440 L 800 600 L ${exception.x} 600 L ${exception.x} 770`} stroke="#EF4444" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                  </>
                )}
                {exception.id === 'on-hold' && (
                  <>
                    <path d={`M 1100 440 L 1100 600 L ${exception.x} 600 L ${exception.x} 770`} stroke="#F97316" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                    <path d={`M 1400 440 L 1400 600 L ${exception.x} 600 L ${exception.x} 770`} stroke="#F97316" strokeWidth="2" strokeDasharray="5,5" fill="none" />
                  </>
                )}
              </g>
            ))}

            {/* Feedback Arrow from QA (Phase 6) to Development (Phase 5) */}
            <path 
              d="M 1660 360 Q 1550 320 1440 360" 
              stroke="#EF4444" 
              strokeWidth="2" 
              fill="none" 
              markerEnd="url(#feedbackArrow)"
            />

            {/* Reiterate Notes */}
            <text x="1550" y="320" textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold">
              Reiterate until Approved
            </text>
            <text x="1550" y="335" textAnchor="middle" fill="#EF4444" fontSize="9">
              (feedback loop with QA phase)
            </text>

            {/* Connecting lines from special elements */}
            <path d="M 650 240 L 650 360" stroke="#10B981" strokeWidth="2" strokeDasharray="3,3" fill="none" />
            <path d="M 2150 190 L 2150 360" stroke="#06B6D4" strokeWidth="2" strokeDasharray="3,3" fill="none" />
            <path d="M 2150 290 L 2150 360" stroke="#3B82F6" strokeWidth="2" strokeDasharray="3,3" fill="none" />
          </svg>
        </div>
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
            📊 Complete horizontal process flow • 🔄 Red arrow shows feedback loop between QA and Development • ⚠️ Exception states show project alternatives
          </p>
          <p className="text-xs text-gray-500">
            All 8 phases displayed in a single continuous horizontal row with comprehensive information boxes and special elements
          </p>
        </div>
      </div>
    </div>
  );
};

export default HorizontalProcessPage;