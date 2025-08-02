import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ReportForm } from './components/ReportForm';
import { IssueDetail } from './components/IssueDetail';
import { Auth } from './components/Auth';
import { Profile } from './components/Profile';

function App() {
  const isAuthenticated = !!localStorage.getItem('accessToken');

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/report" element={isAuthenticated ? <ReportForm /> : <Navigate to="/login" />} />
            <Route path="/issue/:id" element={<IssueDetail />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
