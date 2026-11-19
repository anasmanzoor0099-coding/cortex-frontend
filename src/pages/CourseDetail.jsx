import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PageLoader from '../components/PageLoader';
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  Lock,
  HelpCircle,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Target,
  Lightbulb,
  Wrench,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, API_URL } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [togglingComplete, setTogglingComplete] = useState(false);

  const [showOverview, setShowOverview] = useState(false);
  const [showModuleOverview, setShowModuleOverview] = useState(true);
  const [mobileModulesOpen, setMobileModulesOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const courseRes = await axios.get(`${API_URL}/api/courses/${id}`);
        if (!active) return;
        setCourse(courseRes.data.course);
        const mods = courseRes.data.modules || [];
        setModules(mods);
        setActiveModule(mods.length > 0 ? mods[0] : null);

        if (user?.token) {
          try {
            const enrollRes = await axios.get(`${API_URL}/api/enrollments/${id}`, {
              headers: { Authorization: `Bearer ${user.token}` },
            });
            if (active) setEnrollment(enrollRes.data);
          } catch {
            if (active) setEnrollment(null);
          }
        } else {
          setEnrollment(null);
        }
      } catch (err) {
        if (active) setError(err.response?.data?.message || 'Course not found.');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => {
      active = false;
    };
  }, [id, user, API_URL]);

  // Reset quiz, lesson index & copy state when switching modules
  useEffect(() => {
    setActiveLessonIdx(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    const alreadyPassed = Boolean(
      enrollment?.passedQuizModules?.includes(activeModule?._id)
    );
    setQuizPassed(alreadyPassed);
    setCopiedCode(false);
    setActionError('');
  }, [activeModule?._id, enrollment?.passedQuizModules]);

  const handleEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setEnrolling(true);
    setActionError('');
    try {
      const res = await axios.post(
        `${API_URL}/api/enrollments/${id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setEnrollment(res.data);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not enroll in course.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleToggleComplete = async (moduleId) => {
    if (!enrollment || togglingComplete) return;
    setTogglingComplete(true);
    setActionError('');
    try {
      const res = await axios.put(
        `${API_URL}/api/enrollments/${id}/module/${moduleId}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setEnrollment(res.data);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update progress.');
    } finally {
      setTogglingComplete(false);
    }
  };

  const handleToggleLessonComplete = async (moduleId, lessonIndex) => {
    if (!enrollment) return;
    try {
      const res = await axios.put(
        `${API_URL}/api/enrollments/${id}/module/${moduleId}/lesson/${lessonIndex}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setEnrollment(res.data);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not update lesson status.');
    }
  };

  const handleOptionSelect = (questionIndex, optionIndex) => {
    if (quizSubmitted && quizPassed) return;
    setQuizAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    if (!activeModule?.quiz?.length) return;

    if (Object.keys(quizAnswers).length !== activeModule.quiz.length) {
      setActionError('Please answer all questions before submitting.');
      return;
    }
    setActionError('');

    try {
      const res = await axios.post(
        `${API_URL}/api/enrollments/${id}/module/${activeModule._id}/quiz`,
        { answers: quizAnswers },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setQuizScore(res.data.scorePercentage);
      setQuizSubmitted(true);
      setQuizPassed(res.data.passed);
      if (res.data.passedQuizModules) {
        setEnrollment((prev) =>
          prev ? { ...prev, passedQuizModules: res.data.passedQuizModules } : prev
        );
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to submit quiz.');
    }
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizPassed(false);
    setActionError('');
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Ignore clipboard errors in restricted browsers
    }
  };

  if (loading) {
    return <PageLoader message="Loading course curriculum..." />;
  }

  if (error || !course) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#F8F7F2] px-6 text-center">
        <h2 className="text-3xl font-serif font-bold text-[#17231E] mb-3">
          {error || 'Course not found'}
        </h2>
        <Link
          to="/courses"
          className="bg-[#064E3B] text-white px-7 py-3 rounded-full font-medium hover:bg-[#10B981] transition-all"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  const activeIndex = modules.findIndex((m) => m._id === activeModule?._id);
  const prevModule = activeIndex > 0 ? modules[activeIndex - 1] : null;
  const nextModule =
    activeIndex >= 0 && activeIndex < modules.length - 1 ? modules[activeIndex + 1] : null;

  const hasQuiz = Boolean(activeModule?.quiz && activeModule.quiz.length > 0);
  const lessons = activeModule?.lessons || [];
  const hasLessons = lessons.length > 0;
  const currentLesson = hasLessons ? lessons[activeLessonIdx] || lessons[0] : null;
  const displayObjectives = currentLesson?.objectives?.length
    ? currentLesson.objectives
    : activeModule?.objectives || [];
  const displayNotes = currentLesson ? currentLesson.notes : activeModule?.notes;
  const displayCode = currentLesson ? currentLesson.codeExample : activeModule?.codeExample;
  const displayCodeExplanation = currentLesson?.codeExplanation || '';
  const displayExercise = currentLesson
    ? currentLesson.practiceExercise
    : activeModule?.practiceExercise;
  const displayTakeaways = currentLesson?.keyTakeaways?.length
    ? currentLesson.keyTakeaways
    : activeModule?.keyTakeaways || [];
  const isModuleCompleted = Boolean(
    enrollment?.completedModules?.includes(activeModule?._id)
  );
  const isCourseCompleted =
    enrollment && modules.length > 0 && enrollment.progressPercentage >= 100;

  return (
    <div className="min-h-screen bg-[#F8F7F2] py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <Link
          to="/courses"
          className="inline-flex items-center gap-1 text-[#737A75] hover:text-[#17231E] mb-6 font-medium text-sm"
        >
          <ChevronLeft size={18} /> Back to Courses
        </Link>

        {/* COURSE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white border-2 border-[#DCE4DF] rounded-3xl p-6 md:p-10 shadow-sm mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F8F7F2] border border-[#DCE4DF] text-[#064E3B]">
                  {course.category || 'Web Development'}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F8F7F2] border border-[#DCE4DF] text-[#17231E]">
                  {course.difficulty || 'Beginner'}
                </span>
                <span className="text-xs text-[#737A75] font-medium">
                  {course.totalDuration} • {modules.length} modules
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#17231E] mb-3 break-words">
                {course.title}
              </h1>
              <p className="text-[#737A75] text-base md:text-lg max-w-3xl leading-relaxed">
                {course.description}
              </p>
            </div>

            <div className="flex-shrink-0 w-full md:w-auto text-center">
              {enrollment ? (
                <div className="bg-[#FDFCF8] rounded-2xl p-5 border border-[#DCE4DF] min-w-[160px]">
                  <p className="text-xs uppercase tracking-wider text-[#737A75] mb-1 font-semibold">
                    Your Progress
                  </p>
                  <p className="text-3xl font-serif font-bold text-[#064E3B]">
                    {enrollment.progressPercentage ?? 0}%
                  </p>
                  <div className="w-full bg-white rounded-full h-2 mt-2 overflow-hidden">
                    <div
                      className="bg-[#064E3B] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${enrollment.progressPercentage ?? 0}%` }}
                    />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="bg-[#064E3B] text-white px-8 py-4 rounded-full font-medium hover:bg-[#10B981] transition-all shadow-lg w-full md:w-auto disabled:opacity-60"
                >
                  {enrolling ? 'Enrolling...' : user ? 'Enroll Now — Free' : 'Log in to Enroll'}
                </button>
              )}
            </div>
          </div>

          {/* COURSE OVERVIEW TOGGLE */}
          {(course.learningOutcomes?.length > 0 ||
            course.prerequisites?.length > 0 ||
            course.practicalProject) && (
            <div className="mt-6 pt-5 border-t border-[#DCE4DF]">
              <button
                type="button"
                onClick={() => setShowOverview(!showOverview)}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#17231E] hover:text-[#064E3B] transition-colors"
              >
                <BookOpen size={16} />
                {showOverview ? 'Hide Course Syllabus & Outcomes' : 'View Course Outcomes, Prerequisites & Capstone'}
                {showOverview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showOverview && (
                <div className="grid md:grid-cols-3 gap-6 mt-5 pt-4">
                  {course.learningOutcomes?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#064E3B] mb-2">
                        What You'll Learn
                      </h3>
                      <ul className="space-y-1.5 text-sm text-[#17231E] list-disc pl-4">
                        {course.learningOutcomes.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {course.prerequisites?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#064E3B] mb-2">
                        Prerequisites
                      </h3>
                      <ul className="space-y-1.5 text-sm text-[#17231E] list-disc pl-4">
                        {course.prerequisites.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {course.practicalProject && (
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#064E3B] mb-2">
                        Practical Project
                      </h3>
                      <p className="text-sm text-[#17231E] leading-relaxed">
                        {course.practicalProject}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* COURSE COMPLETION CELEBRATION */}
        {isCourseCompleted && (
          <div className="bg-green-50 border-2 border-green-200 rounded-3xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-600 text-white rounded-2xl flex items-center justify-center flex-shrink-0">
                <Award size={26} />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-green-900">
                  Course Completed!
                </h2>
                <p className="text-sm text-green-700">
                  You have completed all {modules.length} modules in {course.title}.
                </p>
              </div>
            </div>
            <Link
              to="/courses"
              className="bg-green-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-green-800 transition-colors whitespace-nowrap"
            >
              Explore Next Course
            </Link>
          </div>
        )}

        {/* MOBILE MODULE SWITCHER */}
        <div className="lg:hidden mb-6">
          <button
            type="button"
            onClick={() => setMobileModulesOpen(!mobileModulesOpen)}
            className="w-full bg-white border-2 border-[#DCE4DF] rounded-2xl p-4 flex items-center justify-between font-bold text-[#17231E]"
          >
            <span className="truncate">
              {activeModule
                ? `Module ${activeIndex + 1} of ${modules.length}: ${activeModule.title}`
                : 'Select Module'}
            </span>
            {mobileModulesOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {mobileModulesOpen && (
            <div className="mt-2 space-y-2 bg-white border-2 border-[#DCE4DF] rounded-2xl p-3">
              {modules.map((mod, idx) => {
                const isCompleted = enrollment?.completedModules?.includes(mod._id);
                const isActive = activeModule?._id === mod._id;
                return (
                  <button
                    key={mod._id}
                    type="button"
                    onClick={() => {
                      setActiveModule(mod);
                      setMobileModulesOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl flex items-center justify-between border ${
                      isActive
                        ? 'border-[#064E3B] bg-[#F8F7F2]'
                        : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-[11px] font-bold text-[#064E3B]">MODULE {idx + 1}</p>
                      <p className="text-sm font-medium text-[#17231E] truncate">{mod.title}</p>
                    </div>
                    {isCompleted && <CheckCircle size={18} className="text-green-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-3 pb-4">
            <h2 className="text-xl font-bold font-serif mb-3 pb-2">
              Course Modules ({modules.length})
            </h2>
            {modules.length === 0 ? (
              <div className="bg-white border border-[#DCE4DF] rounded-2xl p-5 text-sm text-[#737A75]">
                No modules have been added to this course yet.
              </div>
            ) : (
              modules.map((mod, idx) => {
                const isCompleted = enrollment?.completedModules?.includes(mod._id);
                const isActive = activeModule?._id === mod._id;

                return (
                  <button
                    key={mod._id}
                    type="button"
                    onClick={() => setActiveModule(mod)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                      isActive
                        ? 'border-[#064E3B] bg-white shadow-md'
                        : 'border-[#DCE4DF] bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p
                        className={`text-xs font-bold mb-1 ${
                          isActive ? 'text-[#064E3B]' : 'text-[#737A75]'
                        }`}
                      >
                        MODULE {idx + 1} • {mod.duration}
                      </p>
                      <p
                        className={`font-medium truncate ${
                          isActive ? 'text-[#17231E]' : 'text-[#737A75]'
                        }`}
                      >
                        {mod.title}
                      </p>
                    </div>
                    {isCompleted && (
                      <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </aside>

          {/* Main Lesson Reader */}
          <div className="lg:col-span-2 w-full min-w-0">
            {activeModule ? (
              <motion.div
                key={activeModule._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-2 border-[#DCE4DF] rounded-3xl p-6 sm:p-10 shadow-sm w-full"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-[#DCE4DF] pb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-1">
                      Module {activeIndex + 1} of {modules.length}
                    </p>
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17231E] break-words">
                      {activeModule.title}
                    </h2>
                  </div>
                  <span className="bg-[#FDFCF8] text-[#17231E] px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">
                    {activeModule.duration}
                  </span>
                </div>

                {actionError && (
                  <div role="alert" className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm">
                    {actionError}
                  </div>
                )}

                {!enrollment ? (
                  <div className="flex flex-col items-center justify-center py-14 text-center">
                    <div className="w-20 h-20 bg-[#FDFCF8] rounded-full flex items-center justify-center mb-6">
                      <Lock size={32} className="text-[#064E3B]" />
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-[#17231E] mb-3">
                      Lesson Content Locked
                    </h3>
                    <p className="text-[#737A75] mb-8 max-w-md">
                      Enroll in this free course to unlock detailed notes, executable code examples, exercises, and module quizzes.
                    </p>
                    <button
                      type="button"
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="bg-[#064E3B] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#10B981] transition-all disabled:opacity-60"
                    >
                      {enrolling
                        ? 'Enrolling...'
                        : user
                        ? 'Enroll Now to Unlock'
                        : 'Log in to Enroll'}
                    </button>
                  </div>
                ) : (
                  <div className="w-full min-w-0">
                    {/* Module Overview & Roadmap (when module has multi-part lessons) */}
                    {hasLessons && activeModule.notes && (
                      <div className="mb-6 bg-[#F8F7F2] border border-[#DCE4DF] rounded-2xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setShowModuleOverview((v) => !v)}
                          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-[#FDFCF8]/60 transition-colors"
                        >
                          <span className="text-sm font-bold text-[#17231E] flex items-center gap-2">
                            <BookOpen size={16} className="text-[#064E3B]" />
                            Module Overview, Prerequisites & Completion Criteria
                          </span>
                          {showModuleOverview ? (
                            <ChevronUp size={16} className="text-[#737A75]" />
                          ) : (
                            <ChevronDown size={16} className="text-[#737A75]" />
                          )}
                        </button>
                        {showModuleOverview && (
                          <div className="px-5 pb-5 pt-2 border-t border-[#DCE4DF] text-sm sm:text-base text-[#17231E] leading-relaxed">
                            <ReactMarkdown
                              components={{
                                h2: ({ node, ...props }) => (
                                  <h4 className="text-base font-serif font-bold text-[#17231E] mt-4 mb-2" {...props} />
                                ),
                                h3: ({ node, ...props }) => (
                                  <h4 className="text-sm font-bold uppercase tracking-wider text-[#064E3B] mt-4 mb-1.5" {...props} />
                                ),
                                p: ({ node, ...props }) => (
                                  <p className="mb-2.5 leading-relaxed" {...props} />
                                ),
                                ul: ({ node, ...props }) => (
                                  <ul className="list-disc pl-5 mb-3 space-y-1 marker:text-[#064E3B]" {...props} />
                                ),
                                ol: ({ node, ...props }) => (
                                  <ol className="list-decimal pl-5 mb-3 space-y-1 marker:text-[#064E3B]" {...props} />
                                ),
                                strong: ({ node, ...props }) => (
                                  <strong className="font-bold text-[#17231E]" {...props} />
                                ),
                              }}
                            >
                              {activeModule.notes}
                            </ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Multi-Lesson Stepper */}
                    {hasLessons && (
                      <div className="mb-8 bg-[#F8F7F2] border border-[#DCE4DF] rounded-2xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-xs font-bold uppercase tracking-wider text-[#064E3B]">
                            Lessons in this Module ({activeLessonIdx + 1} of {lessons.length})
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={activeLessonIdx === 0}
                              onClick={() => setActiveLessonIdx((i) => Math.max(0, i - 1))}
                              className="px-2.5 py-1 rounded-lg border border-[#DCE4DF] bg-white text-xs font-medium disabled:opacity-40"
                            >
                              Prev Lesson
                            </button>
                            <button
                              type="button"
                              disabled={activeLessonIdx >= lessons.length - 1}
                              onClick={() =>
                                setActiveLessonIdx((i) => Math.min(lessons.length - 1, i + 1))
                              }
                              className="px-2.5 py-1 rounded-lg border border-[#DCE4DF] bg-white text-xs font-medium disabled:opacity-40"
                            >
                              Next Lesson
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {lessons.map((lesson, lIdx) => {
                            const lessonDone = enrollment?.completedLessons?.includes(
                              `${activeModule._id}:${lIdx}`
                            );
                            return (
                              <button
                                key={lesson._id || lIdx}
                                type="button"
                                onClick={() => setActiveLessonIdx(lIdx)}
                                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border inline-flex items-center gap-1.5 ${
                                  activeLessonIdx === lIdx
                                    ? 'bg-[#064E3B] text-white border-[#17231E]'
                                    : 'bg-white text-[#737A75] border-[#DCE4DF] hover:border-[#064E3B]'
                                }`}
                              >
                                {lessonDone && (
                                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                                )}
                                <span>
                                  {lIdx + 1}. {lesson.title}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#DCE4DF] flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleLessonComplete(activeModule._id, activeLessonIdx)
                            }
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors inline-flex items-center gap-1.5 ${
                              enrollment?.completedLessons?.includes(
                                `${activeModule._id}:${activeLessonIdx}`
                              )
                                ? 'bg-green-50 border-green-200 text-green-700'
                                : 'bg-white border-[#DCE4DF] text-[#17231E] hover:border-[#064E3B]'
                            }`}
                          >
                            <CheckCircle size={14} />
                            {enrollment?.completedLessons?.includes(
                              `${activeModule._id}:${activeLessonIdx}`
                            )
                              ? 'Lesson Read'
                              : 'Mark Lesson Read'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Active Lesson Title & Introduction */}
                    {currentLesson && (
                      <div className="mb-6">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h3 className="text-2xl font-serif font-bold text-[#17231E]">
                            {currentLesson.title}
                          </h3>
                          {currentLesson.duration && (
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F8F7F2] border border-[#DCE4DF] text-[#737A75]">
                              {currentLesson.duration}
                            </span>
                          )}
                        </div>
                        {currentLesson.introduction && (
                          <p className="text-[#17231E] text-base sm:text-lg leading-relaxed bg-[#F8F7F2] border-l-4 border-[#064E3B] p-4 rounded-r-xl">
                            {currentLesson.introduction}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Learning Objectives */}
                    {displayObjectives.length > 0 && (
                      <div className="bg-[#F8F7F2] border border-[#DCE4DF] rounded-2xl p-5 mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#17231E] mb-3 flex items-center gap-2">
                          <Target size={16} className="text-[#064E3B]" /> Learning Objectives
                        </h3>
                        <ul className="space-y-1.5 text-sm sm:text-base text-[#17231E] list-disc pl-5">
                          {displayObjectives.map((obj, idx) => (
                            <li key={idx}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Notes */}
                    <div className="mb-10 w-full overflow-hidden">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ node, ...props }) => (
                            <h2 className="text-2xl font-serif font-bold text-[#17231E] mt-8 mb-4" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h3 className="text-2xl font-serif font-bold text-[#17231E] mt-8 mb-3" {...props} />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3
                              className="text-xl font-serif font-bold text-[#064E3B] mt-8 mb-3 pl-4 border-l-4 border-[#064E3B]"
                              {...props}
                            />
                          ),
                          h4: ({ node, ...props }) => (
                            <h4 className="text-lg font-bold text-[#17231E] mt-6 mb-2" {...props} />
                          ),
                          hr: () => <hr className="my-8 border-t border-[#DCE4DF]" />,
                          em: ({ node, ...props }) => <em className="italic text-[#2C2C2C]" {...props} />,
                          table: ({ node, ...props }) => (
                            <div className="w-full max-w-full overflow-x-auto my-6 rounded-xl border border-[#DCE4DF]">
                              <table className="w-full text-left border-collapse text-sm sm:text-base" {...props} />
                            </div>
                          ),
                          thead: ({ node, ...props }) => (
                            <thead className="bg-[#F8F7F2] border-b border-[#DCE4DF]" {...props} />
                          ),
                          th: ({ node, ...props }) => (
                            <th className="px-4 py-3 font-bold text-[#17231E] whitespace-nowrap" {...props} />
                          ),
                          td: ({ node, ...props }) => (
                            <td className="px-4 py-3 text-[#17231E] border-t border-[#DCE4DF]/70 align-top" {...props} />
                          ),
                          p: ({ node, ...props }) => (
                            <p className="text-[#17231E] text-base sm:text-lg leading-relaxed mb-4 break-words" {...props} />
                          ),
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-6 mb-5 text-[#17231E] text-base sm:text-lg space-y-2 marker:text-[#064E3B]" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal pl-6 mb-5 text-[#17231E] text-base sm:text-lg space-y-2 marker:text-[#064E3B] marker:font-bold" {...props} />
                          ),
                          li: ({ node, ...props }) => <li className="leading-relaxed break-words" {...props} />,
                          strong: ({ node, ...props }) => (
                            <strong className="font-bold text-[#17231E]" {...props} />
                          ),
                          blockquote: ({ node, ...props }) => (
                            <blockquote
                              className="bg-[#FDFCF8] border-l-4 border-[#D4E157] p-4 rounded-r-xl my-6 text-[#17231E] italic"
                              {...props}
                            />
                          ),
                          pre: ({ node, ...props }) => (
                            <div className="w-full max-w-full overflow-hidden rounded-xl my-5 border border-[#2D2D2D]">
                              <pre
                                className="bg-[#1E1E1E] p-5 overflow-x-auto text-sm font-mono text-[#D4D4D4]"
                                {...props}
                              />
                            </div>
                          ),
                          code: ({ node, inline, ...props }) =>
                            inline ? (
                              <code
                                className="bg-[#FDFCF8] text-[#C85A17] px-1.5 py-0.5 rounded font-mono text-sm font-semibold break-words"
                                {...props}
                              />
                            ) : (
                              <code className="font-mono text-sm" {...props} />
                            ),
                        }}
                      >
                        {displayNotes}
                      </ReactMarkdown>
                    </div>

                    {/* Code Example & Explanation */}
                    {displayCode && (
                      <div className="mb-10 w-full max-w-full">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold flex items-center gap-2 text-[#17231E]">
                            <PlayCircle size={22} className="text-[#064E3B]" /> Code Example
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(displayCode)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#DCE4DF] bg-[#F8F7F2] hover:bg-[#FDFCF8] text-[#17231E]"
                          >
                            {copiedCode ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                            {copiedCode ? 'Copied' : 'Copy Code'}
                          </button>
                        </div>
                        <div className="w-full max-w-full overflow-hidden rounded-xl border-2 border-[#1E1E1E] bg-[#1E1E1E]">
                          <pre className="p-5 overflow-x-auto text-sm font-mono text-[#D4D4D4]">
                            <code>{displayCode}</code>
                          </pre>
                        </div>
                        {displayCodeExplanation && (
                          <div className="mt-4 bg-[#F8F7F2] border border-[#DCE4DF] rounded-xl p-4 text-sm sm:text-base text-[#17231E] leading-relaxed">
                            <p className="font-bold text-[#17231E] mb-1">How This Code Works:</p>
                            <p className="whitespace-pre-line">{displayCodeExplanation}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Practice Exercise */}
                    {displayExercise && (
                      <div className="mb-8 bg-[#FFF9F2] border border-[#064E3B]/30 rounded-2xl p-6">
                        <h3 className="text-lg font-serif font-bold text-[#17231E] mb-2 flex items-center gap-2">
                          <Wrench size={18} className="text-[#064E3B]" /> Hands-On Practice
                        </h3>
                        <p className="text-[#17231E] leading-relaxed whitespace-pre-line">
                          {displayExercise}
                        </p>
                      </div>
                    )}

                    {/* Key Takeaways */}
                    {displayTakeaways.length > 0 && (
                      <div className="mb-10 bg-[#FDFCF8]/60 border border-[#DCE4DF] rounded-2xl p-6">
                        <h3 className="text-lg font-serif font-bold text-[#17231E] mb-3 flex items-center gap-2">
                          <Lightbulb size={18} className="text-[#064E3B]" /> Key Takeaways
                        </h3>
                        <ul className="space-y-1.5 text-[#17231E] list-disc pl-5">
                          {displayTakeaways.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Module Practical Assignment */}
                    {activeModule.assignment && (
                      <div className="mb-10 bg-[#1A1A1A] text-white rounded-2xl p-6">
                        <h3 className="text-lg font-serif font-bold text-[#D6B56D] mb-2">
                          Module Practical Assignment
                        </h3>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                          {activeModule.assignment}
                        </p>
                      </div>
                    )}

                    {/* QUIZ SECTION */}
                    {hasQuiz && (
                      <div className="mb-10 bg-[#F8F7F2] border-2 border-[#DCE4DF] rounded-3xl p-6 sm:p-8">
                        <h3 className="text-2xl font-bold font-serif text-[#17231E] mb-2 flex items-center gap-2">
                          <HelpCircle size={24} className="text-[#064E3B]" /> Knowledge Check
                        </h3>
                        <p className="text-[#737A75] mb-6 text-sm sm:text-base">
                          Score 100% on this quiz to unlock "Mark as Complete" for this module.
                        </p>

                        {quizSubmitted && quizPassed ? (
                          <div className="space-y-6">
                            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                              <CheckCircle size={44} className="text-green-500 mx-auto mb-3" />
                              <h4 className="text-2xl font-bold text-green-700 mb-1">
                                Perfect Score ({quizScore}%)!
                              </h4>
                              <p className="text-green-600 text-sm mb-4">
                                You can now mark this module as complete below.
                              </p>
                              <button
                                type="button"
                                onClick={handleRetakeQuiz}
                                className="text-green-700 font-bold text-sm underline inline-flex items-center gap-1.5 hover:text-green-800"
                              >
                                <RefreshCw size={14} /> Retake Quiz
                              </button>
                            </div>
                          </div>
                        ) : (
                          <form onSubmit={handleQuizSubmit}>
                            {activeModule.quiz.map((q, qIndex) => {
                              const selected = quizAnswers[qIndex];
                              const isCorrect = selected === q.correctAnswer;

                              return (
                                <div key={qIndex} className="mb-7">
                                  <p className="font-bold text-base sm:text-lg text-[#17231E] mb-3">
                                    {qIndex + 1}. {q.question}
                                  </p>
                                  <div className="space-y-2.5">
                                    {q.options.map((option, oIndex) => {
                                      const isSelected = selected === oIndex;
                                      let borderClass = 'border-[#DCE4DF] bg-white hover:border-gray-300';
                                      if (isSelected && !quizSubmitted) {
                                        borderClass = 'border-[#064E3B] bg-white';
                                      } else if (quizSubmitted && isSelected && isCorrect) {
                                        borderClass = 'border-green-500 bg-green-50';
                                      } else if (quizSubmitted && isSelected && !isCorrect) {
                                        borderClass = 'border-red-400 bg-red-50';
                                      }

                                      return (
                                        <label
                                          key={oIndex}
                                          className={`flex items-center p-3.5 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${borderClass}`}
                                        >
                                          <input
                                            type="radio"
                                            name={`question-${qIndex}`}
                                            checked={isSelected}
                                            onChange={() => handleOptionSelect(qIndex, oIndex)}
                                            className="w-4 h-4 text-[#064E3B] focus:ring-[#10B981] mr-3.5 flex-shrink-0"
                                          />
                                          <span className="text-[#17231E] text-sm sm:text-base font-medium">
                                            {option}
                                          </span>
                                        </label>
                                      );
                                    })}
                                  </div>

                                  {quizSubmitted && q.explanation && (
                                    <p
                                      className={`mt-2 text-xs sm:text-sm px-3 py-2 rounded-lg ${
                                        isCorrect
                                          ? 'bg-green-50 text-green-700'
                                          : 'bg-amber-50 text-amber-800'
                                      }`}
                                    >
                                      <strong>Explanation:</strong> {q.explanation}
                                    </p>
                                  )}
                                </div>
                              );
                            })}

                            {quizSubmitted && !quizPassed && (
                              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-bold text-red-700">
                                    You scored {quizScore}% — 100% required to pass
                                  </p>
                                  <p className="text-red-600 text-sm">
                                    Review the explanations above and update your answers to try again.
                                  </p>
                                </div>
                              </div>
                            )}

                            <button
                              type="submit"
                              className="w-full bg-[#064E3B] text-white font-bold py-3.5 rounded-xl hover:bg-[#e67a36] transition-all shadow-md"
                            >
                              {quizSubmitted ? 'Submit Updated Answers' : 'Submit Answers'}
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* MARK COMPLETE & NEXT/PREV NAVIGATION */}
                    <div className="border-t border-[#DCE4DF] pt-8 mt-8 space-y-4">
                      <button
                        type="button"
                        onClick={() => handleToggleComplete(activeModule._id)}
                        disabled={togglingComplete || (hasQuiz && !quizPassed && !isModuleCompleted)}
                        className={`w-full py-4 rounded-xl font-bold text-base sm:text-lg transition-all flex items-center justify-center gap-2 ${
                          isModuleCompleted
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-200'
                            : hasQuiz && !quizPassed
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                            : 'bg-[#064E3B] text-white hover:bg-[#10B981] border-2 border-[#17231E] hover:border-[#064E3B]'
                        }`}
                      >
                        <CheckCircle size={20} />
                        {togglingComplete
                          ? 'Saving...'
                          : isModuleCompleted
                          ? 'Completed (Click to Undo)'
                          : hasQuiz && !quizPassed
                          ? 'Pass the quiz (100%) to unlock'
                          : 'Mark as Complete'}
                      </button>

                      <div className="flex items-center justify-between gap-4 pt-2">
                        <button
                          type="button"
                          disabled={!prevModule}
                          onClick={() => prevModule && setActiveModule(prevModule)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DCE4DF] text-sm font-medium text-[#17231E] hover:bg-[#F8F7F2] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft size={16} /> Previous Lesson
                        </button>

                        <button
                          type="button"
                          disabled={!nextModule}
                          onClick={() => nextModule && setActiveModule(nextModule)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DCE4DF] text-sm font-medium text-[#17231E] hover:bg-[#F8F7F2] disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Next Lesson <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="bg-white border-2 border-[#DCE4DF] rounded-3xl p-12 text-center text-[#737A75]">
                This course doesn't have any modules yet. Check back soon!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
