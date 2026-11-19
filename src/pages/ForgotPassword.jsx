import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Mail, ArrowRight } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ForgotPassword = () => {
  const { API_URL } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError('Please enter your account email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, {
        email: email.trim(),
      });
      setSuccess(res.data.message || 'Reset code sent to your email.');
      setTimeout(() => {
        navigate('/reset-password', { state: { email: email.trim() } });
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-cortex-bg px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-cortex-border">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#FDFCF8] rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={26} className="text-[#064E3B]" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-cortex-text mb-2">
            Forgot Password
          </h1>
          <p className="text-cortex-muted text-sm">
            Enter your verified email and we'll send a 6-digit password reset code.
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
            <label htmlFor="fp-email" className="block text-sm font-medium text-cortex-text mb-1">
              Email Address
            </label>
            <input
              id="fp-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-cortex-border focus:outline-none focus:ring-2 focus:ring-cortex-emerald bg-gray-50"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cortex-emerald text-white font-medium py-3.5 rounded-xl hover:bg-cortex-jade transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? 'Sending Code...' : 'Send Reset Code'} <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center text-sm text-cortex-muted mt-6">
          Already have a code?{' '}
          <Link to="/reset-password" className="text-cortex-emerald font-medium hover:underline">
            Reset password
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
