import React from 'react';
import {
  Calendar, MapPin, ThumbsUp,
  AlertCircle, CheckCircle, Clock,
  XCircle, EyeOff
} from 'lucide-react';

export const IssueCard = ({ issue, onClick }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'reported': return <AlertCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'resolved': return <CheckCircle className="h-4 w-4" />;
      case 'closed': return <XCircle className="h-4 w-4" />;
      case 'hidden': return <EyeOff className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reported': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'hidden': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getCategoryIcon = (category) => ({
    roads: '🛣', waste: '🗑', water: '💧',
    lighting: '💡', parks: '🌳', other: '📋'
  }[category] || '📋');

  const getCategoryLabel = (category) => ({
    roads: 'Roads & Transportation', waste: 'Waste Management',
    water: 'Water & Sewage', lighting: 'Street Lighting',
    parks: 'Parks & Recreation', other: 'Other Issues'
  }[category] || 'Other Issues');

  if (issue.isHidden) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 opacity-60">
        <div className="flex items-center space-x-2 text-red-600">
          <EyeOff className="h-5 w-5" />
          <span className="font-medium">This issue has been hidden due to spam reports</span>
        </div>
        <p className="text-red-500 text-sm mt-2">Issue: {issue.title}</p>
      </div>
    );
  }

  const coordinates = issue.location?.coordinates;
  const locationText = coordinates
    ? `Lat: ${coordinates[1]}, Lng: ${coordinates[0]}`
    : 'Location unavailable';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md border-l-4 p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getCategoryIcon(issue.category)}</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{issue.title}</h3>
            <p className="text-sm text-gray-500">{getCategoryLabel(issue.category)}</p>
          </div>
        </div>
        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
          {getStatusIcon(issue.status)}
          <span className="capitalize">{issue.status?.replace('-', ' ')}</span>
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{issue.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{locationText}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>
              {issue.createdAt
                ? new Date(issue.createdAt).toLocaleDateString()
                : 'Date not available'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
