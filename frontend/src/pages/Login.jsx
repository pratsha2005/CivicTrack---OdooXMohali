import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Shield } from 'lucide-react';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const url = isAdmin
      ? '/api/admin/login'
      : isLogin
      ? '/api/user/login'
      : '/api/user/register';
    const userData = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await fetch(`http://localhost:4000${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        if (isAdmin) {
          navigate('/admin-dashboard'); 
        } else {
          navigate('/dashboard'); 
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-center space-x-4">
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              isAdmin ? 'bg-gray-300 text-gray-800' : 'bg-green-600 text-white'
            }`}
            onClick={() => setIsAdmin(false)}
          >
            User Login
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium ${
              isAdmin ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-800'
            }`}
            onClick={() => setIsAdmin(true)}
          >
            Admin Login
          </button>
        </div>

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {isAdmin ? 'Admin Sign In' : isLogin ? 'User Sign In' : 'Create an Account'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {isAdmin
            ? 'Access the admin dashboard'
            : isLogin
            ? 'Access your waste management dashboard'
            : 'Join us in making waste management smarter'}
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            {!isLogin && !isAdmin && (
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 w-full border-gray-300 rounded-lg py-2 px-3"
                    placeholder="Full Name"
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full border-gray-300 rounded-lg py-2 px-3"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full border-gray-300 rounded-lg py-2 px-3"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              {isAdmin ? 'Admin Login' : isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>

        {!isAdmin && (
          <div className="text-sm text-center">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-600"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
