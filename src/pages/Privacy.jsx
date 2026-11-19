import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Database, Lock, Mail, ArrowRight } from 'lucide-react';

const Privacy = () => {
  const privacyCards = [
    {
      icon: <Database size={32} className="text-[#064E3B]" />,
      title: '1. Information We Collect',
      text: 'When you register on Cortex, we collect your name and email address. We also securely store your hashed password (we never see your actual password) and your course progress.',
    },
    {
      icon: <Shield size={32} className="text-[#064E3B]" />,
      title: '2. How We Use It',
      text: 'We use your email exclusively to send you verification codes, password reset codes, and important platform updates. We will never sell or share your data with third parties.',
    },
    {
      icon: <Lock size={32} className="text-[#064E3B]" />,
      title: '3. Storage & Security',
      text: 'We use local storage to keep you logged in securely. Your data is stored in a secure MongoDB Atlas database with strict access controls to prevent unauthorized access.',
    },
    {
      icon: <Mail size={32} className="text-[#064E3B]" />,
      title: '4. Contact Us',
      text: 'If you have any questions about this Privacy Policy, or want your account data deleted, please reach out through our support form on the Contact page.',
      hasContactLink: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F2] pt-24 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold tracking-widest uppercase text-[#064E3B] mb-3">
            Data &amp; Transparency
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#17231E] mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#737A75]">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <div className="flex flex-col gap-8 md:gap-12">
          {privacyCards.map((card, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5 }}
                className={`w-full md:w-4/5 ${
                  isEven ? 'self-start' : 'self-end'
                } bg-white p-8 md:p-10 rounded-3xl border-2 border-[#DCE4DF] shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start`}
              >
                <div className="w-16 h-16 bg-[#FDFCF8] rounded-2xl flex items-center justify-center flex-shrink-0">
                  {card.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#17231E] mb-3">{card.title}</h2>
                  <p className="text-[#737A75] text-lg leading-relaxed">{card.text}</p>
                  {card.hasContactLink && (
                    <Link
                      to="/contact"
                      className="text-[#064E3B] font-bold hover:underline mt-3 inline-flex items-center gap-1.5"
                    >
                      Go to Contact Support Form <ArrowRight size={16} />
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Privacy;
