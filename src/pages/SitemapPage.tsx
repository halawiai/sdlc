import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Eye, BookOpen, Grid, Shield, Map, Info, HelpCircle, ChevronRight } from 'lucide-react';

const SitemapPage: React.FC = () => {
  const pages = [
    {
      path: '/',
      name: 'Process Flow',
      icon: <FileText className="w-5 h-5" />,
      description: 'Interactive phase circles with detailed information boxes and role assignments',
      sections: ['Phase Overview', 'Exception States', 'Role Legend', 'Interactive Details']
    },
    {
      path: '/visual-process',
      name: 'Visual Process',
      icon: <Eye className="w-5 h-5" />,
      description: 'Interactive React Flow diagram with navigation controls and minimap',
      sections: ['React Flow Interface', 'Interactive Nodes', 'Navigation Controls', 'Minimap']
    },
    {
      path: '/criteria',
      name: 'Criteria Matrix',
      icon: <Grid className="w-5 h-5" />,
      description: 'Scientific scoring system for phase routing decisions with interactive calculator',
      sections: ['Interactive Calculator', 'Decision Matrix', 'Example Scenarios', 'Implementation Guide']
    },
    {
      path: '/prioritization-framework',
      name: 'Prioritization Framework',
      icon: <Calculator className="w-5 h-5" />,
      description: 'WRIVE (Weighted RICE + Value/Effort) hybrid prioritization model for strategic initiative scoring',
      sections: ['WRIVE Formula', 'Scoring Criteria', 'Interactive Template', 'Workflow Integration', 'Priority Matrix']
    },
    {
      path: '/full-lifecycle',
      name: 'Full Lifecycle',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Complete timeline reference including Requirements + Design, Business Review, Post Implementation, and Closed phases',
      sections: ['Timeline View', 'Phase Cards', 'Gate Criteria', 'Task Lists', 'Special Logic']
    },
    {
      path: '/raci-matrix',
      name: 'RACI Matrix',
      icon: <Grid className="w-5 h-5" />,
      description: 'Responsibility assignment matrix with updated phase names: Requirements + Design, Business Review, Post Implementation, Closed',
      sections: ['RACI Legend', 'Responsibility Matrix', 'Role Descriptions', 'Statistics', 'Search & Filter']
    },
    {
      path: '/governance-framework',
      name: 'Governance Framework',
      icon: <Shield className="w-5 h-5" />,
      description: 'Comprehensive governance processes including communication, risk, change, and quality management',
      sections: ['Communication Matrix', 'Risk Management', 'Change Management', 'Quality Gates', 'Templates']
    },
    {
      path: '/sdlc-process',
      name: 'SDLC Process',
      icon: <BookOpen className="w-5 h-5" />,
      description: 'Complete Software Development Life Cycle documentation with detailed phase descriptions and deliverables',
      sections: ['Process Overview', 'Phase Documentation', 'Track Selection', 'RACI Assignments', 'SLA Information']
    },
    {
      path: '/about',
      name: 'About',
      icon: <Info className="w-5 h-5" />,
      description: 'Information about the PMO process methodology and framework',
      sections: ['Methodology Overview', 'Framework Benefits', 'Implementation Guide']
    },
    {
      path: '/help',
      name: 'Help',
      icon: <HelpCircle className="w-5 h-5" />,
      description: 'Documentation and guidance on using the PMO lifecycle application',
      sections: ['Getting Started', 'Navigation Guide', 'Feature Overview', 'FAQ']
    }
  ];

  const quickActions = [
    { name: 'Jump to Phase 1', path: '/full-lifecycle#phase-1' },
    { name: 'View RACI for Development', path: '/raci-matrix#phase-5' },
    { name: 'Communication Templates', path: '/governance-framework#communication' },
    { name: 'Risk Management Process', path: '/governance-framework#risk' },
    { name: 'Quality Gate Criteria', path: '/governance-framework#quality' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Map className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
            Site Map
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
          Navigate through all sections of the PMO Project Lifecycle Process application. 
          Find the information you need quickly with this comprehensive overview.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <span className="font-medium text-gray-800">{action.name}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Main Pages */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Main Pages</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pages.map((page) => (
            <div key={page.path} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {page.icon}
                </div>
                <div className="flex-1">
                  <Link
                    to={page.path}
                    className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    {page.name}
                  </Link>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                    {page.description}
                  </p>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-semibold text-gray-700 mb-2 text-sm">Page Sections:</h4>
                <div className="flex flex-wrap gap-2">
                  {page.sections.map((section, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link
                  to={page.path}
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                >
                  Visit Page
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Application Features */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Application Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Navigation</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Breadcrumb navigation</li>
              <li>• Deep linking support</li>
              <li>• Mobile-responsive menu</li>
              <li>• Quick jump navigation</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Interactive Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Clickable phase elements</li>
              <li>• Expandable content sections</li>
              <li>• Search functionality</li>
              <li>• Filter and sort options</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-700 mb-3">Export & Sharing</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• PDF export capability</li>
              <li>• Print-friendly layouts</li>
              <li>• Share functionality</li>
              <li>• Bookmark system</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <p className="text-sm text-blue-800 mb-2 font-medium">
            💡 Use this sitemap to quickly navigate to any section of the PMO lifecycle process
          </p>
          <p className="text-xs text-blue-600">
            All pages are optimized for desktop and mobile viewing with responsive design
          </p>
        </div>
      </div>
    </div>
  );
};

export default SitemapPage;