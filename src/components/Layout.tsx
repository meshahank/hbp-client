import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
import { 
  PenTool, 
  Home, 
  User, 
  LogOut, 
  Plus, 
  BookOpen, 
  Shield, 
  Menu, 
  X,
  Search,
  Settings,
  ChevronDown,
  Globe,
  TrendingUp,
  Users
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, isAuthenticated } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/explore', label: 'Explore', icon: Globe },
    { path: '/trending', label: 'Trending', icon: TrendingUp },
    { path: '/community', label: 'Community', icon: Users },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-xl font-semibold text-gray-900">InkSquare</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900 font-medium">Home</Link>
              <Link to="/explore" className="text-gray-700 hover:text-gray-900 font-medium">Explore</Link>
              <Link to="/trending" className="text-gray-700 hover:text-gray-900 font-medium">Trending</Link>
              <Link to="/community" className="text-gray-700 hover:text-gray-900 font-medium">Community</Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Desktop Search */}
              <form 
                className="hidden md:block"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const query = formData.get('search') as string;
                  if (query.trim()) {
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                  }
                }}
              >
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 w-64 bg-gray-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                </div>
              </form>
              {isAuthenticated ? (
                <>
                  {/* Create Button */}
                  <Link
                    to="/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1 inline" />
                    Create
                  </Link>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <BookOpen className="h-4 w-4 mr-3" />
                          My Articles
                        </Link>

                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Settings
                        </Link>

                        {isAdmin && (
                          <>
                            <div className="border-t border-gray-100 my-2"></div>
                            <Link
                              to="/admin"
                              className="flex items-center px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Shield className="h-4 w-4 mr-3" />
                              Admin Dashboard
                            </Link>
                          </>
                        )}

                        <div className="border-t border-gray-100 my-2"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="btn btn-ghost text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary btn-sm"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActivePath(item.path)
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Search */}
              <div className="pt-4">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const query = formData.get('search') as string;
                  if (query.trim()) {
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                    setIsMobileMenuOpen(false);
                  }
                }}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="search"
                      placeholder="Search..."
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-xl text-sm"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                  <PenTool className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gradient">HBP Publishing</h3>
                  <p className="text-sm text-gray-500">Creative Writing Platform</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                Empowering writers and readers to connect through compelling stories and meaningful content.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors duration-200">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors duration-200">About</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors duration-200">Blog</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors duration-200">Press</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-indigo-600 transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors duration-200">Contact</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors duration-200">Privacy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors duration-200">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-500">
              &copy; 2025 HBP Publishing. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
