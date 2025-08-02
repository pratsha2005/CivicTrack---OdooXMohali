import React, { useState } from 'react';
import { IssueCard } from './IssueCard';
import { Search, Filter, TrendingUp, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';






export const Dashboard = ({onIssueClick }) => {

  const [issues,setIssues] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const visibleIssues = issues.filter(issue => !issue.isHidden);

  const filteredIssues = visibleIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || issue.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || issue.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: visibleIssues.length,
    reported: visibleIssues.filter(i => i.status === 'reported').length,
    inProgress: visibleIssues.filter(i => i.status === 'in-progress').length,
    resolved: visibleIssues.filter(i => i.status === 'resolved').length
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'roads', label: 'Roads & Transportation' },
    { value: 'waste', label: 'Waste Management' },
    { value: 'water', label: 'Water & Sewage' },
    { value: 'lighting', label: 'Street Lighting' },
    { value: 'parks', label: 'Parks & Recreation' },
    { value: 'other', label: 'Other Issues' }
  ];

  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'reported', label: 'Reported' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to CivicTrack</h1>
          <p className="text-xl text-blue-100 mb-6">
            Your voice matters. Report issues, track progress, and help build a better community together.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-blue-100">Total Issues</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.reported}</div>
              <div className="text-sm text-blue-100">Reported</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.inProgress}</div>
              <div className="text-sm text-blue-100">In Progress</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4 text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.resolved}</div>
              <div className="text-sm text-blue-100">Resolved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Issues Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
        {filteredIssues.length > 0 ? (
          filteredIssues.map(issue => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onClick={() => onIssueClick(issue)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};