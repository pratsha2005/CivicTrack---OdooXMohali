import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { ReportForm } from './components/ReportForm';
import { IssueDetail } from './components/IssueDetail';
import { Auth } from './components/Auth';
import { Profile } from './components/Profile';

export const AppRoutes = ({ user, isAuthenticated, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const handleIssueClick = (issue) => {
        setIssue(issue);
        navigate(`/issue`);
  };

  return (
    <Routes>
      <Route path="/" element={<Dashboard onIssueClick={handleIssueClick} />} />
      <Route path="/report" element={isAuthenticated ? <ReportForm user={user} /> : <Navigate to="/login" />} />
      <Route path="/issue" element={<IssueDetail issue={issue} />} />
      <Route path="/profile" element={isAuthenticated ? <Profile user={user} /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Auth isLogin={true} onLoginSuccess={onLoginSuccess} />} />
      <Route path="/signup" element={<Auth isLogin={false} onLoginSuccess={onLoginSuccess} />} />
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
};
