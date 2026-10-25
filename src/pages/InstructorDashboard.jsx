import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Edit, Trash2, X, Settings } from 'lucide-react';

const InstructorDashboard = () => {
  const { user, API_URL } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses`);
      setCourses(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [API_URL]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    try {
      await axios.post(`${API_URL}/api/courses`, 
        { title, description, totalDuration: duration, thumbnail: 'default' },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      setIsModalOpen(false);
      setTitle(''); setDescription(''); setDuration('');
      fetchCourses(); 
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course and all its modules?")) return;
    try {
      await axios.delete(`${API_URL}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchCourses(); // Refresh list
    } catch (error) {
      alert("Failed to delete course");
    }
  };

  if (!user || user.user?.role !== 'instructor') {
    return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] text-xl font-bold text-red-500">Access Denied. Instructors only.</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-[#1C1C1C] mb-2">Instructor Dashboard</h1>
            <p className="text-[#6B6B6B] text-lg">Manage your courses and modules.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1C1C1C] text-white px-6 py-3 rounded-full font-medium hover:bg-[#FF8C42] transition-all flex items-center gap-2 shadow-lg"
          >
            <PlusCircle size={20} /> Create New Course
          </button>
        </div>

        {loading ? (
          <p className="text-[#6B6B6B]">Loading your courses...</p>
        ) : (
          <div className="bg-white border-2 border-[#EAE6DF] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-[#F4F0EA] border-b border-[#EAE6DF]">
                  <th className="p-4 font-bold text-[#1C1C1C]">Course Title</th>
                  <th className="p-4 font-bold text-[#1C1C1C]">Duration</th>
                  <th className="p-4 font-bold text-[#1C1C1C] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course._id} className="border-b border-[#EAE6DF] hover:bg-[#FDFBF7] transition-colors">
                    <td className="p-4 font-medium text-[#1C1C1C]">{course.title}</td>
                    <td className="p-4 text-[#6B6B6B]">{course.totalDuration}</td>
                    <td className="p-4 flex items-center justify-end gap-3">
                      <Link 
                        to={`/instructor/course/${course._id}`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" 
                        title="Manage Modules"
                      >
                        <Settings size={18} />
                      </Link>
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteCourse(course._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE COURSE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-serif font-bold text-[#1C1C1C] mb-6">Create New Course</h2>
            {formError && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm">{formError}</div>}
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Course Title</label>
                <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border-2 border-[#EAE6DF] focus:border-[#FF8C42] outline-none" placeholder="e.g. Advanced React Patterns" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-2 rounded-lg border-2 border-[#EAE6DF] focus:border-[#FF8C42] outline-none h-24 resize-none" placeholder="Briefly describe this course..." />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Estimated Duration</label>
                <input type="text" required value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-4 py-2 rounded-lg border-2 border-[#EAE6DF] focus:border-[#FF8C42] outline-none" placeholder="e.g. 4h 30m" />
              </div>
              <button type="submit" disabled={submitting} className="w-full bg-[#1C1C1C] text-white font-bold py-3 rounded-xl hover:bg-[#FF8C42] transition-all mt-4 disabled:opacity-50">
                {submitting ? 'Creating...' : 'Save Course'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;