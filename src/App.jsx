import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileTopHeader from './components/MobileTopHeader'; // Naya Mobile Header
import MobileNav from './components/MobileNav'; // Naya Mobile Bottom Bar
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import MyLearning from './pages/MyLearning';
import BecomeInstructor from './pages/BecomeInstructor';
import InstructorDashboard from './pages/InstructorDashboard';
import ManageCourse from './pages/ManageCourse';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';

function App() {
  return (
    <Router>
      <ScrollToTop />
      
      {/* pb-20 mobile par bottom bar ke liye jagah banata hai, desktop par pb-0 ho jata hai */}
      <div className="flex flex-col min-h-screen bg-[#FDFBF7] pb-20 md:pb-0">
        
        {/* --- HEADERS --- */}
        <div className="hidden md:block">
          <Navbar /> {/* Desktop Menu */}
        </div>
        <MobileTopHeader /> {/* Mobile Top Logo */}

        {/* --- MAIN CONTENT --- */}
        {/* pt-16 mobile top header ke liye, md:pt-20 desktop navbar ke liye */}
        <main className="flex-grow pt-16 md:pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/my-learning" element={<MyLearning />} />
            <Route path="/become-instructor" element={<BecomeInstructor />} />
            <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
            <Route path="/instructor/course/:id" element={<ManageCourse />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        
        {/* --- FOOTER (Desktop only) --- */}
        <div className="hidden md:block">
          <Footer />
        </div>

        {/* --- MOBILE BOTTOM NAV --- */}
        <MobileNav />
        
      </div>
    </Router>
  );
}

export default App;