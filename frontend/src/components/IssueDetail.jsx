import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ThumbsUp,
  MessageCircle,
  User,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { mockIssues } from '../data/mockData';

export const IssueDetail = ({ issue, onBack, onVote, onComment }) => {
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim() && userName.trim()) {
      onComment(issue.id, newComment);
      setNewComment('');
    }
  };

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
        return null;
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
        return '';
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
                <p className="text-gray-600 capitalize">
                  {issue.category.replace('-', ' ')}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                  issue.status
                )}`}
              >
                {getStatusIcon(issue.status)}
                <span className="capitalize">
                  {issue.status.replace('-', ' ')}
                </span>
              </span>
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${getPriorityColor(
                  issue.priority
                )}`}
              >
                {issue.priority.charAt(0).toUpperCase() +
                  issue.priority.slice(1)}{' '}
                Priority
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
              <span>Reported {new Date(issue.reportedAt).toLocaleDateString()}</span>
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
                  Reported on{' '}
                  {new Date(issue.reportedAt).toLocaleDateString()}
                </span>
              </div>
              {issue.estimatedResolution && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Estimated resolution:{' '}
                    {new Date(issue.estimatedResolution).toLocaleDateString()}
                  </span>
                </div>
              )}
              {issue.actualResolution && (
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">
                    Resolved on{' '}
                    {new Date(issue.actualResolution).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Engagement */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Community Engagement
            </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onVote(issue.id)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{issue.votes} votes</span>
              </button>
              <div className="flex items-center space-x-2 text-gray-600">
                <MessageCircle className="h-4 w-4" />
                <span>{issue.comments.length} comments</span>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            {issue.comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-medium ${
                        comment.isOfficial ? 'text-blue-700' : 'text-gray-900'
                      }`}
                    >
                      {comment.author}
                    </span>
                    {comment.isOfficial && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Official
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <div className="flex space-x-3">
              <textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                required
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};