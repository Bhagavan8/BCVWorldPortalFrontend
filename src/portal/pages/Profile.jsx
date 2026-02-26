import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BiAward, BiBoltCircle, BiBook, BiBookmark, BiBriefcase, BiBuilding, BiBulb, BiChart, BiCheckCircle, BiCheckShield, BiChevronRight, BiChevronUp, BiCog, BiEnvelope, BiFile, BiFingerprint, BiGlobe, BiGroup, BiHeadphone, BiHome, BiInfoCircle, BiLock, BiLogIn, BiLogOut, BiMap, BiPulse, BiRocket, BiSend, BiShield, BiShow, BiSidebar, BiSolidEnvelope, BiSolidGraduation, BiSolidUserBadge, BiStar, BiTime, BiTrendingUp, BiUpload, BiUser, BiUserCircle, BiUserPlus, BiWorld, BiWrench 
} from 'react-icons/bi';

import SEO from '../components/SEO';
import { API_BASE_URL } from '../../utils/config';
import '../assets/css/Profile.css';

const MultiSelectDropdown = ({ options, selected, onChange, placeholder = 'Select items', searchPlaceholder = 'Search', size = 6 }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = React.useRef(null);
  React.useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  const all = Array.from(new Set(options || [])).sort((a, b) => a.localeCompare(b));
  const filtered = query ? all.filter(o => o.toLowerCase().includes(query.toLowerCase())) : all;
  const toggle = (val) => {
    const has = selected.includes(val);
    if (has) onChange(selected.filter(v => v !== val));
    else onChange([...selected, val]);
  };
  const clearAll = () => onChange([]);
  const selectAll = () => onChange(filtered);
  return (
    <div className="ms-root" ref={ref}>
      <button type="button" className="ms-control form-input" onClick={() => setOpen(v => !v)}>
        {selected.length ? `${selected.length} selected` : placeholder}
        <span className="ms-caret">▾</span>
      </button>
      {open && (
        <div className="ms-panel">
          <div className="ms-search">
            <input className="form-input" placeholder={searchPlaceholder} value={query} onChange={e => setQuery(e.target.value)} />
          </div>
          <div className="ms-actions">
            <button className="btn-secondary" onClick={selectAll}>Select all</button>
            <button className="btn-secondary" onClick={clearAll}>Clear</button>
          </div>
          <div className="ms-list" style={{ maxHeight: 40 * size, overflowY: 'auto' }}>
            {filtered.map(opt => (
              <label key={opt} className="ms-item">
                <input
                  type="checkbox"
                  className="ms-checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggle(opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
            {!filtered.length && <div className="ms-empty">No results</div>}
          </div>
        </div>
      )}
    </div>
  );
};

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
  const [stats, setStats] = useState(() => {
    const u = user || {};
    const baseStrength =
      typeof u.profileStrength === 'number'
        ? u.profileStrength
        : 0;
    return {
      jobsApplied:
        typeof u.jobsApplied === 'number'
          ? u.jobsApplied
          : 0,
      savedJobs:
        typeof u.savedJobs === 'number'
          ? u.savedJobs
          : 0,
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
  const userId = user?.id || user?.userId || user?.data?.id || user?.user?.id;
  const [experienceYears, setExperienceYears] = useState(0);
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [newEducation, setNewEducation] = useState({ degree: '', stream: '', institution: '', yearOfPassing: '' });
  const [degreesSelected, setDegreesSelected] = useState([]);
  const [experienceLabel, setExperienceLabel] = useState('');
  const [toast, setToast] = useState({ show: false, text: '', kind: 'success' });
  const SKILL_OPTIONS = Array.from(new Set([
    'Accounting','Adaptability','Agile','AI Ethics','AI/ML','Algorithms','Android','Angular','Ansible','Apache','API Design','API Testing','ASP.NET','Automation','AWS','Azure',
    'B2B Sales','B2C Sales','Babel','Backbone.js','Bash','Big Data','Blockchain','Bootstrap','Business Analysis','Business Development','Business Intelligence','Business Strategy',
    'C','C#','.NET','C++','CAD','Canva','Capacity Planning','CI/CD','ClickHouse','Cloud Architecture','Cloud FinOps','Cocoa','Communication','Conflict Resolution','Content Writing','Copywriting','Couchbase','CouchDB','Creative Thinking','Critical Thinking','CRM','CSS','Cucumber','Customer Service','Cyber Security',
    'Data Analysis','Data Engineering','Data Mining','Data Modeling','Data Pipelines','Data Structures','Database Design','DAX','DB2','Deep Learning','Design Patterns','DevOps','Django','Distributed Systems','Docker','Document Writing',
    'E2E Testing','Elastic Stack','Elasticsearch','Electron','Elixir','Embedded Systems','Emotional Intelligence','English','Enterprise Sales','ETL','Excel','Express',
    'Figma','Firebase','Flask','Flutter',
    'Git','GitHub','GitLab','Go','Golang','Google Ads','GCP','Gradle','GraphQL','Growth Marketing',
    'Hibernate','Hadoop','HTML','HTTP','HubSpot',
    'iOS','Illustrator','Information Architecture','Information Security','InfluxDB',
    'Java','Java EE','JavaFX','JavaScript','Jenkins','Jest','Jira',
    'Kafka','Kanban','Keras','Kotlin','Kubernetes',
    'Laravel','Leadership','Lightroom','Linux','Load Testing','Logic Pro',
    'Machine Learning','Magento','MariaDB','Marketing Automation','Matlab','Mentoring','Metabase','Micro Frontends','Microservices','MongoDB','Motivation','MSSQL','MySQL',
    'Natural Language Processing','Negotiation','Next.js','Nginx','Node.js','NoSQL','NumPy',
    'Objective-C','Observability','OpenCV','OpenShift','OpenStack','Oracle','Optimization',
    'Pandas','Penetration Testing','Performance Testing','Photoshop','PHP','PL/SQL','PostgreSQL','Power Apps','Power Automate','Power BI','PowerPoint','Product Design','Product Management','Program Management','Project Management','Prototyping','Public Speaking','Puppet','PySpark','Python','PyTorch',
    'Quality Assurance','QuickSight',
    'R','R&D','React','React Native','Redis','Redux','Requirements Analysis','Research','REST APIs','Responsive Design','Risk Management','Ruby','Ruby on Rails','Rust',
    'Salesforce','Scala','Scrum','Search Engine Marketing','Search Engine Optimization','Security Architecture','Selenium','ServiceNow','Shell Scripting','Sketch','Snowflake','Solidity','Solr','Spark','Spline','Spring','Spring Boot','SQL','SQLite','Stakeholder Management','Storybook','Supply Chain','Swift','SwiftUI','System Administration','System Design',
    'Tableau','Talend','Team Building','Technical Writing','TensorFlow','Terraform','Testing','Time Management','Tomcat','TypeScript',
    'UI Design','UI Testing','UIKit','UML','Unity','Unix','Usability Testing','User Research','UX Design',
    'Video Editing','Virtualization','Visualization',
    'Vue','Vite',
    'Web Accessibility','Web Analytics','Web Components','Web Security','Webpack','WordPress','Writing',
    'XD',
    'Zabbix','Zeplin',
    // Added per request
    'Software Development',
    'Object Oriented Programming (OOP)',
    'Problem Solving',
    'Debugging',
    'Software Testing',
    'SDLC',
    'System Design Basics',
    'Cloud Computing Basics',
    'Programming Fundamentals',
    'Analytical Skills',
    'Communication Skills',
    'Team Collaboration',
    'Application Development'
  ]));
  const DEGREE_OPTIONS = [
    'B.Tech/BE','B.Sc','BCA','BCS','Diploma','B.Com','BA',
    'M.Tech/ME','M.Sc','MCA','MBA','M.Com','PhD'
  ];
  const STREAM_OPTIONS = [
    'Computer Science','Information Technology','Electronics','Electrical','Electronics & Communication',
    'Mechanical','Civil','Instrumentation','Information Systems','Data Science','AI & ML','Cyber Security','Software Engineering'
  ];
  const YEAR_OPTIONS = (() => {
    const cur = new Date().getFullYear();
    const arr = [];
    for (let y = cur + 1; y >= 1980; y--) arr.push(String(y));
    return arr;
  })();
  const EXPERIENCE_OPTIONS = [
    'Fresher','0-1 Years','0-2 Years','0-3 Years','0-4 Years','0-5 Years',
    '1-2 Years','1-3 Years','1-4 Years','1-5 Years','2-3 Years','2-4 Years','2-5 Years',
    '3-5 Years','5-7 Years','7-10 Years','10+ Years'
  ];
  const labelFromYears = (n) => {
    const y = Number(n) || 0;
    if (y <= 0) return 'Fresher';
    if (y === 1) return '1-2 Years';
    if (y === 2) return '2-3 Years';
    if (y === 3 || y === 4) return '3-5 Years';
    if (y === 5 || y === 6) return '5-7 Years';
    if (y >= 7 && y < 10) return '7-10 Years';
    return '10+ Years';
  };
  const fetchProfile = React.useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(String(userId))}/profile`);
      if (res.ok) {
        const data = await res.json();
        const yrs = Number(data?.experienceYears) || 0;
        setExperienceYears(yrs);
        setExperienceLabel(labelFromYears(yrs));
        setSkills(Array.isArray(data?.skills) ? data.skills : []);
        setEducation(Array.isArray(data?.education) ? data.education : []);
        const serverStrength = typeof data?.profileStrength === 'number' ? data.profileStrength : null;
        if (serverStrength !== null) {
          setStats(prev => ({ ...prev, profileStrength: Math.max(0, Math.min(100, Math.round(serverStrength))) }));
        } else {
          // compute locally if backend doesn't provide
          const sCount = Array.isArray(data?.skills) ? data.skills.length : 0;
          const eCount = Array.isArray(data?.education) ? data.education.length : 0;
          const computed = computeProfileStrength(yrs, sCount, eCount);
          setStats(prev => ({ ...prev, profileStrength: computed }));
        }
      }
    } catch {}
  }, [userId]);
  React.useEffect(() => { fetchProfile(); }, [fetchProfile]);
  React.useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(String(userId))}/applications/count`);
        if (res.ok) {
          const data = await res.json();
          const count = Number(data?.count) || 0;
          setStats(prev => ({ ...prev, jobsApplied: count }));
        }
      } catch {}
    })();
  }, [userId]);

  const computeProfileStrength = (yrs, skillsCount, educationCount) => {
    let score = 0;
    // Experience: up to 30 pts
    if (yrs <= 0) score += 10;           // Fresher gets some credit
    else if (yrs <= 1) score += 18;
    else if (yrs <= 3) score += 24;
    else score += 30;
    // Skills: up to 40 pts
    if (skillsCount >= 1) score += 10;
    if (skillsCount >= 3) score += 20;
    if (skillsCount >= 5) score += 30;
    if (skillsCount >= 8) score += 40;
    // Education: up to 20 pts
    if (educationCount >= 1) score += 15;
    if (educationCount >= 2) score += 20;
    // Misc baseline up to 10 pts for being logged-in and basic details
    score += 10;
    if (score > 100) score = 100;
    return Math.round(score);
  };

  React.useEffect(() => {
    const computed = computeProfileStrength(experienceYears, skills.length, education.length);
    setStats(prev => ({ ...prev, profileStrength: computed }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experienceYears, skills, education]);
  const addSkillsBulk = () => {
    if (!selectedSkills || selectedSkills.length === 0) return;
    setSkills(prev => {
      const set = new Set(prev);
      selectedSkills.forEach(s => set.add(s));
      return Array.from(set);
    });
    setSelectedSkills([]);
  };
  const removeSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };
  const addEducation = () => {
    const base = newEducation;
    const degrees = degreesSelected.length ? degreesSelected : (base.degree ? [base.degree] : []);
    if (!degrees.length) return;
    setEducation(prev => {
      const updated = [...prev];
      degrees.forEach(d => {
        updated.push({ degree: d, stream: base.stream, institution: base.stream, yearOfPassing: base.yearOfPassing });
      });
      return updated;
    });
    setNewEducation({ degree: '', stream: '', institution: '', yearOfPassing: '' });
    setDegreesSelected([]);
  };
  const removeEducation = (index) => {
    setEducation(prev => prev.filter((_, i) => i !== index));
  };
  const yearsFromLabel = (label) => {
    if (!label) return Number(experienceYears) || 0;
    if (label === 'Fresher') return 0;
    if (label.includes('+')) return parseInt(label, 10) || 0;
    const m = label.match(/^(\d+)-/);
    return m ? parseInt(m[1], 10) : (Number(experienceYears) || 0);
  };
  const saveProfile = async () => {
    if (!userId) return;
    let token = user?.token || user?.access_token || user?.data?.token || user?.user?.token;
    if (typeof token === 'string' && token.startsWith('Bearer ')) token = token.replace('Bearer ', '');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const expYrs = yearsFromLabel(experienceLabel);
    const payload = { experienceYears: expYrs, experienceLabel, skills, education };
    try {
      setToast({ show: true, text: 'Saving…', kind: 'success' });
      const res = await fetch(`${API_BASE_URL}/api/users/${encodeURIComponent(String(userId))}/profile`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setToast({ show: true, text: 'Profile saved successfully', kind: 'success' });
        setExperienceYears(expYrs);
        await fetchProfile();
      } else {
        setToast({ show: true, text: 'Failed to save profile', kind: 'error' });
      }
    } catch {
      setToast({ show: true, text: 'Network error while saving', kind: 'error' });
    }
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
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
              
              <a className="action-card warning" href="https://www.overleaf.com/" target="_blank" rel="noopener noreferrer">
                <div className="action-icon">
                  <BiFile className="bi" />
                </div>
                <div className="action-content">
                  <h4>Resume Builder</h4>
                  <p>Create professional resume</p>
                </div>
                <BiChevronRight className="bi action-arrow" />
              </a>
              
              <a className="action-card info" href="https://bcvworld.com/java-learning" target="_blank" rel="noopener noreferrer">
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
        
        <div className="profile-grid">
          <div className="full-row">
            <div className="card">
              <div className="card-header">
                <h3>
                  <span className="icon-pill pill-blue"><BiSolidGraduation className="bi" /></span>
                  Edit Profile
                </h3>
              </div>
              <div className="form-vertical">
                <label className="form-label">Experience</label>
                <select
                  className="form-input"
                  value={experienceLabel}
                  onChange={e => {
                    setExperienceLabel(e.target.value);
                    setExperienceYears(yearsFromLabel(e.target.value));
                  }}
                >
                  <option value="">Select Experience</option>
                  {EXPERIENCE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="divider"></div>
                <label className="form-label">Add Skill</label>
                <MultiSelectDropdown
                  options={SKILL_OPTIONS}
                  selected={selectedSkills}
                  onChange={setSelectedSkills}
                  placeholder="Select skills"
                  searchPlaceholder="Search skills"
                  size={7}
                />
                <div className="input-row"><button className="btn-primary" onClick={addSkillsBulk}>Add</button></div>
                <div className="chip-list">
                  {skills.map((s, i) => (
                    <span key={`${s}-${i}`} className="chip">
                      {s}
                      <button className="chip-remove" onClick={() => removeSkill(i)}>×</button>
                    </span>
                  ))}
                </div>
                <div className="divider"></div>
                <label className="form-label">Education Level</label>
                <MultiSelectDropdown
                  options={DEGREE_OPTIONS}
                  selected={degreesSelected}
                  onChange={setDegreesSelected}
                  placeholder="Select education"
                  searchPlaceholder="Search education"
                  size={6}
                />
                <select
                  className="form-input"
                  value={newEducation.stream}
                  onChange={e => setNewEducation({ ...newEducation, stream: e.target.value })}
                >
                  <option value="">Select stream</option>
                  {STREAM_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                
                <select
                  className="form-input"
                  value={newEducation.yearOfPassing}
                  onChange={e => setNewEducation({ ...newEducation, yearOfPassing: e.target.value })}
                >
                  <option value="">Year of Passing</option>
                  {YEAR_OPTIONS.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <button className="btn-secondary" onClick={addEducation}>Add Education</button>
                <ul className="list-plain">
                  {education.map((edu, i) => (
                    <li key={`edu-${i}`} className="list-item-row">
                      <span>
                        {edu.degree}
                        {(edu.stream || edu.institution) ? ` — ${edu.stream || edu.institution}` : ''}
                        {edu.yearOfPassing ? ` — ${edu.yearOfPassing}` : ''}
                      </span>
                      <button className="link-danger" onClick={() => removeEducation(i)}>Remove</button>
                    </li>
                  ))}
                </ul>
                <div className="actions-row">
                  <button className="btn-primary w-full" onClick={saveProfile}>Save Profile</button>
                </div>
              </div>
            </div>
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
              <Link className="link-card" to="/terms">
                <BiFile className="bi" />
                <span>Terms of Service</span>
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

      {toast.show && (
        <div className={`toast ${toast.kind === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toast.text}
        </div>
      )}

      {/* Floating Action Button */}
      <button className="fab" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <BiChevronUp className="bi" />
      </button>
    </div>
  );
};

export default Profile;
