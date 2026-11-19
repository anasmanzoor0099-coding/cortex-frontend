import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ResetPassword = () => {
  const { API_URL } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || '');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!/^\d{6}$/.test(token.trim())) {
      setError('Please enter the 6-digit reset code.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/reset-password`, {
        email: email.trim(),
        token: token.trim(),
        newPassword,
      });
      setSuccess(res.data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired reset code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-cortex-bg px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-cortex-border">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#FDFCF8] rounded-full flex items-center justify-center mx-auto mb-4">
            <KeyRound size={26} className="text-[#064E3B]" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-cortex-text mb-2">
            Reset Password
          </h1>
          <p className="text-cortex-muted text-sm">
            Enter your email, the 6-digit reset code, and your new password.
          </p>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-5 text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl mb-5 text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rp-email" className="block text-sm font-medium text-cortex-text mb-1">
              Email Address
            </label>
            <input
              id="rp-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cortex-border focus:outline-none focus:ring-2 focus:ring-cortex-emerald bg-gray-50"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="rp-code" className="block text-sm font-medium text-cortex-text mb-1">
              6-Digit Reset Code
            </label>
            <input
              id="rp-code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cortex-border focus:outline-none focus:ring-2 focus:ring-cortex-emerald bg-gray-50 tracking-widest text-center text-xl font-bold"
              placeholder="123456"
            />
          </div>

          <div>
            <label htmlFor="rp-password" className="block text-sm font-medium text-cortex-text mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                id="rp-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-cortex-border focus:outline-none focus:ring-2 focus:ring-cortex-emerald bg-gray-50 pr-12"
                placeholder="Minimum 6 characters"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
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
            className="w-full bg-cortex-emerald text-white font-medium py-3.5 rounded-xl hover:bg-cortex-jade transition-all mt-4 disabled:opacity-60"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-sm text-cortex-muted mt-6">
          Remembered it?{' '}
          <Link to="/login" className="text-cortex-emerald font-medium hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
