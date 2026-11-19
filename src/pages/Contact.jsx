import React, { useState, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, CheckCircle, Clock, ShieldCheck, Headphones } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Contact = () => {
  const { API_URL } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (name.trim().length < 2) {
      setError('Please enter your name (at least 2 characters).');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 10) {
      setError('Please enter a message of at least 10 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/api/contact`, {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || 'General Inquiry',
        message: message.trim(),
      });
      setSuccess(res.data.message || 'Your message has been sent!');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F8F7F2] py-14 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <p className="text-xs font-bold tracking-widest uppercase text-[#064E3B] mb-3">
            Support &amp; Inquiries
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#17231E] mb-5 leading-tight">
            Let's Start a Conversation.
          </h1>
          <p className="text-[#737A75] text-lg md:text-xl leading-relaxed">
            Have a question about a course, found a bug, or want to share feedback? Send us a message using the form and our team will respond promptly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left Column: Support Info Cards (No personal email exposed) */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
              whileHover={{ y: -4 }}
              className="bg-[#1A1A1A] p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-xl transition-shadow hover:shadow-2xl"
            >
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#064E3B] opacity-20 blur-3xl rounded-full pointer-events-none" />
              <div className="w-12 h-12 bg-[#064E3B] rounded-2xl flex items-center justify-center text-white mb-6 relative z-10">
                <Headphones size={24} />
              </div>
              <p className="text-xs font-bold tracking-widest uppercase text-[#064E3B] mb-2 relative z-10">
                Contact Cortex Support
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3 relative z-10">
                We're Here to Help
              </h2>
              <p className="text-gray-400 text-sm sm:text-base relative z-10 leading-relaxed">
                Use the secure message form to reach Cortex support for course questions, account assistance, or bug reports—no external mail app required.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16, ease: 'easeOut' }}
              whileHover={{ y: -4 }}
              className="bg-white border-2 border-[#DCE4DF] p-7 sm:p-8 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-[#F8F7F2] border border-[#DCE4DF] flex items-center justify-center text-[#064E3B] flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#17231E] text-base mb-1">
                    Thoughtful Responses
                  </h3>
                  <p className="text-sm text-[#737A75] leading-relaxed">
                    Every message is reviewed carefully. Include course titles or error details for faster help.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-[#DCE4DF]">
                <div className="w-11 h-11 rounded-2xl bg-[#F8F7F2] border border-[#DCE4DF] flex items-center justify-center text-[#064E3B] flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-[#17231E] text-base mb-1">
                    Privacy Respected
                  </h3>
                  <p className="text-sm text-[#737A75] leading-relaxed">
                    Your email is used solely to reply to your inquiry and is never shared with third parties.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: 'easeOut' }}
            className="lg:col-span-3 bg-white p-8 sm:p-10 md:p-12 rounded-3xl border-2 border-[#DCE4DF] shadow-sm"
          >
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#17231E] mb-2 flex items-center gap-3">
              <MessageSquare size={24} className="text-[#064E3B]" /> Send Us a Message
            </h2>
            <p className="text-[#737A75] text-sm sm:text-base mb-8">
              Fill out the form below and it will be delivered directly to our support team.
            </p>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="contact-error"
                  role="alert"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  key="contact-success"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6 text-sm flex items-center gap-2.5"
                >
                  <CheckCircle size={18} className="flex-shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-bold text-[#17231E] mb-1.5">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] focus:ring-2 focus:ring-[#10B981]/20 outline-none bg-[#F8F7F2] transition-all text-base"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-bold text-[#17231E] mb-1.5">
                    Your Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] focus:ring-2 focus:ring-[#10B981]/20 outline-none bg-[#F8F7F2] transition-all text-base"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-sm font-bold text-[#17231E] mb-1.5">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] focus:ring-2 focus:ring-[#10B981]/20 outline-none bg-[#F8F7F2] transition-all text-base"
                  placeholder="Course question, bug report, or feedback"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-bold text-[#17231E] mb-1.5">
                  Your Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  minLength={10}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-[#DCE4DF] focus:border-[#064E3B] focus:ring-2 focus:ring-[#10B981]/20 outline-none h-40 resize-none bg-[#F8F7F2] transition-all text-base"
                  placeholder="How can we help you?"
                />
              </div>

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.01 }}
                whileTap={{ scale: submitting ? 1 : 0.99 }}
                className="w-full bg-[#064E3B] text-white font-bold py-4 rounded-xl hover:bg-[#10B981] transition-colors flex items-center justify-center gap-2.5 disabled:opacity-60 text-base shadow-md"
              >
                <Send size={18} />
                {submitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
