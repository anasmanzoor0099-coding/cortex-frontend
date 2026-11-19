import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, Search, Layers, CheckCircle, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Courses = () => {
  const { user, API_URL } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const coursesRes = await axios.get(`${API_URL}/api/courses`);
        if (!active) return;
        setCourses(coursesRes.data);

        if (user?.token) {
          try {
            const enrollRes = await axios.get(`${API_URL}/api/enrollments/my`, {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            if (active) {
              const ids = new Set(
                enrollRes.data.map((e) => e.course?._id).filter(Boolean)
              );
              setEnrolledIds(ids);
            }
          } catch {
            // Non-blocking if enrollments fail
          }
        }
      } catch (err) {
        if (active) setError('Unable to load courses right now. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [API_URL, user]);

  const categories = useMemo(() => {
    const set = new Set(courses.map((c) => c.category || 'Web Development'));
    return ['All', ...Array.from(set)];
  }, [courses]);

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredCourses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((course) => {
      const matchesCat =
        selectedCategory === 'All' ||
        (course.category || 'Web Development') === selectedCategory;
      const matchesDiff =
        selectedDifficulty === 'All' ||
        (course.difficulty || 'Beginner') === selectedDifficulty;
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.description.toLowerCase().includes(q) ||
        (course.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesDiff && matchesSearch;
    });
  }, [courses, search, selectedCategory, selectedDifficulty]);

  const cardColors = [
    'bg-[#E6F0FA]',
    'bg-[#FDFCF8]',
    'bg-[#EAEFF0]',
    'bg-[#F5EBE9]',
    'bg-[#EBF1EA]',
    'bg-[#F4EFF7]',
  ];

  const difficultyColor = (diff) => {
    if (diff === 'Advanced') return 'bg-red-50 text-red-700 border-red-200';
    if (diff === 'Intermediate') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  const getAcronym = (title) => {
    if (title.includes('JavaScript')) return 'JS';
    if (title.includes('HTML')) return 'HTML';
    if (title.includes('React')) return 'React';
    if (title.includes('Node')) return 'Node';
    if (title.includes('Mongo')) return 'Mongo';
    if (title.includes('Git')) return 'Git';
    if (title.includes('Vercel')) return 'Vercel';
    if (title.includes('Tailwind')) return 'CSS';
    if (title.includes('TypeScript')) return 'TS';
    if (title.includes('Python')) return 'Py';
    if (title.includes('Project')) return 'Build';
    const firstWord = title.split(' ')[0];
    return firstWord.length > 5 ? firstWord.substring(0, 4) : firstWord;
  };

  const resetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
  };

  return (
    <div className="min-h-screen bg-[#F8F7F2] py-12 md:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center md:text-left"
        >
          <p className="text-xs font-bold tracking-widest uppercase text-[#064E3B] mb-2">
            Curriculum
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#17231E] mb-4">
            Explore Courses
          </h1>
          <p className="text-[#737A75] text-lg md:text-xl max-w-2xl mx-auto md:mx-0">
            Focused, project-based engineering courses with executable examples and interactive quizzes.
          </p>
        </motion.div>

        {/* SEARCH & FILTER BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#FDFCF8] border border-[#DCE4DF] rounded-3xl p-4 sm:p-6 mb-10 shadow-sm space-y-4"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-3.5 sm:gap-4">
            <div className="relative flex-grow min-w-0">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737A75] pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses by title, topic, or tag..."
                aria-label="Search courses"
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-[#DCE4DF] bg-[#F8F7F2] text-sm sm:text-base text-[#17231E] placeholder:text-[#737A75] text-ellipsis focus:outline-none focus:border-[#064E3B] focus:ring-2 focus:ring-[#10B981]/20 transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#737A75] hover:text-[#17231E] p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div
              role="group"
              aria-label="Filter by difficulty"
              className="grid grid-cols-2 min-[410px]:grid-cols-4 lg:flex lg:items-center gap-2 shrink-0"
            >
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-center whitespace-nowrap transition-all border ${
                    selectedDifficulty === diff
                      ? 'bg-[#064E3B] text-white border-[#064E3B] shadow-sm'
                      : 'bg-[#F8F7F2] text-[#737A75] border-[#DCE4DF] hover:border-[#064E3B] hover:text-[#17231E]'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {categories.length > 2 && (
            <div
              role="group"
              aria-label="Filter by category"
              className="flex flex-wrap items-center gap-2 pt-3.5 border-t border-[#DCE4DF]"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#064E3B] text-white shadow-sm'
                      : 'bg-[#F8F7F2] text-[#737A75] hover:text-[#064E3B] hover:border-[#064E3B] border border-[#DCE4DF]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* LOADING SKELETONS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-[#DCE4DF] rounded-[2rem] overflow-hidden animate-pulse"
              >
                <div className="h-44 bg-[#FDFCF8]" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-[#DCE4DF] rounded w-3/4" />
                  <div className="h-4 bg-[#FDFCF8] rounded w-full" />
                  <div className="h-4 bg-[#FDFCF8] rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white border border-red-200 rounded-3xl p-10 text-center">
            <p className="text-red-600 font-medium mb-4">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="bg-[#064E3B] text-white px-6 py-2.5 rounded-full text-sm font-medium"
            >
              Retry
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="bg-white border border-[#DCE4DF] rounded-3xl p-12 text-center">
            <h2 className="text-2xl font-serif font-bold text-[#17231E] mb-2">
              No matching courses found
            </h2>
            <p className="text-[#737A75] mb-6">
              Try clearing your search or selecting a different difficulty/category.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="bg-[#064E3B] text-white px-6 py-3 rounded-full font-medium hover:bg-[#10B981] transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredCourses.map((course, index) => {
              const isEnrolled = enrolledIds.has(course._id);
              return (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.35), ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                  className="flex"
                >
                  <Link
                    to={`/course/${course._id}`}
                    className="w-full bg-white border border-[#DCE4DF] rounded-[2rem] overflow-hidden hover:shadow-2xl hover:border-[#064E3B]/50 transition-all duration-300 group flex flex-col shadow-sm"
                  >
                    <div
                      className={`h-44 sm:h-48 ${
                        cardColors[index % cardColors.length]
                      } p-6 relative overflow-hidden flex flex-col justify-between`}
                    >
                      <div className="flex justify-between items-center gap-2">
                        <span
                          className={`text-sm font-bold px-3.5 py-1 rounded-full border ${difficultyColor(
                            course.difficulty
                          )}`}
                        >
                          {course.difficulty || 'Beginner'}
                        </span>
                        {isEnrolled && (
                          <span className="bg-green-600 text-white text-sm font-bold px-3.5 py-1 rounded-full inline-flex items-center gap-1">
                            <CheckCircle size={14} /> Enrolled
                          </span>
                        )}
                      </div>
                      <h2 className="text-5xl font-serif text-[#17231E]/80 font-bold transition-transform duration-300 group-hover:scale-105 origin-left">
                        {getAcronym(course.title)}
                      </h2>
                    </div>

                    <div className="p-6 md:p-7 flex flex-col flex-grow bg-white">
                      <p className="text-sm font-semibold uppercase tracking-wider text-[#064E3B] mb-2">
                        {course.category || 'Web Development'}
                      </p>
                      <h3 className="text-2xl md:text-[1.65rem] font-serif font-bold text-[#17231E] mb-3 leading-snug line-clamp-2 group-hover:text-[#064E3B] transition-colors">
                        {course.title}
                      </h3>

                      <p className="text-[#737A75] text-base leading-relaxed line-clamp-2 mb-5 flex-grow">
                        {course.description}
                      </p>

                      {course.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {course.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs font-medium px-3 py-1 rounded-full bg-[#F8F7F2] border border-[#DCE4DF] text-[#737A75]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between border-t border-[#DCE4DF] pt-4 mt-auto text-base">
                        <div className="flex items-center gap-4 text-[#737A75] font-medium">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock size={16} className="text-[#064E3B]" />
                            {course.totalDuration || '0h 0m'}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Layers size={16} className="text-[#064E3B]" />
                            {course.moduleCount ?? 0} modules
                          </span>
                        </div>

                        <span className="text-[#17231E] font-bold group-hover:text-[#064E3B] transition-colors">
                          {isEnrolled ? 'Continue' : 'View'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
