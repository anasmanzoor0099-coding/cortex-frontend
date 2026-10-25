import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ChevronLeft, PlusCircle, Trash2, X } from 'lucide-react';

const ManageCourse = () => {
  const { id } = useParams();
  const { user, API_URL } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [codeExample, setCodeExample] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCourseData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses/${id}`);
      setCourse(res.data.course);
      setModules(res.data.modules);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id, API_URL]);

  const handleAddModule = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/courses/${id}/modules`, 
        { title, duration, notes, codeExample },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setIsModalOpen(false);
      setTitle(''); setDuration(''); setNotes(''); setCodeExample('');
      fetchCourseData(); // Refresh list
    } catch (error) {
      alert("Failed to add module");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (!window.confirm("Delete this module?")) return;
    try {
      await axios.delete(`${API_URL}/api/courses/${id}/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchCourseData(); // Refresh list
    } catch (error) {
      alert("Failed to delete module");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">Loading...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">Course not found.</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        <Link to="/instructor/dashboard" className="inline-flex items-center text-[#6B6B6B] hover:text-[#1C1C1C] mb-8 font-medium">
          <ChevronLeft size={20} /> Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1C1C1C] mb-2">{course.title}</h1>
            <p className="text-[#6B6B6B] text-lg">Manage modules for this course.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1C1C1C] text-white px-6 py-3 rounded-full font-medium hover:bg-[#FF8C42] transition-all flex items-center gap-2 shadow-lg whitespace-nowrap"
          >
            <PlusCircle size={20} /> Add Module
          </button>
        </div>

        <div className="space-y-4">
          {modules.length === 0 ? (
            <div className="bg-white border-2 border-[#EAE6DF] rounded-3xl p-8 text-center text-[#6B6B6B]">
              No modules yet. Click "Add Module" to create the first lesson!
            </div>
          ) : (
            modules.map((mod, idx) => (
              <div key={mod._id} className="bg-white border-2 border-[#EAE6DF] rounded-2xl p-6 flex justify-between items-center shadow-sm">
                <div>
                  <p className="text-xs font-bold text-[#FF8C42] mb-1">MODULE {idx + 1}</p>
                  <h3 className="text-xl font-bold text-[#1C1C1C]">{mod.title}</h3>
                  <p className="text-sm text-[#6B6B6B] mt-1">{mod.duration}</p>
                </div>
                <button 
                  onClick={() => handleDeleteModule(mod._id)}
                  className="p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADD MODULE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-serif font-bold text-[#1C1C1C] mb-6">Add New Module</h2>
            
            <form onSubmit={handleAddModule} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Module Title</label>
                  <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-lg border-2 border-[#EAE6DF] focus:border-[#FF8C42] outline-none" placeholder="e.g. Introduction to Variables" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Duration</label>
                  <input type="text" required value={duration} onChange={e => setDuration(e.target.value)} className="w-full px-4 py-2 rounded-lg border-2 border-[#EAE6DF] focus:border-[#FF8C42] outline-none" placeholder="e.g. 1h 30m" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1">Notes (Markdown supported)</label>
                <textarea required value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-4 py-2 rounded-lg border-2 border-[#EAE6DF] focus:border-[#FF8C42] outline-none h-48 font-mono text-sm" placeholder="### Heading&#10;Write your lesson text here...&#10;- Bullet point&#10;- Bullet point" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Code Example (Optional)</label>
                <textarea value={codeExample} onChange={e => setCodeExample(e.target.value)} className="w-full px-4 py-2 rounded-lg border-2 border-[#EAE6DF] focus:border-[#FF8C42] outline-none h-32 font-mono text-sm bg-[#1E1E1E] text-white" placeholder="// Your code here" />
              </div>
              
              <button type="submit" disabled={submitting} className="w-full bg-[#1C1C1C] text-white font-bold py-3 rounded-xl hover:bg-[#FF8C42] transition-all mt-4 disabled:opacity-50">
                {submitting ? 'Adding...' : 'Save Module'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourse;