import React from 'react';
import { Calendar, Target, Users, Zap, CheckCircle, ArrowRight, BookOpen, Shield, TrendingUp, FileText } from 'lucide-react';

const AboutPage: React.FC = () => {
  const benefits = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Structured Approach',
      description: 'Standardized methodology ensures consistent project execution across all initiatives'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Clear Accountability',
      description: 'RACI matrix defines roles and responsibilities, eliminating confusion and overlap'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Risk Mitigation',
      description: 'Built-in governance framework identifies and addresses risks proactively'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Improved Success Rate',
      description: 'Gate criteria and quality checkpoints ensure deliverables meet business objectives'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Faster Delivery',
      description: 'Streamlined processes and clear workflows reduce delays and bottlenecks'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: 'Quality Assurance',
      description: 'Comprehensive testing and validation processes ensure high-quality outcomes'
    }
  ];

  const phases = [
    { id: 1, name: 'Initiation', color: 'from-blue-500 to-blue-600' },
    { id: 2, name: 'Requirements + Design', color: 'from-blue-600 to-teal-500' },
    { id: 3, name: 'Business Review', color: 'from-teal-500 to-green-500' },
    { id: 4, name: 'Planning', color: 'from-green-500 to-green-600' },
    { id: 5, name: 'Development', color: 'from-green-600 to-emerald-500' },
    { id: 6, name: 'QA', color: 'from-emerald-500 to-teal-600' },
    { id: 7, name: 'Post Implementation', color: 'from-teal-600 to-blue-500' },
    { id: 8, name: 'Closed', color: 'from-blue-500 to-indigo-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Calendar className="w-12 h-12 text-blue-600" />
          <h1 className="text-4xl md:text-5xl font-black text-gray-800 tracking-tight">
            About PMO Lifecycle
          </h1>
        </div>
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-full inline-block mb-6">
          <span className="font-bold text-xl tracking-wide">HALA 2025 Framework</span>
        </div>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          A comprehensive project management office framework designed to standardize, streamline, 
          and optimize project execution across enterprise organizations.
        </p>
      </div>

      {/* Methodology Overview */}
      <div className="mb-16">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Methodology Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 leading-relaxed mb-6">
                The PMO Project Lifecycle Process is a battle-tested methodology that guides projects 
                from initial concept through successful closure. Built on industry best practices and 
                refined through real-world implementation, this framework ensures consistent delivery 
                of high-quality solutions.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Our approach emphasizes collaboration, transparency, and accountability at every stage. 
                By clearly defining roles, responsibilities, and deliverables, teams can focus on 
                execution rather than process confusion.
              </p>
              <div className="flex items-center gap-3 text-blue-600 font-semibold">
                <BookOpen className="w-5 h-5" />
                <span>8 Structured Phases • 4 Governance Areas • Clear Accountability</span>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-4 gap-3">
                {phases.map((phase) => (
                  <div
                    key={phase.id}
                    className={`
                      w-16 h-16 rounded-full bg-gradient-to-br ${phase.color}
                      flex items-center justify-center text-white font-bold text-sm
                      shadow-lg transform hover:scale-110 transition-all duration-300
                    `}
                  >
                    {phase.id}
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                  <div className="text-2xl font-bold text-gray-800">8</div>
                  <div className="text-xs text-gray-600 font-medium">Phases</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Framework Benefits */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Framework Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{benefit.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Implementation Guide */}
      <div className="mb-16">
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Implementation Guide</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Getting Started</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Assess Current State</h4>
                    <p className="text-gray-600 text-sm">Evaluate existing project management processes and identify gaps</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Customize Framework</h4>
                    <p className="text-gray-600 text-sm">Adapt the framework to your organization's specific needs and culture</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Train Teams</h4>
                    <p className="text-gray-600 text-sm">Provide comprehensive training on roles, processes, and tools</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Pilot Implementation</h4>
                    <p className="text-gray-600 text-sm">Start with a pilot project to validate and refine the approach</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Best Practices</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Maintain consistent communication across all stakeholders</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Document all decisions and changes for future reference</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Regular review and continuous improvement of processes</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Leverage data and metrics for informed decision making</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">Foster collaboration between cross-functional teams</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore the comprehensive PMO lifecycle process and start implementing structured 
            project management in your organization today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/process-flow"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              <FileText className="w-5 h-5" />
              Explore Process Flow
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/help"
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              View Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;