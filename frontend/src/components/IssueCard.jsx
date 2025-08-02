import React from 'react';
import {
  Calendar,
  MapPin,
  ThumbsUp,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

export const IssueCard = ({ issue, onClick }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'reported':
        return <AlertCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reported':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return '';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'border-l-green-400';
      case 'medium':
        return 'border-l-yellow-400';
      case 'high':
        return 'border-l-orange-400';
      case 'urgent':
        return 'border-l-red-400';
      default:
        return '';
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      roads: '🛣',
      waste: '🗑',
      water: '💧',
      lighting: '💡',
      parks: '🌳',
      other: '📋'
    };
    return icons[category];
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md border-l-4 ${getPriorityColor(
        issue.priority
      )} p-6 cursor-pointer hover:shadow-lg transition-shadow`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-xl">{getCategoryIcon(issue.category)}</span>
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{issue.title}</h3>
        </div>
        <span
          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
            issue.status
          )}`}
        >
          {getStatusIcon(issue.status)}
          <span className="capitalize">{issue.status.replace('-', ' ')}</span>
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{issue.description}</p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{issue.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(issue.reportedAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <ThumbsUp className="h-4 w-4" />
            <span>{issue.votes}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MessageCircle className="h-4 w-4" />
            <span>{issue.comments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};