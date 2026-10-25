import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#EAE6DF] py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="font-serif text-xl font-bold text-[#1C1C1C] mb-2">CORTEX<span className="text-[#FF8C42]">.</span></p>
          <p className="text-cortex-muted text-sm">
            © {new Date().getFullYear()} Cortex. Built by Anas Manzoor.
          </p>
        </div>
        <div className="flex space-x-8 text-sm font-medium text-cortex-muted">
          <Link to="/" className="hover:text-[#FF8C42] transition-colors">Home</Link>
          <a href="mailto:tester1122330099@gmail.com" className="hover:text-[#FF8C42] transition-colors">Contact</a>
          <Link to="/privacy" className="hover:text-[#FF8C42] transition-colors">Privacy Policy</Link>
          <Link to="/about" className="hover:text-[#FF8C42] transition-colors">About</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;