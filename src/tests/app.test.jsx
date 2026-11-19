import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import Footer from '../components/Footer';
import PageLoader, { RouteProgressBar } from '../components/PageLoader';
import PageHeader from '../components/AnimatedHeader';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Courses from '../pages/Courses';
import CourseDetail from '../pages/CourseDetail';
import MyLearning from '../pages/MyLearning';
import InstructorDashboard from '../pages/InstructorDashboard';
import Contact from '../pages/Contact';
import Settings from '../pages/Settings';

vi.mock('axios');

const renderWithProviders = (ui, { authValue = {}, route = '/' } = {}) => {
  const defaultAuth = {
    user: null,
    login: vi.fn(),
    logout: vi.fn(),
    setAuthSession: vi.fn(),
    updateUserProfile: vi.fn(),
    API_URL: 'http://localhost:5000',
    isInstructorOrAdmin: false,
    loading: false,
    ...authValue,
  };

  return render(
    <AuthContext.Provider value={defaultAuth}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('Navigation & Role Consistency', () => {
  it('shows Dashboard link in Navbar and MobileNav for both instructor and admin', () => {
    for (const role of ['instructor', 'admin']) {
      const authValue = {
        user: { token: 'tok', user: { _id: 'u1', name: 'Anas Manzoor', role } },
        isInstructorOrAdmin: true,
      };
      const { unmount } = renderWithProviders(
        <>
          <Navbar />
          <MobileNav />
        </>,
        { authValue }
      );
      expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(2);
      unmount();
    }
  });
});

describe('Authentication Pages', () => {
  it('renders Login, Register, ForgotPassword, and ResetPassword forms', () => {
    const { unmount: u1 } = renderWithProviders(<Login />);
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toHaveAttribute('href', '/forgot-password');
    u1();

    const { unmount: u2 } = renderWithProviders(<Register />);
    expect(screen.getByText('Create an Account')).toBeInTheDocument();
    u2();

    const { unmount: u3 } = renderWithProviders(<ForgotPassword />);
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    u3();

    renderWithProviders(<ResetPassword />);
    expect(screen.getByRole('heading', { name: 'Reset Password' })).toBeInTheDocument();
  });
});

describe('Courses Discovery & Filtering', () => {
  it('filters courses by search query and difficulty', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        {
          _id: 'c1',
          title: 'HTML & CSS Masterclass',
          description: 'Build responsive layouts',
          category: 'Frontend Development',
          difficulty: 'Beginner',
          totalDuration: '16h',
          moduleCount: 6,
          tags: ['HTML5', 'CSS3'],
        },
        {
          _id: 'c2',
          title: 'Practical Full-Stack Projects',
          description: 'Build production apps',
          category: 'Full-Stack Projects',
          difficulty: 'Advanced',
          totalDuration: '16h',
          moduleCount: 6,
          tags: ['MERN'],
        },
      ],
    });

    renderWithProviders(<Courses />);
    await waitFor(() => expect(screen.getByText('HTML & CSS Masterclass')).toBeInTheDocument());
    expect(screen.getByText('Practical Full-Stack Projects')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Advanced' }));
    expect(screen.queryByText('HTML & CSS Masterclass')).not.toBeInTheDocument();
    expect(screen.getByText('Practical Full-Stack Projects')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'All' })[0]);
    fireEvent.change(screen.getByPlaceholderText(/Search courses/i), {
      target: { value: 'HTML' },
    });
    expect(screen.getByText('HTML & CSS Masterclass')).toBeInTheDocument();
    expect(screen.queryByText('Practical Full-Stack Projects')).not.toBeInTheDocument();
  });
});

