import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthService from '../services/AuthService';
import './AuthPages.css';

const BCVWorldAuth = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    if (location.state && location.state.isRegister) {
        setIsLogin(false);
    }
  }, [location.state]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    dob: '',
    country: 'India',
    state: '',
    city: ''
  });

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

  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (formData.state && INDIAN_STATES_CITIES[formData.state]) {
        setCities(INDIAN_STATES_CITIES[formData.state]);
        setFormData(prev => ({ ...prev, city: '' }));
    } else {
        setCities([]);
    }
  }, [formData.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    try {
      setLoading(true);
      // Simulating social login data since we don't have real OAuth keys
      const mockData = {
        email: `user.${provider}@example.com`,
        name: `Demo ${provider.charAt(0).toUpperCase() + provider.slice(1)} User`
      };
      const response = await AuthService.socialLogin(provider, mockData);
      AuthService.setUser(response.data);
      toast.success(`${provider} login successful!`);
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error(`${provider} login failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper font-sans">
      <div className="auth-container">
      {/* Left Panel with BCVWorld Branding */}
      <div className="brand-panel">
        <div className="brand-content">
          <div className="logo-container">
            <img
              src="/assets/images/logo.webp"
              alt="BCVWORLD"
              className="logo rounded-circle"
              style={{ height: '60px', width: '60px', objectFit: 'cover' }}
              width="60"
              height="60"
              decoding="async"
              loading="lazy"
            />
            <h1 style={{ color: 'white', marginTop: '10px', fontSize: '24px', fontWeight: 'bold' }}>BCV<span className="logo-accent">WORLD</span></h1>
          </div>
          
          <div className="services-highlight">
            <h2>Accelerate Your Career Journey</h2>
            <div className="service-item">
              <span className="service-icon">🎯</span>
              <div>
                <h4>Personalized Job Referrals</h4>
                <p>Direct access to opportunities at top companies</p>
              </div>
            </div>
            
            <div className="service-item">
              <span className="service-icon">👨‍🏫</span>
              <div>
                <h4>1:1 Career Mentoring</h4>
                <p>Personalized guidance from industry experts</p>
              </div>
            </div>
            
            <div className="service-item">
              <span className="service-icon">📚</span>
              <div>
                <h4>Comprehensive Learning Resources</h4>
                <p>200+ study materials and structured paths</p>
              </div>
            </div>
            
            <div className="stats-preview">
              <div className="stat">
                <h3>50+</h3>
                <p>Professionals Enhanced</p>
              </div>
              <div className="stat">
                <h3>100+</h3>
                <p>Successful Referrals</p>
              </div>
              <div className="stat">
                <h3>24/7</h3>
                <p>Platform Access</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="auth-panel">
        <div className="auth-header">
          <h2>Welcome Back!</h2>
          <p>Continue accelerating your career growth</p>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="new-email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-options">
            <label className="checkbox">
              <input type="checkbox" /> Remember me
            </label>
            <a href="/forgot-password" className="forgot-link">Forgot Password?</a>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  </div>
  );
};

export default BCVWorldAuth;
