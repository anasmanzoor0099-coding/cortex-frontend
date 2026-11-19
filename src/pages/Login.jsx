import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useContext(AuthContext);
  const notice = location.state?.notice || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email.trim(), password);

    if (result.success) {
      navigate('/my-learning');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-cortex-bg px-4 py-14">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="max-w-lg w-full bg-white p-8 sm:p-10 md:p-12 rounded-3xl shadow-xl border-2 border-cortex-border"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <p className="text-xs font-bold tracking-widest uppercase text-[#064E3B] mb-2">
            Cortex Academy
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-cortex-text mb-2.5">
            Welcome Back
          </h1>
          <p className="text-cortex-muted text-sm sm:text-base">
            Log in to continue your learning journey.
          </p>
        </motion.div>

        {notice && (
          <div
            role="status"
            className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl mb-6 text-sm text-center"
          >
            {notice}
          </div>
        )}

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="login-error"
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl mb-6 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.14 }}
          >
            <label htmlFor="login-email" className="block text-sm font-semibold text-cortex-text mb-1.5">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-cortex-border focus:outline-none focus:border-cortex-emerald focus:ring-2 focus:ring-cortex-emerald/20 bg-[#F8F7F2] transition-all text-base"
              placeholder="you@example.com"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="login-password" className="block text-sm font-semibold text-cortex-text">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs sm:text-sm text-cortex-emerald font-medium hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-cortex-border focus:outline-none focus:border-cortex-emerald focus:ring-2 focus:ring-cortex-emerald/20 bg-[#F8F7F2] pr-12 transition-all text-base"
                placeholder="Enter your password"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-cortex-muted hover:text-cortex-text transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.99 }}
            className="w-full bg-cortex-emerald text-white font-semibold py-4 rounded-xl hover:bg-cortex-jade transition-colors mt-2 disabled:opacity-60 text-base shadow-md"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-cortex-muted mt-7">
          Don't have an account?{' '}
          <Link to="/register" className="text-cortex-emerald font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
