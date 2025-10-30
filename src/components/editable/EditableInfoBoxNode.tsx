import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';

interface InfoBoxNodeData {
  type: 'owner' | 'process' | 'input' | 'output' | 'special';
  label: string;
  content: string;
  sourcePosition?: Position;
  targetPosition?: Position;
  onTextChange?: (id: string, text: string) => void;
  isVisible?: boolean;
}

const EditableInfoBoxNode: React.FC<NodeProps<InfoBoxNodeData>> = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.content);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditText(data.content);
  };

  const handleTextSubmit = () => {
    if (data.onTextChange) {
      data.onTextChange(id, editText);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(data.content);
    }
  };

  const colorStyles = {
    owner: { bg: '#F5F3FF', border: '#E9D5FF', text: '#9333EA' },
    process: { bg: '#EFF6FF', border: '#DBEAFE', text: '#3B82F6' },
    input: { bg: '#F0FDF4', border: '#D1FAE5', text: '#10B981' },
    output: { bg: '#FFF7ED', border: '#FED7AA', text: '#F59E0B' },
    special: { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706' }
  };
  
  const style = colorStyles[data.type] || colorStyles.process;
  
  return (
    <>
      <NodeResizer
        color="#ff0071"
        isVisible={selected}
        minWidth={150}
        minHeight={80}
      />
    <div style={{
      background: style.bg,
      border: `2px solid ${selected ? '#3b82f6' : style.border}`,
      borderRadius: '8px',
      padding: '16px',
      minWidth: '200px',
      maxWidth: '250px',
      fontSize: '12px',
      boxShadow: selected ? '0 0 0 2px #3b82f6' : '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease-in-out',
      cursor: 'grab',
      position: 'relative',
      opacity: data.isVisible === false ? 0 : 1,
      transform: data.isVisible === false ? 'scale(0.8)' : 'scale(1)'
    }}
    onDoubleClick={handleDoubleClick}>
      <div style={{
        fontWeight: '700',
        color: style.text,
        marginBottom: '8px',
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {data.label}
      </div>
      {isEditing ? (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleTextSubmit}
          onKeyDown={handleKeyDown}
          className="w-full h-12 p-1 text-xs bg-white border rounded resize-none"
          style={{ color: '#374151', lineHeight: '1.4' }}
          autoFocus
        />
      ) : (
        <div style={{
          color: '#374151',
          lineHeight: '1.6'
        }}>
          {data.content}
        </div>
      )}
      
      {/* Multiple handles for flexible connections */}
      <Handle type="source" position={Position.Top} id="source-top" />
      <Handle type="source" position={Position.Right} id="source-right" />
      <Handle type="source" position={Position.Bottom} id="source-bottom" />
      <Handle type="source" position={Position.Left} id="source-left" />
      
      <Handle type="target" position={Position.Top} id="target-top" />
      <Handle type="target" position={Position.Right} id="target-right" />
      <Handle type="target" position={Position.Bottom} id="target-bottom" />
      <Handle type="target" position={Position.Left} id="target-left" />
    </div>
    </>
  );
};

export default EditableInfoBoxNode;