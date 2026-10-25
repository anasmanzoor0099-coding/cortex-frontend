import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Get the login function from our global box

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Call the login function from AuthContext
    const result = await login(email, password);

    if (result.success) {
      navigate('/'); // Go to home page on success
      window.location.reload(); // Refresh to update Navbar
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cortex-bg px-4 pt-20">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-cortex-border">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-cortex-text mb-2">
            Welcome Back
          </h2>
          <p className="text-cortex-muted text-sm">
            Log in to continue your learning journey.
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cortex-text mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-cortex-border focus:outline-none focus:ring-2 focus:ring-cortex-orange bg-gray-50"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-cortex-text">Password</label>
              <Link to="/forgot-password" className="text-xs text-cortex-orange font-medium hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-cortex-border focus:outline-none focus:ring-2 focus:ring-cortex-orange bg-gray-50 pr-12"
                placeholder="Enter your password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cortex-muted hover:text-cortex-text"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cortex-text text-white font-medium py-3 rounded-lg hover:bg-cortex-orange transition-all mt-6 disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-sm text-cortex-muted mt-6">
          Don't have an account? <Link to="/register" className="text-cortex-orange font-medium hover:underline">Sign up</Link>
        </p>

      </div>
    </div>
  );
};

export default Login;