describe('CourseDetail Multi-Lesson & Quiz Flow', () => {
  it('renders multi-lesson navigation, grades quiz via API, and unlocks Mark as Complete', async () => {
    const coursePayload = {
      course: {
        _id: 'c1',
        title: 'Modern JavaScript',
        description: 'Learn JS deeply',
        difficulty: 'Beginner',
        totalDuration: '18h',
      },
      modules: [
        {
          _id: 'm1',
          title: 'Module 1: Foundations',
          duration: '2h 30m',
          notes: 'Module overview',
          assignment: 'Build temperature.js',
          lessons: [
            { title: 'Variables & Types', duration: '1h', notes: 'Lesson 1 body' },
            { title: 'Operators & Flow', duration: '1h', notes: 'Lesson 2 body' },
          ],
          quiz: [
            {
              question: 'Which operator checks value and type?',
              options: ['==', '==='],
              correctAnswer: 1,
              explanation: '=== is strict equality.',
            },
          ],
        },
      ],
    };

    const enrollmentPayload = {
      _id: 'e1',
      course: 'c1',
      completedModules: [],
      passedQuizModules: [],
      completedLessons: [],
      progressPercentage: 0,
    };

    axios.get.mockImplementation((url) => {
      if (url.includes('/api/courses/c1')) return Promise.resolve({ data: coursePayload });
      if (url.includes('/api/enrollments/c1')) return Promise.resolve({ data: enrollmentPayload });
      return Promise.reject(new Error('Unexpected GET'));
    });

    axios.post.mockResolvedValueOnce({
      data: {
        scorePercentage: 100,
        passed: true,
        passedQuizModules: ['m1'],
        results: [{ questionIndex: 0, isCorrect: true, explanation: '=== is strict equality.' }],
      },
    });

    renderWithProviders(
      <Routes>
        <Route path="/course/:id" element={<CourseDetail />} />
      </Routes>,
      {
        route: '/course/c1',
        authValue: { user: { token: 'tok', user: { _id: 'u1', name: 'Ali', role: 'student' } } },
      }
    );

    await waitFor(() => expect(screen.getByText('Lesson 1 body')).toBeInTheDocument());

    // Switch to Lesson 2
    fireEvent.click(screen.getByRole('button', { name: /2\. Operators & Flow/i }));
    expect(screen.getByText('Lesson 2 body')).toBeInTheDocument();

    // Mark as Complete is initially locked by quiz
    expect(screen.getByRole('button', { name: /Pass the quiz \(100%\) to unlock/i })).toBeDisabled();

    // Select correct option & submit quiz
    fireEvent.click(screen.getByLabelText('==='));
    fireEvent.click(screen.getByRole('button', { name: /Submit Answers/i }));

    await waitFor(() => expect(screen.getByText(/Perfect Score \(100%\)/i)).toBeInTheDocument());
    expect(screen.getByRole('button', { name: /Mark as Complete/i })).toBeEnabled();
  });
});

describe('MyLearning & InstructorDashboard', () => {
  it('renders fallback card cleanly when an enrolled course was deleted', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { _id: 'e_orphan', course: null, isCourseUnavailable: true, progressPercentage: 0 },
        {
          _id: 'e_valid',
          course: { _id: 'c1', title: 'React.js', description: 'UI engineering', difficulty: 'Intermediate' },
          totalModules: 6,
          completedCount: 3,
          progressPercentage: 50,
        },
      ],
    });

    renderWithProviders(<MyLearning />, {
      authValue: { user: { token: 'tok', user: { _id: 'u1', name: 'Ali', role: 'student' } } },
    });

    await waitFor(() => expect(screen.getByText('This course is no longer available')).toBeInTheDocument());
    expect(screen.getByText('React.js')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('blocks students on InstructorDashboard while allowing admin', async () => {
    axios.get.mockResolvedValue({ data: [] });

    const { unmount } = renderWithProviders(<InstructorDashboard />, {
      authValue: {
        user: { token: 'tok', user: { _id: 'u1', name: 'Student', role: 'student' } },
        isInstructorOrAdmin: false,
      },
    });
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    unmount();

    renderWithProviders(<InstructorDashboard />, {
      authValue: {
        user: { token: 'tok', user: { _id: 'u2', name: 'Admin', role: 'admin' } },
        isInstructorOrAdmin: true,
      },
    });
    await waitFor(() => expect(screen.getByText('Course Management')).toBeInTheDocument());
  });
});

