import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Database, Lock, Mail } from 'lucide-react';

const Privacy = () => {
  const privacyCards = [
    {
      icon: <Database size={32} className="text-[#FF8C42]" />,
      title: "1. Information We Collect",
      text: "When you register on Cortex, we collect your name and email address. We also securely store your hashed password (we never see your actual password) and your course progress."
    },
    {
      icon: <Shield size={32} className="text-[#FF8C42]" />,
      title: "2. How We Use It",
      text: "We use your email exclusively to send you verification codes, password reset links, and important platform updates. We will never sell or share your data with third parties."
    },
    {
      icon: <Lock size={32} className="text-[#FF8C42]" />,
      title: "3. Cookies & Security",
      text: "We use local storage to keep you logged in securely. Your data is stored in a secure MongoDB Atlas database with strict access controls to prevent unauthorized access."
    },
    {
      icon: <Mail size={32} className="text-[#FF8C42]" />,
      title: "4. Contact Us",
      text: "If you have any questions about this Privacy Policy, or want your data deleted, please contact us at:",
      email: "tester1122330099@gmail.com"
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#1C1C1C] mb-4">Privacy Policy</h1>
          <p className="text-[#6B6B6B]">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        <div className="flex flex-col gap-8 md:gap-12">
          {privacyCards.map((card, index) => {
            const isEven = index % 2 === 0;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true, amount: 0.5 }} 
                transition={{ duration: 0.6 }}
                className={`w-full md:w-4/5 ${isEven ? 'self-start' : 'self-end'} bg-white p-8 md:p-10 rounded-3xl border-2 border-[#EAE6DF] shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start`}
              >
                <div className="w-16 h-16 bg-[#F4F0EA] rounded-2xl flex items-center justify-center flex-shrink-0">
                  {card.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#1C1C1C] mb-3">{card.title}</h2>
                  <p className="text-[#6B6B6B] text-lg leading-relaxed">
                    {card.text}
                  </p>
                  {card.email && (
                    <a href={`mailto:${card.email}`} className="text-[#FF8C42] font-bold hover:underline mt-2 inline-block break-all">
                      {card.email}
                    </a>
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