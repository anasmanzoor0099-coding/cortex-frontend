import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const BecomeInstructor = () => {
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, setAuthSession, API_URL, isInstructorOrAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F8F7F2] px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#DCE4DF] text-center shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-[#17231E] mb-3">Sign in required</h2>
          <p className="text-[#737A75] mb-6">Please log in to your Cortex account before requesting instructor access.</p>
          <Link to="/login" className="inline-block bg-[#064E3B] text-white px-7 py-3 rounded-full font-medium hover:bg-[#10B981] transition-all">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isInstructorOrAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F8F7F2] px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-[#DCE4DF] text-center shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-[#17231E] mb-3">You already have access</h2>
          <p className="text-[#737A75] mb-6">Your account already has {user.user.role} privileges.</p>
          <Link to="/instructor/dashboard" className="inline-block bg-[#064E3B] text-white px-7 py-3 rounded-full font-medium hover:bg-[#10B981] transition-all">
            Open Instructor Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.put(
        `${API_URL}/api/auth/become-instructor`,
        { secretCode: secretCode.trim() },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      setAuthSession({
        ...user,
        user: res.data.user || { ...user.user, role: res.data.role },
      });

      navigate('/instructor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid instructor code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#F8F7F2] px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border-2 border-[#DCE4DF]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#FDFCF8] rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} className="text-[#064E3B]" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#17231E] mb-2">
            Become an Instructor
          </h2>
          <p className="text-[#737A75] text-sm">
            Enter the secret code provided by the administrator to unlock course management tools.
          </p>
        </div>

        {error && (
          <div role="alert" className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm text-center border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="inst-code" className="block text-sm font-bold text-[#17231E] mb-2">
              Secret Code
            </label>
            <input
              id="inst-code"
              type="password"
              required
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#DCE4DF] focus:outline-none focus:border-[#064E3B] bg-[#F8F7F2] transition-colors text-center text-lg tracking-widest font-mono"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#064E3B] text-white font-bold py-4 rounded-xl hover:bg-[#10B981] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? 'Verifying...' : 'Unlock Instructor Access'} <ArrowRight size={20} />
          </button>
        </form>

        <p className="text-center text-sm text-[#737A75] mt-6">
          Only authorized personnel should access this area.
        </p>
      </div>
    </div>
  );
};

export default BecomeInstructor;
