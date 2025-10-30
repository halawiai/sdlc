import React from 'react';
import { Handle, Position } from 'reactflow';

interface ExceptionNodeData {
  name: string;
  type: 'dropped' | 'onhold';
  onClick?: (nodeId: string) => void;
}

interface ExceptionNodeProps extends NodeProps {
  data: ExceptionNodeData;
  id: string;
}

const ExceptionNode: React.FC<ExceptionNodeProps> = ({ data, id }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onClick) {
      data.onClick(id);
    }
  };

  const isDropped = data.type === 'dropped';
  const gradientColors = isDropped 
    ? { start: '#EF4444', end: '#DC2626' } // Red for DROPPED
    : { start: '#F97316', end: '#EA580C' }; // Orange for ON HOLD
  
  return (
    <div 
      onClick={handleClick}
      style={{
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${gradientColors.start}, ${gradientColors.end})`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '9px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      border: '2px solid white',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      textAlign: 'center',
      lineHeight: '1.1'
    }}
    className="exception-node"
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.1)';
      e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    }}
    >
      <div style={{ 
        fontSize: '8px', 
        fontWeight: '800',
        letterSpacing: '0.5px'
      }}>
        {data.name}
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default ExceptionNode;