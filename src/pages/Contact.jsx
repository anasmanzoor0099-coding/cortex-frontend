import React from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-24 px-6 flex items-center justify-center">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
        
        {/* Contact Info */}
        <div className="bg-[#1A1A1A] p-10 rounded-3xl relative overflow-hidden flex flex-col justify-center">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#FF8C42] opacity-20 blur-3xl rounded-full"></div>
          <h2 className="text-3xl font-serif font-bold text-white mb-4 relative z-10">Let's Talk.</h2>
          <p className="text-gray-400 mb-8 relative z-10">Have a question about a course, found a bug, or just want to say hi? My inbox is always open.</p>
          
          <a href="mailto:tester1122330099@gmail.com" className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all relative z-10">
            <div className="w-12 h-12 bg-[#FF8C42] rounded-full flex items-center justify-center text-white">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Email Me</p>
              <p className="text-white font-medium">tester1122330099@gmail.com</p>
            </div>
          </a>
        </div>

        {/* Contact Form (Visual Only) */}
        <div className="bg-white p-10 rounded-3xl border-2 border-[#EAE6DF] shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-[#1C1C1C] mb-6 flex items-center gap-2">
            <MessageSquare size={20} className="text-[#FF8C42]" /> Send a Message
          </h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-1">Your Name</label>
              <input type="text" className="w-full px-4 py-2 rounded-lg border-2 border-[#EAE6DF] focus:border-[#FF8C42] outline-none" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">Your Message</label>
              <textarea className="w-full px-4 py-2 rounded-lg border-2 border-[#EAE6DF] focus:border-[#FF8C42] outline-none h-32 resize-none" placeholder="How can I help you?"></textarea>
            </div>
            <button type="button" className="w-full bg-[#1C1C1C] text-white font-bold py-3 rounded-xl hover:bg-[#FF8C42] transition-all flex items-center justify-center gap-2">
              <Send size={18} /> Send Message
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;