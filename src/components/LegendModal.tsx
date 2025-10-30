import React from 'react';
import { X } from 'lucide-react';

interface LegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegendModal: React.FC<LegendModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">PMO Lifecycle V25 - Help & Legend</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Color Legend */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Phase Colors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-700"></div>
                <div>
                  <span className="font-semibold text-gray-800">Discovery</span>
                  <p className="text-sm text-gray-600">Initial scope identification</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                <div>
                  <span className="font-semibold text-gray-800">Core Phases</span>
                  <p className="text-sm text-gray-600">Initiation, UAT, Release, Post Implementation</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400"></div>
                <div>
                  <span className="font-semibold text-gray-800">Enterprise Track</span>
                  <p className="text-sm text-gray-600">BA + Business path (complex features)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-300 to-green-500"></div>
                <div>
                  <span className="font-semibold text-gray-800">Product Track</span>
                  <p className="text-sm text-gray-600">Product path (simple enhancements)</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-8 h-8 rounded border-2 border-dashed border-pink-500 bg-pink-100"></div>
                <div>
                  <span className="font-semibold text-gray-800">Solution Development</span>
                  <p className="text-sm text-gray-600">Parallel Development & QA container</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600"></div>
                <div>
                  <span className="font-semibold text-gray-800">Closure</span>
                  <p className="text-sm text-gray-600">Project completion and lessons learned</p>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Criteria */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Decision Criteria</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-yellow-700 mb-2">Enterprise Track (Yellow)</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Complex new features</li>
                    <li>• Significant business impact</li>
                    <li>• Regulatory requirements</li>
                    <li>• Multiple stakeholder approval needed</li>
                    <li>• Formal BRD documentation required</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Product Track (Green)</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Simple enhancements</li>
                    <li>• Bug fixes and improvements</li>
                    <li>• Clear product requirements</li>
                    <li>• Low technical complexity</li>
                    <li>• User stories sufficient</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">🔀 Branching Decision</h4>
                <p className="text-sm text-blue-700">Owner Decision diamond routes projects to appropriate track based on complexity</p>
              </div>
              
              <div className="bg-pink-50 rounded-lg p-4 border border-pink-200">
                <h4 className="font-semibold text-pink-800 mb-2">📦 Solution Container</h4>
                <p className="text-sm text-pink-700">Development and QA run in parallel within grouped container</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">⚡ Parallel Processing</h4>
                <p className="text-sm text-purple-700">Development and QA phases execute simultaneously for efficiency</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">🧪 QA in Planning</h4>
                <p className="text-sm text-green-700">Test cases developed during Planning phase, refined during Development</p>
              </div>
            </div>
          </div>

          {/* Flow Description */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Process Flow</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <ol className="text-sm text-gray-700 space-y-2">
                <li><strong>1. Discovery & Initiation:</strong> Project scope and formal start</li>
                <li><strong>2. Owner Decision:</strong> Route to Enterprise or Product track</li>
                <li><strong>3a. Enterprise Track:</strong> Requirements → Business Review → Planning</li>
                <li><strong>3b. Product Track:</strong> Requirements → Design → Grooming</li>
                <li><strong>4. Solution Development:</strong> Parallel Development and QA execution</li>
                <li><strong>5. Right Column:</strong> UAT → Release → Post Implementation → Closure</li>
              </ol>
            </div>
          </div>

          {/* Interactive Features */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Interactive Features</h3>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• <strong>Click phase circles</strong> to toggle info boxes</li>
                <li>• <strong>Use panel controls</strong> to expand/collapse all info</li>
                <li>• <strong>Drag and zoom</strong> to navigate the diagram</li>
                <li>• <strong>Red feedback arrow</strong> shows QA → Development rework loop</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          <div className="text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegendModal;