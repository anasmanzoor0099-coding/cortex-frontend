import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from 'framer-motion';
import { Settings as SettingsIcon, LogOut, ChevronDown, BookOpen, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const NAV_EASE = [0.22, 1, 0.36, 1];

const Navbar = () => {
  const { user, logout, isInstructorOrAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState(null);
  const menuRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMenuOpen(false);
    setHoveredPath(null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    ...(user
      ? [
          { path: '/my-learning', label: 'My Learning' },
          {
            path: isInstructorOrAdmin ? '/instructor/dashboard' : '/become-instructor',
            label: isInstructorOrAdmin ? 'Dashboard' : 'Teach',
          },
        ]
      : [{ path: '/login', label: 'Login' }]),
  ];

  const activePath = navItems.find((item) => item.path === location.pathname)?.path ?? null;
  const pillTargetPath = hoveredPath ?? activePath;

  const firstName = user?.user?.name?.trim()?.split(' ')[0] || 'Account';
  const initial = (user?.user?.name?.trim()?.charAt(0) || 'U').toUpperCase();

  return (
    <motion.nav
      initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: NAV_EASE }}
      className="hidden md:flex fixed w-full top-0 z-50 bg-[#F8F7F2]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#F8F7F2]/75 border-b border-[#DCE4DF]/90 shadow-[0_8px_32px_rgba(6,78,59,0.05)]"
    >
      {/* Flowing emerald & jade liquid-glass background sheen */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -inset-y-4 -left-1/4 w-[150%] bg-[linear-gradient(110deg,transparent_0%,rgba(6,78,59,0.06)_26%,rgba(253,252,248,0.72)_50%,rgba(16,185,129,0.09)_74%,transparent_100%)] animate-header-liquid" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D6B56D]/55 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
            transition={{ duration: 0.18 }}
          >
            <Link to="/" className="text-2xl font-serif font-bold text-[#17231E] tracking-tight">
              CORTEX<span className="text-[#D6B56D]">.</span>
            </Link>
          </motion.div>

          {/* Shared Sliding Liquid Pill Capsule */}
          <LayoutGroup id="desktop-navbar-pill">
            <div
              role="navigation"
              aria-label="Primary navigation"
              onMouseLeave={() => setHoveredPath(null)}
              className="relative flex items-center gap-1 rounded-full bg-[#FDFCF8]/95 border border-[#DCE4DF] p-1.5 shadow-inner"
            >
              {navItems.map((item) => {
                const isPillTarget = pillTargetPath === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onMouseEnter={() => setHoveredPath(item.path)}
                    onFocus={() => setHoveredPath(item.path)}
                    onBlur={() => setHoveredPath(null)}
                    className={`relative px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 select-none ${
                      isPillTarget ? 'text-white' : 'text-[#737A75] hover:text-[#064E3B]'
                    }`}
                  >
                    {isPillTarget && (
                      <motion.span
                        layoutId="navbar-sliding-pill"
                        aria-hidden="true"
                        transition={
                          shouldReduceMotion
                            ? { duration: 0.08 }
                            : { type: 'spring', stiffness: 420, damping: 32, mass: 0.85 }
                        }
                        className="absolute inset-0 rounded-full bg-[#064E3B] shadow-sm shadow-[#064E3B]/20 pointer-events-none"
                      />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </LayoutGroup>

          {/* Right Action / Account Area */}
          <div className="flex-shrink-0">
            {user ? (
              <div ref={menuRef} className="relative flex items-center gap-3">
                <motion.button
                  type="button"
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-expanded={menuOpen}
                  aria-haspopup="menu"
                  aria-label="Open account menu"
                  className="inline-flex items-center gap-2.5 bg-[#FDFCF8] border border-[#DCE4DF] hover:border-[#064E3B] px-3.5 py-1.5 rounded-full text-sm font-medium text-[#17231E] transition-all shadow-sm"
                >
                  <span className="w-6 h-6 rounded-full bg-[#064E3B] text-white flex items-center justify-center text-xs font-bold">
                    {initial}
                  </span>
                  <span>Hi, {firstName}</span>
                  <ChevronDown
                    size={15}
                    className={`text-[#737A75] transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
                  />
                </motion.button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      role="menu"
                      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.16, ease: NAV_EASE }}
                      className="absolute right-0 top-12 w-60 bg-[#FDFCF8] border border-[#DCE4DF] rounded-2xl shadow-xl py-2 z-50 origin-top-right"
                    >
                      <div className="px-4 py-2.5 border-b border-[#DCE4DF] mb-1">
                        <p className="text-sm font-semibold text-[#17231E] truncate">
                          {user.user?.name}
                        </p>
                        <p className="text-xs text-[#737A75] truncate">{user.user?.email}</p>
                      </div>

                      <Link
                        role="menuitem"
                        to="/my-learning"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#17231E] hover:bg-[#F8F7F2] transition-colors"
                      >
                        <BookOpen size={16} className="text-[#737A75]" /> My Learning
                      </Link>

                      <Link
                        role="menuitem"
                        to={isInstructorOrAdmin ? '/instructor/dashboard' : '/become-instructor'}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#17231E] hover:bg-[#F8F7F2] transition-colors"
                      >
                        <LayoutDashboard size={16} className="text-[#737A75]" />
                        {isInstructorOrAdmin ? 'Dashboard' : 'Teach on Cortex'}
                      </Link>

                      <Link
                        role="menuitem"
                        to="/settings"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#17231E] hover:bg-[#F8F7F2] transition-colors"
                      >
                        <SettingsIcon size={16} className="text-[#064E3B]" /> Settings
                      </Link>

                      <div className="mt-1 pt-1 border-t border-[#DCE4DF]">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.03 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                transition={{ duration: 0.18, ease: NAV_EASE }}
              >
                <Link
                  to="/register"
                  className="inline-block bg-[#064E3B] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#10B981] transition-all shadow-sm hover:shadow-md hover:shadow-[#10B981]/25"
                >
                  Get Started
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
