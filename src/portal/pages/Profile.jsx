import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BiAward, BiBoltCircle, BiBook, BiBookmark, BiBriefcase, BiBuilding, BiBulb, BiChart, BiCheckCircle, BiCheckShield, BiChevronRight, BiChevronUp, BiCog, BiEnvelope, BiFile, BiFingerprint, BiGlobe, BiGroup, BiHeadphone, BiHome, BiInfoCircle, BiLock, BiLogIn, BiLogOut, BiMap, BiPulse, BiRocket, BiSend, BiShield, BiShow, BiSidebar, BiSolidEnvelope, BiSolidGraduation, BiSolidUserBadge, BiStar, BiTime, BiTrendingUp, BiUpload, BiUser, BiUserCircle, BiUserPlus, BiWorld, BiWrench 
} from 'react-icons/bi';

import SEO from '../components/SEO';
import { API_BASE_URL } from '../../utils/config';
import '../assets/css/Profile.css';

const Profile = () => {
  const [user] = useState(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr && userStr !== 'undefined') {
        return JSON.parse(userStr);
      }
    } catch (e) { console.error('Profile: failed to parse user', e); }
    return null;
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [stats] = useState(() => {
    const u = user || {};
    const baseStrength =
      typeof u.profileStrength === 'number'
        ? u.profileStrength
        : Math.floor(Math.random() * 30) + 70;
    return {
      jobsApplied:
        typeof u.jobsApplied === 'number'
          ? u.jobsApplied
          : Math.floor(Math.random() * 20),
      savedJobs:
        typeof u.savedJobs === 'number'
          ? u.savedJobs
          : Math.floor(Math.random() * 10),
      profileStrength: baseStrength
    };
  });

  if (!user) {
    return (
      <div className="profile-page">
        <SEO title="My Profile" description="View and manage your BCVWorld profile." />
        <div className="profile-container">
          <div className="profile-empty-state">
            <div className="empty-illustration">
              <BiUserCircle className="bi" />
              <div className="empty-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
              </div>
            </div>
            <h2>Welcome to Your Professional Space</h2>
            <p className="empty-subtitle">Sign in to access your personalized dashboard, job matches, and career insights.</p>
            <div className="empty-actions">
              <a className="btn-primary pulse" href="/login">
                <BiLogIn className="bi" />
                <span>Login to Continue</span>
              </a>
              <a className="btn-secondary" href="/register">
                <BiUserPlus className="bi" />
                <span>Create Account</span>
              </a>
            </div>
            <div className="empty-features">
              <div className="feature">
                <BiBriefcase className="bi" />
                <span>Personalized Job Matches</span>
              </div>
              <div className="feature">
                <BiChart className="bi" />
                <span>Career Analytics</span>
              </div>
              <div className="feature">
                <BiCheckShield className="bi" />
                <span>Secure Profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const firstLetter = (user.name || 'User').charAt(0).toUpperCase();
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
  const getCreationDate = () => {
    const actual = user.data || user.user || user;
    const fields = [
      'createdAt','created_at','createdDate','createdOn','created',
      'joinDate','joinedAt','registeredAt','registrationDate'
    ];
    for (const f of fields) {
      const v = actual?.[f];
      if (v) {
        const d = new Date(v);
        if (!isNaN(d.getTime())) return d;
      }
    }
    let token = actual?.token || actual?.access_token || user?.data?.token || user?.user?.token;
    if (token) {
      if (token.startsWith('Bearer ')) token = token.replace('Bearer ', '');
      const decoded = parseJwt(token);
      if (decoded) {
        if (decoded.iat) return new Date(decoded.iat * 1000);
        const claimDate = decoded.createdAt || decoded.created_at || decoded.joinDate || decoded.registeredAt;
        if (claimDate) {
          const d = new Date(claimDate);
          if (!isNaN(d.getTime())) return d;
        }
      }
    }
    try {
      const v = localStorage.getItem('user_first_seen');
      if (v) {
        const d = new Date(v);
        if (!isNaN(d.getTime())) return d;
      }
    } catch (e) { console.error('Profile: failed to read first seen', e); }
    return new Date();
  };
  const createdDate = getCreationDate();
  const joinDate = createdDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const truncate = (s, n = 20) => {
    if (!s) return '';
    const str = String(s);
    return str.length > n ? str.slice(0, n - 3) + '...' : str;
  };

  return (
    <div className="profile-page">
      <SEO title="My Profile" description="View and manage your BCVWorld profile." />
      
      {/* Header */}
      <header className="profile-header">
        <div className="profile-header-content">
          <div className="profile-identity">
            <div className="avatar-large">
              <span className="avatar-initial">{firstLetter}</span>
              <div className="avatar-status online"></div>
            </div>
            <div className="profile-info">
              <h1 className="profile-name" title={user.name || 'User'}>{truncate(user.name || 'User')}</h1>
              <p className="profile-title">Member since {joinDate}</p>
              <div className="profile-tags">
                {user.email && (
                  <span className="tag" title={user.email}>
                    <BiSolidEnvelope className="bi" />
                    {truncate(user.email)}
                  </span>
                )}
                {user.role && (
                  <span className="tag badge">
                    <BiAward className="bi" />
                    {String(user.role).toUpperCase()}
                  </span>
                )}
                {user.location && (
                  <span className="tag">
                    <BiMap className="bi" />
                    {user.location}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <BiSend className="bi" />
              </div>
              <div className="stat-content">
                <h3>{stats.jobsApplied}</h3>
                <p>Jobs Applied</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <BiBookmark className="bi" />
              </div>
              <div className="stat-content">
                <h3>{stats.savedJobs}</h3>
                <p>Saved Jobs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <BiTrendingUp className="bi" />
              </div>
              <div className="stat-content">
                <h3>{stats.profileStrength}%</h3>
                <p>Profile Strength</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="profile-nav">
        <div className="nav-container">
          <button 
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <BiHome className="bi" />
            Overview
          </button>
          <button 
            className={`nav-tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <BiPulse className="bi" />
            Activity
          </button>
          <button 
            className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <BiCog className="bi" />
            Settings
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="profile-main">
        <div className="full-row account-row">
          <div className="card">
            <div className="card-header">
              <h3>
                <span className="icon-pill pill-blue"><BiSolidUserBadge className="bi" /></span>
                User Info
              </h3>
            </div>
            <div className="account-summary">
              <div className="summary-item">
                <div className="summary-label">
                  <BiUser className="bi" />
                  <span>Full Name</span>
                </div>
                <div className="summary-value" title={user.name || '—'}>{truncate(user.name || '—')}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">
                  <BiEnvelope className="bi" />
                  <span>Email</span>
                </div>
                <div className="summary-value" title={user.email || '—'}>{truncate(user.email || '—')}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">
                  <BiShield className="bi" />
                  <span>Account Type</span>
                </div>
                <div className="summary-value summary-badge">
                  {user.role ? String(user.role).toUpperCase() : 'STANDARD'}
                </div>
              </div>
              <div className="summary-item">
                <div className="summary-label">
                  <BiFingerprint className="bi" />
                  <span>User ID</span>
                </div>
                <div className="summary-value summary-code">{user.id || user.userId || '—'}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="full-row quick-actions-row">
          <div className="card">
            <div className="card-header">
              <h3>
                <span className="icon-pill pill-amber"><BiBoltCircle className="bi" /></span>
                Quick Actions
              </h3>
            </div>
            <div className="action-grid">
              <a className="action-card primary" href="/jobs">
                <div className="action-icon">
                  <BiBriefcase className="bi" />
                </div>
                <div className="action-content">
                  <h4>Browse Jobs</h4>
                  <p>Find your next opportunity</p>
                </div>
                <BiChevronRight className="bi action-arrow" />
              </a>
              
              <a className="action-card success" href="/suggestion">
                <div className="action-icon">
                  <BiBulb className="bi" />
                </div>
                <div className="action-content">
                  <h4>Get Suggestions</h4>
                  <p>Personalized career advice</p>
                </div>
                <BiChevronRight className="bi action-arrow" />
              </a>
              
              <a className="action-card warning" href="/resume">
                <div className="action-icon">
                  <BiFile className="bi" />
                </div>
                <div className="action-content">
                  <h4>Resume Builder</h4>
                  <p>Create professional resume</p>
                </div>
                <BiChevronRight className="bi action-arrow" />
              </a>
              
              <a className="action-card info" href="/learning">
                <div className="action-icon">
                  <BiSolidGraduation className="bi" />
                </div>
                <div className="action-content">
                  <h4>Learning Hub</h4>
                  <p>Upskill with courses</p>
                </div>
                <BiChevronRight className="bi action-arrow" />
              </a>
            </div>
          </div>
        </div>
        <div className="full-row strength-row">
          <div className="card">
            <div className="card-header">
              <h3>
                <span className="icon-pill pill-emerald"><BiTrendingUp className="bi" /></span>
                Profile Strength
              </h3>
            </div>
            <div className="strength-horizontal">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${stats.profileStrength}%` }}
                ></div>
              </div>
              <div className="progress-text">
                <span>{stats.profileStrength}% Complete</span>
                <span>Excellent</span>
              </div>
              <div className="pill-list">
                <span className="pill"><BiCheckCircle className="bi" /> Add your skills</span>
                <span className="pill"><BiUpload className="bi" /> Upload resume</span>
                <span className="pill"><BiSolidGraduation className="bi" /> Complete education</span>
              </div>
            </div>
          </div>
        </div>
        <div className="full-row activity-row">
          <div className="card">
            <div className="card-header">
              <h3>
                <BiTime className="bi" />
                Recent Activity
              </h3>
            </div>
            <div className="activity-grid-horizontal">
              <div className="activity-item">
                <div className="activity-icon">
                  <BiShow className="bi" />
                </div>
                <div className="activity-content">
                  <p>Viewed Senior Frontend Developer at TechCorp</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <BiSend className="bi" />
                </div>
                <div className="activity-content">
                  <p>Applied for Product Manager role</p>
                  <span className="activity-time">Yesterday</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <BiBookmark className="bi" />
                </div>
                <div className="activity-content">
                  <p>Saved UX Designer position</p>
                  <span className="activity-time">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="profile-grid">
          {/* Left Column */}
          <div className="left-column">
            
          </div>

          {/* Center Column */}
          <div className="center-column">
            
          </div>

        {/* Full-width Welcome below Recent Activity */}
        <div className="full-row welcome-row">
          <div className="card accent">
            <h3>
              <span className="icon-pill"><BiGlobe className="bi" /></span>
              Welcome to BCVWorld
            </h3>
            <div className="welcome-horizontal">
              <div className="welcome-copy">
                <p>Your all-in-one platform for career growth. We provide curated job opportunities, learning resources, and finance tools — completely free.</p>
                <p>Build a strong professional profile, track applications and learning progress, and get personalized recommendations to move your career forward.</p>
                <p>Access free calculators and helpful tools for planning, budgeting, and decision-making. Your privacy and data security are always our priority.</p>
                <div className="welcome-illustrations">
                  <div className="illustration-card primary">
                    <div className="illustration-icon">
                      <BiWorld className="bi" />
                    </div>
                    <div className="illustration-text">
                      <strong>Global Opportunities</strong>
                      <p>Discover roles across regions and industries.</p>
                    </div>
                  </div>
                  <div className="illustration-card secondary">
                    <div className="illustration-icon">
                      <BiRocket className="bi" />
                    </div>
                    <div className="illustration-text">
                      <strong>Career Growth</strong>
                      <p>Upskill and accelerate your professional journey.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="features-grid">
                <div className="feature-card">
                  <BiStar className="bi" />
                  <div>
                    <strong>Smart Matching</strong>
                    <p>AI-powered job recommendations</p>
                  </div>
                </div>
                <div className="feature-card">
                  <BiCheckShield className="bi" />
                  <div>
                    <strong>Privacy First</strong>
                    <p>Your data stays secure</p>
                  </div>
                </div>
                <div className="feature-card">
                  <BiGroup className="bi" />
                  <div>
                    <strong>Community</strong>
                    <p>Connect with professionals</p>
                  </div>
                </div>
                <div className="feature-card">
                  <BiWrench className="bi" />
                  <div>
                    <strong>Career Tools</strong>
                    <p>Resume builder and insights</p>
                  </div>
                </div>
                <div className="feature-card">
                  <BiBook className="bi" />
                  <div>
                    <strong>Free Resources</strong>
                    <p>Learn and upskill anytime</p>
                  </div>
                </div>
                <div className="feature-card">
                  <BiHeadphone className="bi" />
                  <div>
                    <strong>Support</strong>
                    <p>Help when you need it</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Security & Links below Welcome */}
        <div className="full-row">
          <div className="card">
            <h3>
              <BiLock className="bi" />
              Security & Links
            </h3>
            <div className="links-grid">
              <Link className="link-card" to="/about">
                <BiBuilding className="bi" />
                <span>About Us</span>
              </Link>
              <Link className="link-card" to="/disclaimer">
                <BiFile className="bi" />
                <span>Disclaimer</span>
              </Link>
              <Link className="link-card" to="/ads-disclosure">
                <BiSidebar className="bi" />
                <span>Ads Disclosure</span>
              </Link>
              <a className="link-card" href="/#contact">
                <BiHeadphone className="bi" />
                <span>Contact Support</span>
              </a>
              <Link className="link-card" to="/privacy">
                <BiLock className="bi" />
                <span>Privacy Policy</span>
              </Link>
              <Link className="link-card" to="/terms">
                <BiFile className="bi" />
                <span>Terms of Service</span>
              </Link>
            </div>
            
            <div className="security-note">
              <p>
                <BiInfoCircle className="bi" />
                Your data is stored locally for session convenience. For security, clear storage on public devices.
              </p>
            </div>
            
            <button 
              className="btn-logout" 
              onClick={() => {
                localStorage.removeItem('user');
                window.location.href = '/';
              }}
            >
              <BiLogOut className="bi" />
              <span>Logout from all devices</span>
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          
        </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fab" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <BiChevronUp className="bi" />
      </button>
    </div>
  );
};

export default Profile;
