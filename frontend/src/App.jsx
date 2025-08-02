// import React from 'react'
// import { Route, Routes } from 'react-router-dom'
// import { ToastContainer} from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// // import { Login } from './pages/Login'
// import { Home } from './pages/Home'
// // import { User } from './user/User';
// // import { Admin } from './admin/Admin';

// function App() {
//   return (
//     <div className="min-h-screen bg-white">
//       <ToastContainer />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         {/* <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<User />} />
//         <Route path="/admin-dashboard" element={<Admin />} /> */}
//       </Routes>
//     </div>
//   );
// }

// export default App;


import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ReportForm } from './components/ReportForm';
import { IssueDetail } from './components/IssueDetail';
import { Auth } from './components/Auth';
import { Profile } from './components/Profile';
import { mockIssues, mockUsers } from './data/mockData';

const SPAM_THRESHOLD = 5;

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [issues, setIssues] = useState(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(mockUsers);
  const [spamReports, setSpamReports] = useState({});

  const handleAuth = (authData) => {
    if (currentView === 'login') {
      // Login logic - in real app, verify credentials
      const existingUser = users.find(u => u.email === authData.email);
      if (existingUser) {
        setCurrentUser(existingUser);
        setCurrentView('home');
      } else {
        alert('User not found. Please sign up first.');
      }
    } else {
      // Signup logic
      const newUser = {
        id: Date.now().toString(),
        name: authData.name,
        email: authData.email,
        reportCount: 0,
        joinedAt: new Date()
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setCurrentView('home');
      alert('Account created successfully!');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('login');
    setSelectedIssue(null);
  };

  const handleReportSubmit = (reportData) => {
    const newIssue = {
      ...reportData,
      id: Date.now().toString(),
      reportedAt: new Date(),
      updatedAt: new Date(),
      votes: 0,
      status: 'reported',
      isHidden: false
    };
    
    setIssues([newIssue, ...issues]);
    setCurrentView('home');
    
    // Update user report count
    setUsers(users.map(user => 
      user.id === currentUser.id 
        ? { ...user, reportCount: user.reportCount + 1 }
        : user
    ));
    
    alert('Issue reported successfully! Thank you for helping improve our community.');
  };

  const handleVote = (issueId) => {
    setIssues(issues.map(issue => 
      issue.id === issueId 
        ? { ...issue, votes: issue.votes + 1 }
        : issue
    ));
    
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue({ ...selectedIssue, votes: selectedIssue.votes + 1 });
    }
  };

  const handleReportSpam = (issueId) => {
    const currentReports = spamReports[issueId] || 0;
    const newReportCount = currentReports + 1;
    
    setSpamReports({
      ...spamReports,
      [issueId]: newReportCount
    });

    if (newReportCount >= SPAM_THRESHOLD) {
      setIssues(issues.map(issue => 
        issue.id === issueId 
          ? { ...issue, isHidden: true, status: 'hidden' }
          : issue
      ));
      alert('This issue has been hidden due to multiple spam reports.');
      if (selectedIssue && selectedIssue.id === issueId) {
        setCurrentView('home');
        setSelectedIssue(null);
      }
    } else {
      alert(`Issue reported as spam. ${SPAM_THRESHOLD - newReportCount} more reports needed to hide.`);
    }
  };

  const handleIssueClick = (issue) => {
    if (!issue.isHidden) {
      setSelectedIssue(issue);
      setCurrentView('detail');
    }
  };

  const handleBackToDashboard = () => {
    setSelectedIssue(null);
    setCurrentView('home');
  };

  const handleUpdateProfile = (profileData) => {
    const updatedUser = { ...currentUser, ...profileData };
    setCurrentUser(updatedUser);
    setUsers(users.map(user => 
      user.id === currentUser.id ? updatedUser : user
    ));
    alert('Profile updated successfully!');
  };

  const renderContent = () => {
    if (!currentUser) {
      return (
        <Auth
          isLogin={currentView === 'login'}
          onSubmit={handleAuth}
          onToggleMode={() => setCurrentView(currentView === 'login' ? 'signup' : 'login')}
        />
      );
    }

    switch (currentView) {
      case 'report':
        return <ReportForm onSubmit={handleReportSubmit} user={currentUser} />;
      case 'profile':
        return <Profile user={currentUser} issues={issues} onUpdateProfile={handleUpdateProfile} />;
      case 'detail':
        return selectedIssue ? (
          <IssueDetail
            issue={selectedIssue}
            onBack={handleBackToDashboard}
            onVote={handleVote}
            onReportSpam={handleReportSpam}
          />
        ) : null;
      default:
        return <Dashboard issues={issues} onIssueClick={handleIssueClick} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
        user={currentUser}
        onLogout={handleLogout}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;