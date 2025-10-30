import React from 'react';
import { X, User, Target, ArrowRight, ArrowLeft, CheckSquare, Shield, AlertTriangle, Info, Users } from 'lucide-react';

interface PhaseDetails {
  owner: string;
  processFocus: string;
  inputs: string[];
  outputs: string[];
  keyTasks: string[];
  phaseGateCriteria: string[];
  raciMatrix: { role: string; description: string; }[];
  specialNote?: {
    type: 'warning' | 'info' | 'success';
    icon: string;
    title: string;
    content: string;
  };
}

interface PhaseInfo {
  id: number | string;
  name: string;
  shortName?: string;
  description: string;
  gradient: string;
  details: PhaseDetails;
}

interface PhaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  phase?: PhaseInfo | null;
  phaseInfo?: PhaseInfo | null;
}

const PhaseDetailModal: React.FC<PhaseDetailModalProps> = ({ isOpen, onClose, phase, phaseInfo }) => {
  const modalData = phase || phaseInfo;
  if (!isOpen || !modalData) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[calc(100vh-120px)] overflow-y-auto">
        {/* Modal Header */}
        <div className={`bg-gradient-to-r ${modalData.gradient} p-6 rounded-t-xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`
                w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm
                flex items-center justify-center text-white font-bold text-xl border-2 border-white/30
              `}>
                {typeof modalData.id === 'number' ? modalData.id : modalData.shortName || modalData.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {typeof modalData.id === 'number' ? `Phase ${modalData.id}: ` : ''}{modalData.name}
                </h2>
                <p className="text-white/90 text-sm">
                  {modalData.description}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {/* Owner */}
          <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-l-xl border-l-4 border-purple-500">
            <User className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-bold text-purple-900 text-sm">Process Owner</span>
              <p className="text-purple-800 font-medium">{modalData.details.owner}</p>
            </div>
          </div>

          {/* Process Focus */}
          <div className="flex items-start gap-3 p-4 bg-green-50 rounded-l-xl border-l-4 border-green-500">
            <Target className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-bold text-green-900 text-sm">Process Focus</span>
              <p className="text-green-800 text-sm mt-1 leading-relaxed">{modalData.details.processFocus}</p>
            </div>
          </div>

          {/* Inputs and Outputs */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-3">
                <ArrowRight className="w-5 h-5 text-orange-600" />
                <span className="font-bold text-orange-900 text-sm">Inputs</span>
              </div>
              <ul className="text-sm text-orange-800 space-y-1">
                {modalData.details.inputs.map((input, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{input}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <ArrowLeft className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-purple-900 text-sm">Outputs</span>
              </div>
              <ul className="text-sm text-purple-800 space-y-1">
                {modalData.details.outputs.map((output, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{output}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Tasks */}
          {modalData.details.keyTasks && modalData.details.keyTasks.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-l-xl border-l-4 border-blue-500">
              <div className="flex items-center gap-2 mb-3">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-blue-900 text-sm">Key Tasks</span>
              </div>
              <ul className="text-sm text-blue-800 space-y-1 list-none pl-0">
                {modalData.details.keyTasks.map((task, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* RACI Matrix */}
          {modalData.details.raciMatrix && modalData.details.raciMatrix.length > 0 && (
            <div className="p-4 bg-purple-50 rounded-l-xl border-l-4 border-purple-500">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-bold text-purple-900 text-sm">RACI Matrix</span>
              </div>
              <ul className="text-sm text-purple-800 space-y-1 list-none pl-0">
                {modalData.details.raciMatrix.map((raci, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>
                      <span className="font-semibold">{raci.role}:</span> {raci.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Gate Criteria */}
          {modalData.details.phaseGateCriteria && modalData.details.phaseGateCriteria.length > 0 && (
            <div className="p-4 bg-indigo-50 rounded-l-xl border-l-4 border-indigo-500">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-indigo-900 text-sm">Gate Criteria</span>
              </div>
              <ul className="text-sm text-indigo-800 space-y-1 list-none pl-0">
                {modalData.details.phaseGateCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Special Note */}
          {modalData.details.specialNote && (
            <div className={`p-4 rounded-l-xl border-l-4 ${
              modalData.details.specialNote.type === 'warning' 
                ? 'bg-yellow-50 border-yellow-500' 
                : modalData.details.specialNote.type === 'success'
                ? 'bg-green-50 border-green-500'
                : 'bg-blue-50 border-blue-500'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{modalData.details.specialNote.icon}</span>
                <span className={`font-bold text-sm ${
                  modalData.details.specialNote.type === 'warning' 
                    ? 'text-yellow-900' 
                    : modalData.details.specialNote.type === 'success'
                    ? 'text-green-900'
                    : 'text-blue-900'
                }`}>
                  {modalData.details.specialNote.title}
                </span>
              </div>
              <p className={`text-sm leading-relaxed ${
                modalData.details.specialNote.type === 'warning' 
                  ? 'text-yellow-800' 
                  : modalData.details.specialNote.type === 'success'
                  ? 'text-green-800'
                  : 'text-blue-800'
              }`}>
                {modalData.details.specialNote.content}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          <div className="text-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhaseDetailModal;