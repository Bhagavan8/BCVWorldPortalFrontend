import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthService from '../services/AuthService';
import { Lock, Mail, Server, Shield, Database } from 'lucide-react';

const BCVWorldAuth = () => {
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

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

    setLoading(true);

    try {
      console.log('Login attempt:', { email: formData.email });
      const response = await AuthService.login({ email: formData.email, password: formData.password });
      console.log('Login response data:', response.data); // Debug log
      
      // Ensure we save the correct user object
      const userData = response.data.data || response.data; 
      AuthService.setUser(userData);
      
      toast.success('Login successful!');
      navigate(AuthService.isAdmin() ? '/admin/dashboard' : '/');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSocialLogin = async (provider) => {
    if (provider !== 'Google') {
        toast.error(`${provider} login is not supported.`);
        return;
    }

    setLoading(true);
    try {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) {
            toast.error('Google client ID not configured');
            setLoading(false);
            return;
        }
        if (!googleReady || !window.google?.accounts?.id) {
            toast.error('Google services not loaded. Please try again.');
            setLoading(false);
            return;
        }

        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async ({ credential }) => {
                try {
                    // Decode token to get user info
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
                        idToken: credential,
                        id_token: credential,
                        email: decoded?.email,
                        name: decoded?.name,
                        googleId: decoded?.sub
                    };

                    const response = await AuthService.socialLogin('GOOGLE', payload);
                    AuthService.setUser(response.data);
                    toast.success('Google login successful!');
                    navigate(AuthService.isAdmin() ? '/admin/dashboard' : '/');
                } catch (err) {
                    console.error(err);
                    toast.error(err.response?.data?.message || 'Google login failed');
                } finally {
                    setLoading(false);
                }
            }
        });
        window.google.accounts.id.prompt();
    } catch (err) {
        console.error(err);
        toast.error('Google login failed. Please try again.');
        setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#0f172a] flex font-sans text-slate-200 overflow-hidden">
      
      {/* Left Side - Admin Content */}
      <div className="hidden lg:flex lg:w-3/5 flex-col justify-between p-8 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute -z-10 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-3xl -top-40 -left-40"></div>
        <div className="absolute -z-10 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl bottom-0 right-0"></div>
        
        {/* Logo - Top Left */}
        <div className="flex items-center gap-3">
          <img 
            src="/assets/images/logo.webp" 
            alt="BCVWORLD" 
            className="w-10 h-10 rounded-full shadow-lg shadow-blue-900/20" 
          />
          <span className="text-2xl font-bold tracking-tight text-white">
            BCV<span className="text-blue-500">WORLD</span> <span className="text-slate-400 font-light ml-2">Admin</span>
          </span>
        </div>

        {/* Main Content */}
        <div className="flex flex-col justify-center space-y-8 max-w-3xl mt-4">
          <h1 className="text-5xl font-extrabold leading-tight text-white">
            Experience seamless <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              platform management
            </span>
            <br />with Admin Console.
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
             Access powerful tools to manage users, jobs, finances, and platform settings. 
             Designed for efficiency, security, and real-time control.
          </p>

          <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-800/20 border border-slate-700/30 backdrop-blur-sm">
                <Server className="w-6 h-6 text-blue-400 mb-1" />
                <h3 className="font-semibold text-white text-sm">Scalable Infrastructure</h3>
                <p className="text-xs text-slate-500">Built to handle millions of requests with zero downtime.</p>
             </div>
             <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-800/20 border border-slate-700/30 backdrop-blur-sm">
                <Shield className="w-6 h-6 text-blue-400 mb-1" />
                <h3 className="font-semibold text-white text-sm">Enterprise Security</h3>
                <p className="text-xs text-slate-500">Role-based access control and encrypted data transmission.</p>
             </div>
             <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-800/20 border border-slate-700/30 backdrop-blur-sm">
                <Database className="w-6 h-6 text-blue-400 mb-1" />
                <h3 className="font-semibold text-white text-sm">Real-time Analytics</h3>
                <p className="text-xs text-slate-500">Instant insights into user growth and platform performance.</p>
             </div>
          </div>
        </div>

        {/* Footer/Bottom Element */}
        <div className="pt-4">
           <div className="flex items-center gap-4 text-slate-500 text-xs">
              <span>© 2026 BCVWorld Admin Portal</span>
              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              <span>v2.4.0</span>
           </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-2/5 bg-[#1e293b] border-l border-slate-700/50 flex items-center justify-center p-8">
          <div className="w-full max-w-sm space-y-6">
              <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-white mb-2">Sign in</h2>
                  <p className="text-slate-400 text-sm">Welcome back, Admin</p>
              </div>

              {/* Social Login - ONLY GOOGLE */}
              <div className="flex justify-center mb-6">
                  <button
                      onClick={() => handleSocialLogin('Google')}
                      className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-semibold py-2.5 rounded-lg hover:bg-slate-100 transition-all shadow-lg active:scale-95 text-sm"
                  >
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                      <span>Continue with Google</span>
                  </button>
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                      <span className="px-3 bg-[#1e293b] text-slate-400 font-medium">Or continue with email</span>
                  </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">
                          Email Address
                      </label>
                      <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Mail className="h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          </div>
                          <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className="block w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              placeholder="admin@bcvworld.com"
                          />
                      </div>
                  </div>

                  <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-slate-300">Password</label>
                        <a href="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium">
                            Forgot Password?
                        </a>
                      </div>
                      <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Lock className="h-4 w-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                          </div>
                          <input
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              className="block w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              placeholder="••••••••"
                          />
                      </div>
                  </div>

                  <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20 active:transform active:scale-95 text-sm"
                  >
                      {loading ? 'Verifying...' : 'Sign In'}
                  </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-700/50 text-center">
                  <p className="text-[10px] text-slate-500 mb-2">
                      Protected by Enterprise Grade Security
                  </p>
                  <p className="text-[10px] text-slate-600 leading-relaxed max-w-xs mx-auto">
                      By accessing this portal, you agree to comply with the
                      <a href="/terms" className="text-slate-500 hover:text-slate-400 ml-1 underline">Security Protocols</a> and 
                      <a href="/privacy" className="text-slate-500 hover:text-slate-400 ml-1 underline">Data Privacy Standards</a>.
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default BCVWorldAuth;