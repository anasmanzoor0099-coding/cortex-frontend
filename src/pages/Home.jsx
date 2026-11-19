import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, BookOpen, Code2, LineChart, Quote, Clock, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { API_URL } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalCourses: null,
    totalModules: null,
    totalLessons: null,
    totalEnrollments: null,
  });
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [statsError, setStatsError] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      axios.get(`${API_URL}/api/stats`).catch(() => null),
      axios.get(`${API_URL}/api/courses`).catch(() => null),
    ]).then(([statsRes, coursesRes]) => {
      if (!active) return;
      if (statsRes?.data) {
        setStats(statsRes.data);
        setStatsError(false);
      } else {
        setStatsError(true);
      }
      if (Array.isArray(coursesRes?.data)) setFeaturedCourses(coursesRes.data.slice(0, 3));
    });
    return () => {
      active = false;
    };
  }, [API_URL]);

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F7F2] overflow-hidden">
      {/* HERO SECTION WITH LIQUID MORPHING + FLOWING WAVE BACKGROUND */}
      <section className="relative w-full overflow-hidden">
        {/* Layered Background Animations (behind all content) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
          {/* Animation A: Clearly Visible Liquid Morphing Shapes */}
          <div
            className="animate-liquid-morph absolute -top-20 -left-20 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] opacity-80 blur-xl"
            style={{
              background:
                'radial-gradient(circle at 35% 35%, rgba(6, 78, 59, 0.42), rgba(214, 181, 109, 0.32) 52%, rgba(248, 247, 242, 0) 78%)',
            }}
          />
          <div
            className="animate-liquid-morph-slow hidden sm:block absolute -bottom-16 -right-16 w-[500px] h-[500px] opacity-80 blur-2xl"
            style={{
              background:
                'radial-gradient(circle at 60% 45%, rgba(16, 185, 129, 0.5), rgba(6, 78, 59, 0.3) 48%, rgba(248, 247, 242, 0) 76%)',
            }}
          />
          <div
            className="animate-liquid-morph hidden md:block absolute top-1/4 left-1/2 -translate-x-1/2 w-[460px] h-[340px] opacity-65 blur-2xl"
            style={{
              background:
                'radial-gradient(circle, rgba(214, 181, 109, 0.65), rgba(6, 78, 59, 0.24) 55%, transparent 78%)',
            }}
          />

          {/* Animation B: Dual Flowing Wave / Ripple Layers */}
          <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="animate-wave-flow absolute bottom-0 left-0 w-[112%] -ml-[6%] h-44 sm:h-60 opacity-80"
          >
            <defs>
              <linearGradient id="cortexWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#D6B56D" stopOpacity="0.55" />
                <stop offset="50%" stopColor="#064E3B" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.55" />
              </linearGradient>
            </defs>
            <path
              fill="url(#cortexWaveGrad1)"
              d="M0,192 C240,112 480,268 720,184 C960,104 1200,248 1440,168 L1440,320 L0,320 Z"
            />
          </svg>
          <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="animate-wave-flow-reverse hidden sm:block absolute bottom-0 left-0 w-[112%] -ml-[6%] h-36 sm:h-48 opacity-75"
          >
            <defs>
              <linearGradient id="cortexWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F8F7F2" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#D6B56D" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#FFE0C2" stopOpacity="0.65" />
              </linearGradient>
            </defs>
            <path
              fill="url(#cortexWaveGrad2)"
              d="M0,236 C320,292 640,152 960,224 C1180,272 1320,232 1440,208 L1440,320 L0,320 Z"
            />
          </svg>
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 md:py-28 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center border border-[#DCE4DF] bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium text-[#737A75] mb-8 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-2" />
            A calmer, deeper way to learn
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold text-[#17231E] mb-6 leading-tight max-w-4xl"
          >
            Learn deeply.
            <br />
            <span className="italic text-[#064E3B]">Build boldly.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-lg md:text-xl text-[#737A75] max-w-2xl mb-10 leading-relaxed"
          >
            Structured full-stack courses with real code examples, interactive quizzes, and visible progress from first line to production deployment.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link
              to="/courses"
              className="bg-[#064E3B] text-white px-8 py-4 rounded-full font-medium hover:bg-[#10B981] transition-all flex items-center justify-center gap-2 shadow-md"
            >
              Explore courses <ArrowRight size={18} />
            </Link>
            <Link
              to="/register"
              className="bg-white/95 border border-[#DCE4DF] text-[#17231E] px-8 py-4 rounded-full font-medium hover:bg-gray-50 transition-all shadow-sm"
            >
              Start for free
            </Link>
          </motion.div>
        </div>
      </section>

      {/* REAL DATABASE STATS SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        className="border-y border-[#DCE4DF] bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:divide-x divide-[#DCE4DF]">
          <div>
            <p className="text-4xl font-serif font-bold text-[#17231E] mb-1">
              {stats.totalCourses !== null ? stats.totalCourses : '—'}
            </p>
            <p className="text-sm text-[#737A75]">Focused courses</p>
          </div>
          <div>
            <p className="text-4xl font-serif font-bold text-[#17231E] mb-1">
              {stats.totalLessons !== null ? stats.totalLessons : '—'}
            </p>
            <p className="text-sm text-[#737A75]">Structured lessons</p>
          </div>
          <div>
            <p className="text-4xl font-serif font-bold text-[#17231E] mb-1">
              {stats.totalEnrollments !== null ? stats.totalEnrollments : '—'}
            </p>
            <p className="text-sm text-[#737A75]">Active enrollments</p>
          </div>
          <div>
            <p className="text-4xl font-serif font-bold text-[#17231E] mb-1">100%</p>
            <p className="text-sm text-[#737A75]">Free &amp; open access</p>
          </div>
        </div>
        {statsError && (
          <p className="text-center text-xs text-amber-700 pb-4">
            Live platform statistics are temporarily unavailable.
          </p>
        )}
      </motion.section>

      {/* FEATURED COURSES DISCOVERY */}
      {featuredCourses.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-[#064E3B] mb-2">
                Curriculum Preview
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#17231E]">
                Start with core foundations
              </h2>
            </div>
            <Link
              to="/courses"
              className="text-[#17231E] font-semibold hover:text-[#064E3B] inline-flex items-center gap-2 transition-colors"
            >
              View all courses <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <Link
                key={course._id}
                to={`/course/${course._id}`}
                className="group bg-white border border-[#DCE4DF] rounded-3xl p-7 hover:shadow-xl hover:border-[#064E3B]/50 transition-all flex flex-col"
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-sm font-bold px-3.5 py-1 rounded-full bg-[#F8F7F2] border border-[#DCE4DF] text-[#17231E]">
                    {course.difficulty || 'Beginner'}
                  </span>
                  <span className="text-sm text-[#737A75] font-medium inline-flex items-center gap-1.5">
                    <Layers size={15} className="text-[#064E3B]" /> {course.moduleCount || 0} modules
                  </span>
                </div>
                <h3 className="text-2xl md:text-[1.65rem] font-serif font-bold text-[#17231E] mb-2.5 leading-snug group-hover:text-[#064E3B] transition-colors">
                  {course.title}
                </h3>
                <p className="text-[#737A75] text-base leading-relaxed line-clamp-3 mb-6 flex-grow">
                  {course.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-[#DCE4DF] text-base font-medium">
                  <span className="text-[#737A75] inline-flex items-center gap-1.5">
                    <Clock size={16} className="text-[#064E3B]" /> {course.totalDuration}
                  </span>
                  <span className="text-[#17231E] font-semibold group-hover:text-[#064E3B] inline-flex items-center gap-1">
                    Explore <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* INSTRUCTOR SPOTLIGHT */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="bg-[#1A1A1A] rounded-3xl p-8 md:p-12 border border-gray-800 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#064E3B] opacity-20 blur-3xl rounded-full" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-24 h-24 bg-[#D4E157] rounded-full flex items-center justify-center text-3xl font-serif font-bold text-[#17231E] shadow-lg flex-shrink-0">
              AM
            </div>

            <div className="text-center md:text-left flex-grow">
              <p className="text-sm text-gray-400 font-medium tracking-widest uppercase mb-2">
                Lead Instructor
              </p>
              <h2 className="text-3xl font-serif font-bold text-white mb-2">Anas Manzoor</h2>
              <p className="text-gray-400 mb-6">
                Software Engineering Student &amp; Full-Stack Builder
              </p>

              <div className="flex items-center justify-center md:justify-start gap-8 border-t border-gray-700 pt-6">
                <div>
                  <p className="text-2xl font-serif text-white">
                    {stats.totalCourses !== null ? stats.totalCourses : '—'}
                  </p>
                  <p className="text-xs text-gray-500">courses</p>
                </div>
                <div>
                  <p className="text-2xl font-serif text-white">
                    {stats.totalModules !== null ? stats.totalModules : '—'}
                  </p>
                  <p className="text-xs text-gray-500">modules</p>
                </div>
                <div>
                  <p className="text-2xl font-serif text-white">Project-First</p>
                  <p className="text-xs text-gray-500">curriculum</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-5xl mx-auto px-6 py-16 pb-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-serif font-bold text-[#17231E] mb-4">
            Hard work, in plain sight.
          </h2>
          <p className="text-[#737A75]">
            A simple loop: study a focused module, practice with real code, pass the knowledge check, and track your momentum.
          </p>
        </motion.div>

        <div className="flex flex-col gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-4/5 self-start bg-white border border-[#DCE4DF] rounded-3xl p-8 shadow-sm"
          >
            <div className="w-12 h-12 bg-[#D4E157] rounded-xl flex items-center justify-center mb-6">
              <BookOpen size={24} className="text-[#17231E]" />
            </div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-2xl font-bold text-[#17231E]">Pick a path</h3>
              <span className="text-gray-200 font-serif text-4xl">01</span>
            </div>
            <p className="text-[#737A75] text-lg leading-relaxed">
              Filter by difficulty or topic and enroll in a focused course matched to what you want to build next.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-4/5 self-end bg-white border border-[#DCE4DF] rounded-3xl p-8 shadow-sm"
          >
            <div className="w-12 h-12 bg-[#D4E157] rounded-xl flex items-center justify-center mb-6">
              <Code2 size={24} className="text-[#17231E]" />
            </div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-2xl font-bold text-[#17231E]">Learn &amp; verify</h3>
              <span className="text-gray-200 font-serif text-4xl">02</span>
            </div>
            <p className="text-[#737A75] text-lg leading-relaxed">
              Read structured notes, run executable examples, and pass the module quiz with 100% before marking it complete.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-4/5 self-start bg-white border border-[#DCE4DF] rounded-3xl p-8 shadow-sm"
          >
            <div className="w-12 h-12 bg-[#D4E157] rounded-xl flex items-center justify-center mb-6">
              <LineChart size={24} className="text-[#17231E]" />
            </div>
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-2xl font-bold text-[#17231E]">Watch progress</h3>
              <span className="text-gray-200 font-serif text-4xl">03</span>
            </div>
            <p className="text-[#737A75] text-lg leading-relaxed">
              Every completed module updates your My Learning dashboard in real time so your momentum stays visible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* QUOTES SECTION */}
      <section className="bg-white border-t border-[#DCE4DF] py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold tracking-widest text-[#064E3B] uppercase mb-2">
              Cortex Philosophy
            </h2>
            <h3 className="text-4xl font-serif font-bold text-[#17231E]">
              Words to keep you building.
            </h3>
          </div>

          <div className="flex flex-col gap-16">
            <div className="relative w-full md:w-4/5 self-start">
              <Quote size={48} className="absolute -top-6 -left-4 text-[#FDFCF8] -z-10" />
              <h4 className="text-3xl md:text-4xl font-serif text-[#17231E] leading-snug mb-3">
                "Code is not written in a day. It's debugged in a thousand."
              </h4>
              <p className="text-[#737A75] font-medium">— The Developer's Reality</p>
            </div>

            <div className="relative w-full md:w-4/5 self-end text-right md:pr-8">
              <Quote size={48} className="absolute -top-6 -right-4 text-[#FDFCF8] -z-10 transform rotate-180" />
              <h4 className="text-3xl md:text-4xl font-serif text-[#17231E] leading-snug mb-3">
                "Consistency beats talent when talent stops showing up."
              </h4>
              <p className="text-[#737A75] font-medium">— Anas Manzoor</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
