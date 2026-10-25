import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react'; // Removed ArrowRight

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/courses`);
        setCourses(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses", error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, [API_URL]);

  const cardColors = [
    'bg-[#E6F0FA]', 'bg-[#F4F0EA]', 'bg-[#EAEFF0]', 
    'bg-[#F5EBE9]', 'bg-[#EBF1EA]', 'bg-[#F4EFF7]'
  ];

  // Helper to extract a short acronym from the title
const getAcronym = (title) => {
  // 1. Keep the special acronyms for our main courses
  if (title.includes('JavaScript')) return 'JS';
  if (title.includes('HTML')) return 'HTML';
  if (title.includes('React')) return 'React';
  if (title.includes('Node')) return 'Node';
  if (title.includes('Mongo')) return 'Mongo';
  if (title.includes('Git')) return 'Git';
  if (title.includes('Vercel')) return 'Vercel';
  if (title.includes('Tailwind')) return 'CSS';
  if (title.includes('TypeScript')) return 'TS';
  
  // 2. Dynamic fallback for any NEW course you add!
  // Takes the first word and shortens it if it's too long.
  const firstWord = title.split(' ')[0];
  
  if (firstWord.length > 5) {
    return firstWord.substring(0, 4); // e.g., "Python" becomes "Pyth"
  }
  return firstWord; // e.g., "Java" stays "Java"
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="w-8 h-8 border-4 border-[#FF8C42] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          className="mb-12 md:mb-16 text-center md:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#1C1C1C] mb-4">Explore Courses</h1>
          <p className="text-[#6B6B6B] text-lg md:text-xl max-w-2xl mx-auto md:mx-0">
            Master the stack with our focused, project-based curriculum. Learn deeply, build boldly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {courses.map((course, index) => (
            <motion.div 
              key={course._id}
              // Changed y to 50 so it triggers on mobile scroll
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              // Added amount: 0.1 to trigger as soon as 10% of card is visible
              viewport={{ once: true, amount: 0.1 }} 
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white border border-[#EAE6DF] rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col cursor-pointer shadow-sm relative"
            >
              
              <div className={`h-48 sm:h-56 ${cardColors[index % cardColors.length]} p-6 relative overflow-hidden flex flex-col justify-between`}>
                <div className="flex justify-between items-start">
                  <span className="bg-white/80 backdrop-blur-sm text-[#1C1C1C] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    Course
                  </span>
                </div>
                <h2 className="text-5xl sm:text-6xl font-serif text-[#1C1C1C]/80 font-bold relative z-10 transition-transform duration-500 group-hover:scale-105 origin-left">
                  {getAcronym(course.title)}
                </h2>
              </div>

              <div className="p-6 md:p-8 flex flex-col flex-grow bg-white">
                <h3 className="text-xl md:text-2xl font-serif font-bold text-[#1C1C1C] mb-3 line-clamp-2">
                  {course.title}
                </h3>
                
                <p className="text-[#6B6B6B] text-sm md:text-base line-clamp-2 mb-6 flex-grow">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between border-t border-[#EAE6DF] pt-5 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-[#6B6B6B] font-medium">
                    <Clock size={16} className="text-[#FF8C42]" />
                    <span>{course.totalDuration || '0h 0m'}</span>
                  </div>
                  
                  {/* Arrow removed here */}
                  <Link to={`/course/${course._id}`} className="text-[#1C1C1C] font-bold group-hover:text-[#FF8C42] transition-colors">
                    View
                  </Link>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Courses;