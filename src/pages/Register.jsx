import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'; // Icons for show/hide and back

const Register = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false); // For eye icon
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Step 1: Send Email
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, { name, email });
      setMessage(res.data.message);
      setStep(2); 
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Code & Set Password
  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/api/auth/verify-email`, { 
        email, 
        token: code, 
        password 
      });
      
      localStorage.setItem('cortexUser', JSON.stringify(res.data));
      navigate('/'); 
      window.location.reload(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  // Resend Code Function
  const handleResend = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      // We just call the register API again. It will update the token and resend the email.
      const res = await axios.post(`${API_URL}/api/auth/register`, { name, email });
      setMessage('A new code has been sent to your email!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cortex-bg px-4 pt-20">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-cortex-border relative">
        
        {/* Back button for Step 2 */}
        {step === 2 && (
          <button 
            onClick={() => { setStep(1); setError(''); setMessage(''); }}
            className="absolute top-6 left-6 text-cortex-muted hover:text-cortex-text transition-colors"
            title="Go back to change email"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-cortex-text mb-2">
            {step === 1 ? 'Create an Account' : 'Verify Your Email'}
          </h2>
          <p className="text-cortex-muted text-sm">
            {step === 1 
              ? 'Join Cortex to start learning.' 
              : `We sent a 6-digit code to ${email}`}
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
        {message && step === 2 && <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm text-center">{message}</div>}

        {step === 1 ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cortex-text mb-1">Full Name</label>
              <input 
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-cortex-border focus:outline-none focus:ring-2 focus:ring-cortex-orange bg-gray-50"
                placeholder="Anas Manzoor"
              />
            </div>
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
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-cortex-text text-white font-medium py-3 rounded-lg hover:bg-cortex-orange transition-all mt-4 disabled:opacity-70"
            >
              {loading ? 'Sending Code...' : 'Continue'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cortex-text mb-1">6-Digit Code</label>
              <input 
                type="text" 
                required 
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-cortex-border focus:outline-none focus:ring-2 focus:ring-cortex-orange bg-gray-50 tracking-widest text-center text-xl font-bold"
                placeholder="123456"
                maxLength="6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cortex-text mb-1">Set Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-cortex-border focus:outline-none focus:ring-2 focus:ring-cortex-orange bg-gray-50 pr-12"
                  placeholder="Minimum 6 characters"
                  minLength="6"
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
              className="w-full bg-cortex-text text-white font-medium py-3 rounded-lg hover:bg-cortex-orange transition-all mt-4 disabled:opacity-70"
            >
              {loading ? 'Verifying...' : 'Verify & Create Account'}
            </button>

            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={handleResend}
                disabled={loading}
                className="text-sm text-cortex-muted hover:text-cortex-orange font-medium transition-colors"
              >
                Didn't receive a code? Resend
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-cortex-muted mt-6">
          Already have an account? <Link to="/login" className="text-cortex-orange font-medium hover:underline">Log in</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;