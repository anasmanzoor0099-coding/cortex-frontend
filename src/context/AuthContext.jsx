import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the box
export const AuthContext = createContext();

// Create the provider that wraps the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // This is the address of our backend
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // When the website loads, check if the user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('cortexUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('cortexUser', JSON.stringify(res.data));
      setUser(res.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('cortexUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, API_URL }}>
      {children}
    </AuthContext.Provider>
  );
};