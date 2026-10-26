import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Shield, Mail } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

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
      
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 h-16">
        {/* Logo */}
        <Link to="/" className="text-xl font-serif font-bold text-[#1C1C1C] tracking-tight">
          CORTEX<span className="text-[#FF8C42]">.</span>
        </Link>

        {/* Right Side: User Avatar + Hamburger */}
        <div className="flex items-center gap-3">
          
          {/* User Name / Avatar */}
          {user ? (
            <div className="flex items-center gap-2 bg-white border border-[#EAE6DF] px-3 py-1.5 rounded-full shadow-sm">
              {/* Avatar Circle */}
              <div className="w-6 h-6 bg-[#FF8C42] text-white rounded-full flex items-center justify-center text-xs font-bold">
                {user.user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-[#1C1C1C]">
                {user.user?.name?.split(' ')[0]}
              </span>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-medium text-[#1C1C1C] bg-white border border-[#EAE6DF] px-4 py-1.5 rounded-full shadow-sm">
              Login
            </Link>
          )}

          {/* Hamburger Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="w-9 h-9 flex items-center justify-center bg-[#1C1C1C] text-white rounded-full shadow-md"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Floating Dropdown Menu (Framer Motion) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background Overlay (Darkens the screen behind menu) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Menu Card */}
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-18 right-4 w-64 bg-white rounded-2xl shadow-2xl border border-[#EAE6DF] overflow-hidden z-50 mt-2"
            >
              <div className="p-4 flex flex-col space-y-1">
                
                {/* Links */}
                <Link to="/about" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-[#FDFBF7] rounded-xl text-[#1C1C1C] font-medium transition-colors">
                  <User size={18} className="text-[#6B6B6B]" /> About
                </Link>
                
                <Link to="/privacy" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-[#FDFBF7] rounded-xl text-[#1C1C1C] font-medium transition-colors">
                  <Shield size={18} className="text-[#6B6B6B]" /> Privacy Policy
                </Link>
                
                <Link to="/contact" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-3 hover:bg-[#FDFBF7] rounded-xl text-[#1C1C1C] font-medium transition-colors">
                  <Mail size={18} className="text-[#6B6B6B]" /> Contact Us
                </Link>

                {/* Logout Section */}
                {user && (
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <button 
                      onClick={handleLogout} 
                      className="w-full flex items-center gap-3 px-3 py-3 hover:bg-red-50 rounded-xl text-red-600 font-medium transition-colors"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileTopHeader;