import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Shield, Mail, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const MobileTopHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="md:hidden fixed w-full top-0 z-50 bg-[#F8F7F2]/85 backdrop-blur-xl border-b border-[#DCE4DF]/90 shadow-[0_6px_24px_rgba(6,78,59,0.05)]"
    >
      {/* Subtle emerald & jade liquid-glass shimmer */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -inset-y-2 -left-1/4 w-[150%] bg-[linear-gradient(110deg,transparent_0%,rgba(6,78,59,0.06)_35%,rgba(253,252,248,0.65)_55%,rgba(16,185,129,0.08)_78%,transparent_100%)] animate-header-liquid" />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between px-4 h-16">
        {/* Logo */}
        <Link to="/" className="text-xl font-serif font-bold text-[#17231E] tracking-tight">
          CORTEX<span className="text-[#D6B56D]">.</span>
        </Link>

        {/* Right Side: User Avatar + Hamburger */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 bg-[#FDFCF8] border border-[#DCE4DF] px-3 py-1.5 rounded-full shadow-sm">
              <div className="w-6 h-6 bg-[#064E3B] text-white rounded-full flex items-center justify-center text-xs font-bold">
                {user.user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-[#17231E]">
                {user.user?.name?.split(' ')[0]}
              </span>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium text-[#17231E] bg-[#FDFCF8] border border-[#DCE4DF] px-4 py-1.5 rounded-full shadow-sm"
            >
              Login
            </Link>
          )}

          <motion.button
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="w-10 h-10 flex items-center justify-center bg-[#064E3B] text-white rounded-full shadow-md transition-colors hover:bg-[#10B981]"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </motion.button>
        </div>
      </div>

      {/* Floating Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-16 bg-[#0B3D2E]/20 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-18 right-4 w-64 bg-[#FDFCF8] rounded-2xl shadow-2xl border border-[#DCE4DF] overflow-hidden z-50 mt-2"
            >
              <div className="p-4 flex flex-col space-y-1">
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 hover:bg-[#F8F7F2] rounded-xl text-[#17231E] font-medium transition-colors"
                >
                  <User size={18} className="text-[#737A75]" /> About
                </Link>

                <Link
                  to="/privacy"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 hover:bg-[#F8F7F2] rounded-xl text-[#17231E] font-medium transition-colors"
                >
                  <Shield size={18} className="text-[#737A75]" /> Privacy Policy
                </Link>

                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 hover:bg-[#F8F7F2] rounded-xl text-[#17231E] font-medium transition-colors"
                >
                  <Mail size={18} className="text-[#737A75]" /> Contact Us
                </Link>

                {user && (
                  <div className="pt-2 mt-2 border-t border-[#DCE4DF] space-y-1">
                    <Link
                      to="/settings"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 hover:bg-[#F8F7F2] rounded-xl text-[#17231E] font-medium transition-colors"
                    >
                      <Settings size={18} className="text-[#064E3B]" /> Settings
                    </Link>
                    <button
                      type="button"
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
    </motion.div>
  );
};

export default MobileTopHeader;
