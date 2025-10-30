import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, FileText, Eye, BookOpen, Grid, Shield } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const quickLinks = [
    { path: '/', name: 'Process Flow', icon: <FileText className="w-4 h-4" /> },
    { path: '/visual-process', name: 'Visual Process', icon: <Eye className="w-4 h-4" /> },
    { path: '/full-lifecycle', name: 'Full Lifecycle', icon: <BookOpen className="w-4 h-4" /> },
    { path: '/raci-matrix', name: 'RACI Matrix', icon: <Grid className="w-4 h-4" /> },
    { path: '/governance-framework', name: 'Governance Framework', icon: <Shield className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-black text-gray-200 mb-4">404</div>
          <div className="relative">
            <Search className="w-16 h-16 text-gray-300 mx-auto" />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 text-lg mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500 text-sm">
            Don't worry, you can find what you're looking for using the links below.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="text-blue-600 group-hover:text-blue-700">
                  {link.icon}
                </div>
                <span className="font-medium text-gray-800 group-hover:text-gray-900">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Still can't find what you're looking for? 
            <Link to="/help" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
              Visit our help page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;