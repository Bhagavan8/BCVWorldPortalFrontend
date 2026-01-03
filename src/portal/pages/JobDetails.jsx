 import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import './JobDetails.css';

export default function JobDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('job_id') || searchParams.get('id');
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
  const [company, setCompany] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [prevJob, setPrevJob] = useState(null);
  const [nextJob, setNextJob] = useState(null);
  const [postingComment, setPostingComment] = useState(false);
  const [user, setUser] = useState(null);
  const hasViewed = useRef(false);

  useEffect(() => {
    // Reset view tracking when id changes
    hasViewed.current = false;
  }, [id]);

  useEffect(() => {
    if (id && !hasViewed.current) {
      hasViewed.current = true;
      const trackView = async () => {
        try {
          const userStr = localStorage.getItem('user');
          let u = null;
          if (userStr) {
            try { u = JSON.parse(userStr); } catch (e) {}
          }
          
          const url = `${API_BASE}/api/jobs/${id}/view${u && u.id ? `?userId=${u.id}` : ''}`;
          await fetch(url, { method: 'POST' });
        } catch (error) {
          console.error('Error tracking view:', error);
        }
      };
      trackView();
    }
  }, [id, API_BASE]);

  useEffect(() => {
    // Load user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error('Error parsing user', e);
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        let url = `${API_BASE}/api/jobs/${id}`;
        // Re-add user check logic here properly since we replaced it
        const userStr = localStorage.getItem('user');
        if (userStr) {
          try {
            const u = JSON.parse(userStr);
            if (u.id) {
              url += `?userId=${u.id}`;
            }
          } catch(e) {
            console.error('Error parsing user for view tracking', e);
          }
        }

        const response = await fetch(url);
        if (response.ok) {
          const rawData = await response.json();
          // Normalize data to match component expectations (same as Jobs.jsx)
          const data = {
            ...rawData,
            jobTitle: rawData.title || rawData.jobTitle,
            companyName: rawData.company || rawData.companyName,
            locations: rawData.location ? rawData.location.split(',').map(s => s.trim()) : (rawData.locations || []),
            jobCategory: rawData.category || rawData.jobCategory,
            experienceRequired: rawData.experience || rawData.experienceRequired,
            referralCode: rawData.jobCode || rawData.referralCode,
            companyLogoUrl: rawData.logoUrl || rawData.companyLogoUrl,
            postedDate: rawData.postedDate || new Date().toISOString().split('T')[0], // Fallback if missing
            viewCount: rawData.viewCount || 0,
            likeCount: rawData.likeCount || 0,
            applicationMethod: rawData.applicationMethod,
            applicationLink: rawData.applicationLink,
            applicationEmail: rawData.applicationEmail
          };
          setJob(data);
          setLikeCount(data.likeCount);
          setIsLiked(data.isLiked || false);
          setIsSaved(data.isSaved || false);
        } else {
          console.error('Job not found');
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, API_BASE]);

  // Fetch Comments and Neighbor Jobs
  useEffect(() => {
    if (id) {
      // Fetch Comments
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/api/jobs/${id}/comments`);
          if (res.ok) {
            const data = await res.json();
            setComments(data);
          }
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      })();

      // Fetch Previous Job
      const fetchNeighbors = async () => {
        const currentId = Number(id);
        
        // 1. Fetch Previous (id - 1)
        if (currentId > 1) {
          try {
            const res = await fetch(`${API_BASE}/api/jobs/${currentId - 1}`);
            if (res.ok) {
              const data = await res.json();
              setPrevJob({
                id: currentId - 1,
                jobTitle: data.title || data.jobTitle,
                companyName: data.company || data.companyName,
                companyLogoUrl: data.logoUrl || data.companyLogoUrl
              });
            } else {
              setPrevJob(null);
            }
          } catch (e) {
            setPrevJob(null);
          }
        } else {
          setPrevJob(null);
        }

        // 2. Fetch Next (id + 1)
        let nextData = null;
        let nextId = currentId + 1;
        try {
          const res = await fetch(`${API_BASE}/api/jobs/${nextId}`);
          if (res.ok) {
            nextData = await res.json();
          }
        } catch (e) {}

        // 3. Fallback: If Next is missing, try Previous-Previous (id - 2)
        if (!nextData && currentId > 2) {
          try {
            nextId = currentId - 2; // Use this slot for the previous-previous job
            const res = await fetch(`${API_BASE}/api/jobs/${nextId}`);
            if (res.ok) {
              nextData = await res.json();
            }
          } catch (e) {}
        }

        if (nextData) {
          setNextJob({
            id: nextId,
            jobTitle: nextData.title || nextData.jobTitle,
            companyName: nextData.company || nextData.companyName,
            companyLogoUrl: nextData.logoUrl || nextData.companyLogoUrl
          });
        } else {
          setNextJob(null);
        }
      };

      fetchNeighbors();
    }
  }, [id, API_BASE]);

  const handlePostComment = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('Please login to comment');
      return;
    }

    let userObj;
    try {
        userObj = JSON.parse(userStr);
    } catch (e) {
        toast.error('Invalid user session');
        return;
    }

    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    const actualUser = userObj.data || userObj.user || userObj;
    const userId = actualUser.id || actualUser.userId || actualUser.uid;
    const userName = actualUser.name || actualUser.username || (actualUser.email ? actualUser.email.split('@')[0] : 'User');

    if (!userId) {
      console.error('User ID missing in object:', userObj);
      const keys = actualUser ? Object.keys(actualUser).join(', ') : 'null';
      toast.error(`User ID missing. Found keys: ${keys}. Please logout and login again.`);
      return;
    }

    setPostingComment(true);
    try {
      const response = await fetch(`${API_BASE}/api/jobs/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          user_id: userId,
          userName: userName,
          content: commentText
        })
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setCommentText('');
        toast.success('Comment posted successfully!');
      } else {
        const err = await response.text();
        console.error('Backend error:', err);
        toast.error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Something went wrong');
    } finally {
      setPostingComment(false);
    }
  };

  const handleLike = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('Please login to like this job');
      return;
    }

    try {
      const u = JSON.parse(userStr);
      const actualUser = u.data || u.user || u;
      const userId = actualUser.id || actualUser.userId || actualUser.uid;

      if (!userId) {
        toast.error('Invalid user session');
        return;
      }

      const response = await fetch(`${API_BASE}/api/jobs/${id}/like?userId=${userId}`, {
        method: 'POST'
      });

      if (response.ok) {
        const updatedJob = await response.json();
        setLikeCount(updatedJob.likeCount || 0);
        setIsLiked(updatedJob.isLiked);
        toast.success(updatedJob.isLiked ? 'Job liked!' : 'Job unliked');
      } else {
        toast.error('Failed to update like status');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Something went wrong');
    }
  };

  const handleSaveJob = async () => {
    // Attempt to bookmark the page
    const title = document.title;
    const url = window.location.href;

    if (window.sidebar && window.sidebar.addPanel) { // Firefox <23
      window.sidebar.addPanel(title, url, "");
    } else if (window.external && ('AddFavorite' in window.external)) { // IE
      window.external.AddFavorite(url, title);
    } else if (window.opera && window.print) { // Opera
      const elem = document.createElement('a');
      elem.setAttribute('href', url);
      elem.setAttribute('title', title);
      elem.setAttribute('rel', 'sidebar');
      elem.click();
    } else { 
      // Other browsers (Chrome, Safari, Firefox 23+, Mobile) - show instructions
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      if (/Mobi|Android/i.test(navigator.userAgent)) {
         toast((t) => (
          <span>
            To bookmark this job, tap the <b>Share</b> icon or <b>Menu</b> button and select <b>Add to Home Screen</b> or <b>Add to Bookmarks</b>.
          </span>
        ), { duration: 5000, icon: '🔖' });
      } else {
        toast.success(`Press ${isMac ? 'Cmd+D' : 'Ctrl+D'} to bookmark this job`, {
          icon: '🔖',
          duration: 4000
        });
      }
    }
    
    // Also toggle local state just for visual feedback
    setIsSaved(!isSaved);
  };


  useEffect(() => {
    (async () => {
      try {
        if (job && job.useExistingCompany && job.companyId && (!job.companyName || !job.companyLogoUrl)) {
          const r = await fetch(`${API_BASE}/api/companies/${job.companyId}`);
          if (r.ok) {
            const c = await r.json();
            setCompany(c);
          }
        }
      } catch (e) {
        console.error('Error fetching company', e)
      }
    })();
  }, [job, API_BASE]);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const scrolled = total > 0 ? (doc.scrollTop / total) * 100 : 0;
      const bar = document.getElementById('readingProgress');
      if (bar) bar.style.width = `${scrolled}%`;
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!loading && !job) {
      const timer = setTimeout(() => {
        navigate('/jobs');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loading, job, navigate]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this job: ${job?.jobTitle} at ${(job?.companyName || company?.name || '')}`;
    
    let shareUrl = '';
    switch(platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        return;
      default:
        return;
    }
    window.open(shareUrl, '_blank');
  };

  const getApplyHref = (val) => {
    if (!val) return '#';
    const s = String(val).trim();
    if (/^https?:\/\//i.test(s)) return s;
    if (s.includes('@')) return `mailto:${s}`;
    if (s.startsWith('www.')) return `https://${s}`;
    return s;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="not-found-container">
        <div className="not-found-content">
          <h2>Job Not Found</h2>
          <p>The job you are looking for does not exist or has been removed.</p>
          <p className="text-muted small mb-4">Redirecting to jobs page in 5 seconds...</p>
          <Link to="/jobs" className="btn-primary">
            Browse All Jobs Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
        title={job ? job.jobTitle : "Job Details"} 
        description={job ? `Apply for ${job.jobTitle} at ${job.companyName || 'BCVWORLD'}. View details, salary, and eligibility.` : "Job Details"}
        keywords={job ? `${job.jobTitle}, ${job.companyName}, ${job.jobCategory}, jobs in ${job.locations ? job.locations.join(' ') : ''}, hiring, vacancy` : "jobs, hiring, vacancy"}
        image={job ? (job.companyLogoUrl || undefined) : undefined}
      />
      {/* Reading Progress Bar */}
      <div id="readingProgress" className="reading-progress-bar"></div>

      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <i className="bi bi-list"></i>
        </button>
        <div className="mobile-logo">
          <Link to="/">BCV World</Link>
        </div>
        <button className="mobile-share-btn" onClick={() => handleShare('copy')}>
          <i className="bi bi-share"></i>
        </button>
      </div>

      {/* Mobile Sidebar & Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} style={{ display: sidebarOpen ? 'block' : 'none' }} onClick={() => setSidebarOpen(false)}></div>
      
      <div className={`mobile-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
          <i className="bi bi-x-lg"></i>
        </button>
        
        <div className="sidebar-section">
          <h4>Navigation</h4>
          <Link to="/" className="info-item" onClick={() => setSidebarOpen(false)}>
            <span><i className="bi bi-house-door"></i> Home</span>
            <i className="bi bi-chevron-right"></i>
          </Link>
          <Link to="/jobs" className="info-item" onClick={() => setSidebarOpen(false)}>
            <span><i className="bi bi-briefcase"></i> Browse Jobs</span>
            <i className="bi bi-chevron-right"></i>
          </Link>
          <Link to="/calculators" className="info-item" onClick={() => setSidebarOpen(false)}>
            <span><i className="bi bi-calculator"></i> Calculators</span>
            <i className="bi bi-chevron-right"></i>
          </Link>
        </div>

        <div className="sidebar-section">
          <h4>Account</h4>
          {user ? (
            <>
              <div className="info-item">
                <span><i className="bi bi-person-circle"></i> {user.name}</span>
              </div>
              <Link to="/profile" className="info-item" onClick={() => setSidebarOpen(false)}>
                <span><i className="bi bi-person-badge"></i> My Profile</span>
                <i className="bi bi-chevron-right"></i>
              </Link>
              <button 
                className="info-item" 
                style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                onClick={() => {
                  localStorage.removeItem('user');
                  setUser(null);
                  setIsLiked(false);
                  setSidebarOpen(false);
                  toast.success('Logged out successfully');
                }}
              >
                <span><i className="bi bi-box-arrow-right"></i> Logout</span>
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="info-item" onClick={() => setSidebarOpen(false)}>
                <span><i className="bi bi-box-arrow-in-right"></i> Login</span>
                <i className="bi bi-chevron-right"></i>
              </Link>
              <Link to="/register" className="info-item" onClick={() => setSidebarOpen(false)}>
                <span><i className="bi bi-person-plus"></i> Register</span>
                <i className="bi bi-chevron-right"></i>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Main Container - Full Width */}
      <div className="job-details-page page-wrapper">
        <div className="ad-column ad-left">
          <div className="ad-sidebar">
            <div className="ad-content">Left Ad</div>
          </div>
        </div>
        <div className="ad-column ad-right">
          <div className="ad-sidebar">
            <div className="ad-content">Right Ad</div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="main-content-area">
          
          {/* Back Navigation */}
          <div className="back-navigation-bar">
            <Link to="/jobs" className="back-btn">
              <i className="bi bi-arrow-left"></i> Back to Jobs
            </Link>
            <div className="breadcrumb-nav">
              <Link to="/">Home</Link> › 
              <Link to="/jobs">Jobs</Link> › 
              <span>{job.jobCategory || 'Jobs'}</span> › 
              <span className="current">{(job.jobTitle || '').substring(0, 25)}...</span>
            </div>
          </div>

          {/* Job Header */}
              <div className="job-header-section">
                <div className="job-header-inner">
                  <div className="company-brand">
                    <div className="company-logo">
                      <img 
                        src={job.companyLogoUrl || company?.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName || company?.name || 'Company')}&background=random`} 
                        alt={job.companyName || company?.name || ''}
                      />
                    </div>
                    <div className="company-details">
                      <h1 className="job-title">{job.jobTitle}</h1>
                      <h2 className="company-name">{job.companyName || company?.name}</h2>
                    </div>
                  </div>
                  
                  <div className="job-meta-section">
                    <div className="meta-grid">
                      <div className="meta-item">
                        <i className="bi bi-geo-alt"></i>
                        <div>
                          <span className="meta-label">Location</span>
                          <span className="meta-value">{Array.isArray(job.locations) ? job.locations.join(', ') : ''}</span>
                        </div>
                      </div>
                      <div className="meta-item">
                        <i className="bi bi-briefcase"></i>
                        <div>
                          <span className="meta-label">Experience</span>
                          <span className="meta-value">{job.experienceRequired || ''}</span>
                        </div>
                      </div>
                      <div className="meta-item">
                        <i className="bi bi-calendar3"></i>
                        <div>
                          <span className="meta-label">Posted</span>
                          <span className="meta-value">{job.postedDate}</span>
                        </div>
                      </div>
                      <div className="meta-item">
                        <i className="bi bi-eye"></i>
                        <div>
                          <span className="meta-label">Views</span>
                          <span className="meta-value">{job.viewCount !== undefined && job.viewCount !== null ? job.viewCount : 0}</span>
                        </div>
                      </div>
                      <div className="meta-item" onClick={handleLike} style={{ cursor: 'pointer' }}>
                        <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                        <div>
                          <span className="meta-label">Likes</span>
                          <span className="meta-value">{likeCount}</span>
                        </div>
                      </div>
                      {job.salary && (
                        <div className="meta-item">
                          <i className="bi bi-cash"></i>
                          <div>
                            <span className="meta-label">Salary</span>
                            <span className="meta-value salary">{job.salary}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="action-buttons-row">
                      <span className="job-id-display">
                        <i className="bi bi-hash"></i> Ref ID: {job.referralCode || '—'}
                      </span>
                      <div className="action-buttons">
                        <button 
                          className="btn-primary" 
                          onClick={handleSaveJob}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '4px', fontWeight: '500', height: '40px', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
                        >
                          <i className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i> {isSaved ? 'Saved' : 'Save'}
                        </button>
                        
                        <Link to="/suggestion" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontWeight: '500', height: '40px' }}>
                           <i className="bi bi-lightbulb"></i> Suggestion
                         </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

          {/* Content Sections */}
          <div className="content-sections">
            
            {/* Job Description */}
            <section className="content-section">
              <div className="section-title-bar">
                <i className="bi bi-file-text-fill"></i>
                <h3>Job Description</h3>
              </div>
              <div className="section-content" dangerouslySetInnerHTML={{ __html: job.description }} />
            </section>

            

            {/* Required Skills (stacked) */}
            {job.skills && (
              <section className="content-section">
                <div className="section-title-bar">
                  <i className="bi bi-tools"></i>
                  <h3>Required Skills</h3>
                </div>
                <div className="skills-grid">
                  {job.skills.split(',').map((skill, index) => (
                    <span key={index} className="skill-item">{skill.trim()}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Qualifications (stacked below skills) */}
            {job.qualifications && (
              <section className="content-section">
                <div className="section-title-bar">
                  <i className="bi bi-check-circle-fill"></i>
                  <h3>Qualifications</h3>
                </div>
                <div className="section-content" dangerouslySetInnerHTML={{ __html: job.qualifications }} />
              </section>
            )}

            {/* Additional Details */}
            {job.details && (
              <section className="content-section">
                <div className="section-title-bar">
                  <i className="bi bi-info-circle-fill"></i>
                  <h3>Additional Details</h3>
                </div>
                <div className="section-content" dangerouslySetInnerHTML={{ __html: job.details }} />
              </section>
            )}

            {/* Share Section */}
            <section className="content-section share-section">
              <div className="section-title-bar">
                <i className="bi bi-share-fill"></i>
                <h3>Share This Job</h3>
              </div>
              <div className="share-grid">
                <button className="share-button whatsapp" onClick={() => handleShare('whatsapp')}>
                  <i className="bi bi-whatsapp"></i>
                  <span>WhatsApp</span>
                </button>
                <button className="share-button linkedin" onClick={() => handleShare('linkedin')}>
                  <i className="bi bi-linkedin"></i>
                  <span>LinkedIn</span>
                </button>
                <button className="share-button facebook" onClick={() => handleShare('facebook')}>
                  <i className="bi bi-facebook"></i>
                  <span>Facebook</span>
                </button>
                <button className="share-button twitter" onClick={() => handleShare('twitter')}>
                  <i className="bi bi-twitter"></i>
                  <span>Twitter</span>
                </button>
                <button className="share-button telegram" onClick={() => handleShare('telegram')}>
                  <i className="bi bi-telegram"></i>
                  <span>Telegram</span>
                </button>
                <button className="share-button copy" onClick={() => handleShare('copy')}>
                  <i className="bi bi-link-45deg"></i>
                  <span>Copy Link</span>
                </button>
              </div>
            </section>

            {/* Company Info */}
            <section className="content-section company-section">
              <div className="section-title-bar">
                <i className="bi bi-building"></i>
                <h3>About Company</h3>
              </div>
              <div className="company-info-grid">
                <div className="company-logo-large">
                  <img 
                    src={job.companyLogoUrl || company?.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName || company?.name || 'Company')}&background=random&size=120`} 
                    alt={job.companyName || company?.name || ''}
                  />
                </div>
                <div className="company-details">
                  <h4>{job.companyName || company?.name}</h4>
                  <p className="company-description">
                    {job.aboutCompany || company?.about || ''}
                  </p>
                  {(job.companyWebsite || company?.website) && (
                    <a
                      href={job.companyWebsite || company?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline"
                    >
                      View Company Profile
                    </a>
                  )}
                </div>
              </div>
            </section>

            <section className="community-section">
              <h3 className="community-title"><i className="bi bi-people"></i> Join Our Community</h3>
              <div className="community-actions">
                <a href={job.whatsappLink || '#'} target="_blank" rel="noopener noreferrer" className="community-btn btn-whatsapp">
                  <i className="bi bi-whatsapp"></i> Join WhatsApp Group
                </a>
                <a href={job.telegramLink || '#'} target="_blank" rel="noopener noreferrer" className="community-btn btn-telegram">
                  <i className="bi bi-telegram"></i> Join Telegram Channel
                </a>
              </div>
            </section>

            <section className="comments-section">
              <h3 className="comments-title"><i className="bi bi-chat-dots"></i> Comments ({comments.length})</h3>
              
              <div className="comment-input-area">
                {user ? (
                  <>
                    <textarea
                      className="comment-textarea"
                      rows="3"
                      placeholder="Write your comment..."
                      maxLength={500}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="comments-footer">
                      <span className="char-count">{commentText.length}/500</span>
                      <button 
                        className="post-comment-btn" 
                        onClick={handlePostComment}
                        disabled={postingComment || !commentText.trim()}
                      >
                        {postingComment ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="login-prompt">
                    <p>Please login to join the discussion and post comments.</p>
                    <Link to="/login" className="login-btn">
                      Login to Comment
                    </Link>
                  </div>
                )}
              </div>

              <div className="comments-list">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-avatar">
                        {comment.userName ? comment.userName.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="comment-author">{comment.userName || 'User'}</span>
                          <span className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="comment-text">{comment.content}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-comments" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                    <i className="bi bi-chat" style={{ fontSize: '2rem', marginBottom: '12px', display: 'block' }}></i>
                    <p style={{ margin: 0 }}>No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </section>

            <section className="job-link-section">
               {(() => {
                  const method = (job.applicationMethod || '').toLowerCase();
                  const isEmail = method === 'email' || (job.applicationEmail && !job.applicationLink);
                  
                  if (isEmail) {
                    return (
                      <div className="job-link-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                        <span className="job-link-label" style={{ fontWeight: '600', color: '#333' }}>Job Link:</span>
                        <a 
                          href={`mailto:${job.applicationEmail}`}
                          className="email-apply-link"
                          style={{ textDecoration: 'none', color: '#0d6efd', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}
                        >
                          <i className="bi bi-envelope"></i> {job.applicationEmail}
                        </a>
                      </div>
                    );
                  } else {
                    return (
                      <div className="job-link-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                        <span className="job-link-label" style={{ fontWeight: '600', color: '#333' }}>Job Link:</span>
                        <a
                          href={job.applicationLink || getApplyHref(job.applicationLinkOrEmail)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary"
                        >
                          <i className="bi bi-box-arrow-up-right"></i> Click here to Apply Now
                        </a>
                      </div>
                    );
                  }
               })()}
            </section>

            <div className="job-navigation-section">
              <div className="job-navigation-wrapper">
                {prevJob && (
                  <Link 
                    to={`/job?type=private&job_id=${prevJob.id}&slug=${(prevJob.jobTitle||'').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${(prevJob.companyName||'').toLowerCase().replace(/[^a-z0-9]+/g, '-')}&ref=${Math.random().toString(36).substring(7)}&token=${Math.random().toString(36).substring(7)}&src=bcvworld.com`} 
                    className="nav-job-item previous-job"
                  >
                    <div className="nav-arrow-circle"><i className="bi bi-chevron-left"></i></div>
                    <div className="nav-logo-wrapper">
                      {(prevJob.companyLogoUrl) ? (
                        <img src={prevJob.companyLogoUrl} alt={prevJob.companyName || ''} className="nav-logo-img" />
                      ) : (
                        <div className="nav-logo-img"></div>
                      )}
                    </div>
                    <div className="nav-job-details">
                      <span className="nav-direction-label">Previous Opportunity</span>
                      <h4 className="nav-job-title">{prevJob.jobTitle}</h4>
                      <span className="nav-company-name">{prevJob.companyName}</span>
                    </div>
                  </Link>
                )}
                {nextJob && (
                  <Link 
                    to={`/job?type=private&job_id=${nextJob.id}&slug=${(nextJob.jobTitle||'').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${(nextJob.companyName||'').toLowerCase().replace(/[^a-z0-9]+/g, '-')}&ref=${Math.random().toString(36).substring(7)}&token=${Math.random().toString(36).substring(7)}&src=bcvworld.com`} 
                    className="nav-job-item next-job"
                  >
                    <div className="nav-job-details">
                      <span className="nav-direction-label">
                        {nextJob.id > Number(id) ? 'Next Opportunity' : 'Previous Opportunity'}
                      </span>
                      <h4 className="nav-job-title">{nextJob.jobTitle}</h4>
                      <span className="nav-company-name">{nextJob.companyName}</span>
                    </div>
                    <div className="nav-logo-wrapper">
                      {(nextJob.companyLogoUrl) ? (
                        <img src={nextJob.companyLogoUrl} alt={nextJob.companyName || ''} className="nav-logo-img" />
                      ) : (
                        <div className="nav-logo-img"></div>
                      )}
                    </div>
                    <div className="nav-arrow-circle"><i className="bi bi-chevron-right"></i></div>
                  </Link>
                )}
              </div>
            </div>

            

          </div>

          {/* Footer */}
          <footer className="page-footer">
            <p>
              <i className="bi bi-info-circle"></i>
              BCV World connects job seekers with opportunities. Apply with caution and verify company details before proceeding.
            </p>
          </footer>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="mobile-bottom-bar">
        <div className="bottom-bar-content">
          <button className={`bottom-btn save-btn ${isSaved ? 'active' : ''}`} onClick={handleSaveJob}>
            <i className={`bi ${isSaved ? 'bi-bookmark-fill' : 'bi-bookmark'}`}></i>
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
          <button className="bottom-btn share-btn" onClick={() => setSidebarOpen(true)}>
            <i className="bi bi-share"></i>
            <span>Share</span>
          </button>
          <a 
            href={getApplyHref(job.applicationLinkOrEmail)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bottom-btn apply-btn"
          >
            <i className="bi bi-box-arrow-up-right"></i>
            <span>Apply Now</span>
          </a>
        </div>
      </div>
    </>
  );
}
