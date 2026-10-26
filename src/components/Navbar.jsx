import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const isInstructor = user?.user?.role === 'instructor' || user?.user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="hidden md:flex fixed w-full top-0 z-50 bg-[#FDFBF7] border-b border-[#EAE6DF]">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex items-center justify-between h-20">
          
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-serif font-bold text-[#1C1C1C] tracking-tight">
              CORTEX<span className="text-[#FF8C42]">.</span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link to="/" className="text-[#6B6B6B] hover:text-[#1C1C1C] font-medium transition-colors">Home</Link>
            <Link to="/courses" className="text-[#6B6B6B] hover:text-[#1C1C1C] font-medium transition-colors">Courses</Link>
            <Link to="/about" className="text-[#6B6B6B] hover:text-[#1C1C1C] font-medium transition-colors">About</Link>
            
            {user && (
              <Link to="/my-learning" className="text-[#6B6B6B] hover:text-[#1C1C1C] font-medium transition-colors">My Learning</Link>
            )}
            {user && (
              <Link to={isInstructor ? "/instructor/dashboard" : "/become-instructor"} className="text-[#6B6B6B] hover:text-[#1C1C1C] font-medium transition-colors">
                {isInstructor ? 'Dashboard' : 'Teach'}
              </Link>
            )}
            
            {user ? (
              <>
                <span className="text-[#1C1C1C] font-medium border-l border-[#EAE6DF] pl-6">Hi, {user.user?.name?.split(' ')[0]}</span>
                <button onClick={handleLogout} className="bg-white border border-[#EAE6DF] text-[#1C1C1C] px-6 py-2.5 rounded-full font-medium hover:bg-gray-50 transition-all shadow-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[#6B6B6B] hover:text-[#1C1C1C] font-medium transition-colors">Login</Link>
                <Link to="/register" className="bg-[#1C1C1C] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#FF8C42] transition-all shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;