describe('Contact Form', () => {
  it('submits contact message to /api/contact and shows success alert', async () => {
    axios.post.mockResolvedValueOnce({
      data: { message: 'Your message has been sent!' },
    });

    renderWithProviders(<Contact />);
    fireEvent.change(screen.getByLabelText('Your Name'), { target: { value: 'Ali Raza' } });
    fireEvent.change(screen.getByLabelText('Your Email'), { target: { value: 'ali@example.com' } });
    fireEvent.change(screen.getByLabelText('Your Message'), {
      target: { value: 'This is a detailed test inquiry message.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    await waitFor(() =>
      expect(screen.getByText('Your message has been sent!')).toBeInTheDocument()
    );
  });
});

describe('Settings Page', () => {
  it('redirects unauthenticated users away from Settings to /login', async () => {
    render(
      <AuthContext.Provider
        value={{
          user: null,
          loading: false,
          API_URL: 'http://localhost:5000',
          updateUserProfile: vi.fn(),
          logout: vi.fn(),
        }}
      >
        <MemoryRouter initialEntries={['/settings']}>
          <Routes>
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    await waitFor(() => expect(screen.getByText('Welcome Back')).toBeInTheDocument());
  });

  it('loads profile with read-only email, validates name, and updates AuthContext immediately', async () => {
    const updateUserProfile = vi.fn();
    axios.get.mockResolvedValueOnce({
      data: { user: { _id: 'u1', name: 'Ada Lovelace', email: 'ada@cortex.test', role: 'student' } },
    });
    axios.put.mockResolvedValueOnce({
      data: {
        message: 'Profile updated successfully.',
        user: { _id: 'u1', name: 'Ada Byron', email: 'ada@cortex.test', role: 'student' },
      },
    });

    renderWithProviders(<Settings />, {
      route: '/settings',
      authValue: {
        user: { token: 'tok', user: { _id: 'u1', name: 'Ada Lovelace', email: 'ada@cortex.test', role: 'student' } },
        updateUserProfile,
      },
    });

    const nameInput = await screen.findByLabelText('Full Name');
    const emailInput = screen.getByLabelText('Registered Email Address');
    expect(emailInput).toHaveAttribute('readonly');
    expect(emailInput).toHaveValue('ada@cortex.test');

    // Empty name validation
    fireEvent.change(nameInput, { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Profile/i }));
    expect(await screen.findByText('Please enter your name.')).toBeInTheDocument();
    expect(axios.put).not.toHaveBeenCalled();

    // Valid name update
    fireEvent.change(nameInput, { target: { value: 'Ada Byron' } });
    fireEvent.click(screen.getByRole('button', { name: /Save Profile/i }));
    await waitFor(() =>
      expect(screen.getByText('Profile updated successfully.')).toBeInTheDocument()
    );
    expect(updateUserProfile).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Ada Byron', email: 'ada@cortex.test' })
    );
  });

  it('validates password length/mismatch and submits valid password change', async () => {
    const logout = vi.fn();
    axios.get.mockResolvedValueOnce({
      data: { user: { _id: 'u1', name: 'Ada', email: 'ada@cortex.test', role: 'student' } },
    });
    axios.put.mockResolvedValueOnce({
      data: { message: 'Password changed successfully.', requireRelogin: true },
    });

    renderWithProviders(<Settings />, {
      route: '/settings',
      authValue: {
        user: { token: 'tok', user: { _id: 'u1', name: 'Ada', email: 'ada@cortex.test', role: 'student' } },
        logout,
      },
    });

    await screen.findByLabelText('Current Password');

    // Short password rejected
    fireEvent.change(screen.getByLabelText('Current Password'), { target: { value: 'OldPass123!' } });
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'short' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'short' } });
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));
    expect(await screen.findByText('New password must be at least 8 characters long.')).toBeInTheDocument();

    // Mismatch rejected
    fireEvent.change(screen.getByLabelText('New Password'), { target: { value: 'NewStrong123!' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'Different123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));
    expect(await screen.findByText('New password and confirmation do not match.')).toBeInTheDocument();
    expect(axios.put).not.toHaveBeenCalled();

    // Valid password change
    fireEvent.change(screen.getByLabelText('Confirm New Password'), { target: { value: 'NewStrong123!' } });
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
    expect(logout).toHaveBeenCalledTimes(1);
  });
});

describe('Global PageLoader & AnimatedHeader', () => {
  it('renders branded PageLoader with status role and message', () => {
    render(<PageLoader fullscreen message="Restoring session..." submessage="Almost ready" />);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-label', 'Restoring session...');
    expect(screen.getByText('Restoring session...')).toBeInTheDocument();
    expect(screen.getByText('Almost ready')).toBeInTheDocument();
  });

  it('renders PageHeader eyebrow, title, subtitle, and actions', () => {
    renderWithProviders(
      <PageHeader
        eyebrow="Curriculum"
        title="React Engineering"
        subtitle="Master modern patterns."
        actions={<button type="button">Action</button>}
      />
    );
    expect(screen.getByText('Curriculum')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'React Engineering' })).toBeInTheDocument();
    expect(screen.getByText('Master modern patterns.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('moves the shared sliding pill on Navbar hover and returns to active route on leave', () => {
    renderWithProviders(<Navbar />, { route: '/' });
    const navCapsule = screen.getByRole('navigation', { name: 'Primary navigation' });
    const homeLink = screen.getByRole('link', { name: 'Home' });
    const coursesLink = screen.getByRole('link', { name: 'Courses' });

    expect(homeLink.className).toContain('text-white');
    expect(coursesLink.className).toContain('text-[#737A75]');

    fireEvent.mouseEnter(coursesLink);
    expect(coursesLink.className).toContain('text-white');
    expect(homeLink.className).toContain('text-[#737A75]');

    fireEvent.mouseLeave(navCapsule);
    expect(homeLink.className).toContain('text-white');
    expect(coursesLink.className).toContain('text-[#737A75]');

    const { container } = render(<RouteProgressBar active />);
    expect(container.querySelector('.bg-gradient-to-r')).toBeInTheDocument();
  });

  it('renders Footer with liquid wave layers and accessible navigation links', () => {
    const { container } = renderWithProviders(<Footer />);
    expect(screen.getByRole('navigation', { name: 'Footer navigation' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Courses' })).toBeInTheDocument();
    expect(container.querySelectorAll('footer svg').length).toBeGreaterThanOrEqual(3);
  });
});
