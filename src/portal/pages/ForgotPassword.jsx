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
    navigate('/login');
  };

  return (
    <>
      <SEO
        title="Reset Password | BCVWorld"
        description="Securely reset your BCVWorld account password by verifying your email and setting a new password."
        keywords="forgot password, reset password, BCVWorld login"
      />
      <div className="h-screen bg-[#0f172a] flex font-sans text-slate-200 overflow-hidden">
        
        {/* Left Side - Info Content */}
        <div className="hidden lg:flex lg:w-3/5 flex-col justify-between p-8 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute -z-10 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl -top-40 -left-40"></div>
            <div className="absolute -z-10 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl bottom-0 right-0"></div>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 w-fit">
                <img 
                    src="/assets/images/logo.webp" 
                    alt="BCVWORLD" 
                    className="w-10 h-10 rounded-full shadow-lg shadow-blue-900/20" 
                />
                <span className="text-2xl font-bold tracking-tight text-white">
                    BCV<span className="text-blue-500">WORLD</span> <span className="text-slate-400 font-light ml-2">Recovery</span>
                </span>
            </Link>

            {/* Main Content */}
            <div className="flex flex-col justify-center space-y-8 max-w-3xl mt-4">
                <h1 className="text-5xl font-extrabold leading-tight text-white">
                    Reset your password <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    in two simple steps.
                    </span>
                </h1>

                <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                    This secure flow helps you recover access quickly. 
                    First, we verify your email. Then, you can set a new password immediately.
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-800/20 border border-slate-700/30 backdrop-blur-sm">
                        <RefreshCw className="w-6 h-6 text-blue-400 mb-1" />
                        <h3 className="font-semibold text-white text-sm">1. Verify Email</h3>
                        <p className="text-xs text-slate-500">Confirm your identity with your registered email address.</p>
                    </div>
                    <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-800/20 border border-slate-700/30 backdrop-blur-sm">
                        <Smartphone className="w-6 h-6 text-blue-400 mb-1" />
                        <h3 className="font-semibold text-white text-sm">2. Set New Password</h3>
                        <p className="text-xs text-slate-500">Create a new secure password to regain access.</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="pt-4">
                <div className="flex items-center justify-between w-full text-slate-500 text-xs">
                    <div className="flex items-center gap-4">
                        <span>© 2026 BCVWorld Security</span>
                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                        <span>Secure Recovery</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
                        <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-2/5 bg-[#1e293b] border-l border-slate-700/50 h-full overflow-y-auto relative">
            <div className="min-h-full flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-sm space-y-6">
                <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition-colors mb-4"
                >
                    <ArrowLeft className="h-3 w-3 mr-1.5" />
                    Back to sign in
                </button>

                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2">Account Recovery</h2>
                    <p className="text-slate-400 text-sm">
                        {isEmailVerified ? 'Create your new password' : 'Enter your email to verify account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="text-xs font-medium text-slate-300">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isEmailVerified}
                                className="block w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className={`grid grid-cols-1 gap-4 transition-all duration-300 ${isEmailVerified ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-300">New Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={!isEmailVerified}
                                        className="block w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-300">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={!isEmailVerified}
                                        className="block w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isChecking || isResetting}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 active:transform active:scale-95 text-sm mt-2"
                    >
                        {isChecking ? 'Verifying Email...' : isResetting ? 'Resetting Password...' : isEmailVerified ? 'Reset Password' : 'Verify Email'}
                    </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-700/50 text-center">
                    <p className="text-[10px] text-slate-500">
                        Need help? <Link to="/#contact" className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/30">Contact Support</Link>
                    </p>
                </div>
            </div>
        </div>
      </div>
      </div>
    </>
  );
}
