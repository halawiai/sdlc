import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface DecisionNodeData {
  label: string;
  yesPath: string;
  noPath: string;
  onDecisionChange?: (id: string, decision: string) => void;
}

const DecisionNode: React.FC<NodeProps<DecisionNodeData>> = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.label);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditText(data.label);
  };

  const handleTextSubmit = () => {
    if (data.onDecisionChange) {
      data.onDecisionChange(id, editText);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(data.label);
    }
  };

  return (
    <div className="relative">
      <div 
        className={`
          w-32 h-32 bg-gradient-to-br from-amber-100 to-amber-200 
          border-2 ${selected ? 'border-blue-500' : 'border-amber-500'} 
          transform rotate-45 flex items-center justify-center
          shadow-lg cursor-pointer transition-all duration-200
          hover:shadow-xl hover:scale-105
        `}
        onDoubleClick={handleDoubleClick}
      >
        <div className="transform -rotate-45 text-center p-2">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleTextSubmit}
              onKeyDown={handleKeyDown}
              className="w-20 px-1 py-0 text-center text-xs bg-white rounded border"
              autoFocus
            />
          ) : (
            <div className="text-xs font-bold text-amber-800 leading-tight">
              {data.label}
            </div>
          )}
        </div>
      </div>
      
      {/* Handles */}
      <Handle type="target" position={Position.Left} />
      <Handle 
        type="source" 
        position={Position.Right} 
        id="yes" 
        style={{ top: '30%', background: '#10B981' }}
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="no" 
        style={{ left: '50%', background: '#EF4444' }}
      />
      
      {/* YES/NO Labels */}
      <div className="absolute -right-8 top-6 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
        YES
      </div>
      <div className="absolute bottom-6 left-12 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
        NO
      </div>
    </div>
  );
};

export default DecisionNode;