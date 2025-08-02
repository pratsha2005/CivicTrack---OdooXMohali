import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, ThumbsUp, User, CheckCircle, Clock, AlertCircle, XCircle, Flag } from 'lucide-react';

export const IssueDetail = ({ issue, onBack, onVote, onReportSpam }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'reported':
        return <AlertCircle className="h-5 w-5" />;
      case 'in-progress':
        return <Clock className="h-5 w-5" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5" />;
      case 'closed':
        return <XCircle className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reported':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'urgent':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
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
    return icons[category] || '📋';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Issues</span>
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{getCategoryIcon(issue.category)}</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
                <p className="text-gray-600 capitalize">{issue.category.replace('-', ' ')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(issue.status)}`}>
                {getStatusIcon(issue.status)}
                <span className="capitalize">{issue.status.replace('-', ' ')}</span>
              </span>
              <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${getPriorityColor(issue.priority)}`}>
                {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} Priority
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{issue.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Reported {issue.reportedAt.toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>By {issue.reportedBy}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-700 leading-relaxed">{issue.description}</p>
        </div>

        {/* Timeline */}
        {(issue.estimatedResolution || issue.actualResolution) && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Reported on {issue.reportedAt.toLocaleDateString()}
                </span>
              </div>
              {issue.estimatedResolution && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Estimated resolution: {issue.estimatedResolution.toLocaleDateString()}
                  </span>
                </div>
              )}
              {issue.actualResolution && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Resolved on {issue.actualResolution.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Engagement */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Community Engagement</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onVote(issue.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{issue.votes} votes</span>
              </button>
              <button
                onClick={() => onReportSpam(issue.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Flag className="h-4 w-4" />
                <span>Report Spam</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};