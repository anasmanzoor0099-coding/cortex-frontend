import React, { Suspense, lazy, useContext, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MotionConfig, AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Navbar from './components/Navbar';
import MobileTopHeader from './components/MobileTopHeader';
import MobileNav from './components/MobileNav';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PageLoader, { RouteProgressBar } from './components/PageLoader';
import { AuthContext } from './context/AuthContext';

// Lazy-loaded pages for optimal bundle splitting
const Home = lazy(() => import('./pages/Home'));
const Register = lazy(() => import('./pages/Register'));
const Login = lazy(() => import('./pages/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const MyLearning = lazy(() => import('./pages/MyLearning'));
const BecomeInstructor = lazy(() => import('./pages/BecomeInstructor'));
const InstructorDashboard = lazy(() => import('./pages/InstructorDashboard'));
const ManageCourse = lazy(() => import('./pages/ManageCourse'));
const About = lazy(() => import('./pages/About'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Contact = lazy(() => import('./pages/Contact'));
const Settings = lazy(() => import('./pages/Settings'));

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F8F7F2] px-6 text-center">
    <p className="text-sm font-bold uppercase tracking-widest text-[#064E3B] mb-2">404</p>
    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#17231E] mb-4">Page not found</h1>
    <p className="text-[#737A75] mb-8 max-w-md">
      The page you are looking for doesn't exist or has been moved.
    </p>
    <Link
      to="/"
      className="bg-[#064E3B] text-white px-7 py-3 rounded-full font-medium hover:bg-[#10B981] transition-all"
    >
      Back to Home
    </Link>
  </div>
);

const AppShell = () => {
  const { loading: authLoading } = useContext(AuthContext);
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const [minBootVisible, setMinBootVisible] = useState(true);
  const [routeTransitioning, setRouteTransitioning] = useState(false);
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const bootTimer = setTimeout(() => setMinBootVisible(false), 380);
    return () => clearTimeout(bootTimer);
  }, []);

  useEffect(() => {
    if (prevPathRef.current === location.pathname) return undefined;
    prevPathRef.current = location.pathname;
    setRouteTransitioning(true);
    const timer = setTimeout(() => setRouteTransitioning(false), 380);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const showBootLoader = authLoading || minBootVisible;

  return (
    <>
      <ScrollToTop />
      <AnimatePresence>
        {showBootLoader && (
          <PageLoader key="boot-loader" fullscreen message="Preparing your workspace..." />
        )}
      </AnimatePresence>
      <RouteProgressBar active={routeTransitioning} />

      <div className="flex flex-col min-h-screen bg-[#F8F7F2] pb-20 md:pb-0">
        <div className="hidden md:block">
          <Navbar />
        </div>
        <MobileTopHeader />

        <main className="flex-grow pt-16 md:pt-20">
          <Suspense fallback={<PageLoader message="Loading page..." />}>
            <motion.div
              key={location.pathname}
              initial={shouldReduceMotion ? false : { opacity: 0.88, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            >
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/course/:id" element={<CourseDetail />} />
              <Route path="/my-learning" element={<MyLearning />} />
              <Route path="/become-instructor" element={<BecomeInstructor />} />
              <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
              <Route path="/instructor/course/:id" element={<ManageCourse />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            </motion.div>
          </Suspense>
        </main>

        <div className="hidden md:block">
          <Footer />
        </div>
        <MobileNav />
      </div>
    </>
  );
};

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <AppShell />
      </Router>
    </MotionConfig>
  );
}

export default App;
