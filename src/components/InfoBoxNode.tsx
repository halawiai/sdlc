import React from 'react';
import { Handle, Position } from 'reactflow';

interface InfoBoxNodeData {
  type: 'owner' | 'process' | 'input' | 'output' | 'special';
  label: string;
  content: string;
  sourcePosition?: Position;
  targetPosition?: Position;
  onClick?: (nodeId: string) => void;
  accentColor?: string;
  pinId?: string;
  onTogglePin?: (id: string) => void;
  pinned?: boolean;
}

interface InfoBoxNodeProps extends NodeProps {
  data: InfoBoxNodeData;
  id: string;
}

const InfoBoxNode: React.FC<InfoBoxNodeProps> = ({ data, id }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.onClick) {
      data.onClick(id);
    }
  };

  const colorStyles = {
    owner: { bg: '#F5F3FF', border: '#E9D5FF', text: '#9333EA' },
    process: { bg: '#EFF6FF', border: '#DBEAFE', text: '#3B82F6' },
    input: { bg: '#F0FDF4', border: '#D1FAE5', text: '#10B981' },
    output: { bg: '#FFF7ED', border: '#FED7AA', text: '#F59E0B' },
    special: { bg: '#FFFBEB', border: '#FDE68A', text: '#D97706' }
  };
  
  const baseStyle = colorStyles[data.type] || colorStyles.process;
  const style = data.accentColor ? {
    ...baseStyle,
    border: data.accentColor,
    text: data.accentColor
  } : baseStyle;
  
  return (
    <div 
      onClick={handleClick}
      style={{
      background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: '6px',
      padding: '12px',
      minWidth: '180px',
      maxWidth: '220px',
      fontSize: '11px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer'
    }}
    className="info-box-node"
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'scale(1.02)';
      e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'scale(1)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }}
    >
      <div style={{
        fontWeight: '700',
        color: style.text,
        marginBottom: '6px',
        fontSize: '10px',
        textAlign: 'center',        
        width: '100%'               // ✅ ensures full span so centering works
      }}>
        {data.label}
      </div>
      <div style={{
        color: '#374151',
        lineHeight: '1.5'
      }}>
        {data.content}
      </div>
      
      {/* Pin button */}
      {data.pinId && data.onTogglePin && (
        <button
          onClick={(e) => { e.stopPropagation(); data.onTogglePin?.(data.pinId); }}
          title={data.pinned ? 'Unpin' : 'Pin'}
          style={{
            position: 'absolute',
            top: 6,
            right: 6,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '12px',
            opacity: data.pinned ? 1 : 0.5,
            filter: data.pinned ? 'none' : 'grayscale(100%)'
          }}
        >
          📌
        </button>
      )}
      
      <Handle type="source" position={data.sourcePosition || Position.Right} />
      <Handle type="target" position={data.targetPosition || Position.Left} />
    </div>
  );
};

export default InfoBoxNode;