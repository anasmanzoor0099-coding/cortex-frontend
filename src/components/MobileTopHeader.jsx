import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const MobileTopHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <div className="md:hidden fixed w-full top-0 z-50 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-[#EAE6DF] shadow-sm">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Logo */}
        <Link to="/" className="text-xl font-serif font-bold text-[#1C1C1C] tracking-tight">
          CORTEX<span className="text-[#FF8C42]">.</span>
        </Link>

        {/* Hamburger Icon */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="w-9 h-9 flex items-center justify-center bg-white border border-[#EAE6DF] rounded-full text-[#1C1C1C] shadow-sm"
        >
          {isOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute w-full bg-white border-b border-[#EAE6DF] shadow-xl">
          <div className="px-6 py-6 flex flex-col space-y-4">
            {user && (
              <div className="pb-4 border-b border-gray-100">
                <p className="text-sm text-gray-500">Signed in as</p>
                <p className="font-medium text-[#1C1C1C]">{user.user?.name}</p>
              </div>
            )}

            <Link to="/about" onClick={() => setIsOpen(false)} className="text-[#1C1C1C] font-medium text-lg">About</Link>
            <Link to="/privacy" onClick={() => setIsOpen(false)} className="text-[#1C1C1C] font-medium text-lg">Privacy Policy</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className="text-[#1C1C1C] font-medium text-lg">Contact</Link>
            
            {user ? (
              <div className="pt-4 border-t border-gray-100">
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-medium py-3 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-100">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)} 
                  className="w-full block text-center bg-[#1C1C1C] text-white font-medium py-3 rounded-xl hover:bg-[#FF8C42] transition-colors"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileTopHeader;