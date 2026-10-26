import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, PlayCircle, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const MobileNav = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-[#EAE6DF] z-50 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16">
        
        <Link to="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/') ? 'text-[#FF8C42]' : 'text-[#6B6B6B]'}`}>
          <Home size={22} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link to="/courses" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/courses') ? 'text-[#FF8C42]' : 'text-[#6B6B6B]'}`}>
          <BookOpen size={22} />
          <span className="text-[10px] font-medium">Courses</span>
        </Link>

        <Link to={user ? "/my-learning" : "/login"} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/my-learning') ? 'text-[#FF8C42]' : 'text-[#6B6B6B]'}`}>
          <PlayCircle size={22} />
          <span className="text-[10px] font-medium">Learning</span>
        </Link>

        <Link to={user ? (user.user?.role === 'instructor' ? "/instructor/dashboard" : "/become-instructor") : "/login"} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive('/login') || isActive('/instructor/dashboard') ? 'text-[#FF8C42]' : 'text-[#6B6B6B]'}`}>
          <User size={22} />
          <span className="text-[10px] font-medium">{user ? (user.user?.role === 'instructor' ? 'Dashboard' : 'Profile') : 'Login'}</span>
        </Link>

      </div>
    </div>
  );
};

export default MobileNav;