import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '../utils/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get('token');
    const savedUser = Cookies.get('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      const { data } = await authAPI.login(credentials);
      
      if (data.success) {
        Cookies.set('token', data.token, { expires: 7, path: '/' });
        Cookies.set('user', JSON.stringify(data.user), { expires: 7, path: '/' });
        setUser(data.user);
        toast.success('Login successful!');
        return { success: true, user: data.user };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await authAPI.register(userData);
      
      if (data.success) {
        toast.success('Registration successful! Please login.');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const loginAnonymous = async () => {
    try {
      const { data } = await authAPI.loginAnonymous();
      
      if (data.success) {
        Cookies.set('token', data.token, { expires: 1/24, path: '/' }); // 1 hour
        Cookies.set('user', JSON.stringify(data.user), { expires: 1/24, path: '/' });
        setUser(data.user);
        toast.success('Anonymous login successful!');
        return { success: true, user: data.user };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Anonymous login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('user', { path: '/' });
    setUser(null);
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginAnonymous, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
