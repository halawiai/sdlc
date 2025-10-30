import React from 'react';
import { Handle, Position } from 'reactflow';

interface SpecialElementNodeData {
  name: string;
  type: 'approval' | 'golive' | 'release';
  onClick?: (nodeId: string) => void;
}

interface SpecialElementNodeProps extends NodeProps {
  data: SpecialElementNodeData;
  id: string;
}

const SpecialElementNode: React.FC<SpecialElementNodeProps> = ({ data, id }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onClick) {
      data.onClick(id);
    }
  };

  const isApproval = data.type === 'approval';
  const isRelease = data.type === 'release';
  
  if (isApproval) {
    // Business with Approval - Green rounded rectangle
    return (
      <div 
        onClick={handleClick}
        style={{
        background: 'linear-gradient(135deg, #10B981, #059669)',
        borderRadius: '20px',
        padding: '8px 16px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '2px solid white',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        minWidth: '120px',
        textAlign: 'center'
      }}
      className="special-element-node"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
      >
        {data.name}
        <Handle type="source" position={Position.Bottom} />
        <Handle type="target" position={Position.Top} />
      </div>
    );
  } else if (data.type === 'golive') {
    // Go Live - Blue star/badge
    return (
      <div 
        onClick={handleClick}
        style={{
        background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
        borderRadius: '50%',
        width: '80px',
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '11px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '2px solid white',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        textAlign: 'center',
        position: 'relative'
      }}
      className="special-element-node"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
      >
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          lineHeight: '1.2'
        }}>
          ⭐
          <div style={{ fontSize: '9px', marginTop: '2px' }}>{data.name}</div>
        </div>
        <Handle type="source" position={Position.Bottom} />
        <Handle type="target" position={Position.Top} />
      </div>
    );
  } else if (isRelease) {
    // Release Management - Light blue rounded rectangle
    return (
      <div 
        onClick={handleClick}
        style={{
        background: 'linear-gradient(135deg, #06B6D4, #0891B2)',
        borderRadius: '20px',
        padding: '8px 16px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        border: '2px solid white',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        minWidth: '140px',
        textAlign: 'center'
      }}
      className="special-element-node"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
      >
        {data.name}
        <Handle type="source" position={Position.Bottom} />
        <Handle type="target" position={Position.Top} />
      </div>
    );
  } else {
    return null;
  }
};

export default SpecialElementNode;