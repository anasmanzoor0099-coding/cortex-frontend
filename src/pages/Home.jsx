import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Code2, LineChart, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen w-full bg-[#FDFBF7] pt-20 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32 flex flex-col items-center text-center">
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp}
          className="inline-block border border-[#EAE6DF] bg-white px-4 py-1.5 rounded-full text-sm font-medium text-[#6B6B6B] mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2"></span>
          A calmer way to learn
        </motion.div>
        
        <motion.h1 
          initial="hidden" animate="visible" variants={fadeUp}
          className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-[#1C1C1C] mb-6 leading-tight max-w-4xl"
        >
          Learn deeply.<br />
          <span className="italic text-[#FF8C42]">Build boldly.</span>
        </motion.h1>
        
        <motion.p 
          initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-[#6B6B6B] max-w-2xl mb-10"
        >
          Practical courses in code, design, and career craft. Short lessons, real projects, and progress you can actually see.
        </motion.p>
        
        <motion.div 
          initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link to="/courses" className="bg-[#1C1C1C] text-white px-8 py-4 rounded-full font-medium hover:bg-[#FF8C42] transition-all flex items-center justify-center gap-2">
            Explore courses <ArrowRight size={18} />
          </Link>
          <Link to="/register" className="bg-white border border-[#EAE6DF] text-[#1C1C1C] px-8 py-4 rounded-full font-medium hover:bg-gray-50 transition-all">
            Start for free
          </Link>
        </motion.div>
      </section>

      {/* STATS SECTION */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
        className="border-y border-[#EAE6DF] bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-[#EAE6DF]">
          <div>
            <p className="text-4xl font-serif font-bold text-[#1C1C1C] mb-1">6</p>
            <p className="text-sm text-[#6B6B6B]">Focused courses</p>
          </div>
          <div>
            <p className="text-4xl font-serif font-bold text-[#1C1C1C] mb-1">31</p>
            <p className="text-sm text-[#6B6B6B]">Short lessons</p>
          </div>
          <div>
            <p className="text-4xl font-serif font-bold text-[#1C1C1C] mb-1">2.4k</p>
            <p className="text-sm text-[#6B6B6B]">Learners building</p>
          </div>
          <div>
            <p className="text-4xl font-serif font-bold text-[#1C1C1C] mb-1">4.9</p>
            <p className="text-sm text-[#6B6B6B]">Average rating</p>
          </div>
        </div>
      </motion.section>

      {/* INSTRUCTOR PROFILE (Anas Manzoor) */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp}
          className="bg-[#1A1A1A] rounded-3xl p-8 md:p-12 border border-gray-800 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF8C42] opacity-20 blur-3xl rounded-full"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-24 h-24 bg-[#D4E157] rounded-full flex items-center justify-center text-3xl font-serif font-bold text-[#1C1C1C] shadow-lg flex-shrink-0">
              AM
            </div>
            
            <div className="text-center md:text-left flex-grow">
              <p className="text-sm text-gray-400 font-medium tracking-widest uppercase mb-2">Instructor</p>
              <h2 className="text-3xl font-serif font-bold text-white mb-2">Anas Manzoor</h2>
              <p className="text-gray-400 mb-6">Software Engineering Student</p>
              
              <div className="flex items-center justify-center md:justify-start gap-8 border-t border-gray-700 pt-6">
                <div>
                  <p className="text-2xl font-serif text-white">6</p>
                  <p className="text-xs text-gray-500">courses</p>
                </div>
                <div>
                  <p className="text-2xl font-serif text-white">2.4k</p>
                  <p className="text-xs text-gray-500">learners</p>
                </div>
                <div>
                  <p className="text-2xl font-serif text-white">4.9</p>
                  <p className="text-xs text-gray-500">rating</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS (Staggered Downward Layout) */}
      <section className="max-w-5xl mx-auto px-6 py-12 pb-24">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeUp}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-serif font-bold text-[#1C1C1C] mb-4">Hard work, in plain sight.</h2>
          <p className="text-[#6B6B6B]">A simple loop: learn a small idea, try it, mark it done, come back tomorrow.</p>
        </motion.div>

        <div className="flex flex-col gap-10 md:gap-16">
          {/* Card 1 - Left */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }}
            className="w-full md:w-4/5 self-start bg-white border border-[#EAE6DF] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative"
          >
            <div className="w-12 h-12 bg-[#D4E157] rounded-xl flex items-center justify-center mb-6">
              <BookOpen size={24} className="text-[#1C1C1C]" />
            </div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-[#1C1C1C]">Pick a path</h3>
              <span className="text-gray-200 font-serif text-4xl">01</span>
            </div>
            <p className="text-[#6B6B6B] text-lg leading-relaxed">
              Choose a course that matches the thing you want to build next — not a giant curriculum you will abandon.
            </p>
          </motion.div>

          {/* Card 2 - Right */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }}
            className="w-full md:w-4/5 self-end bg-white border border-[#EAE6DF] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative"
          >
            <div className="w-12 h-12 bg-[#D4E157] rounded-xl flex items-center justify-center mb-6">
              <Code2 size={24} className="text-[#1C1C1C]" />
            </div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-[#1C1C1C]">Learn in small loops</h3>
              <span className="text-gray-200 font-serif text-4xl">02</span>
            </div>
            <p className="text-[#6B6B6B] text-lg leading-relaxed">
              Short lessons with one clear idea each. Read, experiment, and close the tab knowing more than you did before.
            </p>
          </motion.div>

          {/* Card 3 - Left */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }}
            className="w-full md:w-4/5 self-start bg-white border border-[#EAE6DF] rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative"
          >
            <div className="w-12 h-12 bg-[#D4E157] rounded-xl flex items-center justify-center mb-6">
              <LineChart size={24} className="text-[#1C1C1C]" />
            </div>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-[#1C1C1C]">Watch progress</h3>
              <span className="text-gray-200 font-serif text-4xl">03</span>
            </div>
            <p className="text-[#6B6B6B] text-lg leading-relaxed">
              Every completed lesson updates your dashboard. Momentum becomes visible, and visible momentum pulls you forward.
            </p>
          </motion.div>
        </div>
      </section>

      {/* STAGGERED QUOTES SECTION */}
      <section className="bg-white border-t border-[#EAE6DF] py-24">
        <div className="max-w-5xl mx-auto px-6">
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="text-sm font-bold tracking-widest text-[#FF8C42] uppercase mb-2">Quotes to Code By</h2>
            <h3 className="text-4xl font-serif font-bold text-[#1C1C1C]">Words to keep you going.</h3>
          </motion.div>

          <div className="flex flex-col gap-16 md:gap-24">
            
            {/* Quote 1 - Left Aligned */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }}
              className="relative w-full md:w-4/5 self-start"
            >
              <Quote size={48} className="absolute -top-6 -left-4 text-[#F4F0EA] -z-10" />
              <h4 className="text-3xl md:text-4xl font-serif text-[#1C1C1C] leading-snug mb-4">
                "Code is not written in a day. It's debugged in a thousand."
              </h4>
              <p className="text-[#6B6B6B] font-medium tracking-wide">— The Developer's Reality</p>
            </motion.div>

            {/* Quote 2 - Right Aligned */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }}
              className="relative w-full md:w-4/5 self-end text-right md:pr-8"
            >
              <Quote size={48} className="absolute -top-6 -right-4 text-[#F4F0EA] -z-10 transform rotate-180" />
              <h4 className="text-3xl md:text-4xl font-serif text-[#1C1C1C] leading-snug mb-4">
                "Consistency beats talent when talent stops showing up."
              </h4>
              <p className="text-[#6B6B6B] font-medium tracking-wide">— Anas Manzoor</p>
            </motion.div>

            {/* Quote 3 - Center/Left Aligned */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }}
              className="relative w-full md:w-4/5 self-center md:self-start md:ml-12"
            >
              <Quote size={48} className="absolute -top-6 -left-4 text-[#F4F0EA] -z-10" />
              <h4 className="text-3xl md:text-4xl font-serif text-[#1C1C1C] leading-snug mb-4">
                "The best developers aren't the ones who never fail — they're the ones who never quit."
              </h4>
              <p className="text-[#6B6B6B] font-medium tracking-wide">— Cortex Philosophy</p>
            </motion.div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;