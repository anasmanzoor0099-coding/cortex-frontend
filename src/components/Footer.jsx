import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-cortex-border py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="font-serif text-xl font-bold text-cortex-text mb-2">CORTEX<span className="text-cortex-orange">.</span></p>
          <p className="text-cortex-muted text-sm">
            © {new Date().getFullYear()} Cortex. Built by Anas Manzoor.
          </p>
        </div>
        <div className="flex space-x-8 text-sm font-medium text-cortex-muted">
          <a href="mailto:tester1122330099@gmail.com" className="hover:text-cortex-orange transition-colors">Contact</a>
          <a href="/privacy" className="hover:text-cortex-orange transition-colors">Privacy Policy</a>
          <a href="/about" className="hover:text-cortex-orange transition-colors">About</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;