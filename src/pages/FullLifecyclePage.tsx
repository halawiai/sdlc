import React, { useState } from 'react';
import { User, Target, ArrowRight, ArrowLeft, CheckSquare, ChevronRight, Shield, AlertTriangle, Search, Navigation, BookOpen, Clock, Pause, TrendingUp, Users, Calendar, UserCheck, Rocket, Building, GitBranch } from 'lucide-react';
import { v25, PhaseDetails, PhaseID } from '../data/lifecycleDataV25Details';

interface FullLifecyclePhase {
  id: string;
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

const FullLifecyclePage: React.FC = () => {
  const [expandedLifecyclePhase, setExpandedLifecyclePhase] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<'enterprise' | 'product'>('enterprise');

  // Convert v25 data to FullLifecyclePhase format
  const convertV25ToFullLifecycle = (phaseIds: PhaseID[]): FullLifecyclePhase[] => {
    return phaseIds.map(phaseId => {
      const phaseData = v25[phaseId];
      return {
        id: phaseId,
        name: phaseData.name,
        owner: phaseData.details.owner,
        focus: phaseData.details.processFocus,
        input: phaseData.details.inputs,
        output: phaseData.details.outputs,
        keyTasks: phaseData.details.keyTasks,
        gateCriteria: phaseData.details.phaseGateCriteria,
        gradient: phaseData.gradient,
        raciMatrix: phaseData.details.raciMatrix
      };
    });
  };

  // Define phase sequences for each track
  const enterprisePhases: PhaseID[] = ['0', '1', 'E2', 'E3', 'E4', 'SA', '5', '5.1', '6', '7', '8', '9'];
  const productPhases: PhaseID[] = ['0', '1', 'P2', 'P3', 'P4', 'SA', '5', '5.1', '6', '7', '8', '9'];

  // Get phases for current track
  const getCurrentTrackPhases = (): FullLifecyclePhase[] => {
    const phaseIds = activeTab === 'enterprise' ? enterprisePhases : productPhases;
    return convertV25ToFullLifecycle(phaseIds);
  };

  const currentPhases = getCurrentTrackPhases();

  const exceptionPhases = [
    {
      id: 'dropped',
      name: 'DROPPED',
      description: 'Project terminated before completion, can occur at any phase, requires stakeholder approval and documentation',
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'onhold',
      name: 'ON HOLD',
      description: 'Project temporarily suspended, can occur at any phase, requires clear restart criteria and timeline',
      icon: <Pause className="w-5 h-5" />,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const filteredPhases = currentPhases.filter(phase => {
    if (searchTerm === '') return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      phase.name.toLowerCase().includes(searchLower) ||
      phase.focus.toLowerCase().includes(searchLower) ||
      phase.owner.toLowerCase().includes(searchLower) ||
      phase.keyTasks.some(task => task.toLowerCase().includes(searchLower)) ||
      phase.input.some(input => input.toLowerCase().includes(searchLower)) ||
      phase.output.some(output => output.toLowerCase().includes(searchLower)) ||
      phase.raciMatrix.some(raci => raci.role.toLowerCase().includes(searchLower) || raci.description.toLowerCase().includes(searchLower))
    );
  });

  const jumpToPhase = (phaseId: string) => {
    const element = document.getElementById(`phase-${phaseId}`);
    if (element) {
      // First, collapse any currently expanded phase to get accurate positioning
      setExpandedLifecyclePhase(null);
      
      // Use setTimeout to allow the collapse animation to complete
      setTimeout(() => {
        const headerOffset = 120; // Account for fixed headers and spacing
        const elementPosition = element.offsetTop - headerOffset;
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
        
        // Then expand the target phase after scrolling
        setTimeout(() => {
          setExpandedLifecyclePhase(phaseId);
        }, 300); // Wait for scroll to complete
      }, 100); // Wait for collapse animation
      
      // Close mobile sidebar after navigation
      setShowSidebar(false);
    }
  };

  const getTrackDescription = (track: 'enterprise' | 'product') => {
    switch (track) {
      case 'enterprise':
        return 'Comprehensive path for complex features requiring detailed business analysis, formal approval, and extensive planning';
      case 'product':
        return 'Streamlined path for straightforward enhancements with clear product requirements and simplified approval process';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar Navigation */}
      <div className={`
        fixed left-0 top-0 h-screen w-64 bg-white shadow-xl border-r border-gray-200 z-40 transform transition-transform duration-300 overflow-y-auto
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:top-0 lg:w-80 lg:shadow-none lg:border-r lg:flex-shrink-0 lg:h-screen
      `}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
              <Navigation className="w-5 h-5 text-blue-600" />
              Quick Navigation
            </h3>
            <button
              onClick={() => setShowSidebar(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search phases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="p-6">
          <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Jump to Phase</h4>
          <div className="space-y-2">
            {currentPhases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => jumpToPhase(phase.id)}
                className={`
                  w-full text-left p-3 rounded-lg transition-all duration-200 text-sm
                  ${expandedLifecyclePhase === phase.id 
                    ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500' 
                    : 'hover:bg-gray-100 text-gray-700'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-8 h-8 rounded-full bg-gradient-to-br ${phase.gradient}
                    flex items-center justify-center text-white font-bold text-xs
                  `}>
                    {phase.id}
                  </div>
                  <div>
                    <div className="font-medium">{phase.name}</div>
                    <div className="text-xs opacity-75">{phase.owner.split(' + ').slice(0, 2).join(' + ')}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Exception States</h4>
            <div className="space-y-2">
              {exceptionPhases.map((phase) => (
                <div key={phase.id} className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-8 h-8 rounded-full bg-gradient-to-br ${phase.color}
                      flex items-center justify-center text-white
                    `}>
                      {phase.icon}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{phase.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{phase.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setShowSidebar(true)}
        className="lg:hidden fixed top-4 left-4 z-30 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Navigation className="w-5 h-5" />
      </button>

      {/* Sidebar Overlay */}
      {showSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 lg:max-w-screen-xl lg:mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 min-w-0">
              Complete Project Lifecycle Reference
            </h2>
          </div>
          
          {/* Track Tabs */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('enterprise')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'enterprise'
                    ? 'bg-amber-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Building className="w-4 h-4" />
                Enterprise Track
              </button>
              <button
                onClick={() => setActiveTab('product')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'product'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Target className="w-4 h-4" />
                Product Track
              </button>
            </div>
          </div>
          
          {/* Track Description */}
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mx-auto">
              {getTrackDescription(activeTab)}
            </p>
            
            {/* Track Flow Indicators */}
            {activeTab === 'enterprise' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
                  <GitBranch className="w-3 h-3 text-amber-600" />
                  <span className="text-amber-700 font-mono">0→1→E2→E3→E4→SA→5→5.1→6→7→8→9</span>
                </div>
              </div>
            )}
            
            {activeTab === 'product' && (
              <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                  <GitBranch className="w-3 h-3 text-green-600" />
                  <span className="text-green-700 font-mono">0→1→P2→P3→P4→SA→5→5.1→6→7→8→9</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Search Results Info */}
          {searchTerm && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
              <p className="text-sm text-blue-800">
                Found {filteredPhases.length} phase{filteredPhases.length !== 1 ? 's' : ''} matching "{searchTerm}" in {activeTab} track
              </p>
            </div>
          )}
        </div>

        {/* SLA Information */}
        <div className="mb-8 bg-blue-50 rounded-xl p-6 border border-blue-200 shadow-sm">
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

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-green-500 via-emerald-500 via-teal-500 to-indigo-600 rounded-full"></div>

          {/* Phase Cards */}
          <div className="space-y-8">
            {filteredPhases.map((phase, index) => (
              <div key={phase.id} id={`phase-${phase.id}`} className="relative">
                {/* Timeline Dot */}
                <div className={`
                  absolute left-6 w-6 h-6 rounded-full bg-gradient-to-br ${phase.gradient}
                  border-4 border-white shadow-lg z-10 flex items-center justify-center
                `}>
                  <span className="text-white text-xs font-bold">{phase.id}</span>
                </div>

                {/* Phase Card */}
                <div className="ml-16 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Card Header */}
                  <div 
                    className={`
                      bg-gradient-to-r ${phase.gradient} p-6 cursor-pointer
                      hover:shadow-lg transition-all duration-300
                    `}
                    onClick={() => setExpandedLifecyclePhase(
                      expandedLifecyclePhase === phase.id ? null : phase.id
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          Phase {phase.id}: {phase.name}
                        </h3>
                        <p className="text-white/90 text-sm font-medium">
                          {phase.focus}
                        </p>
                      </div>
                      <ChevronRight 
                        className={`
                          w-6 h-6 text-white transition-transform duration-300
                          ${expandedLifecyclePhase === phase.id ? 'rotate-90' : ''}
                        `}
                      />
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <div className={`
                    transition-all duration-500 ease-in-out overflow-hidden
                    ${expandedLifecyclePhase === phase.id ? 'max-h-none opacity-100 pb-6' : 'max-h-0 opacity-0'}
                  `}>
                    {expandedLifecyclePhase === phase.id && (
                      <div className="p-6 space-y-6">
                        {/* Owner */}
                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                          <User className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <span className="font-bold text-blue-900 text-sm">Process Owner</span>
                            <p className="text-blue-800 font-medium">{phase.owner}</p>
                          </div>
                        </div>

                        {/* Process Focus */}
                        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                          <Target className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <span className="font-bold text-green-900 text-sm">Process Focus</span>
                            <p className="text-green-800 text-sm mt-1 leading-relaxed">{phase.focus}</p>
                          </div>
                        </div>

                        {/* Duration Estimate */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                          <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
                          <div>
                            <span className="font-bold text-gray-900 text-sm">Estimated Duration</span>
                            <p className="text-gray-700 text-sm mt-1">
                              {['0', '1'].includes(phase.id) ? '1-2 weeks' : 
                               ['E2', 'E3', 'E4', 'P2', 'P3', 'P4', 'SA'].includes(phase.id) ? '1-3 weeks' : 
                               ['5', '5.1'].includes(phase.id) ? '2-6 weeks' : 
                               ['6', '7'].includes(phase.id) ? '1-2 weeks' : '1 week'}
                            </p>
                          </div>
                        </div>

                        {/* Inputs and Outputs */}
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-center gap-2 mb-3">
                              <ArrowRight className="w-5 h-5 text-orange-600" />
                              <span className="font-bold text-orange-900">Inputs</span>
                            </div>
                            <ul className="text-sm text-orange-800 space-y-2">
                              {phase.input.map((input, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                  {input}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center gap-2 mb-3">
                              <ArrowLeft className="w-5 h-5 text-purple-600" />
                              <span className="font-bold text-purple-900">Outputs</span>
                            </div>
                            <ul className="text-sm text-purple-800 space-y-2">
                              {phase.output.map((output, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                                  {output}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Key Tasks */}
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-3">
                            <CheckSquare className="w-5 h-5 text-green-600" />
                            <span className="font-bold text-green-900">Key Tasks</span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            {phase.keyTasks.map((task, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span className="text-sm text-green-800">{task}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Gate Criteria */}
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                          <div className="flex items-center gap-2 mb-3">
                            <Shield className="w-5 h-5 text-indigo-600" />
                            <span className="font-bold text-indigo-900">Gate Criteria</span>
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            {phase.gateCriteria.map((criteria, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span className="text-sm text-indigo-800">{criteria}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* RACI Matrix */}
                        {phase.raciMatrix && phase.raciMatrix.length > 0 && (
                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <div className="flex items-center gap-2 mb-3">
                              <UserCheck className="w-5 h-5 text-purple-600" />
                              <span className="font-bold text-purple-900">RACI Matrix</span>
                            </div>
                            <div className="grid md:grid-cols-2 gap-3">
                              {phase.raciMatrix.map((raci, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                                  <span className="text-sm text-purple-800">
                                    <span className="font-semibold">{raci.role}:</span> {raci.description}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Exception States */}
        <div className="mt-16 pt-8 border-t-2 border-gray-200">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 text-center mb-6 tracking-wide">
            Exception States
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {exceptionPhases.map((phase) => (
              <div key={phase.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`
                    w-12 h-12 rounded-full bg-gradient-to-br ${phase.color}
                    flex items-center justify-center text-white shadow-lg
                  `}>
                    {phase.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{phase.name}</h3>
                    <p className="text-sm text-gray-600">Exception State</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-600 mb-2 font-medium">
              🖱️ Click on any phase header to expand detailed information • 🔍 Use search to find specific content • 📋 Use sidebar navigation to jump between phases • 🔄 Switch between Enterprise and Product tracks
            </p>
            <p className="text-xs text-gray-500">
              This reference document provides complete PMO lifecycle guidance for both Enterprise and Product process tracks
            </p>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-800 font-medium">
                📋 Track Reference: This comprehensive timeline provides complete reference information for both process tracks. 
                <strong>Enterprise Track</strong> includes detailed business analysis phases (E2→E3→E4), while 
                <strong>Product Track</strong> follows a streamlined approach (P2→P3→P4). Both tracks converge at Solution Architecture (SA) 
                before proceeding through the same development and deployment phases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullLifecyclePage;