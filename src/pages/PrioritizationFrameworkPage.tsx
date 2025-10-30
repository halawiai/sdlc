import React, { useState } from 'react';
import { Calculator, Target, TrendingUp, Users, Star, ArrowRight, CheckCircle, AlertTriangle, Info, RotateCcw, Plus, Trash2, Download, Edit2 } from 'lucide-react';
import { exportToPDF, exportToExcel } from '../utils/exportUtils';

interface Initiative {
  id: string;
  name: string;
  reach: number;
  impact: number;
  confidence: number;
  value: number;
  effort: number;
  wriveScore: number;
  combinedValue: number;
}

interface Weights {
  reach: number;
  impact: number;
  confidence: number;
  value: number;
  effort: number;
}

const PrioritizationFrameworkPage: React.FC = () => {
  const [weights, setWeights] = useState<Weights>({
    reach: 0.25,
    impact: 0.25,
    confidence: 0.15,
    value: 0.25,
    effort: 0.1
  });

  const [initiatives, setInitiatives] = useState<Initiative[]>([
    {
      id: '1',
      name: 'Compliance Reporting Dashboard',
      reach: 4,
      impact: 5,
      confidence: 0.8,
      value: 5,
      effort: 3,
      wriveScore: 0,
      combinedValue: 0
    },
    {
      id: '2',
      name: 'Merchant Cashback Feature',
      reach: 5,
      impact: 4,
      confidence: 0.7,
      value: 4,
      effort: 4,
      wriveScore: 0,
      combinedValue: 0
    },
    {
      id: '3',
      name: 'UI Theme Update',
      reach: 3,
      impact: 2,
      confidence: 0.9,
      value: 2,
      effort: 2,
      wriveScore: 0,
      combinedValue: 0
    }
  ]);

  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  // Calculate WRIVE score
  const calculateWRIVE = (initiative: Omit<Initiative, 'wriveScore' | 'combinedValue'>) => {
    const numerator = (weights.reach * initiative.reach) + 
                     (weights.impact * initiative.impact) + 
                     (weights.confidence * initiative.confidence) + 
                     (weights.value * initiative.value);
    const denominator = weights.effort * initiative.effort;
    return numerator / denominator;
  };

  // Calculate combined value (simple average of reach, impact, value)
  const calculateCombinedValue = (initiative: Initiative) => {
    return (initiative.reach + initiative.impact + initiative.value) / 3;
  };

  // Update initiatives with calculated scores
  React.useEffect(() => {
    setInitiatives(prev => prev.map(initiative => {
      const wriveScore = calculateWRIVE(initiative);
      const combinedValue = calculateCombinedValue(initiative);
      return { ...initiative, wriveScore, combinedValue };
    }));
  }, [weights, initiatives.length]); // Only recalculate when weights change or initiatives are added/removed

  const handleWeightChange = (weightType: keyof Weights, value: number) => {
    setWeights(prev => ({ ...prev, [weightType]: value }));
  };

  const handleCellEdit = (id: string, field: string, currentValue: any) => {
    setEditingCell({ id, field });
    setEditValue(String(currentValue));
  };

  const handleCellSave = () => {
    if (!editingCell) return;
    
    const { id, field } = editingCell;
    const numValue = field === 'name' ? editValue : parseFloat(editValue);
    
    if (field === 'name' || (!isNaN(numValue) && numValue >= 0)) {
      setInitiatives(prev => prev.map(initiative => {
        if (initiative.id === id) {
          const updated = { ...initiative, [field]: field === 'name' ? editValue : numValue };
          const wriveScore = calculateWRIVE(updated);
          const combinedValue = calculateCombinedValue(updated);
          return { ...updated, wriveScore, combinedValue };
        }
        return initiative;
      }));
    }
    
    setEditingCell(null);
    setEditValue('');
  };

  const handleCellCancel = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const addInitiative = () => {
    const newId = String(Date.now());
    const newInitiative: Initiative = {
      id: newId,
      name: 'New Initiative',
      reach: 3,
      impact: 3,
      confidence: 0.7,
      value: 3,
      effort: 3,
      wriveScore: 0,
      combinedValue: 0
    };
    
    const wriveScore = calculateWRIVE(newInitiative);
    const combinedValue = calculateCombinedValue(newInitiative);
    
    setInitiatives(prev => [...prev, { ...newInitiative, wriveScore, combinedValue }]);
  };

  const removeInitiative = (id: string) => {
    setInitiatives(prev => prev.filter(initiative => initiative.id !== id));
  };

  const resetWeights = () => {
    setWeights({
      reach: 0.25,
      impact: 0.25,
      confidence: 0.15,
      value: 0.25,
      effort: 0.1
    });
  };

  const exportToPDFHandler = () => {
    exportToPDF('root', 'prioritization-framework');
  };

  const exportToExcelHandler = () => {
    const excelData = initiatives.map(initiative => ({
      Initiative: initiative.name,
      'Reach (1-5)': initiative.reach,
      'Impact (1-5)': initiative.impact,
      'Confidence (0.5-1.0)': initiative.confidence,
      'Value (1-5)': initiative.value,
      'Effort (1-5)': initiative.effort,
      'Weight - Reach': weights.reach,
      'Weight - Impact': weights.impact,
      'Weight - Confidence': weights.confidence,
      'Weight - Value': weights.value,
      'Weight - Effort': weights.effort,
      'WRIVE Score': initiative.wriveScore.toFixed(4),
      'Combined Value': initiative.combinedValue.toFixed(4)
    }));
    
    exportToExcel(excelData, 'wrive-prioritization-matrix');
  };

  const getPriorityLevel = (score: number) => {
    if (score >= 10) return { label: 'Critical', color: 'bg-red-100 text-red-800 border-red-300' };
    if (score >= 7) return { label: 'High', color: 'bg-orange-100 text-orange-800 border-orange-300' };
    if (score >= 4) return { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    return { label: 'Low', color: 'bg-gray-100 text-gray-800 border-gray-300' };
  };

  const sortedInitiatives = [...initiatives].sort((a, b) => b.wriveScore - a.wriveScore);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
            Prioritization Framework
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
          WRIVE (Weighted RICE + Value/Effort) - A hybrid prioritization model combining the rigor of RICE, 
          simplicity of Value vs. Effort, and flexibility of weighted scoring for Hala's fintech context
        </p>
      </div>

      {/* Framework Overview */}
      <div className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">The Hybrid Framework: WRIVE</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Core Dimensions</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Users className="w-5 h-5 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-bold text-blue-900">Reach (R)</h4>
                  <p className="text-blue-800 text-sm">How many customers/transactions are impacted</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <Target className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <h4 className="font-bold text-green-900">Impact (I)</h4>
                  <p className="text-green-800 text-sm">Business or customer benefit (qualitative, then scaled)</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <CheckCircle className="w-5 h-5 text-purple-600 mt-1" />
                <div>
                  <h4 className="font-bold text-purple-900">Confidence (C)</h4>
                  <p className="text-purple-800 text-sm">Certainty around assumptions/data</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <Star className="w-5 h-5 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-bold text-yellow-900">Value (V)</h4>
                  <p className="text-yellow-800 text-sm">Combines Impact + Reach, aligned with business KPIs</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <TrendingUp className="w-5 h-5 text-red-600 mt-1" />
                <div>
                  <h4 className="font-bold text-red-900">Effort (E)</h4>
                  <p className="text-red-800 text-sm">Estimated cost/resources (person-months, t-shirt sizes, or ranges)</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">WRIVE Formula</h3>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="text-center mb-4">
                <div className="text-lg font-mono bg-white p-4 rounded border border-gray-300 shadow-sm">
                  <div className="text-gray-800 font-bold mb-2">WRIVE Score =</div>
                  <div className="border-b-2 border-gray-400 pb-2 mb-2">
                    (W<sub>R</sub> × R) + (W<sub>I</sub> × I) + (W<sub>C</sub> × C) + (W<sub>V</sub> × V)
                  </div>
                  <div>
                    W<sub>E</sub> × E
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Where each <strong>W<sub>x</sub></strong> is a weight (0–1) reflecting importance in your strategy
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-4">Benefits of WRIVE</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-blue-800 text-sm"><strong>From RICE:</strong> Structure & rigor</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-blue-800 text-sm"><strong>From Value vs. Effort:</strong> Simple visualization</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-blue-800 text-sm"><strong>From Weighted Scoring:</strong> Strategic flexibility</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-blue-800 text-sm"><strong>Fits Hala SDLC:</strong> Applied at P2–P4 phases</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scoring Criteria */}
      <div className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Scoring Criteria</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-900">Factor</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-bold text-gray-900">Scale</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-bold text-gray-900">Example in Payments Context</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-semibold text-blue-800">Reach (R)</td>
                <td className="border border-gray-300 px-4 py-3 text-center">1–5</td>
                <td className="border border-gray-300 px-4 py-3 text-sm"># of SMEs impacted (1 = niche pilot, 5 = all merchants)</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-semibold text-green-800">Impact (I)</td>
                <td className="border border-gray-300 px-4 py-3 text-center">1–5</td>
                <td className="border border-gray-300 px-4 py-3 text-sm">Strategic: (1 = cosmetic UI tweak, 5 = core compliance feature)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-semibold text-purple-800">Confidence (C)</td>
                <td className="border border-gray-300 px-4 py-3 text-center">0.5–1.0</td>
                <td className="border border-gray-300 px-4 py-3 text-sm">Data certainty: (0.5 = guess, 1.0 = validated research)</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 px-4 py-3 font-semibold text-yellow-800">Value (V)</td>
                <td className="border border-gray-300 px-4 py-3 text-center">1–5</td>
                <td className="border border-gray-300 px-4 py-3 text-sm">Business KPI impact (e.g., revenue, churn reduction, compliance pass)</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-semibold text-red-800">Effort (E)</td>
                <td className="border border-gray-300 px-4 py-3 text-center">1–5</td>
                <td className="border border-gray-300 px-4 py-3 text-sm">1 = &lt;1 p-m, 3 = 2–4 p-m, 5 = 8+ p-m</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Example Calculation */}
      <div className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Example Calculation</h2>
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            "New Compliance Reporting Dashboard"
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Scoring:</h4>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Reach (R) = 4</strong> (affects most enterprise SMEs)</li>
                <li>• <strong>Impact (I) = 5</strong> (compliance-critical)</li>
                <li>• <strong>Confidence (C) = 0.8</strong> (based on regulator roadmap)</li>
                <li>• <strong>Value (V) = 5</strong> (avoids fines, improves trust)</li>
                <li>• <strong>Effort (E) = 3</strong> (moderate complexity)</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Calculation:</h4>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="font-mono text-sm space-y-1">
                  <div>Score = [(0.25 × 4) + (0.25 × 5) + (0.15 × 0.8) + (0.25 × 5)] / (0.10 × 3)</div>
                  <div>Score = [1 + 1.25 + 0.12 + 1.25] / 0.3</div>
                  <div className="font-bold text-blue-600">Score = 12.07 (High Priority)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weight Configuration */}
      <div className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Weight Configuration</h2>
          <button
            onClick={resetWeights}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Default
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(weights).map(([key, value]) => (
            <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                Weight - {key}
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.05"
                value={value}
                onChange={(e) => handleWeightChange(key as keyof Weights, parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-mono"
              />
              <div className="text-xs text-gray-500 mt-1 text-center">
                {(value * 100).toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-yellow-800 text-sm">
            <strong>Note:</strong> Weights should reflect your strategic priorities. 
            Adjust quarterly based on business focus (e.g., compliance, revenue, adoption).
          </p>
        </div>
      </div>

      {/* Interactive Scoring Table */}
      <div className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Interactive Scoring Template</h2>
          <div className="flex gap-2">
            <button
              onClick={addInitiative}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Initiative
            </button>
            <button
              onClick={exportToPDFHandler}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={exportToExcelHandler}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-3 py-2 text-left font-bold text-gray-900 min-w-[200px]">Initiative</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-900">Reach<br/>(1-5)</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-900">Impact<br/>(1-5)</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-900">Confidence<br/>(0.5-1.0)</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-900">Value<br/>(1-5)</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-900">Effort<br/>(1-5)</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-900">WRIVE<br/>Score</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-900">Combined<br/>Value</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-900">Priority</th>
                <th className="border border-gray-300 px-3 py-2 text-center font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedInitiatives.map((initiative, index) => {
                const priority = getPriorityLevel(initiative.wriveScore);
                return (
                  <tr key={initiative.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-3 py-2">
                      {editingCell?.id === initiative.id && editingCell?.field === 'name' ? (
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleCellSave}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCellSave();
                            if (e.key === 'Escape') handleCellCancel();
                          }}
                          className="w-full px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      ) : (
                        <div
                          onClick={() => handleCellEdit(initiative.id, 'name', initiative.name)}
                          className="cursor-pointer hover:bg-blue-50 p-1 rounded font-medium"
                        >
                          {initiative.name}
                        </div>
                      )}
                    </td>
                    
                    {['reach', 'impact', 'confidence', 'value', 'effort'].map((field) => (
                      <td key={field} className="border border-gray-300 px-3 py-2 text-center">
                        {editingCell?.id === initiative.id && editingCell?.field === field ? (
                          <input
                            type="number"
                            min={field === 'confidence' ? '0.5' : '1'}
                            max={field === 'confidence' ? '1' : '5'}
                            step={field === 'confidence' ? '0.1' : '1'}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleCellSave}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCellSave();
                              if (e.key === 'Escape') handleCellCancel();
                            }}
                            className="w-16 px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 text-center"
                            autoFocus
                          />
                        ) : (
                          <div
                            onClick={() => handleCellEdit(initiative.id, field, (initiative as any)[field])}
                            className="cursor-pointer hover:bg-blue-50 p-1 rounded font-mono"
                          >
                            {(initiative as any)[field]}
                          </div>
                        )}
                      </td>
                    ))}
                    
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <span className="font-bold text-blue-600 font-mono">
                        {initiative.wriveScore.toFixed(2)}
                      </span>
                    </td>
                    
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <span className="font-mono text-gray-700">
                        {initiative.combinedValue.toFixed(2)}
                      </span>
                    </td>
                    
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${priority.color}`}>
                        {priority.label}
                      </span>
                    </td>
                    
                    <td className="border border-gray-300 px-3 py-2 text-center">
                      <button
                        onClick={() => removeInitiative(initiative.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition-colors"
                        title="Remove initiative"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            💡 Click on any cell to edit values • Higher WRIVE scores indicate higher priority • 
            Initiatives are automatically sorted by WRIVE score
          </p>
        </div>
      </div>

      {/* Suggested Workflow */}
      <div className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Suggested Workflow</h2>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Early (Discovery–Design)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Product + BA assign rough WRIVE scores (Effort = t-shirt size). Focus on getting directional 
                priorities rather than precise calculations.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Before Grooming</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Adjust scores based on feedback from proxy engineers and benchmarks. Refine Effort estimates 
                with technical input.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">During Grooming (P4)</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Engineering refines Effort estimates → update WRIVE score. Use final scores for sprint 
                planning and backlog prioritization.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">Quarterly Roadmap Planning</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Adjust weights to reflect business priorities. For example, increase Impact weight during 
                compliance seasons, or increase Reach weight during growth phases.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Matrix Visualization */}
      <div className="mb-12 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Priority Matrix Visualization</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-50 rounded-lg p-4 border-2 border-red-300 text-center">
            <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
              10+
            </div>
            <h4 className="font-bold text-red-900 mb-1">Critical</h4>
            <p className="text-red-800 text-xs">Immediate action required</p>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-300 text-center">
            <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
              7-9
            </div>
            <h4 className="font-bold text-orange-900 mb-1">High</h4>
            <p className="text-orange-800 text-xs">Next sprint priority</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300 text-center">
            <div className="w-12 h-12 bg-yellow-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
              4-6
            </div>
            <h4 className="font-bold text-yellow-900 mb-1">Medium</h4>
            <p className="text-yellow-800 text-xs">Backlog consideration</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-300 text-center">
            <div className="w-12 h-12 bg-gray-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
              &lt;4
            </div>
            <h4 className="font-bold text-gray-900 mb-1">Low</h4>
            <p className="text-gray-800 text-xs">Future consideration</p>
          </div>
        </div>
      </div>

      {/* Integration with PMO Process */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Integration with PMO Process</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Phase P2-P3 (Requirements/Design)
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Initial WRIVE scoring during requirements gathering and design phases. 
              Use rough estimates to guide early prioritization decisions.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Phase P4 (Grooming)
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Refine WRIVE scores with engineering input on effort estimates. 
              Use final scores for sprint planning and backlog prioritization.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-600" />
              Quarterly Planning
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Adjust weights based on business priorities and strategic focus. 
              Review and recalibrate the framework quarterly.
            </p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-2 font-medium">
            🧮 Use the interactive table to score your initiatives • ⚖️ Adjust weights to reflect strategic priorities • 📊 Export results for roadmap planning
          </p>
          <p className="text-xs text-gray-500">
            This hybrid framework provides the rigor of RICE with the flexibility to adapt to Hala's fintech priorities
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800 font-medium">
              📋 Framework Integration: WRIVE scoring integrates seamlessly with the PMO lifecycle process, 
              providing objective prioritization criteria during requirements (P2-P3) and grooming (P4) phases. 
              The weighted approach allows adaptation to changing business priorities while maintaining consistency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrioritizationFrameworkPage;