import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const BecomeInstructor = () => {
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, setUser, API_URL } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.put(`${API_URL}/api/auth/become-instructor`, 
        { secretCode },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // Update local storage and context with the new role
      const updatedUser = { 
        ...user, 
        user: { ...user.user, role: res.data.role } 
      };
      localStorage.setItem('cortexUser', JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Redirect to the instructor dashboard
      navigate('/instructor/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4 pt-20">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border-2 border-[#EAE6DF]">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#F4F0EA] rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} className="text-[#FF8C42]" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-[#1C1C1C] mb-2">Become an Instructor</h2>
          <p className="text-[#6B6B6B] text-sm">
            Enter the secret code provided by the administrator to unlock course management tools.
          </p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#1C1C1C] mb-2">Secret Code</label>
            <input 
              type="password" 
              required 
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#EAE6DF] focus:outline-none focus:border-[#FF8C42] bg-[#FDFBF7] transition-colors text-center text-lg tracking-widest font-mono"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1C1C1C] text-white font-bold py-4 rounded-xl hover:bg-[#FF8C42] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Verifying...' : 'Unlock Instructor Access'} <ArrowRight size={20} />
          </button>
        </form>

        <p className="text-center text-sm text-[#6B6B6B] mt-6">
          Only authorized personnel should access this area.
        </p>
      </div>
    </div>
  );
};

export default BecomeInstructor;