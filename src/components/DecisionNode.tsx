import React from 'react';
import { Handle, Position } from 'reactflow';

export default function DecisionNode() {
  return (
    <div style={{ width: 80, height: 80, transform: 'rotate(45deg)', border: '2px solid #6b7280', background: 'white', borderRadius: 4 }}>
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
      <div style={{ transform: 'rotate(-45deg)', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#6b7280' }}>
        Owner Decision
      </div>
    </div>
  );
}