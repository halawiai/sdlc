import React, { useState } from 'react';
import { Grid, Filter, Download, Search, Info, Users, Target, Building, Palette, Code, TestTube, Briefcase, BarChart3, UserCheck, GitBranch, Layers } from 'lucide-react';
import { v25, PhaseDetails, PhaseID } from '../data/lifecycleDataV25Details';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

interface RACIAssignment {
  phase: string;
  phaseId: PhaseID;
  PMO: string;
  Product: string;
  Business: string;
  BA: string;
  Design: string;
  Engineering: string;
  QA: string;
  ApplicationSupport: string;
}

interface RoleInfo {
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const RACIMatrixPage: React.FC = () => {
  const [selectedCell, setSelectedCell] = useState<{ phase: number; role: string } | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLegend, setShowLegend] = useState(true);
  const [raciFilter, setRaciFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'enterprise' | 'product'>('enterprise');

  // Generate RACI data from lifecycle phases
  const generateRACIData = (): RACIAssignment[] => {
    return (Object.keys(v25) as PhaseID[]).map(phaseId => {
      const phaseData = v25[phaseId];
      const raciAssignment: RACIAssignment = {
        phase: phaseData.name,
        phaseId: phaseId,
        PMO: 'I',
        Product: 'I',
        Business: 'I',
        BA: 'I',
        Design: 'I',
        Engineering: 'I',
        QA: 'I',
        ApplicationSupport: 'I'
      };

      // Extract RACI assignments from phase data
      phaseData.details.raciMatrix.forEach(raci => {
        const role = raci.role;
        const description = raci.description.toLowerCase();
        
        let assignment = 'I'; // Default to Informed
        if (description.includes('responsible')) assignment = 'R';
        else if (description.includes('accountable')) assignment = 'A';
        else if (description.includes('consulted')) assignment = 'C';
        
        // Map role names to RACI matrix columns
        switch (role) {
          case 'PMO':
            raciAssignment.PMO = assignment;
            break;
          case 'Product':
            raciAssignment.Product = assignment;
            break;
          case 'Business':
            raciAssignment.Business = assignment;
            break;
          case 'BA':
            raciAssignment.BA = assignment;
            break;
          case 'Design':
            raciAssignment.Design = assignment;
            break;
          case 'Engineering':
            raciAssignment.Engineering = assignment;
            break;
          case 'QA':
            raciAssignment.QA = assignment;
            break;
          case 'Application Support':
            raciAssignment.ApplicationSupport = assignment;
            break;
        }
      });

      return raciAssignment;
    });
  };

  const raciData = generateRACIData();

  // Filter data based on active tab
  const getFilteredDataByTrack = () => {
    if (activeTab === 'enterprise') {
      // Enterprise Track: 0 → 1 → E2 → E3 → E4 → 5 → 5.1 → 6 → 7 → 8 → 9
      const enterprisePhases = ['0', '1', 'E2', 'E3', 'E4', '5', '5.1', '6', '7', '8', '9'];
      const filteredData = raciData.filter(row => enterprisePhases.includes(row.phaseId));
      // Sort by the correct order
      return filteredData.sort((a, b) => {
        const aIndex = enterprisePhases.indexOf(a.phaseId);
        const bIndex = enterprisePhases.indexOf(b.phaseId);
        return aIndex - bIndex;
      });
    } else if (activeTab === 'product') {
      // Product Track: 0 → 1 → P2 → P3 → P4 → 5 → 5.1 → 6 → 7 → 8 → 9
      const productPhases = ['0', '1', 'P2', 'P3', 'P4', '5', '5.1', '6', '7', '8', '9'];
      const filteredData = raciData.filter(row => productPhases.includes(row.phaseId));
      // Sort by the correct order
      return filteredData.sort((a, b) => {
        const aIndex = productPhases.indexOf(a.phaseId);
        const bIndex = productPhases.indexOf(b.phaseId);
        return aIndex - bIndex;
      });
    }
    // Default to enterprise track
    const enterprisePhases = ['0', '1', 'E2', 'E3', 'E4', '5', '5.1', '6', '7', '8', '9'];
    const filteredData = raciData.filter(row => enterprisePhases.includes(row.phaseId));
    return filteredData.sort((a, b) => {
      const aIndex = enterprisePhases.indexOf(a.phaseId);
      const bIndex = enterprisePhases.indexOf(b.phaseId);
      return aIndex - bIndex;
    });
  };

  const trackFilteredData = getFilteredDataByTrack();

  const roles: RoleInfo[] = [
    {
      name: 'PMO',
      icon: <Briefcase className="w-4 h-4" />,
      color: 'text-blue-600',
      description: 'Project Management Office - Oversees project governance and standards'
    },
    {
      name: 'Product',
      icon: <Target className="w-4 h-4" />,
      color: 'text-green-600',
      description: 'Product Management - Defines product strategy and requirements'
    },
    {
      name: 'Business',
      icon: <Building className="w-4 h-4" />,
      color: 'text-indigo-600',
      description: 'Business Stakeholders - Provide requirements and approval'
    },
    {
      name: 'BA',
      icon: <Users className="w-4 h-4" />,
      color: 'text-purple-600',
      description: 'Business Analyst - Gathers and analyzes business requirements'
    },
    {
      name: 'Design',
      icon: <Palette className="w-4 h-4" />,
      color: 'text-pink-600',
      description: 'Design Team - Creates user experience and interface designs'
    },
    {
      name: 'Engineering',
      icon: <Code className="w-4 h-4" />,
      color: 'text-orange-600',
      description: 'Development Team - Builds and implements technical solutions'
    },
    {
      name: 'QA',
      icon: <TestTube className="w-4 h-4" />,
      color: 'text-red-600',
      description: 'Quality Assurance - Tests and validates solution quality'
    },
    {
      name: 'Application Support',
      icon: <UserCheck className="w-4 h-4" />,
      color: 'text-cyan-600',
      description: 'Application Support - Provides ongoing technical assistance and incident resolution post-implementation'
    }
  ];

  const raciLegend = [
    { code: 'R', label: 'Responsible', description: 'Does the work', bgColor: 'bg-blue-100', textColor: 'text-blue-800', borderColor: 'border-blue-300' },
    { code: 'A', label: 'Accountable', description: 'Ultimately answerable', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', borderColor: 'border-yellow-300' },
    { code: 'C', label: 'Consulted', description: 'Provides input', bgColor: 'bg-green-100', textColor: 'text-green-800', borderColor: 'border-green-300' },
    { code: 'I', label: 'Informed', description: 'Kept updated', bgColor: 'bg-gray-100', textColor: 'text-gray-800', borderColor: 'border-gray-300' }
  ];

  const getRACIStyle = (value: string) => {
    const cleanValue = value.replace('*', '');
    switch (cleanValue) {
      case 'R': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'A': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'C': return 'bg-green-100 text-green-800 border-green-300';
      case 'I': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-white text-gray-500 border-gray-200';
    }
  };

  const getRoleDescription = (phase: number, role: string, raciCode: string) => {
    // Find the phase data by index in the filtered data
    const phaseData = filteredData[phase - 1];
    if (!phaseData || !phaseData.phaseId) {
      return `${raciCode} role in ${role} for this phase`;
    }
    
    const phaseId = phaseData.phaseId;
    if (!phaseId || !v25[phaseId]) {
      return `${raciCode} role in ${role} for phase ${phaseId}`;
    }
    
    const phaseRaciMatrix = v25[phaseId].details.raciMatrix;
    const roleEntry = phaseRaciMatrix.find(entry => entry.role === role);
    
    return roleEntry ? roleEntry.description : `${raciCode} role in ${role} for phase ${phaseId}`;
  };

  const filteredData = trackFilteredData.filter(row => {
    const matchesSearch = searchTerm === '' || 
      row.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(row).some(val => val.toString().toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterRole === 'all' || 
      (row as any)[filterRole] !== undefined;
    
    const matchesRACIFilter = raciFilter === 'all' || 
      Object.values(row).some(val => val.toString().includes(raciFilter));
    
    return matchesSearch && matchesFilter && matchesRACIFilter;
  });

  const getStatistics = () => {
    const stats: { [key: string]: number } = { R: 0, A: 0, C: 0, I: 0 };
    trackFilteredData.forEach(row => {
      Object.keys(row).forEach(key => {
        if (key !== 'phase' && key !== 'phaseNumber') {
          const value = (row as any)[key].replace('*', '');
          if (stats[value] !== undefined) {
            stats[value]++;
          }
        }
      });
    });
    return stats;
  };

  const statistics = getStatistics();

  const exportToPDF = () => {
    import('../utils/exportUtils').then(({ exportToPDF }) => {
      exportToPDF('root', 'raci-matrix');
    });
  };

  const exportToExcel = () => {
    const excelData = filteredData.map(row => ({
      Phase: row.phase,
      'Phase ID': row.phaseId,
      PMO: row.PMO,
      Product: row.Product,
      Business: row.Business,
      BA: row.BA,
      Design: row.Design,
      Engineering: row.Engineering,
      QA: row.QA,
      'Application Support': row.ApplicationSupport
    }));
    
    import('../utils/exportUtils').then(({ exportToExcel }) => {
      exportToExcel(excelData, `raci-matrix-${activeTab}`);
    });
  };

  const jumpToPhase = (phaseNumber: number) => {
    const element = document.getElementById(`phase-${phaseNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const getTrackDescription = (track: 'product' | 'enterprise') => {
    switch (track) {
      case 'enterprise':
        return 'Comprehensive path for complex features requiring detailed business analysis and formal approval';
      case 'product':
        return 'Simplified path for straightforward enhancements and features with clear product requirements';
    }
  };
  return (
    <div className="max-w-screen-2xl mx-auto p-6">
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Grid className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
            RACI Matrix
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
          Responsibility assignment matrix showing roles and accountability across different process tracks
        </p>
      </div>

      {/* Track Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
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
        <div className="text-center">
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl mx-auto">
            {getTrackDescription(activeTab)}
          </p>
          
          {/* Track Flow Indicators */}
          {activeTab === 'product' && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <div className="flex items-center gap-1 bg-green-100 px-3 py-1 rounded-full">
                <GitBranch className="w-3 h-3 text-green-600" />
                <span className="text-green-700 font-mono">0→1→P2→P3→P4→5→5.1→6→7→8→9</span>
              </div>
            </div>
          )}
          
          {activeTab === 'enterprise' && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <div className="flex items-center gap-1 bg-amber-100 px-3 py-1 rounded-full">
                <GitBranch className="w-3 h-3 text-amber-600" />
                <span className="text-amber-700 font-mono">0→1→E2→E3→E4→5→5.1→6→7→8→9</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <span className="text-sm font-medium text-gray-700 mr-2">Jump to Phase:</span>
        {filteredData.map((row, index) => (
          <button
            key={row.phaseId}
            onClick={() => jumpToPhase(index + 1)}
            className="px-3 py-1 text-xs font-bold bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
          >
            {row.phaseId}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search phases or roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {roles.map((role) => (
                <option key={role.name} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* RACI Filter */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">RACI:</span>
            <select
              value={raciFilter}
              onChange={(e) => setRaciFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="R">Responsible</option>
              <option value="A">Accountable</option>
              <option value="C">Consulted</option>
              <option value="I">Informed</option>
            </select>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2">
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
          </div>

          {/* Legend Toggle */}
          <button
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Info className="w-4 h-4" />
            {showLegend ? 'Hide' : 'Show'} Legend
          </button>
        </div>
      </div>

      {/* RACI Legend */}
      {showLegend && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">RACI Legend</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {raciLegend.map((item) => (
              <div key={item.code} className={`p-4 rounded-lg border-2 ${item.bgColor} ${item.borderColor}`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-full ${item.bgColor} ${item.textColor} flex items-center justify-center font-bold text-sm border-2 ${item.borderColor}`}>
                    {item.code}
                  </div>
                  <span className={`font-bold ${item.textColor}`}>{item.label}</span>
                </div>
                <p className={`text-sm ${item.textColor} opacity-80`}>{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> R* indicates "Responsible when applicable" - role applies only when the specific capability is required for the project.
            </p>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Responsibility Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {raciLegend.map((item) => (
            <div key={item.code} className="text-center">
              <div className={`w-16 h-16 rounded-full ${item.bgColor} ${item.textColor} flex items-center justify-center font-bold text-xl border-2 ${item.borderColor} mx-auto mb-2`}>
                {statistics[item.code]}
              </div>
              <p className="text-sm font-medium text-gray-700">{item.label}</p>
              <p className="text-xs text-gray-500">{item.code} assignments</p>
            </div>
          ))}
        </div>
      </div>

      {/* RACI Matrix Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 border-b border-gray-200 sticky left-0 bg-gray-50 z-10 min-w-[200px]">
                  Phase
                </th>
                {roles.map((role) => (
                  <th key={role.name} className="px-4 py-4 text-center text-sm font-bold text-gray-900 border-b border-gray-200 min-w-[100px]">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`${role.color}`}>
                        {role.icon}
                      </div>
                      <span>{role.name}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={row.phaseId} id={`phase-${index + 1}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 border-b border-gray-200 sticky left-0 bg-inherit z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        {row.phaseId}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{row.phase}</div>
                        <div className="text-xs text-gray-500">Phase {row.phaseId}</div>
                      </div>
                    </div>
                  </td>
                  {roles.map((role) => {
                    const fieldName = role.name === 'Application Support' ? 'ApplicationSupport' : role.name;
                    const raciValue = (row as any)[fieldName] || '';
                    const isSelected = selectedCell?.phase === (index + 1) && selectedCell?.role === role.name;
                    return (
                      <td key={role.name} className="px-4 py-4 border-b border-gray-200 text-center">
                        <button
                          onClick={() => setSelectedCell(
                            isSelected ? null : { phase: index + 1, role: role.name }
                          )}
                          className={`
                            w-12 h-12 rounded-full font-bold text-sm border-2 transition-all duration-200
                            ${getRACIStyle(raciValue)}
                            ${isSelected ? 'ring-4 ring-blue-400 ring-opacity-50 scale-110' : 'hover:scale-105'}
                            focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50
                          `}
                        >
                          {raciValue}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Cell Details */}
      {selectedCell && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {filteredData[selectedCell.phase - 1]?.phaseId}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Phase {filteredData[selectedCell.phase - 1]?.phaseId}: {filteredData[selectedCell.phase - 1]?.phase}
              </h3>
              <p className="text-sm text-gray-600">
                Role: {selectedCell.role} • 
                RACI: {(() => {
                  const fieldName = selectedCell.role === 'Application Support' ? 'ApplicationSupport' : selectedCell.role;
                  return (filteredData[selectedCell.phase - 1] as any)?.[fieldName] || 'I';
                })()}
              </p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-blue-800 leading-relaxed">
              {getRoleDescription(selectedCell.phase, selectedCell.role, (() => {
                const fieldName = selectedCell.role === 'Application Support' ? 'ApplicationSupport' : selectedCell.role;
                return (filteredData[selectedCell.phase - 1] as any)?.[fieldName] || 'I';
              })())}
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              📋 Track Views: Use the tabs above to view RACI assignments for specific process tracks. 
              <strong>Product Track</strong> shows the simplified path (0→1→P2→P3→P4→5→5.1→6→7→8→9), 
              <strong>Enterprise Track</strong> shows the comprehensive path (0→1→E2→E3→E4→5→5.1→6→7→8→9), 
              and <strong>Complete View</strong> shows all phases including both track options.
            </p>
          </div>
          <p className="text-sm text-gray-600 mb-2 font-medium">
            🖱️ Click on any RACI cell to view detailed role descriptions • 🔍 Use search and filters to find specific assignments • 📊 View distribution statistics above
          </p>
          <p className="text-xs text-gray-500">
            This matrix ensures clear accountability and communication throughout the project lifecycle
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-medium">
              It specifies who is Responsible for doing the work, Accountable for the outcome, 
              Consulted for input, and Informed of progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RACIMatrixPage;