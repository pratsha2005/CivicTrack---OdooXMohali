import React from 'react';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ThumbsUp,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Flag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { reportSpamIssueRoute } from '../utils/APIRoutes';

export const IssueDetail = ({ issue }) => {

const handleSpam = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${reportSpamIssueRoute}/${issue._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (response.status === 200 || response.data.success) {
      alert("✅ Issue reported as spam successfully!");
    } else {
      alert("⚠️ Failed to report the issue.");
    }
  } catch (err) {
    console.error("❌ Error reporting spam:", err.response?.data || err.message);
    alert("❌ An error occurred while reporting the issue.");
  }
};


  const navigate = useNavigate();
  const getStatusIcon = (status) => {
    switch (status) {
      case 'reported': return <AlertCircle className="h-5 w-5" />;
      case 'in-progress': return <Clock className="h-5 w-5" />;
      case 'resolved': return <CheckCircle className="h-5 w-5" />;
      case 'closed': return <XCircle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'reported': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
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
    return icons[category.toLowerCase()] || '📋';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={()=> navigate('/')}
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
            <span className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(issue.status.toLowerCase())}`}>
              {getStatusIcon(issue.status.toLowerCase())}
              <span className="capitalize">{issue.status.replace('-', ' ')}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{issue.location?.coordinates?.join(', ') || 'Location not available'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Reported {new Date(issue.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>By {issue.user?.name || 'Anonymous'}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-700 leading-relaxed">{issue.description}</p>
        </div>

        {/* Images */}
        {issue.images && issue.images.length > 0 && (
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issue.images.map((url, idx) => (
                <img key={idx} src={url} alt={`Issue Image ${idx + 1}`} className="rounded-lg border" />
              ))}
            </div>
          </div>
        )}

        {/* Engagement */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Community Engagement</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleSpam}
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
