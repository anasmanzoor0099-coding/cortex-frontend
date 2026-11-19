import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Save,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import PageLoader from '../components/PageLoader';

const getPasswordStrength = (pw) => {
  if (!pw) return { score: 0, label: '', color: 'bg-stone-200', width: '0%' };
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score += 1;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score += 1;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500', width: '25%' };
  if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500', width: '50%' };
  if (score === 3) return { score: 3, label: 'Good', color: 'bg-lime-600', width: '75%' };
  return { score: 4, label: 'Strong', color: 'bg-emerald-600', width: '100%' };
};

const Settings = () => {
  const { user, loading, API_URL, updateUserProfile, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  // Profile state
  const [name, setName] = useState(user?.user?.name || '');
  const [email, setEmail] = useState(user?.user?.email || '');
  const [role, setRole] = useState(user?.user?.role || 'student');
  const [profileLoading, setProfileLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Security / Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (!user?.token) {
      setProfileLoading(false);
      return;
    }

    let active = true;
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!active) return;
        const fresh = res.data?.user;
        if (fresh) {
          setName(fresh.name || '');
          setEmail(fresh.email || '');
          setRole(fresh.role || 'student');
        }
      } catch (err) {
        if (!active) return;
        if (err.response?.status === 401) {
          logout();
          navigate('/login', {
            replace: true,
            state: { notice: 'Your session expired. Please log in again.' },
          });
        }
      } finally {
        if (active) setProfileLoading(false);
      }
    };

    fetchProfile();
    return () => {
      active = false;
    };
  }, [API_URL, user?.token, logout, navigate]);

  if (loading) {
    return <PageLoader message="Loading your settings..." />;
  }

  if (!user && !passwordSuccess) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (savingProfile) return;

    setProfileError('');
    setProfileSuccess('');

    const trimmed = name.trim();
    if (!trimmed) {
      setProfileError('Please enter your name.');
      return;
    }
    if (trimmed.length < 2 || trimmed.length > 80) {
      setProfileError('Name must be between 2 and 80 characters.');
      return;
    }

    setSavingProfile(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/users/profile`,
        { name: trimmed },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const updated = res.data?.user;
      if (updated) {
        setName(updated.name);
        updateUserProfile(updated);
      }
      setProfileSuccess(res.data?.message || 'Profile updated successfully.');
    } catch (err) {
      if (err.response?.status === 401) {
        logout();
        navigate('/login', {
          replace: true,
          state: { notice: 'Your session expired. Please log in again.' },
        });
        return;
      }
      setProfileError(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (changingPassword) return;

    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword.length > 128) {
      setPasswordError('New password cannot exceed 128 characters.');
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError('New password must be different from your current password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/users/password`,
        { currentPassword, newPassword, confirmPassword },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const msg =
        res.data?.message ||
        'Password changed successfully. Please log in again with your new password.';
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccess(msg);
      logout();
      navigate('/login', { replace: true, state: { notice: msg } });
    } catch (err) {
      if (err.response?.status === 401) {
        const msg = err.response?.data?.message || '';
        if (msg.toLowerCase().includes('session') || msg.toLowerCase().includes('token')) {
          logout();
          navigate('/login', {
            replace: true,
            state: { notice: 'Your session expired. Please log in again.' },
          });
          return;
        }
        setPasswordError(msg || 'Current password is incorrect.');
      } else {
        setPasswordError(
          err.response?.data?.message || 'Could not update password. Please try again.'
        );
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const strength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-[#F8F7F2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-[#064E3B] mb-2">
            Account &amp; Security
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#17231E]">
            Settings
          </h1>
          <p className="text-[#737A75] mt-2 text-sm sm:text-base">
            Manage your Cortex profile details and keep your account password secure.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* SECTION A: PROFILE SETTINGS */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            aria-labelledby="profile-settings-heading"
            className="bg-white border border-[#DCE4DF] rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-[#DCE4DF]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#064E3B]/15 text-[#064E3B] flex items-center justify-center font-serif font-bold text-xl">
                  {(name || user?.user?.name || 'U').trim().charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2
                    id="profile-settings-heading"
                    className="text-xl sm:text-2xl font-serif font-bold text-[#17231E]"
                  >
                    Profile Information
                  </h2>
                  <p className="text-sm text-[#737A75]">
                    Update your display name shown across dashboards and courses.
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F8F7F2] border border-[#DCE4DF] text-[#17231E]">
                {role}
              </span>
            </div>

            {profileError && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm"
              >
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            {profileSuccess && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-sm"
              >
                <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="settings-name"
                  className="block text-sm font-semibold text-[#17231E] mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737A75]"
                  />
                  <input
                    id="settings-name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={profileLoading || savingProfile}
                    maxLength={80}
                    required
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#DCE4DF] bg-[#F8F7F2] text-[#17231E] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:bg-white transition-all disabled:opacity-60"
                  />
                </div>
                <p className="text-xs text-[#737A75] mt-1.5">
                  Must be between 2 and 80 characters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="settings-email"
                  className="block text-sm font-semibold text-[#17231E] mb-2"
                >
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737A75]"
                  />
                  <input
                    id="settings-email"
                    name="email"
                    type="email"
                    value={email}
                    readOnly
                    aria-readonly="true"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#DCE4DF] bg-[#FDFCF8]/70 text-[#737A75] cursor-not-allowed focus:outline-none"
                  />
                </div>
                <p className="text-xs text-[#737A75] mt-1.5">
                  Email addresses are locked for account security and cannot be edited here.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile || profileLoading}
                  className="inline-flex items-center justify-center gap-2 bg-[#064E3B] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#10B981] transition-all disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
                >
                  <Save size={16} />
                  {savingProfile ? 'Saving Changes...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </motion.section>

          {/* SECTION B: SECURITY SETTINGS — CHANGE PASSWORD */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            aria-labelledby="security-settings-heading"
            className="bg-white border border-[#DCE4DF] rounded-3xl p-6 sm:p-8 shadow-sm"
          >
            <div className="flex items-center gap-4 pb-6 mb-6 border-b border-[#DCE4DF]">
              <div className="w-12 h-12 rounded-2xl bg-[#064E3B] text-white flex items-center justify-center">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h2
                  id="security-settings-heading"
                  className="text-xl sm:text-2xl font-serif font-bold text-[#17231E]"
                >
                  Security &amp; Password
                </h2>
                <p className="text-sm text-[#737A75]">
                  Changing your password revokes all existing sessions for your protection.
                </p>
              </div>
            </div>

            {passwordError && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm"
              >
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-sm"
              >
                <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="current-password"
                  className="block text-sm font-semibold text-[#17231E] mb-2"
                >
                  Current Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737A75]"
                  />
                  <input
                    id="current-password"
                    name="currentPassword"
                    type={showCurrentPw ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={changingPassword}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your current password"
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-[#DCE4DF] bg-[#F8F7F2] text-[#17231E] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:bg-white transition-all disabled:opacity-60"
                  />
                  <button
                    type="button"
                    aria-label={showCurrentPw ? 'Hide current password' : 'Show current password'}
                    onClick={() => setShowCurrentPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#737A75] hover:text-[#17231E]"
                  >
                    {showCurrentPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="new-password"
                  className="block text-sm font-semibold text-[#17231E] mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737A75]"
                  />
                  <input
                    id="new-password"
                    name="newPassword"
                    type={showNewPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={changingPassword}
                    autoComplete="new-password"
                    required
                    placeholder="At least 8 characters"
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-[#DCE4DF] bg-[#F8F7F2] text-[#17231E] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:bg-white transition-all disabled:opacity-60"
                  />
                  <button
                    type="button"
                    aria-label={showNewPw ? 'Hide new password' : 'Show new password'}
                    onClick={() => setShowNewPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#737A75] hover:text-[#17231E]"
                  >
                    {showNewPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#737A75]">Password strength</span>
                      <span className="font-semibold text-[#17231E]">{strength.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#DCE4DF] rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-semibold text-[#17231E] mb-2"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737A75]"
                  />
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPw ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={changingPassword}
                    autoComplete="new-password"
                    required
                    placeholder="Re-enter your new password"
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-[#DCE4DF] bg-[#F8F7F2] text-[#17231E] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:bg-white transition-all disabled:opacity-60"
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPw ? 'Hide confirm password' : 'Show confirm password'}
                    onClick={() => setShowConfirmPw((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#737A75] hover:text-[#17231E]"
                  >
                    {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="inline-flex items-center justify-center gap-2 bg-[#064E3B] text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-[#10B981] transition-all disabled:opacity-60 disabled:cursor-not-allowed min-h-[44px]"
                >
                  <ShieldCheck size={16} />
                  {changingPassword ? 'Updating Password...' : 'Change Password'}
                </button>
              </div>
            </form>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
