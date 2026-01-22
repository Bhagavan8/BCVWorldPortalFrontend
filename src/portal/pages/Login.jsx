import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import AuthService from '../../admin/services/AuthService';
import SEO from '../components/SEO';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  Target,
  Users,
  BookOpen
} from 'lucide-react';

export default function Login() {
  const toTitleCase = (s) => {
    if (!s) return s;
    return s.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [googleReady, setGoogleReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';
  const forgotPasswordPath = `/forgot-password?returnTo=${encodeURIComponent(returnTo)}`;

  useEffect(() => {
    // Check for remembered email and password
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    const rememberedPassword = localStorage.getItem('rememberedPassword');
    if (rememberedEmail) {
      setFormData(prev => ({ 
        ...prev, 
        email: rememberedEmail,
        password: rememberedPassword || ''
      }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      setGoogleReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    script.onerror = () => setGoogleReady(false);
    document.head.appendChild(script);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);

    try {
      if (provider === 'Google') {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) {
          toast.error('Google client ID not configured');
          return;
        }
        if (!googleReady || !window.google?.accounts?.id) {
          toast.error('Google services not loaded. Please try again.');
          return;
        }
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async ({ credential }) => {
            try {
              const decoded = (() => {
                try {
                  const base64Url = credential.split('.')[1];
                  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                  }).join(''));
                  return JSON.parse(jsonPayload);
                } catch { return null; }
              })();
              const payload = {
                provider: 'GOOGLE',
                idToken: credential,
                id_token: credential,
                email: decoded?.email,
                name: toTitleCase(decoded?.name),
                googleId: decoded?.sub
              };
              const { data } = await api.post('/social', payload);
              localStorage.setItem('user', JSON.stringify(data));
              toast.success('Google login successful!');
              setTimeout(() => {
                const isAdmin = AuthService.isAdmin();
                const safeReturn = (!isAdmin && typeof returnTo === 'string' && returnTo.includes('/admin')) ? '/profile' : returnTo;
                navigate(isAdmin ? '/admin' : safeReturn);
              }, 1000);
            } catch (err) {
              toast.error(err.response?.data?.message || 'Google login failed');
            } finally {
              setIsLoading(false);
            }
          }
        });
        window.google.accounts.id.prompt();
        return;
      }

      const mock = {
        email: `user.${provider.toLowerCase()}@example.com`,
        name: `Demo ${provider} User`,
        provider: provider.toUpperCase(),
      };
      const { data } = await api.post('/social', mock);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success(`${provider} login successful!`);
      setTimeout(() => {
        const isAdmin = AuthService.isAdmin();
        const safeReturn = (!isAdmin && typeof returnTo === 'string' && returnTo.includes('/admin')) ? '/profile' : returnTo;
        navigate(isAdmin ? '/admin' : safeReturn);
      }, 1200);

    } catch (err) {
      toast.error(
        err.response?.data?.message || `${provider} login failed`
      );
    } finally {
      if (provider !== 'Google') setIsLoading(false);
    }
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error('Please enter your email');
      return;
    }

    if (!formData.password) {
      toast.error('Please enter your password');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await api.post('/login', formData);

      let userData = data.data || data;

      // Ensure ID is present by extracting from token if missing
      if ((!userData.id && !userData.userId && !userData.uid) && (userData.token || userData.access_token)) {
        const token = userData.token || userData.access_token;
        const decoded = parseJwt(token);
        if (decoded) {
          const userId = decoded.id || decoded.userId || decoded.uid || decoded.sub;
          if (userId) {
            userData = { ...userData, id: userId };
          }
        }
      }

      (() => {
        try {
          const actual = userData.user || userData.data || userData;
          let created =
            actual.createdAt ||
            actual.createdAT ||
            actual.created_at ||
            actual.joinDate ||
            actual.registeredAt ||
            actual.registrationDate;
          if (!created && (userData.token || userData.access_token)) {
            const token = userData.token || userData.access_token;
            const decoded = parseJwt(token);
            if (decoded && decoded.iat) {
              created = new Date(decoded.iat * 1000).toISOString();
            }
          }
          if (created && !userData.createdAt) {
            userData = { ...userData, createdAt: created };
          }
        } catch { void 0; }
      })();
      try { localStorage.setItem('user_first_seen', new Date().toISOString()); } catch { void 0; }
      localStorage.setItem('user', JSON.stringify(userData));

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', formData.email);
        localStorage.setItem('rememberedPassword', formData.password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

      toast.success('Login successful! Redirecting...');

      setTimeout(() => {
        const isAdmin = AuthService.isAdmin();
        const safeReturn = (!isAdmin && typeof returnTo === 'string' && returnTo.includes('/admin')) ? '/profile' : returnTo;
        const dest = isAdmin ? '/admin' : (safeReturn || '/profile');
        navigate(dest);
      }, 1200);

    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Invalid email or password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row bg-[#0f172a] overflow-hidden font-sans text-slate-200">
      <SEO 
        title="Login"  
        description="Login to your BCVWORLD account to access job referrals, mentoring, and financial tools." 
        keywords="login, sign in, bcvworld login, career portal, job portal login"
      />
      <div className="w-full lg:w-1/2 bg-[#0f172a] text-white p-8 lg:p-12 lg:pb-20 flex flex-col justify-between relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full opacity-10 blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full opacity-10 blur-[100px]"></div>
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center space-x-2 text-white mb-8">
            <img
              src="/assets/images/logo.webp"
              alt="BCVWORLD"
              className="h-12 w-12 object-cover bg-white rounded-full p-1 shadow-lg shadow-blue-900/20"
              width="48"
              height="48"
              decoding="async"
            />
          </Link>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Your Complete <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Career Growth</span> Partner
            </h1>
            <p className="text-lg lg:text-xl text-slate-400 mb-8 max-w-lg">
              Join thousands of professionals who are accelerating their careers with BCVWorld's comprehensive platform.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-white">Personalized Job Referrals</h3>
                  <p className="text-slate-400 text-sm">Direct access to opportunities at top companies tailored to your skills.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-white">1:1 Career Mentoring</h3>
                  <p className="text-slate-400 text-sm">Get personalized guidance from industry experts and senior professionals.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 backdrop-blur-sm">
                  <BookOpen className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1 text-white">Comprehensive Resources</h3>
                  <p className="text-slate-400 text-sm">Access 200+ study materials, structured learning paths, and interview prep.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-sm text-slate-500 border-t border-slate-800 pt-6">
          <p className="mb-0">© 2026 BCVWorld. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative bg-[#1e293b] border-l border-slate-700/50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/assets/images/logo.webp"
                alt="BCVWorld logo"
                className="h-12 w-12 rounded-full shadow-lg shadow-blue-900/20 bg-white p-1"
                width="48"
                height="48"
                decoding="async"
                loading="lazy"
              />
            </Link>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white">Welcome Back!</h2>
            <p className="mt-2 text-slate-400">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6" noValidate>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-900 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to={forgotPasswordPath} className="font-medium text-blue-400 hover:text-blue-300">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-blue-900/20 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1e293b] text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center w-full px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors bg-slate-900"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-sm font-medium text-slate-300">Google</span>
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#1e293b] text-slate-500">Don't have an account?</span>
              </div>
            </div>

            <div className="text-center">
              <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300">
                Create an account for free

              </Link>
            </div>
          </form>
          
          <div className="lg:hidden text-center mt-8 text-xs text-gray-500">
            © 2026 BCVWorld. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
