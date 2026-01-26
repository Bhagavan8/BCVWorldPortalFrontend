import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import api from '../../api/axios';
import AuthService from '../../admin/services/AuthService';
import SEO from '../components/SEO';
import { API_BASE_URL } from '../../utils/config';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Phone,
  Calendar,
  MapPin,
  ArrowRight, 
  CheckCircle,
  AlertCircle,
  Users,
  BookOpen,
  Shield
} from 'lucide-react';

const INDIAN_STATES_CITIES = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Pasighat"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat"],
  "Bihar": ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Haryana": ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Solan"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane"],
  "Manipur": ["Imphal", "Churachandpur", "Thoubal"],
  "Meghalaya": ["Shillong", "Tura", "Jowai"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Chandigarh", "Patiala"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Sikkim": ["Gangtok", "Namchi", "Geyzing"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Noida", "Ghaziabad"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Rishikesh", "Nainital"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"]
};

export default function Register() {
  const toTitleCase = (s) => {
    if (!s) return s;
    return s.trim().split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    countryCode: '+91',
    dob: '',
    country: 'India',
    state: '',
    city: ''
  });

  const COUNTRY_CODES = [
    { code: "+91", label: "IN (+91)" },
    { code: "+1", label: "US/CA (+1)" },
    { code: "+44", label: "UK (+44)" },
    { code: "+61", label: "AU (+61)" },
    { code: "+971", label: "AE (+971)" },
    { code: "+65", label: "SG (+65)" },
  ];
  
  const [cities, setCities] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPasswordCriteria, setShowPasswordCriteria] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [googleReady, setGoogleReady] = useState(false);
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';

  const passwordCriteria = {
    length: formData.password.length >= 8,
    upper: /[A-Z]/.test(formData.password),
    lower: /[a-z]/.test(formData.password),
    number: /[0-9]/.test(formData.password),
    special: /[^A-Za-z0-9]/.test(formData.password)
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    if (formData.state && INDIAN_STATES_CITIES[formData.state]) {
      setCities(INDIAN_STATES_CITIES[formData.state]);
      setFormData(prev => ({ ...prev, city: '' }));
    } else {
      setCities([]);
    }
  }, [formData.state]);

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
    const key = e.target.name;
    let val = e.target.value;

    if (key === 'mobile') {
      // Remove non-numeric characters
      val = val.replace(/\D/g, '');
      
      // Enforce max length based on country code
      if (formData.countryCode === '+91' && val.length > 10) {
        val = val.slice(0, 10);
      } else if (val.length > 15) {
        val = val.slice(0, 15);
      }
    }

    setFormData(prev => ({
      ...prev,
      [key]: key === 'name' ? toTitleCase(val) : val
    }));
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
                const safeReturn = (!isAdmin && typeof returnTo === 'string' && returnTo.includes('/admin')) ? '/' : returnTo;
                navigate(isAdmin ? '/admin' : safeReturn);
              }, 1000);
            } catch (err) {
              const msg = err.response?.data?.message || (err.code === 'ERR_NETWORK' ? 'Network error. Please check your connection.' : 'Google login failed');
              toast.error(msg);
            } finally {
              setIsLoading(false);
            }
          }
        });
        window.google.accounts.id.prompt();
        return;
      }
      toast.error(`${provider} login is currently disabled.`, { duration: 3000 });
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

    // Validation
    if (!formData.name) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.mobile) {
      toast.error('Please enter your mobile number');
      return;
    }
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }
    if (!formData.dob) {
      toast.error('Please select your date of birth');
      return;
    }
    if (!formData.state) {
      toast.error('Please select your state');
      return;
    }
    if (!formData.city) {
      toast.error('Please select your city');
      return;
    }
    if (!formData.password) {
      toast.error('Please enter a password');
      return;
    }
    if (!formData.confirmPassword) {
      toast.error('Please confirm your password');
      return;
    }

    if (emailError || !validateEmail(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
    if (!isPasswordValid) {
      toast.error('Password does not meet all security criteria');
      setShowPasswordCriteria(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      // Exclude confirmPassword and format mobile number
      const { confirmPassword, countryCode, mobile, ...rest } = formData;
      const payload = {
        ...rest,
        mobile: `${countryCode}${mobile}`
      };

      const response = await fetch(`${API_BASE_URL}/api/admin/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server returned non-JSON response. Please check backend.');
      }

      if (response.ok) {
        toast.success('Registration successful! Redirecting to home...');

        let userData = data;
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
            if (!created) created = new Date().toISOString();
            if (created && !userData.createdAt) {
              userData = { ...userData, createdAt: created };
            }
          } catch { void 0; }
        })();
        try { localStorage.setItem('user_first_seen', new Date().toISOString()); } catch { void 0; }
        localStorage.setItem('user', JSON.stringify(userData));
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        toast.error(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main role="main" className="h-screen w-full flex flex-col lg:flex-row bg-[#0f172a] overflow-hidden font-sans text-slate-200">
      <SEO 
        title="Register" 
        description="Create a BCVWORLD account to unlock job referrals, mentoring, and exclusive career resources." 
        keywords="register, sign up, create account, bcvworld registration, career growth, job alerts"
      />
      {/* Left Side - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0f172a] text-white p-8 lg:p-12 flex-col justify-between relative overflow-hidden">
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
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              Start Your <br/>
              <span className="text-blue-400">Career Journey</span> Today
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-lg">
              Join a community of professionals and get access to exclusive job opportunities, mentorship, and resources.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col space-y-2">
                <div className="w-12 h-12 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center backdrop-blur-sm mb-2">
                  <CheckCircle className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg leading-tight">Personalized Job Matches</h2>
                  <p className="text-gray-400 text-xs mt-1">Get recommendations based on your skills</p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <div className="w-12 h-12 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center backdrop-blur-sm mb-2">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg leading-tight">Community Access</h2>
                  <p className="text-slate-400 text-xs mt-1">Connect with peers and mentors</p>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="w-12 h-12 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center backdrop-blur-sm mb-2">
                  <BookOpen className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg leading-tight">Learning Resources</h2>
                  <p className="text-slate-400 text-xs mt-1">Access to premium study materials</p>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="w-12 h-12 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center backdrop-blur-sm mb-2">
                  <Shield className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg leading-tight">Secure & Private</h2>
                  <p className="text-slate-400 text-xs mt-1">Your data is encrypted and protected</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-sm text-slate-400">
            <span>Already have an account?</span>
            <Link to={`/login?returnTo=${encodeURIComponent(window.location.href)}`} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign in here</Link>
          </div>
        </div>
      </div>

      {/* Right Panel - Registration Form */}
      <div className="w-full lg:w-1/2 h-full overflow-y-auto bg-[#1e293b] relative lg:border-l border-slate-700/50">
        <div className="w-full max-w-xl mx-auto p-6 sm:p-8 flex flex-col justify-center min-h-full">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-6">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/assets/images/logo.webp"
                alt="BCVWORLD"
                className="h-12 w-12 object-cover rounded-full shadow-lg shadow-blue-900/20 bg-white p-1"
                width="48"
                height="48"
                decoding="async"
                loading="lazy"
              />
            </Link>
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white">Create Account</h2>
            <p className="text-slate-400 text-base mt-2">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Row 1: Name & Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base min-h-[48px]"
                      required
                      aria-label="Full Name"
                    />
                  </div>
                </div>
                {/* Mobile */}
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium text-slate-300 mb-1">Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="w-24 flex-shrink-0">
                      <select
                        id="countryCode"
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="w-full px-2 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm min-h-[48px]"
                        aria-label="Country Code"
                        title="Country Code"
                      >
                        {COUNTRY_CODES.map(c => (
                          <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                      <input
                        id="mobile"
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full pl-8 pr-2 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base min-h-[48px]"
                        required
                        maxLength={formData.countryCode === '+91' ? 10 : 15}
                        placeholder="1234567890"
                        aria-label="Mobile Number"
                      />
                    </div>
                  </div>
                </div>
            </div>

            {/* Row 2: Email & DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3 py-2.5 bg-slate-900 border rounded-lg focus:ring-2 outline-none transition-all text-base text-white placeholder-slate-500 min-h-[48px] ${
                        emailError ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-slate-700 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      required
                      aria-label="Email Address"
                    />
                  </div>
                  {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                </div>
                {/* DOB */}
                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-slate-300 mb-1">Date of Birth</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                      <input
                        id="dob"
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base [color-scheme:dark] min-h-[48px]"
                        required
                        aria-label="Date of Birth"
                      />
                    </div>
                </div>
            </div>

            {/* Row 3: State & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div>
                <label htmlFor="state" className="block text-sm font-medium text-slate-300 mb-1">State</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none text-base min-h-[48px]"
                    required
                    aria-label="State"
                  >
                    <option value="" className="bg-slate-900 text-slate-400">Select State</option>
                    {Object.keys(INDIAN_STATES_CITIES).map(state => (
                      <option key={state} value={state} className="bg-slate-900 text-white">{state}</option>
                    ))}
                  </select>
                </div>
               </div>
               <div>
                <label htmlFor="city" className="block text-sm font-medium text-slate-300 mb-1">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none text-base min-h-[48px]"
                    required
                    disabled={!formData.state}
                    aria-label="City"
                  >
                    <option value="" className="bg-slate-900 text-slate-400">Select City</option>
                    {cities.map(city => (
                      <option key={city} value={city} className="bg-slate-900 text-white">{city}</option>
                    ))}
                  </select>
                </div>
               </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setShowPasswordCriteria(true)}
                    className="w-full pl-10 pr-12 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-base min-h-[48px]"
                    required
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 min-w-[48px] min-h-[48px] flex items-center justify-center"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-2.5 bg-slate-900 border rounded-lg focus:ring-2 outline-none transition-all text-base text-white placeholder-slate-500 min-h-[48px] ${
                      formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                        : 'border-slate-700 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                    required
                    aria-label="Confirm Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300 min-w-[48px] min-h-[48px] flex items-center justify-center"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>
            </div>

            {/* Password Criteria Checklist */}
            {(showPasswordCriteria || formData.password) && (
              <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                <p className="text-xs font-medium text-slate-400 mb-2">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex items-center text-xs ${passwordCriteria.length ? 'text-green-400' : 'text-slate-500'}`}>
                    <CheckCircle className="w-3 h-3 mr-1" /> 8+ Characters
                  </div>
                  <div className={`flex items-center text-xs ${passwordCriteria.upper ? 'text-green-400' : 'text-slate-500'}`}>
                    <CheckCircle className="w-3 h-3 mr-1" /> Uppercase Letter
                  </div>
                  <div className={`flex items-center text-xs ${passwordCriteria.lower ? 'text-green-400' : 'text-slate-500'}`}>
                    <CheckCircle className="w-3 h-3 mr-1" /> Lowercase Letter
                  </div>
                  <div className={`flex items-center text-xs ${passwordCriteria.number ? 'text-green-400' : 'text-slate-500'}`}>
                    <CheckCircle className="w-3 h-3 mr-1" /> Number
                  </div>
                  <div className={`flex items-center text-xs ${passwordCriteria.special ? 'text-green-400' : 'text-slate-500'}`}>
                    <CheckCircle className="w-3 h-3 mr-1" /> Special Char
                  </div>
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-5 h-5 border border-slate-600 rounded bg-slate-900 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                  aria-label="I agree to the Terms of Service and Privacy Policy"
                />
              </div>
              <label htmlFor="terms" className="ml-2 text-xs text-slate-400">
                I agree to the <Link to="/terms" className="text-blue-400 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed text-sm shadow-lg shadow-blue-900/20 min-h-[48px]"
              aria-label="Create Account"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-[#1e293b] text-slate-300">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center w-full px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors bg-slate-900 min-h-[48px]"
                aria-label="Sign in with Google"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
                <span className="text-xs font-medium text-slate-300">Google</span>
              </button>
            </div>
          </form>

          <div className="mt-4 text-center lg:hidden">
             <p className="text-xs text-slate-400">
               Already have an account?{' '}
               <Link to={`/login?returnTo=${encodeURIComponent(window.location.href)}`} className="text-blue-400 font-medium hover:underline">Sign in</Link>
             </p>
          </div>
        </div>
      </div>
    </main>
  );
}
