import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

const MyLearning = () => {
  const { user, API_URL } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEnrollments = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/enrollments/my`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setEnrollments(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (user) fetchMyEnrollments();
  }, [user, API_URL]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">Loading your courses...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">Please login to see your courses.</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-[#1C1C1C] mb-2">My Learning</h1>
        <p className="text-[#6B6B6B] mb-10 text-lg">Pick up where you left off.</p>

        {enrollments.length === 0 ? (
          <div className="bg-white border border-[#EAE6DF] rounded-3xl p-12 text-center">
            <h2 className="text-2xl font-bold text-[#1C1C1C] mb-4">You aren't enrolled in any courses yet.</h2>
            <Link to="/courses" className="bg-[#1C1C1C] text-white px-8 py-3 rounded-full font-medium hover:bg-[#FF8C42] transition-all">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {enrollments.map((enroll) => (
              <motion.div 
                key={enroll._id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-[#EAE6DF] rounded-3xl p-6 shadow-sm flex flex-col"
              >
                <h3 className="text-2xl font-serif font-bold text-[#1C1C1C] mb-2">{enroll.course.title}</h3>
                <p className="text-[#6B6B6B] text-sm mb-6 flex-grow">{enroll.course.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2 font-medium">
                    <span className="text-[#1C1C1C]">Progress</span>
                    <span className="text-[#FF8C42]">{enroll.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-[#EAE6DF] rounded-full h-2.5">
                    <div className="bg-[#FF8C42] h-2.5 rounded-full transition-all duration-500" style={{ width: `${enroll.progressPercentage}%` }}></div>
                  </div>
                </div>

                <Link to={`/course/${enroll.course._id}`} className="w-full bg-[#FDFBF7] border border-[#EAE6DF] text-[#1C1C1C] py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#F4F0EA] transition-colors">
                  <PlayCircle size={20} /> Continue Learning
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;