import React from 'react';
import { Link } from 'react-router-dom';

const MobileTopHeader = () => {
  return (
    <div className="md:hidden fixed w-full top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#EAE6DF]">
      <div className="flex items-center justify-center h-16">
        <Link to="/" className="text-xl font-serif font-bold text-[#1C1C1C] tracking-tight">
          CORTEX<span className="text-[#FF8C42]">.</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileTopHeader;