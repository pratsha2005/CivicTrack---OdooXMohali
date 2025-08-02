import React from 'react';
import { MapPin, FileText } from 'lucide-react';

export const Header = ({ currentView, onViewChange, isLoggedIn, userAvatarUrl }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: MapPin },
    { id: 'report', label: 'Report Issue', icon: FileText }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + Title */}
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">CivicTrack</h1>
          </div>

          {/* Navigation and Login/Avatar */}
          <div className="flex items-center space-x-2">
            <nav className="flex space-x-1">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onViewChange(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            {/* Login or Avatar */}
            {isLoggedIn ? (
              <button
                onClick={() => onViewChange('edit-profile')}
                className="ml-4"
              >
                <img
                  src={userAvatarUrl || 'https://via.placeholder.com/32'}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full border-2 border-blue-500"
                />
              </button>
            ) : (
              <button
                onClick={() => onViewChange('login')}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
