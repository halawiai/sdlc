import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronRight, BookOpen, Play, FileText, Grid, Shield, Eye, MessageCircle, Mail, Phone } from 'lucide-react';

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const gettingStarted = [
    {
      title: 'Understanding the PMO Lifecycle',
      description: 'Learn about the 8-phase project management methodology',
      steps: [
        'Start with the Process Flow page to get an overview',
        'Review each phase\'s objectives and deliverables',
        'Understand the role assignments using the RACI matrix',
        'Explore governance processes for quality assurance'
      ]
    },
    {
      title: 'Navigation Basics',
      description: 'Master the application navigation and features',
      steps: [
        'Use the top navigation bar to switch between pages',
        'Click on interactive elements for detailed information',
        'Use the search functionality to find specific content',
        'Bookmark frequently accessed sections'
      ]
    },
    {
      title: 'Using Interactive Features',
      description: 'Make the most of clickable elements and dynamic content',
      steps: [
        'Click phase circles to view detailed information',
        'Expand timeline cards for comprehensive phase details',
        'Use filters and search to find relevant information',
        'Export content for offline reference'
      ]
    }
  ];

  const pageGuides = [
    {
      icon: <FileText className="w-5 h-5" />,
      name: 'Process Flow',
      description: 'Interactive phase overview with updated phase names: Requirements + Design, Business Review, Post Implementation, Closed',
      features: ['Clickable phase circles', 'Detailed info boxes', 'Role legend', 'Exception states']
    },
    {
      icon: <Eye className="w-5 h-5" />,
      name: 'Visual Process',
      description: 'Comprehensive flowchart with updated phase names and connections',
      features: ['SVG flowchart', 'Phase information boxes', 'Process arrows', 'Detailed layouts']
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      name: 'Full Lifecycle',
      description: 'Complete timeline with expandable phase cards including Requirements + Design, Business Review, Post Implementation, Closed',
      features: ['Timeline view', 'Expandable cards', 'Gate criteria', 'Task lists', 'Search navigation']
    },
    {
      icon: <Grid className="w-5 h-5" />,
      name: 'RACI Matrix',
      description: 'Responsibility assignment matrix with updated phase names and role definitions',
      features: ['Interactive matrix', 'Role descriptions', 'Filter options', 'Statistics view']
    },
    {
      icon: <Shield className="w-5 h-5" />,
      name: 'Governance Framework',
      description: 'Process governance with templates and procedures',
      features: ['Expandable sections', 'Template downloads', 'Process workflows', 'Search functionality']
    }
  ];

  const faqs = [
    {
      question: 'How do I navigate between different phases?',
      answer: 'You can navigate between phases using several methods: click on phase circles in the Process Flow, use the timeline in Full Lifecycle, or use the quick navigation buttons available on each page. The 8 phases include Initiation, Requirements + Design, Business Review, Planning, Development, QA, Post Implementation, and Closed. The global search functionality also helps you find specific phase information quickly across all pages.'
    },
    {
      question: 'What does each RACI designation mean?',
      answer: 'RACI stands for: Responsible (R) - does the work, Accountable (A) - ultimately answerable for the outcome, Consulted (C) - provides input and expertise, Informed (I) - kept updated on progress. Each role is color-coded in the matrix for easy identification.'
    },
    {
      question: 'Can I export or print the content?',
      answer: 'Yes! Each page has full export functionality. Use the download button in the header to export as PDF, Word, or Excel formats. Templates in the Governance Framework can also be downloaded directly. You can also use the print button for print-friendly layouts, or use your browser\'s print function (Ctrl+P).'
    },
    {
      question: 'How do I bookmark frequently used sections?',
      answer: 'Click the bookmark icon in the header to save the current page to your favorites. Bookmarked pages are stored locally and will be highlighted when you return to them. You can also use your browser\'s bookmark feature for permanent storage.'
    },
    {
      question: 'What are the governance framework templates?',
      answer: 'The Governance Framework page includes downloadable templates for communication plans, risk assessments, change requests, and quality checklists. These templates are now fully functional and can be downloaded in PDF, Word, or Excel formats. They are designed to standardize processes across your organization.'
    },
    {
      question: 'How do I search across all content?',
      answer: 'Use the search bar in the header to search across all pages and content. The global search function looks through phase names, descriptions, tasks, governance items, and FAQ content to help you find relevant information quickly. Search results appear in a dropdown with direct links to the relevant sections.'
    },
    {
      question: 'Can I customize the framework for my organization?',
      answer: 'While this application provides a standard 8-phase framework (Initiation, Requirements + Design, Business Review, Planning, Development, QA, Post Implementation, Closed), you can adapt the processes, templates, and procedures to fit your organization\'s specific needs. The framework is designed to be flexible and customizable.'
    },
    {
      question: 'What browsers are supported?',
      answer: 'The application works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of your preferred browser with JavaScript enabled.'
    },
    {
      question: 'Are the visual diagrams interactive?',
      answer: 'Yes! All visual elements including phase circles, information boxes, and special elements are now fully interactive. Click on any element in the Visual Process page or other diagrams to view detailed information in a modal popup. This makes exploring the process much more engaging and informative.'
    },
    {
      question: 'How do I access video tutorials?',
      answer: 'Video tutorials are coming soon! We are developing comprehensive video guides for complex features like the Editable Test Page and navigating the React Flow diagrams. Check back for updates or contact support for early access.'
    }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <HelpCircle className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">
            Help & Documentation
          </h1>
        </div>
        <p className="text-gray-600 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
          Learn how to navigate and use the PMO Project Lifecycle Process application effectively. 
          Find answers to common questions and discover all available features.
        </p>
      </div>

      {/* Getting Started */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Play className="w-6 h-6 text-green-600" />
          Getting Started
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {gettingStarted.map((guide, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">{guide.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
              <ol className="space-y-2">
                {guide.steps.map((step, stepIndex) => (
                  <li key={stepIndex} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {stepIndex + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* Page Guides */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Page Guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pageGuides.map((page, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {page.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{page.name}</h3>
                  <p className="text-gray-600 text-sm">{page.description}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2 text-sm">Key Features:</h4>
                <ul className="space-y-1">
                  {page.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-purple-600" />
          Frequently Asked Questions
        </h2>
        
        {/* FAQ Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-800 pr-4">{faq.question}</h3>
                {expandedFAQ === index ? (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {expandedFAQ === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No FAQ items match your search.</p>
          </div>
        )}
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Need More Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm mb-3">Get help via email</p>
            <a href="mailto:pmo@hala.com" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              pmo@hala.com
            </a>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Phone Support</h3>
            <p className="text-gray-600 text-sm mb-3">Speak with our team</p>
            <a href="tel:+1-555-PMO-HELP" className="text-green-600 hover:text-green-700 font-medium text-sm">
              +1 (555) PMO-HELP
            </a>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm mb-3">Chat with support (Coming Soon)</p>
            <button 
              onClick={() => alert('Live chat feature is coming soon! Please use email or phone support for immediate assistance.')}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm"
            >
              Coming Soon
            </button>
          </div>
        </div>
        
        {/* Video Tutorials Section */}
        <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-4 text-center">📹 Video Tutorials (Coming Soon)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Getting Started</h4>
              <p className="text-sm text-blue-600">Complete walkthrough of the PMO lifecycle process</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Interactive Features</h4>
              <p className="text-sm text-blue-600">How to use clickable elements and navigation</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Advanced Usage</h4>
              <p className="text-sm text-blue-600">Export, search, and customization features</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;