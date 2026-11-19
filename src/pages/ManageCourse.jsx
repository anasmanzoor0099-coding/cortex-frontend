import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PageLoader from '../components/PageLoader';
import PageHeader from '../components/AnimatedHeader';
import {
  ChevronLeft,
  PlusCircle,
  Trash2,
  X,
  Edit,
  ArrowUp,
  ArrowDown,
  HelpCircle,
} from 'lucide-react';

const EMPTY_QUESTION = () => ({
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: '',
});

const EMPTY_MODULE = {
  title: '',
  duration: '',
  notes: '',
  codeExample: '',
  practiceExercise: '',
  objectivesText: '',
  keyTakeawaysText: '',
  quiz: [],
};

const ManageCourse = () => {
  const { id } = useParams();
  const { user, API_URL, isInstructorOrAdmin } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [form, setForm] = useState(EMPTY_MODULE);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchCourseData = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/api/courses/${id}`);
      setCourse(res.data.course);
      setModules(res.data.modules || []);
    } catch {
      setCourse(null);
    } finally {
      setLoading(false);
    }
  }, [API_URL, id]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  if (!user || !isInstructorOrAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#F8F7F2] text-red-600 font-bold">
        Access Denied. Instructors or admins only.
      </div>
    );
  }

  const openAddModal = () => {
    setEditingModuleId(null);
    setForm(EMPTY_MODULE);
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (mod) => {
    setEditingModuleId(mod._id);
    setForm({
      title: mod.title || '',
      duration: mod.duration || '',
      notes: mod.notes || '',
      codeExample: mod.codeExample || '',
      practiceExercise: mod.practiceExercise || '',
      objectivesText: (mod.objectives || []).join('\n'),
      keyTakeawaysText: (mod.keyTakeaways || []).join('\n'),
      quiz: (mod.quiz || []).map((q) => ({
        question: q.question || '',
        options:
          q.options && q.options.length >= 2
            ? [...q.options, '', '', '', ''].slice(0, Math.max(4, q.options.length))
            : ['', '', '', ''],
        correctAnswer: q.correctAnswer ?? 0,
        explanation: q.explanation || '',
      })),
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveModule = async (e) => {
    e.preventDefault();
    setFormError('');

    if (form.title.trim().length < 2 || form.notes.trim().length < 10) {
      setFormError('Module title and notes (at least 10 chars) are required.');
      return;
    }

    // Validate quiz questions
    const cleanedQuiz = [];
    for (let i = 0; i < form.quiz.length; i++) {
      const q = form.quiz[i];
      const cleanedOpts = q.options.map((o) => o.trim()).filter(Boolean);
      if (!q.question.trim()) {
        setFormError(`Quiz Question ${i + 1} text cannot be empty.`);
        return;
      }
      if (cleanedOpts.length < 2) {
        setFormError(`Quiz Question ${i + 1} needs at least 2 non-empty options.`);
        return;
      }
      const correctIdx = Math.min(q.correctAnswer, cleanedOpts.length - 1);
      cleanedQuiz.push({
        question: q.question.trim(),
        options: cleanedOpts,
        correctAnswer: correctIdx,
        explanation: q.explanation.trim(),
      });
    }

    const payload = {
      title: form.title.trim(),
      duration: form.duration.trim() || '1h 00m',
      notes: form.notes,
      codeExample: form.codeExample,
      practiceExercise: form.practiceExercise.trim(),
      objectives: form.objectivesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      keyTakeaways: form.keyTakeawaysText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      quiz: cleanedQuiz,
    };

    setSubmitting(true);
    try {
      if (editingModuleId) {
        await axios.put(`${API_URL}/api/courses/${id}/modules/${editingModuleId}`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFeedback({ type: 'success', text: 'Module updated successfully.' });
      } else {
        await axios.post(`${API_URL}/api/courses/${id}/modules`, payload, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFeedback({ type: 'success', text: 'Module added successfully.' });
      }
      setIsModalOpen(false);
      fetchCourseData();
    } catch (error) {
      setFormError(error.response?.data?.message || 'Failed to save module.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteModule = async (moduleId, title) => {
    if (!window.confirm(`Delete module "${title}"?`)) return;
    try {
      await axios.delete(`${API_URL}/api/courses/${id}/modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFeedback({ type: 'success', text: 'Module deleted and enrollment progress updated.' });
      fetchCourseData();
    } catch (error) {
      setFeedback({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete module.',
      });
    }
  };

  const handleMoveModule = async (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= modules.length) return;

    const reordered = [...modules];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    setModules(reordered);

    try {
      await axios.put(
        `${API_URL}/api/courses/${id}/modules/reorder`,
        { moduleIds: reordered.map((m) => m._id) },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
    } catch {
      fetchCourseData();
      setFeedback({ type: 'error', text: 'Failed to reorder modules.' });
    }
  };

  // Quiz builder helpers
  const addQuizQuestion = () => {
    setForm((prev) => ({ ...prev, quiz: [...prev.quiz, EMPTY_QUESTION()] }));
  };

  const removeQuizQuestion = (qIndex) => {
    setForm((prev) => ({
      ...prev,
      quiz: prev.quiz.filter((_, idx) => idx !== qIndex),
    }));
  };

  const updateQuizField = (qIndex, field, value) => {
    setForm((prev) => ({
      ...prev,
      quiz: prev.quiz.map((q, idx) => (idx === qIndex ? { ...q, [field]: value } : q)),
    }));
  };

  const updateQuizOption = (qIndex, oIndex, value) => {
    setForm((prev) => ({
      ...prev,
      quiz: prev.quiz.map((q, idx) => {
        if (idx !== qIndex) return q;
        const nextOpts = [...q.options];
        nextOpts[oIndex] = value;
        return { ...q, options: nextOpts };
      }),
    }));
  };

  if (loading) {
    return <PageLoader message="Loading course editor..." />;
  }
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F2]">
        Course not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F7F2] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/instructor/dashboard"
          className="inline-flex items-center text-[#737A75] hover:text-[#17231E] mb-6 font-medium text-sm"
        >
          <ChevronLeft size={18} /> Back to Dashboard
        </Link>

        <PageHeader
          eyebrow="Course Editor"
          title={course.title}
          subtitle="Add, edit, reorder modules, and manage interactive quizzes."
          className="mb-8"
          titleClassName="text-3xl md:text-4xl font-serif font-bold text-[#17231E]"
          actions={
            <button
              type="button"
              onClick={openAddModal}
              className="bg-[#064E3B] text-white px-6 py-3 rounded-full font-medium hover:bg-[#10B981] transition-all flex items-center gap-2 shadow-md whitespace-nowrap"
            >
            <PlusCircle size={20} /> Add Module
          </button>
          }
        />

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

        <div className="space-y-4">
          {modules.length === 0 ? (
            <div className="bg-white border-2 border-[#DCE4DF] rounded-3xl p-10 text-center text-[#737A75]">
              No modules yet. Click "Add Module" to create the first lesson!
            </div>
          ) : (
            modules.map((mod, idx) => (
              <div
                key={mod._id}
                className="bg-white border-2 border-[#DCE4DF] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#064E3B]">MODULE {idx + 1}</span>
                    <span className="text-xs text-[#737A75]">• {mod.duration}</span>
                    <span className="text-xs text-[#737A75]">
                      • {mod.quiz?.length || 0} quiz Qs
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#17231E] truncate">{mod.title}</h3>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveModule(idx, -1)}
                    className="p-2 text-[#737A75] hover:bg-[#F8F7F2] border border-[#DCE4DF] rounded-xl disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    disabled={idx === modules.length - 1}
                    onClick={() => handleMoveModule(idx, 1)}
                    className="p-2 text-[#737A75] hover:bg-[#F8F7F2] border border-[#DCE4DF] rounded-xl disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => openEditModal(mod)}
                    className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    title="Edit Module & Quiz"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteModule(mod._id, mod.title)}
                    className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                    title="Delete Module"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADD / EDIT MODULE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-500"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-serif font-bold text-[#17231E] mb-6">
              {editingModuleId ? 'Edit Module & Quiz' : 'Add New Module'}
            </h2>

            {formError && (
              <div role="alert" className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveModule} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Module Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] outline-none"
                    placeholder="e.g. Introduction to Closures"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] outline-none"
                    placeholder="e.g. 1h 30m"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">
                  Learning Objectives (one per line, optional)
                </label>
                <textarea
                  value={form.objectivesText}
                  onChange={(e) => setForm({ ...form, objectivesText: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] outline-none h-20 text-sm"
                  placeholder="Understand lexical scope&#10;Build a counter using closures"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Notes (Markdown supported)</label>
                <textarea
                  required
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] outline-none h-44 font-mono text-sm"
                  placeholder="### Section Heading&#10;Explain the concept clearly..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Code Example (Optional)</label>
                <textarea
                  value={form.codeExample}
                  onChange={(e) => setForm({ ...form, codeExample: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] outline-none h-32 font-mono text-sm bg-[#1E1E1E] text-white"
                  placeholder="// Executable example code"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">Practice Exercise (Optional)</label>
                  <textarea
                    value={form.practiceExercise}
                    onChange={(e) => setForm({ ...form, practiceExercise: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] outline-none h-24 text-sm"
                    placeholder="Describe a hands-on exercise..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Key Takeaways (one per line)</label>
                  <textarea
                    value={form.keyTakeawaysText}
                    onChange={(e) => setForm({ ...form, keyTakeawaysText: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] outline-none h-24 text-sm"
                    placeholder="Key point 1&#10;Key point 2"
                  />
                </div>
              </div>

              {/* QUIZ BUILDER */}
              <div className="border-t border-[#DCE4DF] pt-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-serif font-bold text-[#17231E] flex items-center gap-2">
                    <HelpCircle size={18} className="text-[#064E3B]" /> Quiz Questions ({form.quiz.length})
                  </h3>
                  <button
                    type="button"
                    onClick={addQuizQuestion}
                    className="text-xs font-bold px-3.5 py-2 rounded-full bg-[#F8F7F2] border border-[#DCE4DF] hover:border-[#064E3B] text-[#17231E]"
                  >
                    + Add Question
                  </button>
                </div>

                <div className="space-y-4">
                  {form.quiz.map((q, qIdx) => (
                    <div
                      key={qIdx}
                      className="bg-[#F8F7F2] border border-[#DCE4DF] rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#064E3B]">
                          QUESTION {qIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeQuizQuestion(qIdx)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => updateQuizField(qIdx, 'question', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#DCE4DF] bg-white text-sm"
                        placeholder="Enter question..."
                      />

                      <div className="grid sm:grid-cols-2 gap-2">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${qIdx}`}
                              checked={q.correctAnswer === oIdx}
                              onChange={() => updateQuizField(qIdx, 'correctAnswer', oIdx)}
                              title="Mark as correct answer"
                            />
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => updateQuizOption(qIdx, oIdx, e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg border border-[#DCE4DF] bg-white text-sm"
                              placeholder={`Option ${oIdx + 1}`}
                            />
                          </div>
                        ))}
                      </div>

                      <input
                        type="text"
                        value={q.explanation}
                        onChange={(e) => updateQuizField(qIdx, 'explanation', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#DCE4DF] bg-white text-xs"
                        placeholder="Explanation shown after submission (optional)"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#064E3B] text-white font-bold py-3.5 rounded-xl hover:bg-[#10B981] transition-all mt-4 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editingModuleId ? 'Save Module Changes' : 'Create Module'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourse;
