import React from 'react';
import { MapPin, FileText, User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: MapPin },
    { path: '/report', label: 'Report Issue', icon: FileText },
    { path: '/profile', label: 'Profile', icon: User }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">CivicTrack</h1>
          </div>

          {user ? (
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-1">
                {navItems.map(({ path, label, icon: Icon }) => (
                  <button
                    key={path}
                    onClick={() => navigate(path)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === path
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>

              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
