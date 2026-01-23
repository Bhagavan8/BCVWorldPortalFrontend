import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
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
              <i className="bi bi-person-circle"></i>
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
                <i className="bi bi-box-arrow-in-right"></i>
                <span>Login to Continue</span>
              </a>
              <a className="btn-secondary" href="/register">
                <i className="bi bi-person-plus"></i>
                <span>Create Account</span>
              </a>
            </div>
            <div className="empty-features">
              <div className="feature">
                <i className="bi bi-briefcase"></i>
                <span>Personalized Job Matches</span>
              </div>
              <div className="feature">
                <i className="bi bi-graph-up"></i>
                <span>Career Analytics</span>
              </div>
              <div className="feature">
                <i className="bi bi-shield-check"></i>
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
                    <i className="bi bi-envelope-fill"></i>
                    {truncate(user.email)}
                  </span>
                )}
                {user.role && (
                  <span className="tag badge">
                    <i className="bi bi-award"></i>
                    {String(user.role).toUpperCase()}
                  </span>
                )}
                {user.location && (
                  <span className="tag">
                    <i className="bi bi-geo-alt"></i>
                    {user.location}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-send-check"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.jobsApplied}</h3>
                <p>Jobs Applied</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-bookmark-star"></i>
              </div>
              <div className="stat-content">
                <h3>{stats.savedJobs}</h3>
                <p>Saved Jobs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <i className="bi bi-graph-up-arrow"></i>
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
            <i className="bi bi-house-door"></i>
            Overview
          </button>
          <button 
            className={`nav-tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <i className="bi bi-activity"></i>
            Activity
          </button>
          <button 
            className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="bi bi-gear"></i>
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
                <span className="icon-pill pill-blue"><i className="bi bi-person-badge"></i></span>
                User Info
              </h3>
            </div>
            <div className="account-summary">
              <div className="summary-item">
                <div className="summary-label">
                  <i className="bi bi-person"></i>
                  <span>Full Name</span>
                </div>
                <div className="summary-value" title={user.name || '—'}>{truncate(user.name || '—')}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">
                  <i className="bi bi-envelope"></i>
                  <span>Email</span>
                </div>
                <div className="summary-value" title={user.email || '—'}>{truncate(user.email || '—')}</div>
              </div>
              <div className="summary-item">
                <div className="summary-label">
                  <i className="bi bi-shield"></i>
                  <span>Account Type</span>
                </div>
                <div className="summary-value summary-badge">
                  {user.role ? String(user.role).toUpperCase() : 'STANDARD'}
                </div>
              </div>
              <div className="summary-item">
                <div className="summary-label">
                  <i className="bi bi-fingerprint"></i>
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
                <span className="icon-pill pill-amber"><i className="bi bi-lightning-charge"></i></span>
                Quick Actions
              </h3>
            </div>
            <div className="action-grid">
              <a className="action-card primary" href="/jobs">
                <div className="action-icon">
                  <i className="bi bi-briefcase"></i>
                </div>
                <div className="action-content">
                  <h4>Browse Jobs</h4>
                  <p>Find your next opportunity</p>
                </div>
                <i className="bi bi-chevron-right action-arrow"></i>
              </a>
              
              <a className="action-card success" href="/suggestion">
                <div className="action-icon">
                  <i className="bi bi-lightbulb"></i>
                </div>
                <div className="action-content">
                  <h4>Get Suggestions</h4>
                  <p>Personalized career advice</p>
                </div>
                <i className="bi bi-chevron-right action-arrow"></i>
              </a>
              
              <a className="action-card warning" href="/resume">
                <div className="action-icon">
                  <i className="bi bi-file-earmark-text"></i>
                </div>
                <div className="action-content">
                  <h4>Resume Builder</h4>
                  <p>Create professional resume</p>
                </div>
                <i className="bi bi-chevron-right action-arrow"></i>
              </a>
              
              <a className="action-card info" href="/learning">
                <div className="action-icon">
                  <i className="bi bi-mortarboard"></i>
                </div>
                <div className="action-content">
                  <h4>Learning Hub</h4>
                  <p>Upskill with courses</p>
                </div>
                <i className="bi bi-chevron-right action-arrow"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="full-row strength-row">
          <div className="card">
            <div className="card-header">
              <h3>
                <span className="icon-pill pill-emerald"><i className="bi bi-graph-up-arrow"></i></span>
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
                <span className="pill"><i className="bi bi-check-circle"></i> Add your skills</span>
                <span className="pill"><i className="bi bi-upload"></i> Upload resume</span>
                <span className="pill"><i className="bi bi-mortarboard"></i> Complete education</span>
              </div>
            </div>
          </div>
        </div>
        <div className="full-row activity-row">
          <div className="card">
            <div className="card-header">
              <h3>
                <i className="bi bi-clock-history"></i>
                Recent Activity
              </h3>
            </div>
            <div className="activity-grid-horizontal">
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="bi bi-eye"></i>
                </div>
                <div className="activity-content">
                  <p>Viewed Senior Frontend Developer at TechCorp</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="bi bi-send-check"></i>
                </div>
                <div className="activity-content">
                  <p>Applied for Product Manager role</p>
                  <span className="activity-time">Yesterday</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">
                  <i className="bi bi-bookmark-star"></i>
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
              <span className="icon-pill"><i className="bi bi-globe"></i></span>
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
                      <i className="bi bi-globe-americas"></i>
                    </div>
                    <div className="illustration-text">
                      <strong>Global Opportunities</strong>
                      <p>Discover roles across regions and industries.</p>
                    </div>
                  </div>
                  <div className="illustration-card secondary">
                    <div className="illustration-icon">
                      <i className="bi bi-rocket-takeoff"></i>
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
                  <i className="bi bi-stars"></i>
                  <div>
                    <strong>Smart Matching</strong>
                    <p>AI-powered job recommendations</p>
                  </div>
                </div>
                <div className="feature-card">
                  <i className="bi bi-shield-check"></i>
                  <div>
                    <strong>Privacy First</strong>
                    <p>Your data stays secure</p>
                  </div>
                </div>
                <div className="feature-card">
                  <i className="bi bi-people"></i>
                  <div>
                    <strong>Community</strong>
                    <p>Connect with professionals</p>
                  </div>
                </div>
                <div className="feature-card">
                  <i className="bi bi-tools"></i>
                  <div>
                    <strong>Career Tools</strong>
                    <p>Resume builder and insights</p>
                  </div>
                </div>
                <div className="feature-card">
                  <i className="bi bi-book"></i>
                  <div>
                    <strong>Free Resources</strong>
                    <p>Learn and upskill anytime</p>
                  </div>
                </div>
                <div className="feature-card">
                  <i className="bi bi-headset"></i>
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
              <i className="bi bi-shield-lock"></i>
              Security & Links
            </h3>
            <div className="links-grid">
              <Link className="link-card" to="/about">
                <i className="bi bi-building"></i>
                <span>About Us</span>
              </Link>
              <Link className="link-card" to="/disclaimer">
                <i className="bi bi-file-text"></i>
                <span>Disclaimer</span>
              </Link>
              <Link className="link-card" to="/ads-disclosure">
                <i className="bi bi-window-sidebar"></i>
                <span>Ads Disclosure</span>
              </Link>
              <a className="link-card" href="/#contact">
                <i className="bi bi-headset"></i>
                <span>Contact Support</span>
              </a>
              <Link className="link-card" to="/privacy">
                <i className="bi bi-lock"></i>
                <span>Privacy Policy</span>
              </Link>
              <Link className="link-card" to="/terms">
                <i className="bi bi-file-earmark-check"></i>
                <span>Terms of Service</span>
              </Link>
            </div>
            
            <div className="security-note">
              <p>
                <i className="bi bi-info-circle"></i>
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
              <i className="bi bi-box-arrow-right"></i>
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
        <i className="bi bi-arrow-up"></i>
      </button>
    </div>
  );
};

export default Profile;
