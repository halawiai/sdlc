// Global search utility for indexing and searching all content
import { fullLifecyclePhases } from '../data/lifecycleData';

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'phase' | 'governance' | 'faq' | 'help';
  page: string;
  url: string;
}

// Build search index from all content
export const buildSearchIndex = (): SearchResult[] => {
  const results: SearchResult[] = [];

  // Index lifecycle phases
  fullLifecyclePhases.forEach(phase => {
    results.push({
      id: `phase-${phase.id}`,
      title: `Phase ${phase.id}: ${phase.name}`,
      content: `${phase.focus} ${phase.keyTasks.join(' ')} ${phase.input.join(' ')} ${phase.output.join(' ')} ${phase.gateCriteria.join(' ')}`,
      type: 'phase',
      page: 'Full Lifecycle',
      url: `/full-lifecycle#phase-${phase.id}`
    });
  });

  // Index governance items
  const governanceItems = [
    {
      id: 'communication',
      title: 'Communication Matrix',
      content: 'Weekly status reports phase gate reviews escalation path stakeholder updates',
      page: 'Governance Framework',
      url: '/governance-framework#communication'
    },
    {
      id: 'risk',
      title: 'Risk Management',
      content: 'Risk register maintenance monthly risk review escalation triggers mitigation tracking',
      page: 'Governance Framework',
      url: '/governance-framework#risk'
    },
    {
      id: 'change',
      title: 'Change Management',
      content: 'Formal change request process impact assessment approval hierarchy change log maintenance',
      page: 'Governance Framework',
      url: '/governance-framework#change'
    },
    {
      id: 'quality',
      title: 'Quality Gates',
      content: 'Deliverable review checkpoints compliance validation performance benchmarks quality metrics tracking',
      page: 'Governance Framework',
      url: '/governance-framework#quality'
    }
  ];

  governanceItems.forEach(item => {
    results.push({
      id: item.id,
      title: item.title,
      content: item.content,
      type: 'governance',
      page: item.page,
      url: item.url
    });
  });

  // Index FAQ items
  const faqItems = [
    {
      id: 'faq-navigation',
      title: 'How do I navigate between different phases?',
      content: 'navigate phases click circles timeline search functionality',
      page: 'Help',
      url: '/help#faq'
    },
    {
      id: 'faq-raci',
      title: 'What does each RACI designation mean?',
      content: 'RACI responsible accountable consulted informed color-coded matrix',
      page: 'Help',
      url: '/help#faq'
    },
    {
      id: 'faq-export',
      title: 'Can I export or print the content?',
      content: 'export PDF Word Excel print functionality download',
      page: 'Help',
      url: '/help#faq'
    }
  ];

  faqItems.forEach(item => {
    results.push({
      id: item.id,
      title: item.title,
      content: item.content,
      type: 'faq',
      page: item.page,
      url: item.url
    });
  });

  return results;
};

// Search function
export const searchContent = (query: string, index: SearchResult[]): SearchResult[] => {
  if (!query.trim()) return [];
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  
  return index.filter(item => {
    const searchableText = `${item.title} ${item.content}`.toLowerCase();
    return searchTerms.some(term => searchableText.includes(term));
  }).slice(0, 10); // Limit to top 10 results
};