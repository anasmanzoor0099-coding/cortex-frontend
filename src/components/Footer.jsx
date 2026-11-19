import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

const footerLinks = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/about', label: 'About' },
];

const Footer = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <footer className="relative overflow-hidden border-t border-[#DCE4DF] bg-gradient-to-b from-[#F8F7F2] via-[#FDFCF8] to-[#ECF2EE] pt-20 pb-12 mt-auto">
      {/* Subtle jade and champagne gold liquid reflections */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_22%_20%,rgba(16,185,129,0.11),transparent_55%),radial-gradient(ellipse_at_82%_75%,rgba(214,181,109,0.16),transparent_60%)]"
      />

      {/* Multi-layered seamless horizontal liquid waves */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-28 overflow-hidden select-none">
        {/* Back slow emerald wave */}
        <svg
          className="absolute top-0 left-0 w-[200%] h-24 animate-footer-wave-slow opacity-75"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,48 C150,92 300,8 450,48 C600,88 750,8 900,48 C1050,88 1200,8 1200,48 L1200,0 L0,0 Z"
            fill="rgba(6, 78, 59, 0.08)"
          />
        </svg>

        {/* Mid counter-flowing pearl-ivory glass highlight wave */}
        <svg
          className="absolute top-0 left-0 w-[200%] h-24 animate-footer-wave-mid opacity-85"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,36 C180,6 320,76 500,36 C680,-4 820,76 1000,36 C1100,16 1160,26 1200,36 L1200,0 L0,0 Z"
            fill="rgba(253, 252, 248, 0.85)"
          />
        </svg>

        {/* Front jade crest wave */}
        <svg
          className="absolute top-0 left-0 w-[200%] h-20 animate-footer-wave-fast"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,26 C150,62 300,4 450,26 C600,48 750,4 900,26 C1050,48 1200,4 1200,26 L1200,0 L0,0 Z"
            fill="rgba(16, 185, 129, 0.12)"
          />
        </svg>
      </div>

      {/* Bottom champagne gold & emerald liquid crest */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 overflow-hidden select-none">
        <svg
          className="absolute bottom-0 left-0 w-[200%] h-16 animate-footer-wave-slow opacity-80"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,74 C200,30 400,110 600,74 C800,38 1000,110 1200,74 L1200,120 L0,120 Z"
            fill="rgba(214, 181, 109, 0.18)"
          />
        </svg>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="text-center md:text-left"
        >
          <Link
            to="/"
            className="inline-block font-serif text-xl font-bold text-[#17231E] mb-2 hover:text-[#064E3B] transition-colors"
          >
            CORTEX<span className="text-[#D6B56D]">.</span>
          </Link>
          <p className="text-[#737A75] text-sm font-medium">
            © {new Date().getFullYear()} Cortex. Built by Anas Manzoor.
          </p>
        </motion.div>

        <nav aria-label="Footer navigation" className="flex flex-wrap justify-center gap-5 sm:gap-7 text-sm font-medium text-[#17231E]">
          {footerLinks.map((item) => (
            <motion.div
              key={item.to}
              whileHover={shouldReduceMotion ? undefined : { y: -2 }}
              transition={{ duration: 0.18 }}
            >
              <Link
                to={item.to}
                className="relative inline-block py-1 hover:text-[#064E3B] transition-colors after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:rounded-full after:bg-[#10B981] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200 after:origin-center"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
