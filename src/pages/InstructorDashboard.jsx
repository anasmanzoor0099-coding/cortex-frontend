import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { PlusCircle, Edit, Trash2, X, Settings, Users, Layers } from 'lucide-react';
import PageHeader from '../components/AnimatedHeader';

const EMPTY_FORM = {
  title: '',
  description: '',
  totalDuration: '',
  category: 'Web Development',
  difficulty: 'Beginner',
  tags: '',
  practicalProject: '',
};

const InstructorDashboard = () => {
  const { user, API_URL, isInstructorOrAdmin } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Create/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Enrollments Modal
  const [enrollModal, setEnrollModal] = useState({
    open: false,
    loading: false,
    courseTitle: '',
    totalModules: 0,
    enrollments: [],
    error: '',
  });

  const fetchCourses = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses`);
      setCourses(res.data);
    } catch {
      setFeedback({ type: 'error', text: 'Failed to load courses.' });
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (!user || !isInstructorOrAdmin) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#F8F7F2] px-6 text-center">
        <h2 className="text-2xl font-serif font-bold text-red-600 mb-2">Access Denied</h2>
        <p className="text-[#737A75] mb-6">This area is restricted to instructors and administrators.</p>
        <Link to="/" className="bg-[#064E3B] text-white px-6 py-2.5 rounded-full text-sm font-medium">
          Back to Home
        </Link>
      </div>
    );
  }

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setEditingId(course._id);
    setForm({
      title: course.title || '',
      description: course.description || '',
      totalDuration: course.totalDuration || '',
      category: course.category || 'Web Development',
      difficulty: course.difficulty || 'Beginner',
      tags: Array.isArray(course.tags) ? course.tags.join(', ') : '',
      practicalProject: course.practicalProject || '',
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    setFormError('');

    if (form.title.trim().length < 3) {
      setFormError('Course title must be at least 3 characters.');
      return;
    }
    if (form.description.trim().length < 10) {
      setFormError('Description must be at least 10 characters.');
      return;
    }

    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      totalDuration: form.totalDuration.trim() || '0h 0m',
      category: form.category.trim() || 'Web Development',
      difficulty: form.difficulty,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      practicalProject: form.practicalProject.trim(),
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/api/courses/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFeedback({ type: 'success', text: 'Course updated successfully.' });
      } else {
        await axios.post(`${API_URL}/api/courses`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFeedback({ type: 'success', text: 'Course created successfully.' });
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to save course.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id, title) => {
    if (
      !window.confirm(
        `Delete "${title}"? This will permanently remove the course, all its modules, and student enrollments.`
      )
    ) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFeedback({ type: 'success', text: `Deleted "${title}".` });
      fetchCourses();
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete course.',
      });
    }
  };

  const handleViewEnrollments = async (course) => {
    setEnrollModal({
      open: true,
      loading: true,
      courseTitle: course.title,
      totalModules: 0,
      enrollments: [],
      error: '',
    });

    try {
      const res = await axios.get(`${API_URL}/api/courses/${course._id}/enrollments`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEnrollModal({
        open: true,
        loading: false,
        courseTitle: res.data.courseTitle,
        totalModules: res.data.totalModules,
        enrollments: res.data.enrollments || [],
        error: '',
      });
    } catch (err) {
      setEnrollModal((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || 'Could not load enrollments.',
      }));
    }
  };

  const totalModulesCount = courses.reduce((acc, c) => acc + (c.moduleCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8F7F2] py-12 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        <PageHeader
          eyebrow={user.user?.role === 'admin' ? 'Admin & Instructor Studio' : 'Instructor Studio'}
          title="Course Management"
          className="mb-8"
          titleClassName="text-3xl md:text-4xl font-serif font-bold text-[#17231E]"
          actions={
            <button
              type="button"
              onClick={openCreateModal}
              className="bg-[#064E3B] text-white px-6 py-3 rounded-full font-medium hover:bg-[#10B981] transition-all flex items-center gap-2 shadow-md"
            >
              <PlusCircle size={20} /> Create New Course
            </button>
          }
        />

        {/* OVERVIEW STATS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-[#DCE4DF] rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-[#737A75] font-semibold">Total Courses</p>
            <p className="text-3xl font-serif font-bold text-[#17231E] mt-1">{courses.length}</p>
          </div>
          <div className="bg-white border border-[#DCE4DF] rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-[#737A75] font-semibold">Total Modules</p>
            <p className="text-3xl font-serif font-bold text-[#064E3B] mt-1">{totalModulesCount}</p>
          </div>
          <div className="bg-white border border-[#DCE4DF] rounded-2xl p-5 col-span-2 md:col-span-1">
            <p className="text-xs uppercase tracking-wider text-[#737A75] font-semibold">Signed In As</p>
            <p className="text-lg font-bold text-[#17231E] mt-2 capitalize">{user.user?.role}</p>
          </div>
        </div>

        {feedback.text && (
          <div
            className={`p-4 rounded-2xl mb-6 text-sm font-medium flex justify-between items-center ${
              feedback.type === 'error'
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-green-50 border border-green-200 text-green-700'
            }`}
          >
            <span>{feedback.text}</span>
            <button type="button" onClick={() => setFeedback({ type: '', text: '' })}>
              <X size={16} />
            </button>
          </div>
        )}

        {loading ? (
          <div className="bg-white border border-[#DCE4DF] rounded-3xl p-8 text-[#737A75]">
            Loading courses...
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white border border-[#DCE4DF] rounded-3xl p-12 text-center">
            <p className="text-lg text-[#737A75] mb-4">No courses found yet.</p>
            <button
              type="button"
              onClick={openCreateModal}
              className="bg-[#064E3B] text-white px-6 py-3 rounded-full font-medium"
            >
              Create First Course
            </button>
          </div>
        ) : (
          <div className="bg-white border-2 border-[#DCE4DF] rounded-3xl overflow-hidden shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              <thead>
                <tr className="bg-[#FDFCF8] border-b border-[#DCE4DF] text-sm">
                  <th className="p-4 font-bold text-[#17231E]">Course Title</th>
                  <th className="p-4 font-bold text-[#17231E]">Difficulty</th>
                  <th className="p-4 font-bold text-[#17231E]">Modules</th>
                  <th className="p-4 font-bold text-[#17231E]">Duration</th>
                  <th className="p-4 font-bold text-[#17231E] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course._id}
                    className="border-b border-[#DCE4DF] hover:bg-[#F8F7F2] transition-colors"
                  >
                    <td className="p-4">
                      <p className="font-semibold text-[#17231E]">{course.title}</p>
                      <p className="text-xs text-[#737A75]">{course.category || 'Web Development'}</p>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F8F7F2] border border-[#DCE4DF] text-[#17231E]">
                        {course.difficulty || 'Beginner'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[#737A75]">
                      <span className="inline-flex items-center gap-1">
                        <Layers size={14} className="text-[#064E3B]" /> {course.moduleCount ?? 0}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[#737A75]">{course.totalDuration}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewEnrollments(course)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="View Enrolled Students"
                        >
                          <Users size={18} />
                        </button>
                        <Link
                          to={`/instructor/course/${course._id}`}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Manage Modules & Quizzes"
                        >
                          <Settings size={18} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(course)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Course"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCourse(course._id, course.title)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Course"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT COURSE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-500"
            >
              <X size={22} />
            </button>
            <h2 className="text-2xl font-serif font-bold text-[#17231E] mb-6">
              {editingId ? 'Edit Course' : 'Create New Course'}
            </h2>
            {formError && (
              <div role="alert" className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] outline-none"
                  placeholder="e.g. Advanced React Patterns"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <textarea
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] outline-none h-24 resize-none"
                  placeholder="Describe what students will learn..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] outline-none"
                    placeholder="Frontend Development"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Difficulty</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] outline-none bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    required
                    value={form.totalDuration}
                    onChange={(e) => setForm({ ...form, totalDuration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] outline-none"
                    placeholder="e.g. 6h 30m"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] outline-none"
                    placeholder="React, Hooks, SPA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Practical Capstone Project (Optional)</label>
                <input
                  type="text"
                  value={form.practicalProject}
                  onChange={(e) => setForm({ ...form, practicalProject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] outline-none"
                  placeholder="e.g. Build a full-stack task manager..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#064E3B] text-white font-bold py-3.5 rounded-xl hover:bg-[#10B981] transition-all mt-4 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Create Course'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* COURSE ENROLLMENTS MODAL */}
      {enrollModal.open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setEnrollModal((prev) => ({ ...prev, open: false }))}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-500"
            >
              <X size={22} />
            </button>
            <p className="text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-1">
              Student Progress
            </p>
            <h2 className="text-2xl font-serif font-bold text-[#17231E] mb-5">
              {enrollModal.courseTitle}
            </h2>

            {enrollModal.loading ? (
              <p className="text-[#737A75] py-6">Loading enrolled students...</p>
            ) : enrollModal.error ? (
              <p className="text-red-600 py-4">{enrollModal.error}</p>
            ) : enrollModal.enrollments.length === 0 ? (
              <p className="text-[#737A75] py-6">No students enrolled in this course yet.</p>
            ) : (
              <div className="space-y-3">
                {enrollModal.enrollments.map((item) => (
                  <div
                    key={item._id}
                    className="border border-[#DCE4DF] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="font-bold text-[#17231E]">{item.student?.name}</p>
                      <p className="text-xs text-[#737A75]">{item.student?.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#737A75]">
                        {item.completedCount} / {enrollModal.totalModules} modules
                      </span>
                      <span className="text-sm font-bold text-[#064E3B] bg-[#F8F7F2] px-3 py-1 rounded-full border border-[#DCE4DF]">
                        {item.progressPercentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;
