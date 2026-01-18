import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import SEO from '../components/SEO';
import { Mail, ArrowLeft, ArrowRight, ShieldCheck, RefreshCw, Smartphone, Lock } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!isEmailVerified) {
      setIsChecking(true);
      try {
        await api.post('/forgot-password', { email: trimmed });
        setIsEmailVerified(true);
        toast.success('Email verified. You can now reset your password.');
      } catch (error) {
        const message = error?.response?.data?.message || 'Account not found for this email.';
        toast.error(message);
      } finally {
        setIsChecking(false);
      }
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsResetting(true);
    try {
      await api.post('/reset-password', { email: trimmed, password });
      toast.success('Password updated successfully. You can now sign in.');
      navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`);
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to reset password. Please try again.';
      toast.error(message);
    } finally {
      setIsResetting(false);
    }
  };

  const handleBackToLogin = () => {
    navigate(returnTo || '/login');
  };

  return (
    <>
      <SEO
        title="Reset Password | BCVWorld"
        description="Securely reset your BCVWorld account password by verifying your email and setting a new password."
        keywords="forgot password, reset password, BCVWorld login"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-800 via-indigo-800 to-sky-600 text-white p-10 lg:p-14 relative">
            <div className="absolute inset-0 opacity-35 bg-[radial-gradient(circle_at_top,_#ffffff_0,_transparent_55%)]" aria-hidden="true" />
            <div className="relative z-10 flex flex-col justify-between w-full">
              <div>
                <Link
                  to="/"
                  className="inline-flex items-center space-x-3 rounded-full bg-white/10 px-4 py-2 text-xs font-medium backdrop-blur border border-white/20 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-600 focus-visible:ring-white"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>Secure account recovery with BCVWorld</span>
                </Link>
                <h1 className="mt-10 text-4xl xl:text-5xl font-semibold leading-tight tracking-tight drop-shadow-md">
                  Reset your password
                  <span className="block text-blue-50 mt-2">in two simple, secure steps.</span>
                </h1>
                <div className="mt-6 space-y-3 text-sm leading-relaxed text-blue-50 max-w-xl">
                  <p>
                    This secure flow is designed to quickly help you get back into your account
                    while keeping your personal data safe. You stay on this page the entire time.
                  </p>
                  <p>
                    First we confirm that the email you enter is linked to an existing BCVWorld
                    account. After that, the password fields unlock so you can choose a new,
                    strong password without any reset emails or OTP codes.
                  </p>
                </div>
              </div>
              <div className="mt-10 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Step 1: Verify your email</p>
                    <p className="text-sm text-blue-50">
                      Enter the email you used to sign up. We only check it against our records and
                      never send spam or marketing messages from this page.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                    <Smartphone className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Step 2: Set a new password</p>
                    <p className="text-sm text-blue-50">
                      Once your email is confirmed, create a new password with at least 6
                      characters, mixing letters, numbers, and symbols for better security.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 bg-white text-slate-900 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 flex items-center justify-center">
            <div className="w-full max-w-lg space-y-8">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full px-2 -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Back to sign in
              </button>
              <div className="text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Forgot your password?</h2>
                <p className="mt-2 text-sm text-gray-700">
                  Enter your registered email to verify your account. Once verified, you can create a new password on this page.
                </p>
                <ul className="mt-4 space-y-1 text-xs text-gray-600">
                  <li>• We do not change anything until you confirm a new password.</li>
                  <li>• If the email is not found, you’ll see a clear message on this page.</li>
                  <li>• This page works smoothly on both mobile and desktop devices.</li>
                </ul>
              </div>
              <form onSubmit={handleSubmit} className="mt-4 space-y-6" noValidate>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-white dark:bg-slate-900 dark:border-slate-700 dark:focus:ring-offset-slate-950"
                      placeholder="you@example.com"
                      aria-describedby="reset-helper"
                    />
                  </div>
                  <p id="reset-helper" className="text-xs text-gray-500 dark:text-gray-400">
                    We only use this email to locate your account. No email will be sent from this step.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        New password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          id="new-password"
                          name="new-password"
                          type="password"
                          autoComplete="new-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={!isEmailVerified}
                          className="block w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-white disabled:bg-gray-100 disabled:text-gray-400 dark:bg-slate-900 dark:border-slate-700 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 dark:focus:ring-offset-slate-950"
                          placeholder={isEmailVerified ? 'Create a strong password' : 'Verify email to enable'}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Confirm password
                      </label>
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                          id="confirm-password"
                          name="confirm-password"
                          type="password"
                          autoComplete="new-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={!isEmailVerified}
                          className="block w-full rounded-lg border border-gray-300 bg-white px-10 py-3 text-sm placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-white disabled:bg-gray-100 disabled:text-gray-400 dark:bg-slate-900 dark:border-slate-700 dark:disabled:bg-slate-800 dark:disabled:text-slate-500 dark:focus:ring-offset-slate-950"
                          placeholder={isEmailVerified ? 'Re-enter new password' : 'Verify email to enable'}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Password fields are enabled only after we confirm that this email belongs to an existing account.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isChecking || isResetting}
                  className="w-full inline-flex items-center justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-md transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isChecking ? (
                    <span className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Verifying email...
                    </span>
                  ) : isResetting ? (
                    <span className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Updating password...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      {isEmailVerified ? 'Reset password' : 'Verify email'}
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                </button>
                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                  Having trouble?{' '}
                  <a
                    href="mailto:support@bcvworld.com"
                    className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Contact support
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
