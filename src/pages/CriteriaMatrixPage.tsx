import React, { useState } from 'react';
import { Calculator, Target, TrendingUp, Users, Star, ArrowRight, CheckCircle, AlertTriangle, Info, RotateCcw } from 'lucide-react';
import { v25 } from '../data/lifecycleDataV25Details';

const CriteriaMatrixPage: React.FC = () => {
  const [scores, setScores] = useState({ customer: 0, market: 0, features: 0 });

  const calculateTotal = () => scores.customer + scores.market + scores.features;
  
  const getDecision = (total: number) => {
    if (total < 9) return { 
      result: 'Product Override Approved', 
      color: 'green', 
      description: 'Product writes stories directly → Phase 4 (Planning)',
      icon: <CheckCircle className="w-5 h-5" />
    };
    if (total === 9) return { 
      result: 'Discussion Required', 
      color: 'yellow', 
      description: 'PMO + Product + BA meeting needed',
      icon: <AlertTriangle className="w-5 h-5" />
    };
    return { 
      result: 'Standard Process Required', 
      color: 'blue', 
      description: 'Full Enterprise track (E2→E3→E4) with complete BA involvement',
      icon: <Info className="w-5 h-5" />
    };
  };

  const examples = [
    { 
      name: 'Customer Mobile App Feature', 
      scores: {customer: 1, market: 1, features: 1}, 
      total: 3,
      description: 'New customer-facing mobile feature with market demand'
    },
    { 
      name: 'Internal Reporting Dashboard', 
      scores: {customer: 5, market: 5, features: 5}, 
      total: 15,
      description: 'Internal analytics dashboard for operations team'
    },
    { 
      name: 'Mixed Feature Enhancement', 
      scores: {customer: 3, market: 3, features: 3}, 
      total: 9,
      description: 'Feature affecting both customers and internal processes'
    }
  ];

  const handleScoreChange = (criteria: string, value: number) => {
    setScores(prev => ({ ...prev, [criteria]: value }));
  };

  const resetScores = () => {
    setScores({ customer: 0, market: 0, features: 0 });
  };

  const total = calculateTotal();
  const decision = getDecision(total);

  // Get dynamic data from v25 'D' phase
  const ownerDecisionPhase = v25['D'];
  const dynamicData = {
    raciMatrix: ownerDecisionPhase.details.raciMatrix,
    keyTasks: ownerDecisionPhase.details.keyTasks,
    gateCriteria: ownerDecisionPhase.details.phaseGateCriteria,
    processFocus: ownerDecisionPhase.details.processFocus,
    owner: ownerDecisionPhase.details.owner
  };
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
            Criteria Assessment Matrix
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
          Scientific scoring system for phase routing decisions integrated with Owner Decision phase
        </p>
      </div>

      {/* Interactive Calculator */}
      <div className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Interactive Calculator</h2>
          <button
            onClick={resetScores}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Customer Impact */}
          <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Customer Impact
            </h3>
            <div className="space-y-3 mb-4">
              {[1, 3, 5].map(value => (
                <label key={value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="customer"
                    value={value}
                    checked={scores.customer === value}
                    onChange={() => handleScoreChange('customer', value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">
                    <strong>{value}:</strong> {
                      value === 1 ? 'Fully Customer Facing' :
                      value === 3 ? 'Mixed Customer/Internal' :
                      'Not Customer Facing'
                    }
                  </span>
                </label>
              ))}
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-blue-600">{scores.customer}</span>
            </div>
          </div>

          {/* Market Demand */}
          <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
            <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Market Demand
            </h3>
            <div className="space-y-3 mb-4">
              {[1, 3, 5].map(value => (
                <label key={value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="market"
                    value={value}
                    checked={scores.market === value}
                    onChange={() => handleScoreChange('market', value)}
                    className="w-4 h-4 text-green-600"
                  />
                  <span className="text-sm">
                    <strong>{value}:</strong> {
                      value === 1 ? 'Market Driven Focus' :
                      value === 3 ? 'Balanced Demand' :
                      'Internally Driven Focus'
                    }
                  </span>
                </label>
              ))}
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-green-600">{scores.market}</span>
            </div>
          </div>

          {/* Request Features */}
          <div className="bg-purple-50 rounded-xl p-6 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Request Features
            </h3>
            <div className="space-y-3 mb-4">
              {[1, 3, 5].map(value => (
                <label key={value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="features"
                    value={value}
                    checked={scores.features === value}
                    onChange={() => handleScoreChange('features', value)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm">
                    <strong>{value}:</strong> {
                      value === 1 ? 'Marketable Enhancement' :
                      value === 3 ? 'Mixed Features' :
                      'Internal Enhancement'
                    }
                  </span>
                </label>
              ))}
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-purple-600">{scores.features}</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Assessment Result</h3>
            <div className="text-4xl font-black text-gray-900 mb-2">
              Total Score: {total}
            </div>
          </div>
          
          {total > 0 && (
            <div className={`
              p-4 rounded-lg border-2 text-center
              ${decision.color === 'green' ? 'bg-green-50 border-green-300' :
                decision.color === 'yellow' ? 'bg-yellow-50 border-yellow-300' :
                'bg-blue-50 border-blue-300'}
            `}>
              <div className={`
                flex items-center justify-center gap-2 mb-2
                ${decision.color === 'green' ? 'text-green-700' :
                  decision.color === 'yellow' ? 'text-yellow-700' :
                  'text-blue-700'}
              `}>
                {decision.icon}
                <h4 className="text-lg font-bold">{decision.result}</h4>
              </div>
              <p className={`
                text-sm
                ${decision.color === 'green' ? 'text-green-600' :
                  decision.color === 'yellow' ? 'text-yellow-600' :
                  'text-blue-600'}
              `}>
                {decision.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Decision Matrix Reference */}
      <div className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Decision Matrix Reference</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 rounded-lg p-6 border-2 border-green-300">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h4 className="font-bold text-green-900">Score &lt; 9</h4>
            </div>
            <p className="text-sm text-green-800 mb-3 font-semibold">Product Override Approved</p>
            <p className="text-xs text-green-700 leading-relaxed">
              Product writes stories directly → Skip to Phase 4 (Planning). Follow Product track (P2→P3→P4).
            </p>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <h4 className="font-bold text-yellow-900">Score = 9</h4>
            </div>
            <p className="text-sm text-yellow-800 mb-3 font-semibold">Discussion Required</p>
            <p className="text-xs text-yellow-700 leading-relaxed">
              PMO + Product + BA meeting needed to determine appropriate path. 
              Case-by-case evaluation.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-6 h-6 text-blue-600" />
              <h4 className="font-bold text-blue-900">Score &gt; 9</h4>
            </div>
            <p className="text-sm text-blue-800 mb-3 font-semibold">Standard Process Required</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Full Enterprise track (E2→E3→E4) with complete BA involvement. 
              Comprehensive requirements and business review process.
            </p>
          </div>
        </div>
      </div>

      {/* Owner Decision Phase Details - Dynamic Integration */}
      <div className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
          <Target className="w-6 h-6 text-amber-600" />
          Owner Decision Phase Details
        </h2>
        <div className="bg-amber-50 rounded-lg p-6 border border-amber-200 mb-6">
          <h3 className="text-lg font-bold text-amber-900 mb-3">Process Overview</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">Process Owner:</h4>
              <p className="text-amber-700 text-sm">{dynamicData.owner}</p>
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-2">Process Focus:</h4>
              <p className="text-amber-700 text-sm">{dynamicData.processFocus}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* RACI Matrix */}
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              RACI Assignments
            </h3>
            <div className="space-y-3">
              {dynamicData.raciMatrix.map((raci, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-purple-200">
                  <div className="font-semibold text-purple-800 text-sm">{raci.role}</div>
                  <div className="text-purple-700 text-xs mt-1">{raci.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Tasks */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Key Tasks
            </h3>
            <ul className="space-y-2">
              {dynamicData.keyTasks.map((task, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-blue-800 text-sm">{task}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Gate Criteria */}
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Gate Criteria
            </h3>
            <ul className="space-y-2">
              {dynamicData.gateCriteria.map((criteria, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-green-800 text-sm">{criteria}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Example Scenarios */}
      <div className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Example Scenarios</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {examples.map((example, idx) => {
            const exampleDecision = getDecision(example.total);
            return (
              <div key={idx} className="p-6 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors">
                <h4 className="font-bold text-gray-800 mb-3">{example.name}</h4>
                <p className="text-sm text-gray-600 mb-4">{example.description}</p>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span>Customer Impact:</span>
                    <span className="font-semibold">{example.scores.customer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Demand:</span>
                    <span className="font-semibold">{example.scores.market}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Features:</span>
                    <span className="font-semibold">{example.scores.features}</span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Total Score:</span>
                    <span className="text-xl font-black">{example.total}</span>
                  </div>
                  <div className={`
                    flex items-center gap-2 p-2 rounded
                    ${exampleDecision.color === 'green' ? 'bg-green-100 text-green-700' :
                      exampleDecision.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'}
                  `}>
                    {exampleDecision.icon}
                    <span className="text-xs font-semibold">{exampleDecision.result}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Implementation Guide</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Excel Implementation</h3>
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
              <p className="text-sm text-gray-600 mb-2">Excel Formula for automated decision:</p>
              <code className="bg-gray-100 px-3 py-2 rounded text-sm block font-mono break-all">
                {`=IF(H2<9,"Product Override",IF(H2=9,"Discussion Required","Enterprise Track"))`}
              </code>
            </div>
            <p className="text-xs text-gray-600">
              Where H2 contains the sum of your three criteria scores (Customer Impact + Market Demand + Features).
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Process Integration</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <ArrowRight className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Step 1: Complete Phase 1 (Initiation)</p>
                  <p className="text-xs text-gray-600">Gather initial requirements and PRD brief</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Step 2: Apply Criteria Assessment</p>
                  <p className="text-xs text-gray-600">Score all three criteria and calculate total</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ArrowRight className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Step 3: Follow Decision Path</p>
                  <p className="text-xs text-gray-600">Route to appropriate phase based on score</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2 font-medium">
            🧮 Use the interactive calculator above to score your project • 📊 Reference the decision matrix for routing guidance • 📋 See examples for common scenarios
          </p>
          <p className="text-xs text-gray-500">
            This scientific approach ensures consistent and objective decision-making integrated with the Owner Decision phase
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-medium">
              Each criterion is scored from 1-5, and the total score determines the project path: 
              &lt;9 = Product Override (Product track), =9 = Discussion Required, &gt;9 = Enterprise Track. 
              This assessment is performed during the Owner Decision phase with clear RACI assignments and gate criteria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CriteriaMatrixPage;