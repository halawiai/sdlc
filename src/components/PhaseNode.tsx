import React from 'react';
import { Handle, Position } from 'reactflow';

interface PhaseNodeData {
  number: number;
  name: string;
  gradientStart: string;
  gradientEnd: string;
  onClick?: (nodeId: string) => void;
}

interface PhaseNodeProps extends NodeProps {
  data: PhaseNodeData;
  id: string;
}

const PhaseNode: React.FC<PhaseNodeProps> = ({ data, id }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onClick) {
      data.onClick(id);
    }
  };

  return (
    <div 
      className="phase-node" 
      onClick={handleClick}
      style={{
        width: '96px',                 // fixed node width for consistent wrapping
        height: 'auto',                // auto height; circle + label control total height
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        rowGap: '6px',                 // spacing between circle and label
        cursor: 'pointer',
      }}
    >
      {/* Circle */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${data.gradientStart}, ${data.gradientEnd})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: '3px solid white',
          transition: 'transform 0.2s',
        }}
      >
        <div style={{ fontSize: '24px', fontWeight: 600, lineHeight: 1 }}>{data.number}</div>
      </div>

      {/* Label (FIXED HEIGHT, CENTERED) */}
      <div
        style={{
          fontSize: '10px',
          lineHeight: 1.2,
          textAlign: 'center',
          maxWidth: '88px',            // slightly less than container to avoid touching edges
          minHeight: '28px',           // reserves space for 1–2 lines to keep rows aligned
          padding: '0 4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          wordBreak: 'break-word',
          overflowWrap: 'anywhere',
          color: '#111827',
        }}
      >
        {data.name}
      </div>

      {/* Handles */}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
    </div>
  );
};

export default PhaseNode;