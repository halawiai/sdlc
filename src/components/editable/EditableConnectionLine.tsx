import React, { useState } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from 'reactflow';

interface EditableConnectionData {
  label?: string;
  color?: string;
  width?: number;
  dashed?: boolean;
  onLabelChange?: (id: string, label: string) => void;
}

const EditableConnectionLine: React.FC<EdgeProps<EditableConnectionData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data = {},
  selected
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(data.label || '');

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleLabelDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditText(data.label || '');
  };

  const handleLabelSubmit = () => {
    if (data.onLabelChange) {
      data.onLabelChange(id, editText);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(data.label || '');
    }
  };

  const edgeStyle = {
    stroke: data.color || style.stroke || '#6B7280',
    strokeWidth: data.width || style.strokeWidth || 2,
    strokeDasharray: data.dashed ? '5,5' : '0',
    ...style
  };

  if (selected) {
    edgeStyle.stroke = '#3B82F6';
    edgeStyle.strokeWidth = (edgeStyle.strokeWidth as number) + 1;
  }

  return (
    <>
      <path
        id={id}
        style={edgeStyle}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd="url(#react-flow__arrowclosed)"
      />
      
      {(data.label || isEditing) && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            {isEditing ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleLabelSubmit}
                onKeyDown={handleKeyDown}
                className="px-2 py-1 text-xs bg-white border border-blue-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ minWidth: '80px' }}
                autoFocus
              />
            ) : (
              <div
                onDoubleClick={handleLabelDoubleClick}
                className="px-2 py-1 bg-white border border-gray-200 rounded shadow-sm cursor-pointer hover:bg-gray-50"
                style={{ fontSize: '11px', color: '#374151' }}
              >
                {data.label}
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default EditableConnectionLine;