import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isInstructor = user?.user?.role === 'instructor' || user?.user?.role === 'admin';

  return (
    <nav className="fixed w-full top-0 z-50 bg-[#FDFBF7] border-b border-[#EAE6DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-serif font-bold text-[#1C1C1C] tracking-tight">
              CORTEX<span className="text-[#FF8C42]">.</span>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[#6B6B6B] hover:text-[#1C1C1C] font-medium transition-colors">
              Home
            </Link>
            {user && (
              <Link to="/my-learning" className="text-[#6B6B6B] hover:text-[#1C1C1C] font-medium transition-colors">
                My Learning
              </Link>
            )}
            {user && (
              <Link to={isInstructor ? "/instructor/dashboard" : "/become-instructor"} className="text-[#6B6B6B] hover:text-[#1C1C1C] font-medium transition-colors">
                {isInstructor ? 'Dashboard' : 'Teach'}
              </Link>
            )}
            <Link to="/courses" className="text-[#6B6B6B] hover:text-[#1C1C1C] font-medium transition-colors">
              Courses
            </Link>
            <Link to="/about" className="text-[#6B6B6B] hover:text-[#1C1C1C] font-medium transition-colors">
              About
            </Link>
            
            {user ? (
              <>
                <span className="text-[#1C1C1C] font-medium border-l border-[#EAE6DF] pl-6">
                  Hi, {user.user?.name?.split(' ')[0]}
                </span>
                <button onClick={handleLogout} className="bg-white border border-[#EAE6DF] text-[#1C1C1C] px-6 py-2.5 rounded-full font-medium hover:bg-gray-50 transition-all shadow-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[#6B6B6B] hover:text-[#1C1C1C] font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-[#1C1C1C] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#FF8C42] transition-all shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU RIGHT SIDE */}
          <div className="md:hidden flex items-center space-x-2">
            {user && (
              <span className="text-sm font-medium text-[#1C1C1C] max-w-[80px] truncate">
                Hi, {user.user?.name?.split(' ')[0]}
              </span>
            )}
            
            {user ? (
              <button onClick={handleLogout} className="text-xs bg-white border border-[#EAE6DF] text-[#1C1C1C] px-3 py-1.5 rounded-full font-medium shadow-sm hover:bg-gray-50">
                Logout
              </button>
            ) : (
              <Link to="/register" className="text-xs bg-[#1C1C1C] text-white px-3 py-1.5 rounded-full font-medium shadow-sm hover:bg-[#FF8C42] transition-colors">
                Sign up
              </Link>
            )}
            
            <button onClick={() => setIsOpen(!isOpen)} className="w-9 h-9 flex items-center justify-center bg-white border border-[#EAE6DF] rounded-full text-[#1C1C1C] shadow-sm ml-1">
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-[#EAE6DF] shadow-xl absolute w-full left-0">
          <div className="px-6 py-6 flex flex-col space-y-4">
            <Link to="/" onClick={() => setIsOpen(false)} className="text-[#1C1C1C] font-medium text-lg">
              Home
            </Link>
            {user && (
              <Link to="/my-learning" onClick={() => setIsOpen(false)} className="text-[#1C1C1C] font-medium text-lg">
                My Learning
              </Link>
            )}
            {user && (
              <Link to={isInstructor ? "/instructor/dashboard" : "/become-instructor"} onClick={() => setIsOpen(false)} className="text-[#1C1C1C] font-medium text-lg">
                {isInstructor ? 'Dashboard' : 'Teach'}
              </Link>
            )}
            <Link to="/courses" onClick={() => setIsOpen(false)} className="text-[#1C1C1C] font-medium text-lg">
              Courses
            </Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className="text-[#1C1C1C] font-medium text-lg">
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;