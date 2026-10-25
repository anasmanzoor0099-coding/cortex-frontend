import React from 'react';
import { motion } from 'framer-motion';
import { Code2, GraduationCap, Award } from 'lucide-react';

const About = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-20">
      
      {/* HERO SECTION (Clean, No 3D) */}
      <section className="relative w-full py-24 flex items-center justify-center border-b border-[#EAE6DF] bg-white">
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeUp}
            className="text-5xl md:text-7xl font-serif font-bold text-[#1C1C1C] mb-6"
          >
            The Story of <span className="italic text-[#FF8C42]">Cortex.</span>
          </motion.h1>
          <motion.p 
            initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[#6B6B6B] max-w-2xl mx-auto leading-relaxed"
          >
            We believe learning to code should be calm, focused, and deeply rewarding. No fluff, just code.
          </motion.p>
        </div>
      </section>

      {/* INSTRUCTOR BIO SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="w-full md:w-1/3 flex justify-center"
          >
            <div className="w-64 h-64 bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-2xl relative">
              <div className="absolute inset-0 bg-[#FF8C42] opacity-20 blur-2xl rounded-full"></div>
              <span className="text-7xl font-serif font-bold text-[#D4E157]">AM</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="w-full md:w-2/3"
          >
            <h2 className="text-4xl font-serif font-bold text-[#1C1C1C] mb-4">Anas Manzoor</h2>
            <p className="text-[#FF8C42] font-medium text-lg mb-6 flex items-center gap-2">
              <GraduationCap size={20} /> Software Engineering Student
            </p>
            <p className="text-[#6B6B6B] text-lg leading-relaxed mb-6">
              Hi, I'm Anas. I created Cortex because I remember how overwhelming it was to learn web development. There are endless tutorials, outdated docs, and giant 40-hour video courses that you never finish.
            </p>
            <p className="text-[#6B6B6B] text-lg leading-relaxed">
              I wanted to build a platform that strips away the noise. Short, focused modules. Real code examples. A clear path from complete beginner to full-stack developer. 
            </p>
          </motion.div>
        </div>
      </section>

      {/* VALUES SECTION (Zig-Zag Downward Style) */}
      <section className="bg-white border-y border-[#EAE6DF] py-24 px-6">
        <div className="max-w-5xl mx-auto">
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#1C1C1C]">Why I Built This</h2>
          </motion.div>

          <div className="flex flex-col gap-10 md:gap-16">
            
            {/* Card 1 - Left */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }}
              className="w-full md:w-4/5 self-start bg-[#FDFBF7] p-8 md:p-10 rounded-3xl border-2 border-[#EAE6DF] shadow-sm hover:border-[#FF8C42] hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6"
            >
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-[#FF8C42] shadow-sm flex-shrink-0">
                <Code2 size={40} />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-[#1C1C1C] mb-2">Learn by Doing</h3>
                <p className="text-[#6B6B6B] text-lg">We don't just teach theory. Every module includes real code you can copy, run, and break.</p>
              </div>
            </motion.div>
            
            {/* Card 2 - Right */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }}
              className="w-full md:w-4/5 self-end bg-[#FDFBF7] p-8 md:p-10 rounded-3xl border-2 border-[#EAE6DF] shadow-sm hover:border-[#FF8C42] hover:shadow-md transition-all flex flex-col md:flex-row-reverse items-center gap-6"
            >
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-[#FF8C42] shadow-sm flex-shrink-0">
                <Award size={40} />
              </div>
              <div className="text-center md:text-right">
                <h3 className="text-2xl font-bold text-[#1C1C1C] mb-2">Quality over Quantity</h3>
                <p className="text-[#6B6B6B] text-lg">We only have 10 courses, but each one is a masterpiece of detailed, textbook-level content.</p>
              </div>
            </motion.div>

            {/* Card 3 - Left */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.6 }}
              className="w-full md:w-4/5 self-start bg-[#FDFBF7] p-8 md:p-10 rounded-3xl border-2 border-[#EAE6DF] shadow-sm hover:border-[#FF8C42] hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6"
            >
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-[#FF8C42] shadow-sm flex-shrink-0">
                <GraduationCap size={40} />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-[#1C1C1C] mb-2">Built for Students</h3>
                <p className="text-[#6B6B6B] text-lg">As a student myself, I know what it's like to be broke. Cortex is completely free to use.</p>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;