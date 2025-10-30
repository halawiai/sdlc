import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PhaseNodeData {
  number: number;
  name: string;
  gradientStart: string;
  gradientEnd: string;
  onTextChange?: (id: string, text: string) => void;
  onClick?: () => void;
  isExpanded?: boolean;
  expandIcon?: React.ComponentType<any>;
}

const EditablePhaseNode: React.FC<NodeProps<PhaseNodeData>> = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.name);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onClick) {
      data.onClick();
    }
  };
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditText(data.name);
  };

  const handleTextSubmit = () => {
    if (data.onTextChange) {
      data.onTextChange(id, editText);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(data.name);
    }
  };

  const ExpandIcon = (typeof data.expandIcon === 'function') ? data.expandIcon : ChevronDown;
  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={80}
        minHeight={80}
      />
    <div 
      className="phase-node" 
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${data.gradientStart}, ${data.gradientEnd})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        boxShadow: selected ? '0 0 0 2px #3b82f6' : '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '3px solid white',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative'
      }}
    >
      <div style={{ fontSize: '28px', fontWeight: '700' }}>{data.number}</div>
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleTextSubmit}
          onKeyDown={handleKeyDown}
          className="w-16 px-1 py-0 text-center text-xs bg-white text-black rounded border"
          style={{ fontSize: '10px', marginTop: '4px' }}
          autoFocus
        />
      ) : (
        <div style={{ fontSize: '11px', marginTop: '4px', textAlign: 'center' }}>{data.name}</div>
      )}
      
      {/* Expand/Collapse Indicator */}
      {data.onClick && (
        <div 
          className="absolute bottom-1 right-1 bg-white bg-opacity-20 rounded-full p-1"
          style={{ fontSize: '12px' }}
        >
          <ExpandIcon className="w-3 h-3" />
        </div>
      )}
      
      {/* Handles with labels on hover */}
      <Handle type="target" position={Position.Top} id="target-top" />
      <Handle type="target" position={Position.Right} id="target-right" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" />
      <Handle type="target" position={Position.Left} id="target-left" />
      
      <Handle type="source" position={Position.Top} id="source-top" />
      <Handle type="source" position={Position.Right} id="source-right" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" />
      <Handle type="source" position={Position.Left} id="source-left" />
    </div>
    </>
  );
};

export default EditablePhaseNode;