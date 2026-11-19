import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle, AlertTriangle, BookOpen, Award, Settings } from 'lucide-react';
import PageLoader from '../components/PageLoader';
import PageHeader from '../components/AnimatedHeader';

const MyLearning = () => {
  const { user, API_URL } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.token) {
      setLoading(false);
      return;
    }

    let active = true;
    const fetchMyEnrollments = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/enrollments/my`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (active) setEnrollments(res.data);
      } catch (err) {
        if (active) setError('Could not load your enrollments. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchMyEnrollments();
    return () => {
      active = false;
    };
  }, [user, API_URL]);

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#F8F7F2] px-6">
        <div className="bg-white border border-[#DCE4DF] rounded-3xl p-10 text-center max-w-md w-full shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-[#17231E] mb-3">Sign in to view your learning</h2>
          <p className="text-[#737A75] mb-6">Track your enrolled courses, module progress, and quiz completions.</p>
          <Link to="/login" className="inline-block bg-[#064E3B] text-white px-7 py-3 rounded-full font-medium hover:bg-[#10B981] transition-all">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <PageLoader message="Loading your courses..." />;
  }

  return (
    <div className="min-h-[85vh] bg-[#F8F7F2] py-12 md:py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <PageHeader
          eyebrow="Student Dashboard"
          title="My Learning"
          subtitle="Pick up right where you left off."
          className="mb-10"
          actions={
            <>
              <Link
                to="/settings"
                className="text-sm font-semibold text-[#17231E] bg-white border border-[#DCE4DF] hover:border-[#064E3B] px-4 py-2 rounded-full inline-flex items-center gap-2 transition-colors"
              >
                <Settings size={15} className="text-[#064E3B]" /> Settings
              </Link>
              <Link
                to="/courses"
                className="text-sm font-semibold text-[#17231E] hover:text-[#064E3B] inline-flex items-center gap-2 transition-colors"
              >
                <BookOpen size={16} /> Browse all courses
              </Link>
            </>
          }
        />

        {error && (
          <div role="alert" className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl mb-6">
            {error}
          </div>
        )}

        {enrollments.length === 0 ? (
          <div className="bg-white border border-[#DCE4DF] rounded-3xl p-12 text-center shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-[#17231E] mb-3">
              You aren't enrolled in any courses yet.
            </h2>
            <p className="text-[#737A75] mb-6 max-w-md mx-auto">
              Start with HTML & CSS, JavaScript, or Python — every course is free and tracks your module progress automatically.
            </p>
            <Link
              to="/courses"
              className="inline-block bg-[#064E3B] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#10B981] transition-all"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {enrollments.map((enroll) => {
              // Safely handle orphaned enrollments if a course was deleted
              if (!enroll.course || enroll.isCourseUnavailable) {
                return (
                  <div
                    key={enroll._id}
                    className="bg-white border border-amber-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="inline-flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-xs font-bold mb-4">
                        <AlertTriangle size={14} /> Course Unavailable
                      </div>
                      <h3 className="text-xl font-serif font-bold text-[#17231E] mb-2">
                        This course is no longer available
                      </h3>
                      <p className="text-sm text-[#737A75] mb-6">
                        The instructor removed or archived this course. Explore our active curriculum to continue learning.
                      </p>
                    </div>
                    <Link
                      to="/courses"
                      className="w-full bg-[#F8F7F2] border border-[#DCE4DF] text-[#17231E] py-3 rounded-xl font-medium text-center hover:bg-[#FDFCF8] transition-colors"
                    >
                      Browse Active Courses
                    </Link>
                  </div>
                );
              }

              const progress = Number.isFinite(enroll.progressPercentage)
                ? enroll.progressPercentage
                : 0;
              const isCompleted = progress >= 100 && (enroll.totalModules ?? 0) > 0;

              return (
                <motion.div
                  key={enroll._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-[#DCE4DF] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F8F7F2] border border-[#DCE4DF] text-[#737A75]">
                      {enroll.course.difficulty || 'Beginner'}
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                        <Award size={14} /> Completed
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-[#17231E] mb-2">
                    {enroll.course.title}
                  </h3>
                  <p className="text-[#737A75] text-sm mb-6 line-clamp-2 flex-grow">
                    {enroll.course.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span className="text-[#17231E]">
                        {enroll.completedCount ?? enroll.completedModules?.length ?? 0} of{' '}
                        {enroll.totalModules ?? 0} modules
                      </span>
                      <span className="text-[#064E3B] font-bold">{progress}%</span>
                    </div>
                    <div className="w-full bg-[#DCE4DF] rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          isCompleted ? 'bg-green-500' : 'bg-[#064E3B]'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    to={`/course/${enroll.course._id}`}
                    className="w-full bg-[#F8F7F2] border border-[#DCE4DF] text-[#17231E] py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#17231E] hover:text-white transition-colors"
                  >
                    {isCompleted ? <CheckCircle size={18} /> : <PlayCircle size={18} />}
                    {isCompleted ? 'Review Course' : 'Continue Learning'}
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

export default MyLearning;
