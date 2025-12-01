import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaLock, FaUserSecret, FaServer } from 'react-icons/fa';

export default function Login() {
  const router = useRouter();
  const { login, loginAnonymous, user, loading: authLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Only redirect if user exists and we're not currently in a login process
    if (user && !loading && !redirecting && !authLoading) {
      window.location.replace('/dashboard');
    }
  }, [user, loading, redirecting, authLoading]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || redirecting) return;
    
    setLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        setRedirecting(true);
        // Small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 200));
        window.location.replace('/dashboard');
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    if (loading || redirecting) return;
    
    setLoading(true);
    try {
      const result = await loginAnonymous();
      if (result.success) {
        setRedirecting(true);
        // Small delay to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 200));
        window.location.replace('/dashboard');
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Anonymous login error:', error);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login - FTP Management System</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo/Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <FaServer className="text-3xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Summoners Upload
            </h1>
            <p className="text-gray-600">
              Welcome to the rift uploads
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || redirecting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {redirecting ? 'Redirecting...' : loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Anonymous Login */}
            <button
              onClick={handleAnonymousLogin}
              disabled={loading || redirecting}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaUserSecret />
              {redirecting ? 'Redirecting...' : 'Continue as Guest'}
            </button>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                League of Legends: <br />
                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                  JG / Diff
                </span>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
            <div>
              <div className="font-semibold">Secure</div>
              <div className="text-xs">JWT Auth</div>
            </div>
            <div>
              <div className="font-semibold">Fast</div>
              <div className="text-xs">FTP Transfer</div>
            </div>
            <div>
              <div className="font-semibold">Protected</div>
              <div className="text-xs">DOS Guard</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
