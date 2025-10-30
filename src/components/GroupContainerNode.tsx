import React from 'react';
import { Handle, Position } from 'reactflow';

export default function GroupContainerNode({ data }: any) {
  return (
    <div style={{
      width: data.width || 360, height: data.height || 220,
      border: '2px dashed #ec4899', background: '#fce7f3', borderRadius: 10, position: 'relative'
    }}>
      {/* Left handle for incoming connections */}
      <Handle 
        type="target" 
        position={Position.Left} 
        id="left"
        style={{ top: '50%', left: '-8px' }}
      />
      
      {/* Right handle for outgoing connections */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id="right"
        style={{ top: '50%', right: '-8px' }}
      />
      
      <div style={{ position: 'absolute', top: -18, left: '50%', transform: 'translateX(-50%)', fontSize: 12, fontWeight: 700, color: '#831843' }}>
        5 — Solution Development
      </div>
    </div>
  );
}