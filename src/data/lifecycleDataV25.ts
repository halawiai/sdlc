export const lifecycleV25 = [
  { id: '0',   name: 'DISCOVERY',            focus: 'Identify scope & objectives', owner: 'Product + Business',           input: [], output: ['Project charter'],                    gradient: { start: '#9333ea', end: '#7c3aed' } },
  { id: '1',   name: 'INITIATION',           focus: 'Formal project start',        owner: 'PMO + Product',                 input: [], output: ['Resource allocation'],               gradient: { start: '#3b82f6', end: '#2563eb' } },
  { id: 'D',   name: 'OWNER DECISION',       focus: 'Choose Enterprise vs Product path', owner: 'Owner',                 input: [], output: ['Path decision'],                     gradient: { start: '#6b7280', end: '#6b7280' } },
  // Enterprise track
  { id: 'E2',  name: 'ENTERPRISE REQUIREMENTS', focus: 'Requirements',            owner: 'BA + Business',                 input: [], output: ['BRD document'],                      gradient: { start: '#fef3c7', end: '#fbbf24' } },
  { id: 'E3',  name: 'BUSINESS REVIEW',      focus: 'Business review & approval',  owner: 'Business + PMO',               input: [], output: ['Formal approval'],                   gradient: { start: '#fef3c7', end: '#fbbf24' } },
  { id: 'E4',  name: 'PLANNING',             focus: 'Planning & early QA test cases', owner: 'PMO + Product + QA',      input: [], output: ['Project plan','Test cases'],          gradient: { start: '#fef3c7', end: '#fbbf24' } },
  // Product track
  { id: 'P2',  name: 'PRODUCT REQUIREMENTS', focus: 'Requirements',                owner: 'Product + BA',                  input: [], output: ['User stories'],                      gradient: { start: '#bbf7d0', end: '#10b981' } },
  { id: 'P3',  name: 'DESIGN',               focus: 'UX/UI design',                owner: 'Design + Product',              input: [], output: ['UX/UI designs'],                     gradient: { start: '#bbf7d0', end: '#10b981' } },
  { id: 'P4',  name: 'GROOMING',             focus: 'Backlog refinement',          owner: 'Product + PMO',                 input: [], output: ['Refined backlog'],                   gradient: { start: '#bbf7d0', end: '#10b981' } },
  // Solution Development container children (parallel)
  { id: '5',   name: 'DEVELOPMENT',          focus: 'Solution development',        owner: 'Engineering',                   input: [], output: ['Working code'],                      gradient: { start: '#93c5fd', end: '#60a5fa' } },
  { id: '5.1', name: 'QA',                   focus: 'QA testing',                  owner: 'QA + PMO',                      input: [], output: ['Test results'],                      gradient: { start: '#93c5fd', end: '#60a5fa' } },
  // Right column
  { id: '6',   name: 'UAT',                  focus: 'User acceptance testing',     owner: 'Business + Product',            input: [], output: ['User approval'],                     gradient: { start: '#93c5fd', end: '#3b82f6' } },
  { id: '7',   name: 'RELEASE MANAGEMENT',   focus: 'Production deployment',       owner: 'Engineering + PMO',             input: [], output: ['Deployed release'],                  gradient: { start: '#93c5fd', end: '#3b82f6' } },
  { id: '8',   name: 'POST IMPLEMENTATION',  focus: 'Stabilization & metrics',     owner: 'PMO + Support',                 input: [], output: ['Performance metrics'],               gradient: { start: '#93c5fd', end: '#3b82f6' } },
  { id: '9',   name: 'CLOSURE',              focus: 'Lessons learned & closure',   owner: 'PMO + Product',                 input: [], output: ['Lessons learned'],                   gradient: { start: '#10b981', end: '#059669' } },
];