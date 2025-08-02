import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from './components/Header';
import { AppRoutes } from './AppRoutes'; // New file to separate routing logic

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  const handleLogin = (user) => {
    setUser(user);
  };

  const isAuthenticated = !!user;

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header user={user} onLogout={handleLogout} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AppRoutes
            user={user}
            isAuthenticated={isAuthenticated}
            onLoginSuccess={handleLogin}
          />
        </main>
      </div>
    </Router>
  );
}

export default App;
