import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Home, BookOpen, PlayCircle, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const MobileNav = () => {
  const { user, isInstructorOrAdmin } = useContext(AuthContext);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const isActive = (path) => location.pathname === path;

  const accountPath = user
    ? isInstructorOrAdmin
      ? '/instructor/dashboard'
      : '/become-instructor'
    : '/login';

  const accountLabel = user
    ? isInstructorOrAdmin
      ? 'Dashboard'
      : 'Teach'
    : 'Login';

  const tabs = [
    { to: '/', label: 'Home', icon: Home, active: isActive('/') },
    { to: '/courses', label: 'Courses', icon: BookOpen, active: isActive('/courses') },
    { to: user ? '/my-learning' : '/login', label: 'Learning', icon: PlayCircle, active: isActive('/my-learning') },
    { to: accountPath, label: accountLabel, icon: User, active: isActive(accountPath) },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-[#FDFCF8]/95 backdrop-blur-md border-t border-[#DCE4DF] z-50 pb-safe shadow-[0_-4px_12px_rgba(6,78,59,0.06)]">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.label}
              to={tab.to}
              className={`relative flex flex-col items-center justify-center w-full h-full transition-colors ${
                tab.active ? 'text-[#064E3B]' : 'text-[#737A75] hover:text-[#10B981]'
              }`}
            >
              {tab.active && (
                <motion.span
                  layoutId="mobile-nav-active"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute top-0 w-9 h-0.5 rounded-full bg-[#064E3B]"
                />
              )}
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center space-y-1"
              >
                <Icon size={22} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
