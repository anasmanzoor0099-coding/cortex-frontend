import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { setAuthSession, API_URL } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name: name.trim(),
        email: email.trim(),
      });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');

    if (!/^\d{6}$/.test(code.trim())) {
      setError('Please enter the 6-digit verification code from your email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/verify-email`, {
        email: email.trim(),
        token: code.trim(),
        password,
      });

      setAuthSession({ token: res.data.token, user: res.data.user });
      navigate('/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/auth/register`, {
        name: name.trim(),
        email: email.trim(),
      });
      setMessage('A new 6-digit code has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-cortex-bg px-4 py-14">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="max-w-lg w-full bg-white p-8 sm:p-10 md:p-12 rounded-3xl shadow-xl border-2 border-cortex-border relative"
      >
        {step === 2 && (
          <button
            type="button"
            aria-label="Go back to change email"
            onClick={() => {
              setStep(1);
              setError('');
              setMessage('');
            }}
            className="absolute top-7 left-7 p-1.5 text-cortex-muted hover:text-cortex-text transition-colors"
            title="Go back to change email"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <p className="text-xs font-bold tracking-widest uppercase text-[#064E3B] mb-2">
            {step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-cortex-text mb-2.5">
            {step === 1 ? 'Create an Account' : 'Verify Your Email'}
          </h1>
          <p className="text-cortex-muted text-sm sm:text-base">
            {step === 1
              ? 'Join Cortex to start learning.'
              : `We sent a 6-digit code to ${email}`}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              key="reg-error"
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="bg-red-50 border border-red-200 text-red-600 p-3.5 rounded-xl mb-5 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
          {message && step === 2 && (
            <motion.div
              key="reg-msg"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="bg-green-50 border border-green-200 text-green-700 p-3.5 rounded-xl mb-5 text-sm text-center"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="step-1"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleRegister}
              className="space-y-5"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
              >
                <label htmlFor="reg-name" className="block text-sm font-semibold text-cortex-text mb-1.5">
                  Full Name
                </label>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-cortex-border focus:outline-none focus:border-cortex-emerald focus:ring-2 focus:ring-cortex-emerald/20 bg-[#F8F7F2] transition-all text-base"
                  placeholder="Your full name"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.16 }}
              >
                <label htmlFor="reg-email" className="block text-sm font-semibold text-cortex-text mb-1.5">
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-cortex-border focus:outline-none focus:border-cortex-emerald focus:ring-2 focus:ring-cortex-emerald/20 bg-[#F8F7F2] transition-all text-base"
                  placeholder="you@example.com"
                />
              </motion.div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                className="w-full bg-cortex-emerald text-white font-semibold py-4 rounded-xl hover:bg-cortex-jade transition-colors mt-2 disabled:opacity-60 text-base shadow-md"
              >
                {loading ? 'Sending Code...' : 'Continue'}
              </motion.button>
            </motion.form>
          ) : (
            <motion.form
              key="step-2"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              onSubmit={handleVerify}
              className="space-y-5"
            >
              <div>
                <label htmlFor="reg-code" className="block text-sm font-semibold text-cortex-text mb-1.5">
                  6-Digit Code
                </label>
                <input
                  id="reg-code"
                  type="text"
                  inputMode="numeric"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-cortex-border focus:outline-none focus:border-cortex-emerald focus:ring-2 focus:ring-cortex-emerald/20 bg-[#F8F7F2] tracking-widest text-center text-xl font-bold transition-all"
                  placeholder="123456"
                  maxLength={6}
                />
              </div>
              <div>
                <label htmlFor="reg-password" className="block text-sm font-semibold text-cortex-text mb-1.5">
                  Set Password
                </label>
                <div className="relative">
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-cortex-border focus:outline-none focus:border-cortex-emerald focus:ring-2 focus:ring-cortex-emerald/20 bg-[#F8F7F2] pr-12 transition-all text-base"
                    placeholder="Minimum 6 characters"
                    minLength={6}
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
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
                className="w-full bg-cortex-emerald text-white font-semibold py-4 rounded-xl hover:bg-cortex-jade transition-colors mt-2 disabled:opacity-60 text-base shadow-md"
              >
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </motion.button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-sm text-cortex-muted hover:text-cortex-emerald font-medium transition-colors"
                >
                  Didn't receive a code? Resend
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-sm text-cortex-muted mt-7">
          Already have an account?{' '}
          <Link to="/login" className="text-cortex-emerald font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
