import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';
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
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';
  const [company, setCompany] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [comments, setComments] = useState([]);
  const [prevJob, setPrevJob] = useState(null);
  const [nextJob, setNextJob] = useState(null);
  const [postingComment, setPostingComment] = useState(false);
  const [user, setUser] = useState(null);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [showLeftAd, setShowLeftAd] = useState(true);
  const [showRightAd, setShowRightAd] = useState(true);
  const [showMobileBottomBar, setShowMobileBottomBar] = useState(false);
  const hasViewed = useRef(false);

  useEffect(() => {
    const src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6284022198338659';
    const exists = Array.from(document.getElementsByTagName('script')).some(s => s.src === src);
    if (!exists) {
      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, []);



  useEffect(() => {
    hasViewed.current = false;
  }, [id]);

  useEffect(() => {
    if (id && !hasViewed.current) {
      hasViewed.current = true;
      const trackView = async () => {
        try {
          const w = window;
          if (!w.__bcvworldViewLoadId) {
            w.__bcvworldViewLoadId =
              (typeof crypto !== 'undefined' && crypto.randomUUID)
                ? crypto.randomUUID()
                : `${Date.now()}_${Math.random().toString(16).slice(2)}`;
          }

          const loadKey = `job_view_load_${id}`;
          const loadId = w.__bcvworldViewLoadId;
          if (sessionStorage.getItem(loadKey) === loadId) return;
          sessionStorage.setItem(loadKey, loadId);

          const userStr = localStorage.getItem('user');
          if (!userStr || userStr === 'undefined') {
            const url = `${API_BASE}/api/jobs/${id}/view`;
            await fetch(url, { method: 'POST' });
            return;
          }

          let parsed;
          try {
            parsed = JSON.parse(userStr);
          } catch {
            const url = `${API_BASE}/api/jobs/${id}/view`;
            await fetch(url, { method: 'POST' });
            return;
          }

          const userId =
            parsed?.id ??
            parsed?.userId ??
            parsed?.uid ??
            parsed?._id ??
            parsed?.user?.id ??
            parsed?.user?.userId ??
            parsed?.user?.uid ??
            parsed?.user?._id ??
            parsed?.data?.id ??
            parsed?.data?.userId ??
            parsed?.data?.uid ??
            parsed?.data?._id;

          if (!userId) {
            const url = `${API_BASE}/api/jobs/${id}/view`;
            await fetch(url, { method: 'POST' });
            return;
          }

          const viewKey = `job_view_${String(userId)}_${id}`;
          if (localStorage.getItem(viewKey)) return;

          localStorage.setItem(viewKey, '1');
          const url = `${API_BASE}/api/jobs/${id}/view?userId=${encodeURIComponent(String(userId))}`;
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

        // Add auth header if token exists
        const userStr = localStorage.getItem('user');
        const headers = {};
        if (userStr) {
          try {
            const u = JSON.parse(userStr);
            let token = u.token || u.data?.token || u.user?.token || u.access_token;
            if (token) {
              if (token.startsWith('Bearer ')) {
                token = token.replace('Bearer ', '');
              }
              headers['Authorization'] = `Bearer ${token}`;
            }
            if (u.id) {
              url += `?userId=${u.id}`;
            }
          } catch (e) {
            console.error('Error parsing user for auth', e);
          }
        }

        const response = await fetch(url, { headers });
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
            educationLevels: Array.isArray(rawData.educationLevels)
              ? rawData.educationLevels
              : typeof rawData.educationLevels === 'string'
                ? rawData.educationLevels.split(',').map(s => s.trim()).filter(Boolean)
                : Array.isArray(rawData.education_level)
                  ? rawData.education_level
                  : typeof rawData.education_level === 'string'
                    ? rawData.education_level.split(',').map(s => s.trim()).filter(Boolean)
                    : Array.isArray(rawData.education)
                      ? rawData.education
                      : typeof rawData.education === 'string'
                        ? rawData.education.split(',').map(s => s.trim()).filter(Boolean)
                        : [],
            referralCode: rawData.jobCode || rawData.referralCode,
            companyLogoUrl: rawData.logoUrl || rawData.companyLogoUrl,
            postedDate: rawData.postedDate || new Date().toISOString().split('T')[0], // Fallback if missing
            viewCount: rawData.viewCount || 0,
            likeCount: rawData.likeCount || 0,
            applicationMethod: rawData.applicationMethod,
            applicationLink: rawData.applicationLink,
            applicationEmail: rawData.applicationEmail,
            walkin_details: rawData.walkin_details || rawData.walkinDetails
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

  useEffect(() => {
    if (job && job.companyName) {
      (async () => {
        try {
          const res = await fetch(`${API_BASE}/api/jobs`);
          if (res.ok) {
            let allJobs = await res.json();
            allJobs = Array.isArray(allJobs) ? allJobs : [];

            // Filter by SAME COMPANY instead of Category
            const filtered = allJobs.filter(j => {
              const cName = j.company || j.companyName;
              const jId = j.id;
              return cName && cName.toLowerCase() === job.companyName.toLowerCase() && String(jId) !== String(job.id);
            });

            const mapped = filtered.slice(0, 3).map(j => ({
              id: j.id,
              jobTitle: j.title || j.jobTitle,
              companyName: j.company || j.companyName,
              locations: j.location ? (typeof j.location === 'string' ? j.location.split(',').map(s => s.trim()) : []) : (j.locations || []),
              companyLogoUrl: j.logoUrl || j.companyLogoUrl,
              postedDate: j.postedDate
            }));
            setRelatedJobs(mapped);
          }
        } catch (e) {
          console.error('Error fetching company jobs', e);
        }
      })();
    }
  }, [job, API_BASE]);

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
        } catch (e) { }

        // 3. Fallback: If Next is missing, try Previous-Previous (id - 2)
        if (!nextData && currentId > 2) {
          try {
            nextId = currentId - 2; // Use this slot for the previous-previous job
            const res = await fetch(`${API_BASE}/api/jobs/${nextId}`);
            if (res.ok) {
              nextData = await res.json();
            }
          } catch (e) { }
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

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const formatDateDDMMMYYYY = (dateString) => {
    if (!dateString) return '';
    let date;

    // Handle YYYY-MM-DD manually to prevent timezone shifts
    if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [y, m, d] = dateString.split('-');
      date = new Date(y, parseInt(m) - 1, d);
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) return dateString;

    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const highlightContent = (htmlContent) => {
    if (!htmlContent) return '';

    const keywords = [
      'fresher', 'freshers', 'graduates', 'postgraduates', 'experience', 'mandatory', 'required', 'preferred', 'responsibilities', 'role', 'salary', 'location',
      'job description', 'key skills', 'qualifications', 'education', 'education branches', 'benefits', 'summary', 'engineer', 'engineering', 'bachelor', 'computer science', 'computer science and engineering', 'computer science engineering',
      'communication skills', 'english communication', 'analytical', 'healthcare', 'compliance', 'security', 'regulatory',
      'voice process', 'voice-based', 'voice', 'customer support', 'customer support process', 'international voice process', 'night shift', 'night shifts',
      'cse', 'ece', 'ec', 'eee', 'cs', 'it', 'information technology', 'information technology engineering',
      'electronics and communication engineering', 'electrical and electronics engineering', 'electronics engineering', 'electrical engineering', 'telecommunication engineering',
      'mechanical engineering', 'civil engineering', 'chemical engineering', 'biomedical engineering', 'aeronautical engineering', 'automobile engineering', 'industrial engineering', 'instrumentation engineering',
      'commerce', 'science', 'arts', 'business administration', 'computer applications',
      'bcom', 'b.com', 'bsc', 'b.sc', 'ba', 'b.a', 'bba', 'bca', 'be', 'b.e', 'btech', 'b.tech', 'b.ed',
      'mcom', 'm.com', 'msc', 'm.sc', 'ma', 'm.a', 'mba', 'mca', 'me', 'm.e', 'mtech', 'm.tech', 'm.ed',
      'phd', 'doctorate',
      'diploma', 'polytechnic', 'ug', 'pg',
      'software testing', 'automation testing', 'manual testing', 'test cases', 'test scenarios', 'qa', 'api',
      'front-end', 'front end', 'back-end', 'back end', 'database', 'unix', 'linux', 'sql', 'ai', 'istqb',
      ...(job?.skills ? job.skills.split(',').map(s => s.trim()) : [])
    ];

    const techStack = [
      'Java', 'Python', 'C++', 'C#', '.NET', 'JavaScript', 'React', 'Angular', 'Vue', 'Node.js', 'Spring Boot', 'AWS', 'Azure', 'Docker',
      'Kubernetes', 'Git', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'HTML', 'CSS', 'TypeScript', 'Go', 'Rust', 'PHP', 'Laravel',
      'Django', 'Flask', 'TensorFlow', 'PyTorch', 'Linux', 'Unix', 'Agile', 'Scrum', 'Jira', 'Junit', 'Selenium', 'Rest API',
      'GraphQL', 'Machine Learning', 'AI', 'Data Science', 'DevOps', 'CI/CD', 'Jenkins'
    ];

    const allKeywords = [...new Set([...keywords, ...techStack])].filter(k => k && k.length > 1);
    allKeywords.sort((a, b) => b.length - a.length);
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let processed = htmlContent;
    const safeReplace = (text, pattern, replacement) => {
      try {
        const regex = new RegExp(`(${pattern})(?![^<]*>)`, 'gi');
        return text.replace(regex, replacement);
      } catch {
        return text;
      }
    };

    const keywordPattern = `\\b(${allKeywords.map(escapeRegExp).join('|')})\\b`;
    processed = safeReplace(processed, keywordPattern, '<b>$1</b>');

    const numberPattern = `(?<![&#\\w])\\b\\d+(\\.\\d+)?\\+?\\b`;
    processed = safeReplace(processed, numberPattern, '<b>$&</b>');

    const linkify = (html) => {
      const parts = html.split(/(<[^>]+>)/g);
      const linked = parts.map(seg => {
        if (seg.startsWith('<')) return seg;
        let s = seg;
        s = s.replace(/(https?:\/\/[^\s<]+)/gi, '<a href="$1" target="_blank" rel="noopener noreferrer" class="inline-link">$1</a>');
        s = s.replace(/\bwww\.[^\s<]+/gi, (m) => `<a href="https://${m}" target="_blank" rel="noopener noreferrer" class="inline-link">${m}</a>`);
        s = s.replace(/(?:^|\s)((?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(?:\/[^\s<]*)?)/g, (match, p1) => {
          return match.replace(p1, `<a href="https://${p1}" target="_blank" rel="noopener noreferrer" class="inline-link">${p1}</a>`);
        });
        return s;
      }).join('');
      return linked;
    };
    processed = linkify(processed);

    return processed;
  };

  const renderEnhancedContent = (htmlContent) => {
    if (!htmlContent) return '';
    const hasBlocks = /<(p|ul|ol|table|br)[^>]*>/i.test(htmlContent);
    if (hasBlocks) {
      return highlightContent(htmlContent);
    }
    const plain = htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const sentences = plain.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length <= 2) {
      return highlightContent(`<p>${plain}</p>`);
    }
    const targetParas = Math.min(3, Math.ceil(sentences.length / 3));
    const per = Math.ceil(sentences.length / targetParas);
    const paras = [];
    for (let i = 0; i < sentences.length; i += per) {
      paras.push(sentences.slice(i, i + per).join(' '));
    }
    const html = paras.map(p => `<p>${p}</p>`).join('');
    return highlightContent(html);
  };

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
    let userId = actualUser.id || actualUser.userId || actualUser.uid;

    // Fallback: Extract ID from token if missing
    if (!userId && (actualUser.token || actualUser.access_token)) {
      const token = actualUser.token || actualUser.access_token;
      const decoded = parseJwt(token);
      if (decoded) {
        userId = decoded.id || decoded.userId || decoded.uid || decoded.sub;
      }
    }

    const userName = actualUser.name || actualUser.username || (actualUser.email ? actualUser.email.split('@')[0] : 'User');
    const userEmail = actualUser.email || '';

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
          email: userEmail,
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
        const data = await response.json();

        // Handle boolean response (if backend returns just true/false)
        if (typeof data === 'boolean') {
          setIsLiked(data);
          setLikeCount(prev => data ? prev + 1 : Math.max(0, prev - 1));
          toast.success(data ? 'Job liked!' : 'Job unliked');
        }
        // Handle object response (Job object or custom DTO)
        else if (data && typeof data === 'object') {
          // Determine liked status: look for isLiked, liked, or infer from logic if missing
          // If the backend returns the Job object without isLiked, we might be in trouble unless we track it.
          // But assuming if it's an object, it might have 'liked' or 'isLiked'
          const newStatus = data.isLiked ?? data.liked;

          if (newStatus !== undefined) {
            setIsLiked(newStatus);
            toast.success(newStatus ? 'Job liked!' : 'Job unliked');
          }

          // Update like count
          if (data.likeCount !== undefined) {
            setLikeCount(data.likeCount);
          } else if (newStatus !== undefined) {
            // Fallback if count not in response
            setLikeCount(prev => newStatus ? prev + 1 : Math.max(0, prev - 1));
          }
        }
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
      const isMobile = window.innerWidth <= 640;
      setShowMobileBottomBar(isMobile && scrolled >= 85);
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
    const title = job?.jobTitle || 'Job Opportunity';
    const companyName = job?.companyName || company?.name || 'BCVWORLD';
    const text = `Check out this job: ${title} at ${companyName}`;

    let shareUrl = '';
    switch (platform) {
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
    if (!s) return '#';
    if (/^(mailto|tel):/i.test(s)) return s;
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) return s;
    if (/^https?:\/\//i.test(s)) return s;
    if (s.includes('@') && !s.includes('/')) return `mailto:${s}`;
    if (s.startsWith('www.')) return `https://${s}`;
    if (/^[\w.-]+\.[a-z]{2,}([/?#].*)?$/i.test(s)) return `https://${s}`;
    return s;
  };

  const applyTargetValue = job?.applicationLink || job?.applicationEmail || job?.applicationLinkOrEmail;
  const applyHref = getApplyHref(applyTargetValue);
  const isApplyMailto = /^mailto:/i.test(applyHref);
  const applyDisplayValue = isApplyMailto ? applyHref.replace(/^mailto:/i, '') : applyTargetValue;

  const mobileNav = (
    <>
      <div className="mobile-header font-sans">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Open mobile menu" aria-expanded={sidebarOpen}>
          <i className="bi bi-list"></i>
        </button>
        <div className="mobile-logo">
          <Link to="/">BCV World</Link>
        </div>
        <button className="mobile-share-btn" onClick={() => handleShare('copy')} aria-label="Copy job link">
          <i className="bi bi-share"></i>
        </button>
      </div>

      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} style={{ display: sidebarOpen ? 'block' : 'none' }} onClick={() => setSidebarOpen(false)}></div>

      <div className={`mobile-sidebar ${sidebarOpen ? 'open' : ''} font-sans`}>
        <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
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
              <Link to={`/login?returnTo=${encodeURIComponent(window.location.href)}`} className="info-item" onClick={() => setSidebarOpen(false)}>
                <span><i className="bi bi-box-arrow-in-right"></i> Login</span>
                <i className="bi bi-chevron-right"></i>
              </Link>
              <Link to={`/register?returnTo=${encodeURIComponent(window.location.href)}`} className="info-item" onClick={() => setSidebarOpen(false)}>
                <span><i className="bi bi-person-plus"></i> Register</span>
                <i className="bi bi-chevron-right"></i>
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );

  if (loading) {
    return (
      <>
        {mobileNav}
        <div className="loading-screen">
          <div className="spinner"></div>
          <p>Loading job details...</p>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        {mobileNav}
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
      </>
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

      {mobileNav}

      {/* Main Container - Full Width */}
      <div className="job-details-page page-wrapper font-sans">

        {/* Left Ad */}
        {showLeftAd && (
          <div className="ad-column ad-left">
            <div className="ad-sidebar">
              <button className="ad-close-btn" onClick={() => setShowLeftAd(false)} title="Close Ad">
                <i className="bi bi-x-lg"></i>
              </button>
              <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-6284022198338659"
                data-ad-slot="3196528375"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({ });
              </script>
            </div>
          </div>
        )}

        {/* Right Ad */}
        {showRightAd && (
          <div className="ad-column ad-right">
            <div className="ad-sidebar">
              <button className="ad-close-btn" onClick={() => setShowRightAd(false)} title="Close Ad">
                <i className="bi bi-x-lg"></i>
              </button>
              <ins
                className="adsbygoogle"
                style={{ display: 'block' }}
                data-ad-client="ca-pub-6284022198338659"
                data-ad-slot="6272433641"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({ });
              </script>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className={`main-content-area ${showLeftAd ? 'has-left-ad' : ''} ${showRightAd ? 'has-right-ad' : ''}`}>

          {/* Back Navigation */}
          <div className="back-navigation-bar">
            <Link to="/jobs" className="back-btn">
              <i className="bi bi-arrow-left"></i> Back to Jobs
            </Link>
            <div className="breadcrumb-nav">
              <Link to="/">Home</Link> ›
              <Link to="/jobs">Jobs</Link> ›
              <span>{job.jobCategory || 'Jobs'}</span> ›
              <span
                className="current"
                title={job.jobTitle || ''}
              >
                {(job.jobTitle || '').length > 30
                  ? (job.jobTitle || '').slice(0, 30) + '...'
                  : (job.jobTitle || '')}
              </span>
            </div>
          </div>

          <ins
            className="adsbygoogle"
            style={{ display: 'block' }}
            data-ad-client="ca-pub-6284022198338659"
            data-ad-slot="1855526545"
            data-ad-format="auto"
            data-full-width-responsive="true"
          ></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({ });
          </script>
          {/* Job Header */}
          <div className="job-header-section">
            <div className="job-header-inner">
              <div className="company-brand">
                    <div className="company-logo">
                      <img 
                        src={job.companyLogoUrl || company?.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName || company?.name || 'Company')}&background=random&size=80`} 
                        alt={job.companyName || company?.name || ''}
                        width="80"
                        height="80"
                        sizes="(max-width: 640px) 60px, 80px"
                        decoding="async"
                      />
                    </div>
                <div className="company-details">
                  <h1
                    className="job-title"
                    title={job.jobTitle || ''}
                  >
                    {(job.jobTitle || '').length > 30
                      ? (job.jobTitle || '').slice(0, 30) + '...'
                      : (job.jobTitle || '')}
                  </h1>
                  <h2 className="company-name">
                    {job.companyName || company?.name}
                    {(() => {
                      const e = job.experienceRequired || '';
                      const cleaned = String(e).trim();
                      if (!cleaned) return null;
                      const lower = cleaned.toLowerCase();
                      let label = cleaned;
                      if (lower.includes('fresher')) label = 'Fresher';
                      else {
                        label = cleaned.replace(/years/gi, "Year's");
                      }
                      return <span className="exp-label"> ({label})</span>;
                    })()}
                  </h2>
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
                    <i className="bi bi-mortarboard"></i>
                    <div>
                      <span className="meta-label">Education</span>
                      {(() => {
                        const levels = Array.isArray(job.educationLevels) ? job.educationLevels : [];
                        const full = levels.join(', ');
                        const display = full.length > 25 ? `${full.slice(0, 25)}...` : full;
                        return <span className="meta-value" title={full}>{display}</span>;
                      })()}
                    </div>
                  </div>
                  <div className="meta-item">
                    <i className="bi bi-calendar3"></i>
                    <div>
                      <span className="meta-label">Posted</span>
                      <span className="meta-value">{formatDateDDMMMYYYY(job.postedDate)}</span>
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
                  <div className="meta-item meta-ref-id">
                    <i className="bi bi-hash"></i>
                    <div>
                      <span className="meta-label">Ref ID</span>
                      <span className="meta-value">{job.referralCode || '—'}</span>
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
              <div className="section-content" dangerouslySetInnerHTML={{ __html: renderEnhancedContent(job.description) }} />
            </section>



            {/* Required Skills (stacked) */}
            {job.skills && (
              <section className="content-section">
                <div className="section-title-bar">
                  <i className="bi bi-tools"></i>
                  <h3>Required Skills</h3>
                </div>
                {/* Desktop View */}
                <div className="hidden min-[769px]:block">
                  <div className="skills-grid">
                    {job.skills.split(',').map((skill, index) => (
                      <span key={index} className="skill-item">{skill.trim()}</span>
                    ))}
                  </div>
                </div>
                {/* Mobile View */}
                <div className="block min-[769px]:hidden">
                  <div className="skills-grid">
                    {job.skills.split(',').map((skill, index) => (
                      <span key={index} className="skill-item">{skill.trim()}</span>
                    ))}
                  </div>
                </div>
              </section>
            )}

            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-6284022198338659"
              data-ad-slot="9542444871"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
            <script>
              (adsbygoogle = window.adsbygoogle || []).push({ });
            </script>
            {/* Qualifications (stacked below skills) */}
            {job.qualifications && (
              <section className="content-section">
                <div className="section-title-bar">
                  <i className="bi bi-check-circle-fill"></i>
                  <h3>Qualifications</h3>
                </div>
                <div className="section-content" dangerouslySetInnerHTML={{ __html: renderEnhancedContent(job.qualifications) }} />
              </section>
            )}

            {/* Additional Details */}
            {job.details && (
              <section className="content-section">
                <div className="section-title-bar">
                  <i className="bi bi-info-circle-fill"></i>
                  <h3>Additional Details</h3>
                </div>
                <div className="section-content" dangerouslySetInnerHTML={{ __html: renderEnhancedContent(job.details) }} />
              </section>
            )}

            {job.walkin_details && (
              <section className="content-section">
                <div className="section-title-bar">
                  <i className="bi bi-geo-alt-fill"></i>
                  <h3>Walk-In Details</h3>
                </div>
                {typeof job.walkin_details === 'string' ? (
                  <div className="section-content">
                    {(() => {
                      const text = String(job.walkin_details || '');
                      const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                      const timeRangeMatch = plain.match(/(\d{1,2}[.:]\d{2}\s*(AM|PM))\s*-\s*(\d{1,2}[.:]\d{2}\s*(AM|PM))/i);
                      const startTime = timeRangeMatch ? timeRangeMatch[1] : null;
                      const endTime = timeRangeMatch ? timeRangeMatch[3] : null;
                      const timeRange = startTime && endTime ? `${startTime} - ${endTime}` : null;
                      const dateMatch = plain.match(/\b(\d{1,2}(?:st|nd|rd|th)?\s+[A-Za-z]+(?:\s+\d{4})?)\b/);
                      const date = dateMatch ? dateMatch[1] : null;
                      let venue = null;
                      const contactIdx = plain.toLowerCase().indexOf('contact');
                      if (timeRangeMatch) {
                        const afterTime = plain.slice(plain.indexOf(timeRangeMatch[0]) + timeRangeMatch[0].length).trim();
                        const contactAfterIdx = afterTime.toLowerCase().indexOf('contact');
                        venue = afterTime ? (contactAfterIdx > -1 ? afterTime.slice(0, contactAfterIdx).trim() : afterTime) : null;
                      }
                      const emailMatch = plain.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}/);
                      const phoneMatch = plain.match(/(\+?\d[\d\s-]{9,}\d)/);
                      let contactName = null;
                      if (contactIdx > -1) {
                        const cText = plain.slice(contactIdx + 'contact'.length).trim();
                        const nameMatch = cText.match(/[-:–]\s*([A-Za-z ]+)/) || cText.match(/^\s*([A-Za-z ]+)/);
                        contactName = nameMatch ? nameMatch[1].trim() : null;
                      }
                      const locationsArr = (venue || '').split(',').map(s => s.trim()).filter(Boolean);
                      const contactParts = [contactName, phoneMatch ? phoneMatch[1] : null, emailMatch ? emailMatch[0] : null].filter(Boolean);
                      return (
                        <div>
                          <div style={{ textAlign: 'center', fontWeight: 700 }}>Time and Venue</div>
                          <div style={{ textAlign: 'center', fontWeight: 700 }}>
                            {(date ? `${formatDateDDMMMYYYY(date)} , ` : '')}{timeRange || 'Missing'}
                          </div>
                          <div style={{ textAlign: 'center', fontWeight: 700 }}>
                            {locationsArr.length > 0 ? locationsArr.join(', ') : (venue || 'Missing')}
                            {(() => {
                              const mapQuery = (venue && venue.trim().length > 0)
                                ? venue
                                : (locationsArr.length > 0 ? locationsArr.join(', ') : '');
                              return mapQuery ? (
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#0d6efd', marginLeft: 8 }}
                                >
                                  (View on map)
                                </a>
                              ) : null;
                            })()}
                          </div>
                          <div style={{ textAlign: 'center', fontWeight: 700 }}>
                            Contact - {contactParts.length > 0 ? contactParts.join(', ') : 'Missing'}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : Array.isArray(job.walkin_details) ? (
                  <div className="section-content">
                    {job.walkin_details.map((item, idx) => (
                      <div key={idx}>{String(item ?? 'Missing')}</div>
                    ))}
                  </div>
                ) : (
                  <div className="section-content">
                    {(() => {
                      const d = job.walkin_details || {};
                      const date = d.date || d.walkin_date || d.datetime || null;
                      const timeRange = (d.start_time && d.end_time) ? `${d.start_time} - ${d.end_time}` : null;
                      const time = timeRange || d.time || d.walkin_time || null;
                      const venue = d.venue || d.address || d.location || null;
                      const rawLocations = d.locations || d.location_list || null;
                      const locationsArr = Array.isArray(rawLocations)
                        ? rawLocations
                        : typeof rawLocations === 'string'
                          ? rawLocations.split(',').map(s => s.trim()).filter(Boolean)
                          : Array.isArray(job.locations)
                            ? job.locations
                            : typeof job.locations === 'string'
                              ? job.locations.split(',').map(s => s.trim()).filter(Boolean)
                              : [];
                      const contactParts = [
                        d.contact_person || d.contact || d.hr_name || null,
                        d.phone || d.contact_number || d.mobile || null,
                        d.email || d.contact_email || null
                      ].filter(v => v && String(v).trim().length > 0);
                      return (
                        <div>
                          <div style={{ textAlign: 'center', fontWeight: 700 }}>Time and Venue</div>
                          <div style={{ textAlign: 'center', fontWeight: 700 }}>
                            {(date ? `${formatDateDDMMMYYYY(date)} , ` : '')}{time || 'Missing'}
                          </div>
                          <div style={{ textAlign: 'center', fontWeight: 700 }}>
                            {locationsArr.length > 0 ? locationsArr.join(', ') : (venue || 'Missing')}
                            {(() => {
                              const mapQuery = (venue && venue.trim().length > 0)
                                ? venue
                                : (locationsArr.length > 0 ? locationsArr.join(', ') : '');
                              return mapQuery ? (
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#0d6efd', marginLeft: 8 }}
                                >
                                  (View on map)
                                </a>
                              ) : null;
                            })()}
                          </div>
                          <div style={{ textAlign: 'center', fontWeight: 700 }}>
                            Contact - {contactParts.length > 0 ? contactParts.join(', ') : 'Missing'}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
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

            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-6284022198338659"
              data-ad-slot="4257478543"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
            <script>
              (adsbygoogle = window.adsbygoogle || []).push({ });
            </script>

            {/* About Company Section - Unique Design */}
            {(job.companyName || company?.name) && (job.companyLogoUrl || company?.logoUrl) && (job.aboutCompany || company?.about) && (
              <section className="content-section company-info-section">
                <div className="section-title-bar">
                  <i className="bi bi-building"></i>
                  <h3>About the Company</h3>
                </div>
                <div className="company-info-header">
                  <div className="company-info-brand">
                      <div className="company-info-logo">
                         <img 
                           src={job.companyLogoUrl || company?.logoUrl} 
                           alt={job.companyName || company?.name} 
                           width="60"
                           height="60"
                           loading="lazy"
                           decoding="async"
                           sizes="(max-width: 640px) 60px, 60px"
                         />
                      </div>
                    <div className="company-info-text">
                      <h4>{job.companyName || company?.name}</h4>
                      {(job.companyWebsite || company?.website) && (
                        <a href={job.companyWebsite || company?.website} target="_blank" rel="noopener noreferrer" className="company-website-link">
                          <i className="bi bi-link-45deg"></i> Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="company-info-body" dangerouslySetInnerHTML={{ __html: renderEnhancedContent(job.aboutCompany || company?.about) }}>
                </div>
              </section>
            )}

            <section className="community-section">
              <h3 className="community-title"><i className="bi bi-people"></i> Join Our Community</h3>
              <div className="community-actions">
                <a href="https://www.whatsapp.com/channel/0029VasadwXLikgEikBhWE1o" target="_blank" rel="noopener noreferrer" className="community-btn btn-whatsapp">
                  <i className="bi bi-whatsapp"></i> Join WhatsApp Group
                </a>
                <a href="https://t.me/bcvworld" target="_blank" rel="noopener noreferrer" className="community-btn btn-telegram">
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

            {relatedJobs.length > 0 && (
              <section className="content-section company-jobs-section">
                <div className="section-title-bar">
                  <i className="bi bi-briefcase"></i>
                  <h3>More from {job.companyName}</h3>
                </div>
                <div className="company-jobs-list">
                  {relatedJobs.map(rJob => (
                    <Link
                      to={`/job?job_id=${rJob.id}`}
                      key={rJob.id}
                      className="company-job-item"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    >
                      <div className="company-job-details">
                        <h4 className="company-job-title">{rJob.jobTitle}</h4>
                        <div className="company-job-meta">
                          {rJob.locations && rJob.locations.length > 0 && (
                            <span className="company-job-location"><i className="bi bi-geo-alt"></i> {rJob.locations[0]}</span>
                          )}
                          <span className="company-job-date">Posted {rJob.postedDate ? formatDateDDMMMYYYY(rJob.postedDate) : 'Recently'}</span>
                        </div>
                      </div>
                      <div className="company-job-arrow">
                        <i className="bi bi-chevron-right"></i>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <ins
              className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-6284022198338659"
              data-ad-slot="7571899411"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></ins>
            <script>
              (adsbygoogle = window.adsbygoogle || []).push({ });
            </script>

            <section className="job-link-section">
              {isApplyMailto ? (
                <div className="job-link-row">
                  <span className="job-link-label">Job Link:</span>
                  <a href={applyHref} className="email-apply-link">
                    <i className="bi bi-envelope"></i> {applyDisplayValue}
                  </a>
                </div>
              ) : (
                <div className="job-link-row">
                  <span className="job-link-label">Job Link:</span>
                  <a
                    href={applyHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    onClick={(e) => {
                      if (applyHref === '#') {
                        e.preventDefault();
                        toast.error('Application link not available');
                      }
                    }}
                  >
                    <i className="bi bi-box-arrow-up-right"></i> Click here to Apply Now
                  </a>
                </div>
              )}
            </section>

            <div className="job-navigation-section">
              <div className="job-navigation-wrapper">
                {prevJob && (
                  <Link
                    to={`/job?type=private&job_id=${prevJob.id}&slug=${(prevJob.jobTitle || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${(prevJob.companyName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}&ref=${Math.random().toString(36).substring(7)}&token=${Math.random().toString(36).substring(7)}&src=bcvworld.com`}
                    className="nav-job-item previous-job"
                  >
                    <div className="nav-arrow-circle"><i className="bi bi-chevron-left"></i></div>
                    <div className="nav-logo-wrapper">
                      {(prevJob.companyLogoUrl) ? (
                        <img src={prevJob.companyLogoUrl} alt={prevJob.companyName || ''} className="nav-logo-img" width="48" height="48" loading="lazy" decoding="async" />
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
                    to={`/job?type=private&job_id=${nextJob.id}&slug=${(nextJob.jobTitle || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${(nextJob.companyName || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}&ref=${Math.random().toString(36).substring(7)}&token=${Math.random().toString(36).substring(7)}&src=bcvworld.com`}
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
                        <img src={nextJob.companyLogoUrl} alt={nextJob.companyName || ''} className="nav-logo-img" width="48" height="48" loading="lazy" decoding="async" />
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

          {/* Footer removed as requested */}
        </div>
      </div>

      {/* Mobile Bottom Action Bar (shows at 90% scroll) */}
      {showMobileBottomBar && (
        <div className="mobile-bottom-bar">
          <div className="bottom-bar-content">
            <a
              href="https://www.whatsapp.com/channel/0029VasadwXLikgEikBhWE1o"
              target="_blank"
              rel="noopener noreferrer"
              className="bottom-btn"
            >
              <FaWhatsapp size={20} color="#25D366" />
              <span>WhatsApp</span>
            </a>
            <a
              href="https://t.me/bcvworld"
              target="_blank"
              rel="noopener noreferrer"
              className="bottom-btn"
            >
              <FaTelegram size={20} color="#0088cc" />
              <span>Telegram</span>
            </a>
            <a
              href={applyHref}
              target={isApplyMailto ? undefined : "_blank"}
              rel={isApplyMailto ? undefined : "noopener noreferrer"}
              className="bottom-btn apply-btn"
              onClick={(e) => {
                if (applyHref === '#') {
                  e.preventDefault();
                  toast.error('Application link not available');
                }
              }}
            >
              <i className="bi bi-box-arrow-up-right"></i>
              <span>Apply Now</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
