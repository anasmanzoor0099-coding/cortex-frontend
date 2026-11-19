import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const logout = useCallback(() => {
    localStorage.removeItem('cortexUser');
    setUser(null);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem('cortexUser');
      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        const parsed = JSON.parse(stored);
        if (!parsed?.token) {
          logout();
          setLoading(false);
          return;
        }
        setUser(parsed);

        // Sync fresh user role/profile from backend
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${parsed.token}` },
          timeout: 8000,
        });
        const synced = { ...parsed, user: res.data.user };
        localStorage.setItem('cortexUser', JSON.stringify(synced));
        setUser(synced);
      } catch (err) {
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [API_URL, logout]);

  const setAuthSession = useCallback((sessionData) => {
    localStorage.setItem('cortexUser', JSON.stringify(sessionData));
    setUser(sessionData);
  }, []);

  const updateUserProfile = useCallback((updatedUser) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, user: { ...prev.user, ...updatedUser } };
      localStorage.setItem('cortexUser', JSON.stringify(next));
      return next;
    });
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      setAuthSession(res.data);
      return { success: true };
    } catch (error) {
      if (!error.response) {
        return {
          success: false,
          message: 'Unable to reach the server. Please check your connection and try again.',
        };
      }
      if (error.response.status >= 500) {
        return {
          success: false,
          message: error.response.data?.message || 'Server error during login. Please try again later.',
        };
      }
      return {
        success: false,
        message: error.response.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  const isInstructorOrAdmin =
    user?.user?.role === 'instructor' || user?.user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        setAuthSession,
        updateUserProfile,
        login,
        logout,
        loading,
        API_URL,
        isInstructorOrAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
