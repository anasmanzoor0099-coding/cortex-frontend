import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Code2, GraduationCap, Award } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const About = () => {
  const { API_URL } = useContext(AuthContext);
  const [courseCount, setCourseCount] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/stats`)
      .then((res) => setCourseCount(res.data.totalCourses))
      .catch(() => {});
  }, [API_URL]);

  const values = [
    {
      icon: Code2,
      title: 'Learn by Doing',
      description:
        'Every module pairs clear conceptual explanations with real executable code, hands-on exercises, and practical projects.',
      align: 'self-start',
      reverse: false,
    },
    {
      icon: Award,
      title: 'Quality over Quantity',
      description:
        courseCount !== null
          ? `We curate ${courseCount} focused, multi-lesson courses crafted with textbook-level clarity and interactive quizzes.`
          : 'Every course is crafted with textbook-level clarity, practical assignments, and interactive quizzes.',
      align: 'self-end',
      reverse: true,
    },
    {
      icon: GraduationCap,
      title: 'Built for Students',
      description:
        'Completely free to use, distraction-free, and engineered to work smoothly across desktop, tablet, and mobile devices.',
      align: 'self-start',
      reverse: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7F2] overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative w-full py-24 md:py-32 flex items-center justify-center border-b border-[#DCE4DF] bg-white overflow-hidden">
        <div
          aria-hidden="true"
          className="animate-liquid-morph hidden sm:block absolute -top-16 -right-16 w-80 h-80 opacity-45 blur-2xl pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(6, 78, 59, 0.32), rgba(214, 181, 109, 0.2) 55%, transparent 78%)',
          }}
        />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="text-xs font-bold tracking-widest uppercase text-[#064E3B] mb-4"
          >
            Our Mission
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: 'easeOut' }}
            className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-[#17231E] mb-6 leading-tight"
          >
            The Story of <span className="italic text-[#064E3B]">Cortex.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.14, ease: 'easeOut' }}
            className="text-lg md:text-xl text-[#737A75] max-w-2xl mx-auto leading-relaxed"
          >
            We believe learning to code should be calm, focused, and deeply rewarding. No fluff — just clear explanations, real code, and measurable progress.
          </motion.p>
        </div>
      </section>

      {/* INSTRUCTOR BIO SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row gap-12 items-center bg-white border border-[#DCE4DF] rounded-3xl p-8 sm:p-12 shadow-sm"
        >
          <div className="w-full md:w-1/3 flex justify-center">
            <div className="w-52 h-52 sm:w-56 sm:h-56 bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-2xl relative">
              <div className="absolute inset-0 bg-[#064E3B] opacity-20 blur-2xl rounded-full" />
              <span className="text-6xl font-serif font-bold text-[#D4E157] relative z-10">AM</span>
            </div>
          </div>

          <div className="w-full md:w-2/3 text-center md:text-left">
            <p className="text-xs font-bold tracking-widest uppercase text-[#737A75] mb-2">
              Founder &amp; Lead Instructor
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#17231E] mb-3">
              Anas Manzoor
            </h2>
            <p className="text-[#064E3B] font-medium text-lg mb-6 inline-flex items-center gap-2">
              <GraduationCap size={20} /> Software Engineering Student
            </p>
            <p className="text-[#737A75] text-base sm:text-lg leading-relaxed mb-5">
              I created Cortex because learning web development often feels overwhelming — endless tutorials, outdated docs, and 40-hour videos you never finish.
            </p>
            <p className="text-[#737A75] text-base sm:text-lg leading-relaxed">
              Cortex strips away the noise: structured multi-part lessons, real executable examples, knowledge checks, and a clear path from fundamentals to full-stack engineering.
            </p>
          </div>
        </motion.div>
      </section>

      {/* VALUES SECTION */}
      <section className="bg-white border-y border-[#DCE4DF] py-20 md:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#064E3B] mb-2">
              Core Principles
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#17231E]">
              Why Cortex Exists
            </h2>
          </motion.div>

          <div className="flex flex-col gap-8 md:gap-10">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
                  whileHover={{ y: -4 }}
                  className={`w-full md:w-4/5 ${val.align} bg-[#F8F7F2] p-8 sm:p-10 rounded-3xl border-2 border-[#DCE4DF] hover:border-[#064E3B]/60 hover:shadow-lg transition-all flex flex-col ${
                    val.reverse ? 'md:flex-row-reverse' : 'md:flex-row'
                  } items-center gap-6`}
                >
                  <div className="w-16 h-16 bg-white border border-[#DCE4DF] rounded-2xl flex items-center justify-center text-[#064E3B] shadow-sm flex-shrink-0">
                    <Icon size={32} />
                  </div>
                  <div className={`text-center ${val.reverse ? 'md:text-right' : 'md:text-left'}`}>
                    <h3 className="text-2xl font-serif font-bold text-[#17231E] mb-2">
                      {val.title}
                    </h3>
                    <p className="text-[#737A75] text-base sm:text-lg leading-relaxed">
                      {val.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
