import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, ChevronLeft, PlayCircle, Lock, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const CourseDetail = () => {
  const { id } = useParams();
  const { user, API_URL } = useContext(AuthContext);
  
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeModule, setActiveModule] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- QUIZ STATE ---
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await axios.get(`${API_URL}/api/courses/${id}`);
        setCourse(courseRes.data.course);
        setModules(courseRes.data.modules);
        if(courseRes.data.modules.length > 0) setActiveModule(courseRes.data.modules[0]);

        if (user) {
          try {
            const enrollRes = await axios.get(`${API_URL}/api/enrollments/${id}`, {
              headers: { Authorization: `Bearer ${user.token}` }
            });
            setEnrollment(enrollRes.data);
          } catch (err) {
            setEnrollment(null);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, API_URL]);

  // Reset quiz state when switching modules
  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizPassed(false);
  }, [activeModule]);

  const handleEnroll = async () => {
    if (!user) return alert("Please login to enroll!");
    try {
      const res = await axios.post(`${API_URL}/api/enrollments/${id}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setEnrollment(res.data);
    } catch (error) { console.error(error); }
  };

  const handleToggleComplete = async (moduleId) => {
    if (!enrollment) return;
    try {
      const res = await axios.put(`${API_URL}/api/enrollments/${id}/module/${moduleId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setEnrollment(res.data);
    } catch (error) { console.error(error); }
  };

  const handleOptionSelect = (questionIndex, optionIndex) => {
    setQuizAnswers({ ...quizAnswers, [questionIndex]: optionIndex });
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(quizAnswers).length !== activeModule.quiz.length) {
      return alert("Please answer all questions before submitting.");
    }

    let correctCount = 0;
    activeModule.quiz.forEach((q, index) => {
      if (quizAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = (correctCount / activeModule.quiz.length) * 100;
    setQuizScore(scorePercentage);
    setQuizSubmitted(true);
    
    // Require 100% to pass
    if (scorePercentage === 100) {
      setQuizPassed(true);
    }
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizPassed(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">Loading...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">Course not found.</div>;

  const hasQuiz = activeModule?.quiz && activeModule.quiz.length > 0;
  const isModuleCompleted = enrollment?.completedModules?.includes(activeModule?._id);

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full overflow-x-hidden lg:overflow-visible">
        
        <Link to="/courses" className="inline-flex items-center text-[#6B6B6B] hover:text-[#1C1C1C] mb-8 font-medium">
          <ChevronLeft size={20} /> Back to Courses
        </Link>

        {/* Course Header */}
        <div className="bg-white border-2 border-[#EAE6DF] rounded-3xl p-8 md:p-12 shadow-sm mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1C1C1C] mb-4 break-words">{course.title}</h1>
            <p className="text-[#6B6B6B] text-lg max-w-2xl">{course.description}</p>
          </div>
          
          <div className="flex-shrink-0 text-center">
            {enrollment ? (
              <div className="bg-[#F4F0EA] rounded-2xl p-6 border border-[#EAE6DF] min-w-[150px]">
                <p className="text-sm text-[#6B6B6B] mb-1 font-medium">Your Progress</p>
                <p className="text-3xl font-serif font-bold text-[#FF8C42]">{enrollment.progressPercentage}%</p>
              </div>
            ) : (
              <button onClick={handleEnroll} className="bg-[#1C1C1C] text-white px-8 py-4 rounded-full font-medium hover:bg-[#FF8C42] transition-all shadow-lg w-full md:w-auto">
                Enroll Now
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-3 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto w-full pb-4 custom-scrollbar">
            <h2 className="text-xl font-bold font-serif mb-4 sticky top-0 bg-[#FDFBF7] z-10 pb-2">Course Modules</h2>
            {modules.map((mod, idx) => {
              const isCompleted = enrollment?.completedModules?.includes(mod._id);
              const isActive = activeModule?._id === mod._id;

              return (
                <div 
                  key={mod._id} 
                  onClick={() => setActiveModule(mod)}
                  className={`p-4 rounded-xl cursor-pointer border-2 transition-all flex items-center justify-between ${
                    isActive ? 'border-[#FF8C42] bg-white shadow-md' : 'border-[#EAE6DF] bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className={`text-xs font-bold mb-1 ${isActive ? 'text-[#FF8C42]' : 'text-[#6B6B6B]'}`}>MODULE {idx + 1}</p>
                    <p className={`font-medium truncate ${isActive ? 'text-[#1C1C1C]' : 'text-[#6B6B6B]'}`}>{mod.title}</p>
                  </div>
                  {isCompleted && <CheckCircle size={20} className="text-green-500 flex-shrink-0" />}
                </div>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 w-full min-w-0">
            {activeModule ? (
              <motion.div key={activeModule._id} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-white border-2 border-[#EAE6DF] rounded-3xl p-6 sm:p-10 shadow-sm w-full max-w-full">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-[#EAE6DF] pb-6">
                  <h2 className="text-3xl font-serif font-bold text-[#1C1C1C] break-words">{activeModule.title}</h2>
                  <span className="bg-[#F4F0EA] text-[#1C1C1C] px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap">{activeModule.duration}</span>
                </div>

                {!enrollment ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 bg-[#F4F0EA] rounded-full flex items-center justify-center mb-6">
                      <Lock size={32} className="text-[#FF8C42]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#1C1C1C] mb-3">Content Locked</h3>
                    <p className="text-[#6B6B6B] mb-8 max-w-md">You need to enroll in this course to view the detailed notes, code examples, and track your progress.</p>
                    <button onClick={handleEnroll} className="bg-[#1C1C1C] text-white px-8 py-3 rounded-full font-medium hover:bg-[#FF8C42] transition-all">
                      Enroll Now to Unlock
                    </button>
                  </div>
                ) : (
                  <div className="w-full min-w-0">
                    {/* Notes */}
                    <div className="mb-10 w-full overflow-hidden">
                      <ReactMarkdown
                        components={{
                          h3: ({node, ...props}) => (
                            <h3 className="text-2xl font-serif font-bold text-[#FF8C42] mt-10 mb-4 pl-4 border-l-4 border-[#FF8C42]" {...props} />
                          ),
                          p: ({node, ...props}) => <p className="text-[#4A4A4A] text-lg leading-relaxed mb-5 break-words" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 text-[#4A4A4A] text-lg space-y-2 marker:text-[#FF8C42]" {...props} />,
                          li: ({node, ...props}) => <li className="leading-relaxed break-words" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-[#1C1C1C] bg-[#FDFBF7] px-1 rounded" {...props} />,
                          blockquote: ({node, ...props}) => (
                            <blockquote className="bg-[#F4F0EA] border-l-4 border-[#D4E157] p-4 rounded-r-xl my-6 text-[#1C1C1C] italic" {...props} />
                          ),
                          pre: ({node, ...props}) => (
                            <div className="w-full max-w-full overflow-hidden rounded-xl my-6 border-2 border-[#EAE6DF]">
                              <pre className="bg-[#1E1E1E] p-5 overflow-x-auto text-sm font-mono text-[#D4D4D4]" {...props} />
                            </div>
                          ),
                          code: ({node, inline, ...props}) => 
                            inline ? <code className="bg-[#EAE6DF] text-[#FF8C42] px-1.5 py-0.5 rounded font-mono text-sm font-bold break-words" {...props} /> 
                                   : <code className="font-mono text-sm" {...props} />
                        }}
                      >
                        {activeModule.notes}
                      </ReactMarkdown>
                    </div>

                    {/* Code Example */}
                    {activeModule.codeExample && (
                      <div className="mb-10 w-full max-w-full">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1C1C1C]">
                          <PlayCircle size={24} className="text-[#FF8C42]"/> Code Example
                        </h3>
                        <div className="w-full max-w-full overflow-hidden rounded-xl border-2 border-[#1E1E1E] bg-[#1E1E1E]">
                          <pre className="p-6 overflow-x-auto text-sm font-mono text-[#D4D4D4]">
                            <code>{activeModule.codeExample}</code>
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* --- QUIZ SECTION --- */}
                    {hasQuiz && (
                      <div className="mb-10 bg-[#FDFBF7] border-2 border-[#EAE6DF] rounded-3xl p-6 sm:p-8">
                        <h3 className="text-2xl font-bold font-serif text-[#1C1C1C] mb-2 flex items-center gap-2">
                          <HelpCircle size={24} className="text-[#FF8C42]" /> Knowledge Check
                        </h3>
                        <p className="text-[#6B6B6B] mb-6">You must answer all questions correctly to complete this module.</p>

                        {quizSubmitted && quizPassed ? (
                          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                            <h4 className="text-2xl font-bold text-green-700 mb-2">Perfect Score!</h4>
                            <p className="text-green-600 mb-6">You got {quizScore}% correct. You can now mark this module as complete.</p>
                            <button onClick={handleRetakeQuiz} className="text-green-700 font-bold underline flex items-center justify-center gap-2 mx-auto hover:text-green-800">
                              <RefreshCw size={16} /> Retake Quiz
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleQuizSubmit}>
                            {activeModule.quiz.map((q, qIndex) => (
                              <div key={qIndex} className="mb-8">
                                <p className="font-bold text-lg text-[#1C1C1C] mb-4">{qIndex + 1}. {q.question}</p>
                                <div className="space-y-3">
                                  {q.options.map((option, oIndex) => (
                                    <label 
                                      key={oIndex} 
                                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                        quizAnswers[qIndex] === oIndex ? 'border-[#FF8C42] bg-white' : 'border-[#EAE6DF] bg-white hover:border-gray-300'
                                      }`}
                                    >
                                      <input 
                                        type="radio" 
                                        name={`question-${qIndex}`} 
                                        checked={quizAnswers[qIndex] === oIndex}
                                        onChange={() => handleOptionSelect(qIndex, oIndex)}
                                        className="w-5 h-5 text-[#FF8C42] focus:ring-[#FF8C42] mr-4"
                                      />
                                      <span className="text-[#4A4A4A] font-medium">{option}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}

                            {quizSubmitted && !quizPassed && (
                              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-bold text-red-700">Not quite there!</p>
                                  <p className="text-red-600 text-sm">You scored {quizScore}%. You need 100% to pass. Review the notes and try again.</p>
                                </div>
                              </div>
                            )}

                            <button 
                              type="submit" 
                              className="w-full bg-[#FF8C42] text-white font-bold py-4 rounded-xl hover:bg-[#e67a36] transition-all shadow-md"
                            >
                              {quizSubmitted ? 'Try Again' : 'Submit Answers'}
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* Complete Button */}
                    <div className="border-t border-[#EAE6DF] pt-8 mt-8">
                      <button 
                        onClick={() => handleToggleComplete(activeModule._id)}
                        disabled={hasQuiz && !quizPassed && !isModuleCompleted}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                          isModuleCompleted
                          ? 'bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-200'
                          : (hasQuiz && !quizPassed)
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-2 border-gray-200'
                            : 'bg-[#1C1C1C] text-white hover:bg-[#FF8C42] border-2 border-[#1C1C1C] hover:border-[#FF8C42]'
                        }`}
                      >
                        <CheckCircle size={22} />
                        {isModuleCompleted ? 'Completed (Click to Undo)' : (hasQuiz && !quizPassed) ? 'Pass the quiz to unlock' : 'Mark as Complete'}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="bg-white border-2 border-[#EAE6DF] rounded-3xl p-12 text-center text-[#6B6B6B]">
                Select a module to start learning.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetail;