import React, { useState } from 'react';
import { BookOpen, Search, Clock, Users, CheckCircle, ArrowRight, FileText, Shield, Target, Building, GitBranch, AlertTriangle, Info } from 'lucide-react';
import { v25 } from '../data/lifecycleDataV25Details';

interface UnifiedPhase {
  id: string;
  conceptualName: string;
  description: string;
  icon: string;
  duration: string;
  tracks: {
    enterprise?: {
      phaseId: string;
      name: string;
      owner: string;
      processFocus: string;
      inputs: string[];
      outputs: string[];
      keyTasks: string[];
      gateCriteria: string[];
      raciMatrix: { role: string; description: string; }[];
    };
    product?: {
      phaseId: string;
      name: string;
      owner: string;
      processFocus: string;
      inputs: string[];
      outputs: string[];
      keyTasks: string[];
      gateCriteria: string[];
      raciMatrix: { role: string; description: string; }[];
    };
    common?: {
      phaseId: string;
      name: string;
      owner: string;
      processFocus: string;
      inputs: string[];
      outputs: string[];
      keyTasks: string[];
      gateCriteria: string[];
      raciMatrix: { role: string; description: string; }[];
    };
  };
  specialNotes?: string[];
}

const SDLCProcessPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Create unified phase structure that combines both tracks
  const unifiedPhases: UnifiedPhase[] = [
    {
      id: 'discovery',
      conceptualName: 'Discovery',
      description: 'Initial project scope identification and stakeholder alignment',
      icon: '🔍',
      duration: '1-2 weeks',
      tracks: {
        common: {
          phaseId: '0',
          name: v25['0'].name,
          owner: v25['0'].details.owner,
          processFocus: v25['0'].details.processFocus,
          inputs: v25['0'].details.inputs,
          outputs: v25['0'].details.outputs,
          keyTasks: v25['0'].details.keyTasks,
          gateCriteria: v25['0'].details.phaseGateCriteria,
          raciMatrix: v25['0'].details.raciMatrix
        }
      }
    },
    {
      id: 'initiation',
      conceptualName: 'Initiation',
      description: 'Formal project kickoff and resource allocation',
      icon: '🚀',
      duration: '1-2 weeks',
      tracks: {
        common: {
          phaseId: '1',
          name: v25['1'].name,
          owner: v25['1'].details.owner,
          processFocus: v25['1'].details.processFocus,
          inputs: v25['1'].details.inputs,
          outputs: v25['1'].details.outputs,
          keyTasks: v25['1'].details.keyTasks,
          gateCriteria: v25['1'].details.phaseGateCriteria,
          raciMatrix: v25['1'].details.raciMatrix
        }
      }
    },
    {
      id: 'requirements',
      conceptualName: 'Requirements Gathering',
      description: 'Comprehensive requirements analysis and documentation - varies by track complexity',
      icon: '📋',
      duration: '1-3 weeks',
      tracks: {
        enterprise: {
          phaseId: 'E2',
          name: v25['E2'].name,
          owner: v25['E2'].details.owner,
          processFocus: v25['E2'].details.processFocus,
          inputs: v25['E2'].details.inputs,
          outputs: v25['E2'].details.outputs,
          keyTasks: v25['E2'].details.keyTasks,
          gateCriteria: v25['E2'].details.phaseGateCriteria,
          raciMatrix: v25['E2'].details.raciMatrix
        },
        product: {
          phaseId: 'P2',
          name: v25['P2'].name,
          owner: v25['P2'].details.owner,
          processFocus: v25['P2'].details.processFocus,
          inputs: v25['P2'].details.inputs,
          outputs: v25['P2'].details.outputs,
          keyTasks: v25['P2'].details.keyTasks,
          gateCriteria: v25['P2'].details.phaseGateCriteria,
          raciMatrix: v25['P2'].details.raciMatrix
        }
      },
      specialNotes: [
        'Enterprise Track: Focuses on detailed business requirements documentation (BRD)',
        'Product Track: Emphasizes user stories and product requirements'
      ]
    },
    {
      id: 'review-design',
      conceptualName: 'Review & Design',
      description: 'Business validation and design activities - track-specific approaches',
      icon: '✅',
      duration: '1-3 weeks',
      tracks: {
        enterprise: {
          phaseId: 'E3',
          name: v25['E3'].name,
          owner: v25['E3'].details.owner,
          processFocus: v25['E3'].details.processFocus,
          inputs: v25['E3'].details.inputs,
          outputs: v25['E3'].details.outputs,
          keyTasks: v25['E3'].details.keyTasks,
          gateCriteria: v25['E3'].details.phaseGateCriteria,
          raciMatrix: v25['E3'].details.raciMatrix
        },
        product: {
          phaseId: 'P3',
          name: v25['P3'].name,
          owner: v25['P3'].details.owner,
          processFocus: v25['P3'].details.processFocus,
          inputs: v25['P3'].details.inputs,
          outputs: v25['P3'].details.outputs,
          keyTasks: v25['P3'].details.keyTasks,
          gateCriteria: v25['P3'].details.phaseGateCriteria,
          raciMatrix: v25['P3'].details.raciMatrix
        }
      },
      specialNotes: [
        'Enterprise Track: Business Review focuses on formal approval and validation',
        'Product Track: Design focuses on UX/UI development and prototyping'
      ]
    },
    {
      id: 'planning',
      conceptualName: 'Planning & Preparation',
      description: 'Project planning, resource allocation, and preparation activities',
      icon: '📅',
      duration: '1-3 weeks',
      tracks: {
        enterprise: {
          phaseId: 'E4',
          name: v25['E4'].name,
          owner: v25['E4'].details.owner,
          processFocus: v25['E4'].details.processFocus,
          inputs: v25['E4'].details.inputs,
          outputs: v25['E4'].details.outputs,
          keyTasks: v25['E4'].details.keyTasks,
          gateCriteria: v25['E4'].details.phaseGateCriteria,
          raciMatrix: v25['E4'].details.raciMatrix
        },
        product: {
          phaseId: 'P4',
          name: v25['P4'].name,
          owner: v25['P4'].details.owner,
          processFocus: v25['P4'].details.processFocus,
          inputs: v25['P4'].details.inputs,
          outputs: v25['P4'].details.outputs,
          keyTasks: v25['P4'].details.keyTasks,
          gateCriteria: v25['P4'].details.phaseGateCriteria,
          raciMatrix: v25['P4'].details.raciMatrix
        }
      },
      specialNotes: [
        'Enterprise Track: Comprehensive planning with early QA test case development',
        'Product Track: Backlog grooming and sprint preparation'
      ]
    },
    {
      id: 'architecture',
      conceptualName: 'Solution Architecture',
      description: 'Technical architecture decisions and system design alignment',
      icon: '🏗️',
      duration: '1-2 weeks',
      tracks: {
        common: {
          phaseId: 'SA',
          name: v25['SA'].name,
          owner: v25['SA'].details.owner,
          processFocus: v25['SA'].details.processFocus,
          inputs: v25['SA'].details.inputs,
          outputs: v25['SA'].details.outputs,
          keyTasks: v25['SA'].details.keyTasks,
          gateCriteria: v25['SA'].details.phaseGateCriteria,
          raciMatrix: v25['SA'].details.raciMatrix
        }
      }
    },
    {
      id: 'development',
      conceptualName: 'Development',
      description: 'Solution development and implementation',
      icon: '💻',
      duration: '2-6 weeks',
      tracks: {
        common: {
          phaseId: '5',
          name: v25['5'].name,
          owner: v25['5'].details.owner,
          processFocus: v25['5'].details.processFocus,
          inputs: v25['5'].details.inputs,
          outputs: v25['5'].details.outputs,
          keyTasks: v25['5'].details.keyTasks,
          gateCriteria: v25['5'].details.phaseGateCriteria,
          raciMatrix: v25['5'].details.raciMatrix
        }
      }
    },
    {
      id: 'testing',
      conceptualName: 'Quality Assurance Testing',
      description: 'Comprehensive testing and quality validation (parallel with development)',
      icon: '🧪',
      duration: '2-6 weeks',
      tracks: {
        common: {
          phaseId: '5.1',
          name: v25['5.1'].name,
          owner: v25['5.1'].details.owner,
          processFocus: v25['5.1'].details.processFocus,
          inputs: v25['5.1'].details.inputs,
          outputs: v25['5.1'].details.outputs,
          keyTasks: v25['5.1'].details.keyTasks,
          gateCriteria: v25['5.1'].details.phaseGateCriteria,
          raciMatrix: v25['5.1'].details.raciMatrix
        }
      }
    },
    {
      id: 'acceptance',
      conceptualName: 'Business/Product Acceptance',
      description: 'Final validation and acceptance by business and product stakeholders',
      icon: '👥',
      duration: '1-2 weeks',
      tracks: {
        common: {
          phaseId: '6',
          name: v25['6'].name,
          owner: v25['6'].details.owner,
          processFocus: v25['6'].details.processFocus,
          inputs: v25['6'].details.inputs,
          outputs: v25['6'].details.outputs,
          keyTasks: v25['6'].details.keyTasks,
          gateCriteria: v25['6'].details.phaseGateCriteria,
          raciMatrix: v25['6'].details.raciMatrix
        }
      }
    },
    {
      id: 'release',
      conceptualName: 'Release Management',
      description: 'Production deployment and release coordination',
      icon: '🚀',
      duration: '1-2 weeks',
      tracks: {
        common: {
          phaseId: '7',
          name: v25['7'].name,
          owner: v25['7'].details.owner,
          processFocus: v25['7'].details.processFocus,
          inputs: v25['7'].details.inputs,
          outputs: v25['7'].details.outputs,
          keyTasks: v25['7'].details.keyTasks,
          gateCriteria: v25['7'].details.phaseGateCriteria,
          raciMatrix: v25['7'].details.raciMatrix
        }
      }
    },
    {
      id: 'post-implementation',
      conceptualName: 'Post Implementation',
      description: 'System stabilization and performance measurement',
      icon: '📊',
      duration: '1 week',
      tracks: {
        common: {
          phaseId: '8',
          name: v25['8'].name,
          owner: v25['8'].details.owner,
          processFocus: v25['8'].details.processFocus,
          inputs: v25['8'].details.inputs,
          outputs: v25['8'].details.outputs,
          keyTasks: v25['8'].details.keyTasks,
          gateCriteria: v25['8'].details.phaseGateCriteria,
          raciMatrix: v25['8'].details.raciMatrix
        }
      }
    },
    {
      id: 'closure',
      conceptualName: 'Project Closure',
      description: 'Project closure, lessons learned, and knowledge transfer',
      icon: '🎯',
      duration: '1 week',
      tracks: {
        common: {
          phaseId: '9',
          name: v25['9'].name,
          owner: v25['9'].details.owner,
          processFocus: v25['9'].details.processFocus,
          inputs: v25['9'].details.inputs,
          outputs: v25['9'].details.outputs,
          keyTasks: v25['9'].details.keyTasks,
          gateCriteria: v25['9'].details.phaseGateCriteria,
          raciMatrix: v25['9'].details.raciMatrix
        }
      }
    }
  ];

  // Filter phases based on search term
  const filteredPhases = unifiedPhases.filter(phase => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    
    // Search in conceptual phase info
    const conceptualMatch = (
      phase.conceptualName.toLowerCase().includes(searchLower) ||
      phase.description.toLowerCase().includes(searchLower)
    );
    
    // Search in track-specific details
    const trackMatch = Object.values(phase.tracks).some(track => {
      if (!track) return false;
      return (
        track.name.toLowerCase().includes(searchLower) ||
        track.processFocus.toLowerCase().includes(searchLower) ||
        track.keyTasks.some(task => task.toLowerCase().includes(searchLower)) ||
        track.inputs.some(input => input.toLowerCase().includes(searchLower)) ||
        track.outputs.some(output => output.toLowerCase().includes(searchLower)) ||
        track.raciMatrix.some(raci => 
          raci.role.toLowerCase().includes(searchLower) || 
          raci.description.toLowerCase().includes(searchLower)
        )
      );
    });
    
    return conceptualMatch || trackMatch;
  });

  const renderTrackDetails = (track: any, trackName: string, trackColor: string) => {
    if (!track) return null;
    
    return (
      <div className={`bg-${trackColor}-50 rounded-lg p-4 border border-${trackColor}-200 mb-4`}>
        <div className="flex items-center gap-2 mb-3">
          {trackName === 'Enterprise' ? (
            <Building className="w-4 h-4 text-amber-600" />
          ) : trackName === 'Product' ? (
            <Target className="w-4 h-4 text-green-600" />
          ) : (
            <GitBranch className="w-4 h-4 text-blue-600" />
          )}
          <h4 className={`font-bold text-${trackColor}-900 text-sm`}>
            {trackName === 'Enterprise' ? 'Enterprise Track' : trackName === 'Product' ? 'Product Track' : 'Common Process'}
          </h4>
          <span className={`text-xs px-2 py-1 bg-${trackColor}-100 text-${trackColor}-700 rounded`}>
            Phase {track.phaseId}
          </span>
        </div>
        
        {/* Process Owner */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="font-semibold text-gray-800 text-sm">Process Owner:</span>
          </div>
          <p className="text-sm text-gray-700 ml-6">{track.owner}</p>
        </div>

        {/* Process Focus */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-gray-600" />
            <span className="font-semibold text-gray-800 text-sm">Process Focus:</span>
          </div>
          <p className="text-sm text-gray-700 ml-6 leading-relaxed">{track.processFocus}</p>
        </div>

        {/* Inputs and Outputs */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ArrowRight className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-gray-800 text-sm">Inputs:</span>
            </div>
            <ul className="ml-6 space-y-1">
              {track.inputs.map((input: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700">{input}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-gray-800 text-sm">Outputs:</span>
            </div>
            <ul className="ml-6 space-y-1">
              {track.outputs.map((output: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-sm text-gray-700">{output}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Key Tasks */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-gray-800 text-sm">Key Tasks:</span>
          </div>
          <div className="ml-6 grid md:grid-cols-2 gap-2">
            {track.keyTasks.map((task: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-sm text-gray-700">{task}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gate Criteria */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-gray-800 text-sm">Gate Criteria:</span>
          </div>
          <div className="ml-6 grid md:grid-cols-2 gap-2">
            {track.gateCriteria.map((criteria: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                <span className="text-sm text-gray-700">{criteria}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RACI Matrix */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="font-semibold text-gray-800 text-sm">RACI Assignments:</span>
          </div>
          <div className="ml-6 grid md:grid-cols-2 gap-2">
            {track.raciMatrix.map((raci: any, idx: number) => (
              <div key={idx} className="bg-white rounded-lg p-2 border border-gray-200">
                <div className="font-semibold text-gray-800 text-xs">{raci.role}</div>
                <div className="text-gray-600 text-xs mt-1">{raci.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
            SDLC Process Documentation
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
          Comprehensive Software Development Life Cycle documentation presenting the unified process flow 
          with detailed step-by-step guidance for both Enterprise and Product tracks
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search phases, tasks, or deliverables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {searchTerm && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Found {filteredPhases.length} phase{filteredPhases.length !== 1 ? 's' : ''} matching "{searchTerm}"
            </p>
          </div>
        )}
      </div>

      {/* Process Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">SDLC Process Overview</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Process Flow Structure</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</div>
                <div>
                  <span className="font-semibold text-gray-800">Linear Progression:</span>
                  <p className="text-sm text-gray-600">Each phase builds upon the previous phase's deliverables</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</div>
                <div>
                  <span className="font-semibold text-gray-800">Track Variations:</span>
                  <p className="text-sm text-gray-600">Enterprise and Product tracks handle complexity differently</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</div>
                <div>
                  <span className="font-semibold text-gray-800">Convergence Points:</span>
                  <p className="text-sm text-gray-600">Both tracks converge at Solution Architecture and continue together</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</div>
                <div>
                  <span className="font-semibold text-gray-800">Quality Gates:</span>
                  <p className="text-sm text-gray-600">Each phase has defined criteria that must be met before progression</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Track Decision Logic</h3>
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Enterprise Track
                </h4>
                <p className="text-sm text-amber-700 mb-2">
                  For complex features requiring formal business analysis and approval
                </p>
                <div className="text-xs text-amber-600 font-mono bg-amber-100 px-2 py-1 rounded">
                  0→1→E2→E3→E4→SA→5→5.1→6→7→8→9
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Product Track
                </h4>
                <p className="text-sm text-green-700 mb-2">
                  For straightforward enhancements with clear product requirements
                </p>
                <div className="text-xs text-green-600 font-mono bg-green-100 px-2 py-1 rounded">
                  0→1→P2→P3→P4→SA→5→5.1→6→7→8→9
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phase Documentation */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Step-by-Step Process Documentation
        </h2>
        
        {filteredPhases.map((phase, index) => {
          const hasMultipleTracks = (phase.tracks.enterprise && phase.tracks.product);
          
          return (
            <div key={phase.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              {/* Phase Header */}
              <div className="border-l-4 border-blue-500 pl-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">{phase.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Step {index + 1}: {phase.conceptualName}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {phase.description}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        {phase.duration}
                      </div>
                      {hasMultipleTracks && (
                        <div className="flex items-center gap-1 text-blue-600 text-sm">
                          <GitBranch className="w-4 h-4" />
                          Track-specific implementation
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase Content */}
              <div className="space-y-6">
                {/* Track-specific implementations */}
                {phase.tracks.common && renderTrackDetails(phase.tracks.common, 'Common', 'blue')}
                {phase.tracks.enterprise && renderTrackDetails(phase.tracks.enterprise, 'Enterprise', 'amber')}
                {phase.tracks.product && renderTrackDetails(phase.tracks.product, 'Product', 'green')}
                
                {/* Special Notes */}
                {phase.specialNotes && (
                  <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-yellow-900 mb-2">Track Differences</h4>
                        <ul className="space-y-1">
                          {phase.specialNotes.map((note, idx) => (
                            <li key={idx} className="text-yellow-800 text-sm">• {note}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Special handling for specific phases */}
                {phase.id === 'review-design' && (
                  <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-orange-900 mb-2">Important Note</h4>
                        <p className="text-orange-800 text-sm">
                          Enterprise Track Business Review may require multiple iterations until all stakeholders 
                          provide formal approval. The process continues until consensus is reached.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {phase.id === 'acceptance' && (
                  <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-blue-900 mb-2">Definition of Done Validation</h4>
                        <p className="text-blue-800 text-sm">
                          If DoD is met but business/product requires additional features: Critical items can be 
                          discussed and accommodated in new linked tickets. Cosmetic or nice-to-have items can be 
                          rejected by QA/Engineering/Tech teams.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Process Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200 mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Process Summary</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GitBranch className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Unified Process Flow</h3>
            <p className="text-sm text-gray-600">
              Single structured approach with track-specific implementations where needed
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Quality Assurance</h3>
            <p className="text-sm text-gray-600">
              Comprehensive testing and validation processes ensure high-quality outcomes
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Governance Framework</h3>
            <p className="text-sm text-gray-600">
              Built-in governance processes identify and address risks proactively
            </p>
          </div>
        </div>
      </div>

      {/* SLA Information */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 shadow-sm mt-8">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-blue-900">Service Level Agreement (SLA)</h3>
        </div>
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <p className="text-blue-800 font-medium mb-3">
            <strong>Standard Phase Transition:</strong> 24-48 hours for moving between phases
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-yellow-800 text-sm">
              <strong>⚠️ Exemptions:</strong> Requirements and development cycles are exempted from this strict timing 
              as they depend on the feature being in use and complexity of implementation.
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2 font-medium">
            📖 Complete step-by-step process documentation • 🔍 Use search to find specific content • 📋 Each step shows track-specific implementations where applicable
          </p>
          <p className="text-xs text-gray-500">
            This unified documentation presents the complete SDLC process as a structured step-by-step flow with track-specific details
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-medium">
              📋 Unified Process Documentation: This page presents the SDLC as a cohesive step-by-step process, 
              showing how Enterprise and Product tracks handle each conceptual phase. Rather than separating tracks, 
              it demonstrates the unified flow while detailing track-specific implementations within each step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDLCProcessPage;