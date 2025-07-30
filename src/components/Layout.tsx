import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
import { PenTool, Home, User, LogOut, Plus, BookOpen, Shield } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-900">
                <PenTool className="h-6 w-6 text-blue-600" />
                <span>HBP Publishing</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/edit"
                    className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Write</span>
                  </Link>
                  
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  )}

                  <div className="flex items-center space-x-3">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>{user?.firstName || user?.username}</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 HBP Publishing. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
