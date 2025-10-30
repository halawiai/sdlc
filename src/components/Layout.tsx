import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Calendar, Menu, X, Home, ChevronRight, ArrowUp, Search, Bookmark, Share2, Printer, Download, Moon, Sun, HelpCircle, FileText } from 'lucide-react';
import FeedbackModal from './FeedbackModal';
import { buildSearchIndex, searchContent, SearchResult } from '../utils/searchIndex';
import { exportToPDF, exportToExcel, exportToWord } from '../utils/exportUtils';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showBackToTop?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = "PMO Project Lifecycle Process", 
  description = "Interactive project management process flow diagram",
  showBackToTop = true,
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBackToTopBtn, setShowBackToTopBtn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchIndex, setSearchIndex] = useState<SearchResult[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const dropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();

  // Navigation items
  const menuStructure = [
    {
      id: 'process',
      name: 'Process',
      icon: '📊',
      items: [
        { path: '/process-flow-test', name: 'Process Flow - V2', icon: '🔬' },
        { path: '/raci-matrix', name: 'RACI Matrix', icon: '📋' },
        { path: '/criteria', name: 'Criteria Matrix', icon: '🧮' },
        { path: '/prioritization-framework', name: 'Prioritization Framework', icon: '⚖️' }
      ]
    },
    {
      id: 'documentation',
      name: 'Documentation',
      icon: '📖',
      items: [
        { path: '/full-lifecycle', name: 'Full Lifecycle', icon: '📖' },
        { path: '/governance-framework', name: 'Governance Framework', icon: '🛡️' },
        { path: '/sdlc-process', name: 'SDLC Process', icon: '📋' }
      ]
    }
  ];

  const utilityItems = [
    { path: '/sitemap', name: 'Sitemap', icon: '🗺️' }
  ];

  // Get all navigation items for breadcrumb generation
  const getAllNavItems = () => {
    const allItems: any[] = [];
    menuStructure.forEach(menu => {
      allItems.push(...menu.items);
    });
    allItems.push(...utilityItems);
    return allItems;
  };

  const navItems = getAllNavItems();

  // Breadcrumb generation
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Home', path: '/' }];
    
    // Special handling for root path with title
    if (location.pathname === '/' && title) {
      breadcrumbs.push({ name: title, path: '/' });
      return breadcrumbs;
    }
    
    const allNavItems = getAllNavItems();
    let currentPath = '';
    pathSegments.forEach(segment => {
      currentPath += `/${segment}`;
      const navItem = allNavItems.find(item => item.path === currentPath);
      if (navItem) {
        breadcrumbs.push({ name: navItem.name, path: currentPath });
      } else if (title && currentPath === location.pathname) {
        // Use title if no nav item found but title is provided
        breadcrumbs.push({ name: title, path: currentPath });
      }
    });
    
    return breadcrumbs;
  };

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTopBtn(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', (!darkMode).toString());
  };

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
    
    // Build search index
    setSearchIndex(buildSearchIndex());
    
    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Bookmark functionality
  const toggleBookmark = () => {
    const currentPath = location.pathname;
    const newBookmarks = bookmarks.includes(currentPath)
      ? bookmarks.filter(b => b !== currentPath)
      : [...bookmarks, currentPath];
    
    setBookmarks(newBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
  };

  // Load bookmarks
  useEffect(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarks(savedBookmarks);
  }, []);

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Print functionality
  const handlePrint = () => {
    window.print();
  };

  // Export functionality (placeholder)
  const handleExport = async (format: string) => {
    const currentPage = location.pathname.split('/').pop() || 'home';
    const filename = `pmo-${currentPage}-${Date.now()}`;
    
    switch (format.toLowerCase()) {
      case 'pdf':
        await exportToPDF('root', filename);
        break;
      case 'word':
        const content = document.body.innerText;
        exportToWord(content, filename);
        break;
      case 'excel':
        // Create sample data for Excel export
        const data = [
          { Page: currentPage, Timestamp: new Date().toISOString(), Content: 'PMO Lifecycle Data' }
        ];
        exportToExcel(data, filename);
        break;
      default:
        alert(`Export to ${format} not implemented yet`);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchContent(query, searchIndex);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    setShowSearchResults(false);
    setSearchQuery('');
    // Navigate to the result URL
    window.location.href = result.url;
  };

  // Check if current path is in a menu group
  const isMenuActive = (menuId: string) => {
    const menu = menuStructure.find(m => m.id === menuId);
    return menu?.items.some(item => item.path === location.pathname) || false;
  };

  // Toggle dropdown menu
  const toggleDropdown = (menuId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === menuId ? null : menuId);
  };

  // Handle dropdown mouse enter with timeout clearing
  const handleDropdownMouseEnter = (menuId: string) => {
    // Clear any pending close timeout
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setOpenDropdown(menuId);
  };

  // Handle dropdown mouse leave with delay
  const handleDropdownMouseLeave = () => {
    // Set a delay before closing the dropdown
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200); // 200ms delay
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="min-h-screen bg-white transition-colors duration-300">
          {/* Professional Header */}
          <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo and Title */}
                <div className="flex items-center space-x-4">
                  <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                    <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h1 className="text-xl font-bold text-gray-900 dark:text-white">PMO Lifecycle</h1>
                      <p className="text-xs text-gray-500 dark:text-gray-400">HALA 2025</p>
                    </div>
                  </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-1 mx-6">
                  {/* Main Menu Items with Dropdowns */}
                  {menuStructure.map((menu) => (
                    <div 
                      key={menu.id} 
                      className="relative dropdown-container group"
                      onMouseEnter={() => handleDropdownMouseEnter(menu.id)}
                      onMouseLeave={handleDropdownMouseLeave}
                    >
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                          isMenuActive(menu.id)
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="text-base">{menu.icon}</span>
                        {menu.name}
                        <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                          openDropdown === menu.id ? 'rotate-90' : ''
                        }`} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {openDropdown === menu.id && (
                        <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 opacity-100 visible transform translate-y-0 transition-all duration-200">
                          {menu.items.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={`block px-4 py-2 text-sm transition-colors ${
                                location.pathname === item.path
                                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              <span className="mr-2">{item.icon}</span>
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Utility Items */}
                  {utilityItems.filter(item => item.path !== '/sitemap').map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        location.pathname === item.path
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="mr-2 text-base">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  {/* Search */}
                  <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => searchQuery && setShowSearchResults(true)}
                      onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                      className="pl-10 pr-4 py-2 w-64 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 opacity-100 visible transform translate-y-0 transition-all duration-200">
                        {searchResults.map((result) => (
                          <button
                            key={result.id}
                            onClick={() => handleSearchResultClick(result)}
                            className="block w-full text-left px-4 py-2 text-sm transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <div className="font-medium text-gray-900 dark:text-white text-sm">{result.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result.page}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <button
                    onClick={toggleBookmark}
                    className={`p-2 rounded-lg transition-colors ${
                      bookmarks.includes(location.pathname)
                        ? 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    title="Bookmark this page"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Share this page"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Print this page"
                  >
                    <Printer className="w-4 h-4" />
                  </button>

                  <div className="relative group">
                    <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <button
                        onClick={() => handleExport('PDF')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                      >
                        Export as PDF
                      </button>
                      <button
                        onClick={() => handleExport('Word')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Export as Word
                      </button>
                      <button
                        onClick={() => handleExport('Excel')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                      >
                        Export as Excel
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Toggle dark mode"
                  >
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>

                  <Link
                    to="/help"
                    className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Help"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </Link>

                  {/* Mobile menu button */}
                  <button
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                    className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            {showMobileMenu && (
              <div className="lg:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto absolute top-full left-0 right-0 shadow-lg">
                <div className="px-4 py-2 space-y-1">
                  {/* Mobile Menu Structure */}
                  {menuStructure.map((menu) => (
                    <div key={menu.id}>
                      <button
                        onClick={() => setOpenMobileMenu(openMobileMenu === menu.id ? null : menu.id)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <span>{menu.icon}</span>
                          {menu.name}
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${
                          openMobileMenu === menu.id ? 'rotate-90' : ''
                        }`} />
                      </button>
                      
                      {/* Mobile Submenu */}
                      {openMobileMenu === menu.id && (
                        <div className="ml-4 mt-1 space-y-1">
                          {menu.items.map((item) => (
                            <Link
                              key={item.path}
                              to={item.path}
                              onClick={() => {
                                setShowMobileMenu(false);
                                setOpenMobileMenu(null);
                              }}
                              className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                                location.pathname === item.path
                                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                            >
                              <span className="mr-2">{item.icon}</span>
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Mobile Utility Items */}
                  {utilityItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMobileMenu(false)}
                      className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === item.path
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </header>

          {/* Breadcrumb Navigation */}
          {breadcrumbs.length > 1 && (
            <nav className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-x-auto mt-16">
              <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center space-x-2 py-3 text-sm min-w-max">
                  {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                      {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                      {index === breadcrumbs.length - 1 ? (
                        <span className="text-gray-900 dark:text-white font-medium whitespace-nowrap">{crumb.name}</span>
                      ) : (
                        <Link
                          to={crumb.path}
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors whitespace-nowrap"
                        >
                          {crumb.name}
                        </Link>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </nav>
          )}

          {/* Main Content */}
          <main className="relative">
            {children}
          </main>

          {/* Back to Top Button */}
          {showBackToTop && showBackToTopBtn && (
            <button
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-40"
              title="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          )}

          {/* Professional Footer */}
          <footer className="bg-gray-900 dark:bg-gray-950 text-white mt-16">
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-3 mb-4">
                    <Calendar className="w-8 h-8 text-blue-400" />
                    <div>
                      <h3 className="text-xl font-bold">PMO Lifecycle Process</h3>
                      <p className="text-gray-400 text-sm">HALA 2025</p>
                    </div>
                  </div>
                  <p className="text-gray-400 mb-4 max-w-md">
                    Professional project management office lifecycle framework for enterprise project execution and governance.
                  </p>
                  <div className="text-sm text-gray-500">
                    <p>Version 2.1.0 • Last updated: January 2025</p>
                    <p>© 2025 HALA Project Management Office</p>
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/sitemap"
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        Sitemap
                      </Link>
                    </li>
                    {navItems.filter(item => item.path !== '/sitemap').slice(0, 5).map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className="text-gray-400 hover:text-white transition-colors text-sm"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Support</h4>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
                        Help & Documentation
                      </Link>
                    </li>
                    <li>
                      <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                        About PMO Process
                      </Link>
                    </li>
                    <li>
                      <a href="mailto:pmo@hala.com" className="text-gray-400 hover:text-white transition-colors">
                        Contact Support
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={() => setShowFeedbackModal(true)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Send Feedback
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
      />
    </div>
  );
};

export default Layout;