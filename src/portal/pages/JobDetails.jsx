import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaWhatsapp, FaTelegram } from 'react-icons/fa';
import { 
  BiCopy, BiListUl, BiShare, BiX, BiHome, BiChevronRight, BiBriefcase, BiBulb, 
  BiUserCircle, BiSolidUserBadge, BiLogOut, BiLogIn, BiUserPlus, 
  BiWifiOff, BiRefresh, BiError, BiSolidUser, 
  BiSolidBadgeCheck, BiMapPin, BiPlusCircle, BiSolidGraduation, BiCalendar, BiShow, 
  BiHeart, BiSolidHeart, BiHash, BiMoney, BiBookmark, BiSolidBookmark, BiFile, 
  BiWrench, BiCheckCircle, BiInfoCircle, BiShareAlt, BiLogoWhatsapp, BiLogoLinkedin, 
  BiLogoFacebook, BiLogoTwitter, BiLogoTelegram, BiLink, BiBuilding, BiCommentDots, 
  BiChat, BiLinkExternal, BiEnvelope, BiChevronLeft, BiTime, BiPhone
} from 'react-icons/bi';
import SEO from '../components/SEO';
import { API_BASE_URL } from '../../utils/config';
import GoogleAd from '../components/GoogleAd';
import './JobDetails.css';
import JobDetailsSkeleton from '../components/JobDetailsSkeleton';

// Helper for robust fetching with retry and timeout
const fetchWithRetry = async (url, options = {}, retries = 3, timeout = 20000) => {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(id);
      
      // If successful or client error (4xx except 429), return response
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }
      
      // If 5xx, throw to trigger retry
      if (response.status >= 500) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      return response;
    } catch (error) {
      if (i === retries) throw error;
      // Exponential backoff: 1s, 2s, 4s
      const delay = 1000 * Math.pow(2, i);
      console.log(`Fetch failed, retrying in ${delay}ms... (${url})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

const KEYWORDS = [
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
];

const TECH_STACK = [
  'Java', 'Python', 'C++', 'C#', '.NET', 'JavaScript', 'React', 'Angular', 'Vue', 'Node.js', 'Spring Boot', 'AWS', 'Azure', 'Docker',
  'Kubernetes', 'Git', 'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'HTML', 'CSS', 'TypeScript', 'Go', 'Rust', 'PHP', 'Laravel',
  'Django', 'Flask', 'TensorFlow', 'PyTorch', 'Linux', 'Unix', 'Agile', 'Scrum', 'Jira', 'Junit', 'Selenium', 'Rest API',
  'GraphQL', 'Machine Learning', 'AI', 'Data Science', 'DevOps', 'CI/CD', 'Jenkins'
];



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

export default function JobDetails() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('job_id') || searchParams.get('id');
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const API_BASE = API_BASE_URL;
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
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [showLeftAd, setShowLeftAd] = useState(true);
  const [showRightAd, setShowRightAd] = useState(true);
  const [showMobileBottomBar, setShowMobileBottomBar] = useState(false);
  const [hideStickyAds, setHideStickyAds] = useState(false);
  const [isEducationExpanded, setIsEducationExpanded] = useState(false);
  const hasViewed = useRef(false);
  const bottomBarShownRef = useRef(false);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      
      // Logic for Mobile Bottom Bar
      const scrollPosition = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      if (scrollPosition >= docHeight * 0.9) {
        if (!bottomBarShownRef.current) {
          setShowMobileBottomBar(true);
          bottomBarShownRef.current = true;
        }
      } else {
        if (bottomBarShownRef.current) {
          setShowMobileBottomBar(false);
          bottomBarShownRef.current = false;
        }
      }

      // Logic for Sticky Ads (Hide when near footer/bottom)
      const distanceToBottom = docHeight - scrollPosition;
      if (distanceToBottom < 400) {
        setHideStickyAds(true);
      } else {
        setHideStickyAds(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

        const response = await fetchWithRetry(url, { headers });
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
            postedByName: rawData.posted_by_name || rawData.postedByName,
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
          if (response.status === 404) {
             console.error('Job not found');
             // Job will remain null, triggering "Job Not Found" UI
          } else {
             throw new Error(`Server returned ${response.status}`);
          }
        }
      } catch (error) {
        console.error('Error fetching job details:', error);
        setError('Unable to load job details. Please check your internet connection.');
        toast.error('Network Error: Unable to load job details');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, API_BASE]);

  // Consolidated Side Effects for Related Jobs & Neighbors
  useEffect(() => {
    if (!job || !id) return;

    let isMounted = true;
    setLoadingRelated(true);

    const fetchRelatedAndNeighbors = async () => {
      try {
        // Fetch all jobs once for both "Related" and "Neighbors" logic
        // Ideally, the backend should support /api/jobs?company=X or /api/jobs/neighbors/ID
        const res = await fetchWithRetry(`${API_BASE}/api/jobs`);
        if (!res.ok || !isMounted) return;

        let allJobs = await res.json();
        allJobs = Array.isArray(allJobs) ? allJobs : [];

        // 1. Process Related Jobs (Same Company)
        if (job.companyName) {
          const related = allJobs
            .filter(j => {
              const cName = j.company || j.companyName;
              return cName && cName.toLowerCase() === job.companyName.toLowerCase() && String(j.id) !== String(job.id);
            })
            .slice(0, 3)
            .map(j => ({
              id: j.id,
              jobTitle: j.title || j.jobTitle,
              companyName: j.company || j.companyName,
              locations: j.location ? (typeof j.location === 'string' ? j.location.split(',').map(s => s.trim()) : []) : (j.locations || []),
              companyLogoUrl: j.logoUrl || j.companyLogoUrl,
              postedDate: j.postedDate
            }));
          
          if (isMounted) setRelatedJobs(related);
        }

        // 2. Process Previous/Next Jobs (Neighbors)
        const activeJobs = allJobs
          .filter(j => j.isActive === true || j.isActive === 'true' || String(j.isActive) === 'true')
          .sort((a, b) => a.id - b.id);

        const currentId = Number(id);
        const currentIndex = activeJobs.findIndex(j => j.id === currentId);

        if (currentIndex !== -1 && activeJobs.length > 1) {
          // Circular Previous
          const prev = currentIndex > 0 
            ? activeJobs[currentIndex - 1] 
            : activeJobs[activeJobs.length - 1];
          
          // Circular Next
          const next = currentIndex < activeJobs.length - 1 
            ? activeJobs[currentIndex + 1] 
            : activeJobs[0];

          if (isMounted) {
            setPrevJob({
              id: prev.id,
              jobTitle: prev.title || prev.jobTitle,
              companyName: prev.company || prev.companyName,
              companyLogoUrl: prev.logoUrl || prev.companyLogoUrl
            });
            setNextJob({
              id: next.id,
              jobTitle: next.title || next.jobTitle,
              companyName: next.company || next.companyName,
              companyLogoUrl: next.logoUrl || next.companyLogoUrl
            });
          }
        } else if (isMounted) {
          setPrevJob(null);
          setNextJob(null);
        }

      } catch (e) {
        console.error('Error fetching related/neighbor jobs', e);
      } finally {
        if (isMounted) setLoadingRelated(false);
      }
    };

    fetchRelatedAndNeighbors();

    return () => { isMounted = false; };
  }, [job, id, API_BASE]); // Depend on 'job' to ensure we have companyName, and 'id' for neighbors

  // Fetch Comments independently
  useEffect(() => {
    if (!id) return;
    const fetchComments = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs/${id}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [id, API_BASE]);

  const keywordPattern = useMemo(() => {
    const extraSkills = job?.skills ? job.skills.split(',').map(s => s.trim()) : [];
    const allKeywords = [...new Set([...KEYWORDS, ...TECH_STACK, ...extraSkills])].filter(k => k && k.length > 1);
    allKeywords.sort((a, b) => b.length - a.length);
    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return `\\b(${allKeywords.map(escapeRegExp).join('|')})\\b`;
  }, [job?.skills]);

  const highlightContent = useCallback((htmlContent) => {
    if (!htmlContent) return '';

    let processed = htmlContent;
    const safeReplace = (text, pattern, replacement) => {
      try {
        const regex = new RegExp(`(${pattern})(?![^<]*>)`, 'gi');
        return text.replace(regex, replacement);
      } catch {
        return text;
      }
    };

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
  }, [keywordPattern]);

  const renderEnhancedContent = useCallback((htmlContent) => {
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
  }, [highlightContent]);

  const walkinDetails = useMemo(() => {
    if (!job?.walkin_details || typeof job.walkin_details !== 'string') return null;
    let text = String(job.walkin_details || '');
    // Clean HTML and extra spaces
    text = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    // Remove "Time and Venue" prefix if present
    text = text.replace(/^Time and Venue\s*/i, '');

    // 1. Extract Time Range (Anchor)
    // Matches: 9.30 AM - 5.30 PM, 9:30 AM - 5:30 PM
    const timeRegex = /(\d{1,2}[.:]\d{2}\s*(?:AM|PM))\s*-\s*(\d{1,2}[.:]\d{2}\s*(?:AM|PM))/i;
    const timeMatch = text.match(timeRegex);

    let date = null;
    let timeRange = null;
    let venue = null;
    let contactInfo = null;

    if (timeMatch) {
      timeRange = timeMatch[0];
      
      // Date is everything before the time range
      const dateRaw = text.substring(0, timeMatch.index).trim();
      date = dateRaw.replace(/[,-\s]+$/, ''); // Remove trailing separators

      // Everything after time range is Venue + Contact
      let rest = text.substring(timeMatch.index + timeMatch[0].length).trim();
      rest = rest.replace(/^[,-\s]+/, ''); // Remove leading separators

      const contactIdx = rest.toLowerCase().indexOf('contact');
      if (contactIdx !== -1) {
        venue = rest.substring(0, contactIdx).trim();
        venue = venue.replace(/[,-\s]+$/, '');
        contactInfo = rest.substring(contactIdx).trim();
      } else {
        venue = rest;
      }
    } else {
       // Fallback logic if strict time pattern fails
       const contactIdx = text.toLowerCase().indexOf('contact');
       if (contactIdx > -1) {
          venue = text.slice(0, contactIdx).trim();
          contactInfo = text.slice(contactIdx).trim();
       } else {
          venue = text;
       }
    }

    // Process Contact Info
    let contactName = null;
    let contactPhone = null;
    let contactEmail = null;

    if (contactInfo) {
      // Remove "Contact -" prefix
      let cText = contactInfo.replace(/^Contact\s*[-:]\s*/i, '');
      
      const emailMatch = cText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}/);
      if (emailMatch) contactEmail = emailMatch[0];

      const phoneMatch = cText.match(/(\+?\d[\d\s-]{9,}\d)/);
      if (phoneMatch) {
        contactPhone = phoneMatch[0];
        // Remove phone from name
        cText = cText.replace(phoneMatch[0], '').replace(/[()]/g, '').trim();
      }
      contactName = cText.replace(contactEmail || '', '').trim().replace(/[-:]$/, '');
    }

    // Map Query Logic
    const locationsArr = (venue || '').split(',').map(s => s.trim()).filter(Boolean);
    const mapQuery = venue ? venue.replace(/\(View on map\)/i, '').trim() : '';
    const cleanVenue = venue ? venue.replace(/\(View on map\)/i, '').trim() : null;

    const contactParts = [contactName, contactPhone, contactEmail].filter(Boolean);

    return { date, timeRange, venue: cleanVenue, locationsArr, contactParts, mapQuery };
  }, [job?.walkin_details]);

  const handlePostComment = useCallback(async () => {
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
        setComments(prev => [newComment, ...prev]);
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
  }, [commentText, API_BASE, id]);

  const handleLike = useCallback(async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('Please login to like this job');
      return;
    }

    try {
      const u = JSON.parse(userStr);
      
      // Robust User ID Extraction
      let userId = 
        u?.id ??
        u?.userId ??
        u?.uid ??
        u?._id ??
        u?.user?.id ??
        u?.user?.userId ??
        u?.user?.uid ??
        u?.user?._id ??
        u?.data?.id ??
        u?.data?.userId ??
        u?.data?.uid ??
        u?.data?._id;

      // Fallback: Extract ID from token if missing (similar to handlePostComment)
      if (!userId) {
        const token = u.token || u.access_token || u.data?.token || u.user?.token;
        if (token) {
          const decoded = parseJwt(token);
          if (decoded) {
            userId = decoded.id || decoded.userId || decoded.uid || decoded.sub;
          }
        }
      }

      if (!userId) {
        console.error('User ID missing in object:', u);
        toast.error('Invalid user session. Please logout and login again.');
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
  }, [API_BASE, id]);

  const handleSaveJob = useCallback(async () => {
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
    setIsSaved(prev => !prev);
  }, []);


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
    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      // READ phase - batch layout reads
      const total = doc.scrollHeight - doc.clientHeight;
      const scrolledPercent = total > 0 ? (doc.scrollTop / total) * 100 : 0;
      const isMobile = window.innerWidth <= 640;

      // WRITE phase - perform DOM updates
      const bar = document.getElementById('readingProgress');
      if (bar) bar.style.width = `${scrolledPercent}%`;

      if (!isMobile) {
        setShowMobileBottomBar(false);
        ticking = false;
        return;
      }

      if (bottomBarShownRef.current) {
        setShowMobileBottomBar(true);
      } else if (scrolledPercent >= 80) {
        bottomBarShownRef.current = true;
        setShowMobileBottomBar(true);
      } else {
        setShowMobileBottomBar(false);
      }

      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!loading && !job && !error) {
      const timer = setTimeout(() => {
        navigate('/jobs');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loading, job, error, navigate]);

  const handleCopyTitle = useCallback(() => {
    if (job && job.jobTitle) {
      navigator.clipboard.writeText(job.jobTitle)
        .then(() => toast.success('Job title copied!'))
        .catch(() => toast.error('Failed to copy title'));
    }
  }, [job]);

  const handleShare = useCallback((platform) => {
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
  }, [job, company]);

  const applyTargetValue = job?.jobUrl || job?.applicationLink || job?.jobEmail || job?.applicationEmail || job?.applicationLinkOrEmail;
  const applyHref = getApplyHref(applyTargetValue);
  const isApplyMailto = /^mailto:/i.test(applyHref);
  const applyDisplayValue = isApplyMailto ? applyHref.replace(/^mailto:/i, '') : applyTargetValue;

  const handleApply = useCallback((e) => {
    if (applyHref === '#') {
      e.preventDefault();
      toast.error('Application link not available');
    }
  }, [applyHref]);

  const clean = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const mobileNav = (
    <>
      <div className="mobile-header font-sans">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Open mobile menu" aria-expanded={sidebarOpen}>
          <BiListUl className="bi" />
        </button>
        <div className="mobile-logo">
          <Link to="/">BCVWorld</Link>
        </div>
        <button className="mobile-share-btn" onClick={() => handleShare('copy')} aria-label="Copy job link">
          <BiShare className="bi" />
        </button>
      </div>

      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} style={{ display: sidebarOpen ? 'block' : 'none' }} onClick={() => setSidebarOpen(false)}></div>

      <div className={`mobile-sidebar ${sidebarOpen ? 'open' : ''} font-sans`}>
        <div className="sidebar-header-row">
          <span className="sidebar-brand">BCVWorld</span>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <BiX />
          </button>
        </div>

        <div className="sidebar-scroll-content">
          <div className="sidebar-section">
            <h4 className="sidebar-label">Navigation</h4>
            <div className="sidebar-menu">
              <Link to="/" className="sidebar-item" onClick={() => setSidebarOpen(false)}>
                <div className="sidebar-item-left">
                  <BiHome className="sidebar-icon" />
                  <span>Home</span>
                </div>
                <BiChevronRight className="sidebar-arrow" />
              </Link>
              <Link to="/jobs" className="sidebar-item" onClick={() => setSidebarOpen(false)}>
                <div className="sidebar-item-left">
                  <BiBriefcase className="sidebar-icon" />
                  <span>Browse Jobs</span>
                </div>
                <BiChevronRight className="sidebar-arrow" />
              </Link>
              <Link to="/suggestion" className="sidebar-item" onClick={() => setSidebarOpen(false)}>
                <div className="sidebar-item-left">
                  <BiBulb className="sidebar-icon" />
                  <span>Suggestions</span>
                </div>
                <BiChevronRight className="sidebar-arrow" />
              </Link>
            </div>
          </div>

          <div className="sidebar-section">
            <h4 className="sidebar-label">Account</h4>
            <div className="sidebar-menu">
              {user ? (
                <>
                  <div className="sidebar-user-card">
                    <div className="sidebar-user-avatar">
                      {user.name ? user.name.charAt(0).toUpperCase() : <BiUserCircle />}
                    </div>
                    <div className="sidebar-user-info">
                      <div className="sidebar-user-name">{user.name}</div>
                      <div className="sidebar-user-status">Logged In</div>
                    </div>
                  </div>
                  
                  <Link to="/profile" className="sidebar-item" onClick={() => setSidebarOpen(false)}>
                    <div className="sidebar-item-left">
                      <BiSolidUserBadge className="sidebar-icon" />
                      <span>My Profile</span>
                    </div>
                    <BiChevronRight className="sidebar-arrow" />
                  </Link>
                  <button
                    className="sidebar-item logout-btn"
                    onClick={() => {
                      localStorage.removeItem('user');
                      setUser(null);
                      setIsLiked(false);
                      setSidebarOpen(false);
                      toast.success('Logged out successfully');
                    }}
                  >
                    <div className="sidebar-item-left">
                      <BiLogOut className="sidebar-icon" />
                      <span>Logout</span>
                    </div>
                    <BiChevronRight className="sidebar-arrow" />
                  </button>
                </>
              ) : (
                <>
                  <Link to={`/login?returnTo=${encodeURIComponent(window.location.href)}`} className="sidebar-item" onClick={() => setSidebarOpen(false)}>
                    <div className="sidebar-item-left">
                      <BiLogIn className="sidebar-icon" />
                      <span>Login</span>
                    </div>
                    <BiChevronRight className="sidebar-arrow" />
                  </Link>
                  <Link to={`/register?returnTo=${encodeURIComponent(window.location.href)}`} className="sidebar-item" onClick={() => setSidebarOpen(false)}>
                    <div className="sidebar-item-left">
                      <BiUserPlus className="sidebar-icon" />
                      <span>Register</span>
                    </div>
                    <BiChevronRight className="sidebar-arrow" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (loading) {
    return (
      <>
        {mobileNav}
        <JobDetailsSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <SEO title="Connection Error" noindex={true} />
        {mobileNav}
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50 pt-20">
          <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
             <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiWifiOff className="text-3xl text-red-500" />
             </div>
             <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Issue</h2>
             <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">{error}</p>
             <button 
               onClick={() => window.location.reload()} 
               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-95"
             >
               <BiRefresh /> Retry Connection
             </button>
             <div className="mt-6">
               <Link to="/jobs" className="text-gray-500 hover:text-blue-600 text-sm font-medium transition duration-200 flex items-center justify-center gap-1">
                 <BiChevronLeft /> Go back to Jobs
               </Link>
             </div>
          </div>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <SEO title="Job Not Found" noindex={true} />
        {mobileNav}
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50 pt-20">
           <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
            <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BiError className="text-3xl text-yellow-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-2 text-sm md:text-base">The job you are looking for does not exist or has been removed.</p>
            <p className="text-gray-400 text-xs mb-6">Redirecting to jobs page automatically...</p>
            <Link to="/jobs" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg">
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
        {!isMobile && showLeftAd && (
          <div className="ad-column ad-left" style={{ opacity: hideStickyAds ? 0 : 1, pointerEvents: hideStickyAds ? 'none' : 'auto', transition: 'opacity 0.3s ease' }}>
            <div className="ad-sidebar">
              <button className="ad-close-btn" onClick={() => setShowLeftAd(false)} title="Close Ad">
                <BiX className="bi" />
              </button>
              <GoogleAd slot="8773320892" minHeight="600px" />
            </div>
          </div>
        )}

        {/* Right Ad */}
        {!isMobile && showRightAd && (
          <div className="ad-column ad-right" style={{ opacity: hideStickyAds ? 0 : 1, pointerEvents: hideStickyAds ? 'none' : 'auto', transition: 'opacity 0.3s ease' }}>
            <div className="ad-sidebar">
              <button className="ad-close-btn" onClick={() => setShowRightAd(false)} title="Close Ad">
                <BiX className="bi" />
              </button>
              <GoogleAd slot="7460239222" minHeight="600px" />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className={`main-content-area ${showLeftAd ? 'has-left-ad' : ''} ${showRightAd ? 'has-right-ad' : ''}`}>

          {/* Back Navigation */}
          <div className="back-navigation-bar">
            <Link to="/jobs" className="back-btn">
              <BiChevronLeft className="bi" /> Back to Jobs
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

          <GoogleAd slot="2290112520" immediate={true} fullWidthResponsive="true" />

          {/* Job Header (kept above the fold for best LCP) */}
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
                        style={{ objectFit: 'contain' }}
                        decoding="async"
                        loading="lazy"
                      />
                    </div>
                <div className="company-details">
                  <h1
                    className="job-title"
                  >
                    {job.jobTitle || ''}
                    {(user?.role === 'ADMIN' || user?.role === 'admin') && (
                      <BiCopy 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyTitle();
                        }}
                        title="Copy full title"
                        style={{ 
                          fontSize: '0.5em', 
                          marginLeft: '10px', 
                          cursor: 'pointer',
                          color: '#64748b',
                          verticalAlign: 'middle',
                          display: 'inline-block'
                        }}
                      />
                    )}
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
                  {job.postedByName && (
                    <div className="posted-by-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                      <div className="posted-by-avatar" style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        backgroundColor: '#e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b'
                      }}>
                        <BiSolidUser style={{ fontSize: '18px' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
                            By {job.postedByName}
                          </span>
                          <BiSolidBadgeCheck style={{ color: '#0066cc', fontSize: '14px' }} />
                        </div>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          Published on: {new Date(job.postedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="job-meta-section">
                <div className="meta-grid">
                  <div className="meta-item">
                    <BiMapPin className="bi" />
                    <div>
                      <span className="meta-label">Location</span>
                      <span className="meta-value">
                        {Array.isArray(job.locations) ? (
                          job.locations.length > 2 ? (
                            <>
                              {job.locations.slice(0, 2).join(', ')}
                              <span className="location-more">
                                <BiPlusCircle style={{ fontSize: '0.9em', marginLeft: '4px' }} />
                                <span className="location-tooltip">
                                  {job.locations.slice(2).join(', ')}
                                </span>
                              </span>
                            </>
                          ) : (
                            job.locations.join(', ')
                          )
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="meta-item">
                    <BiSolidGraduation className="bi" />
                    <div>
                      <span className="meta-label">Education</span>
                      {(() => {
                        const levels = Array.isArray(job.educationLevels) ? job.educationLevels : [];
                        const formattedLevels = levels.map((level, index) => {
                           const s = String(level).trim();
                           // Remove "Degree" from all items except the last one to avoid repetition
                           // e.g. "Bachelor Degree, Master Degree" -> "Bachelor, Master Degree"
                           if (index < levels.length - 1) {
                               return s.replace(/\s+Degree$/i, '');
                           }
                           return s;
                        });
                        const full = formattedLevels.join(', ');
                        const shouldTruncate = full.length > 30;

                        return (
                          <span className="meta-value" style={{ display: 'block' }}>
                            {shouldTruncate && !isEducationExpanded ? (
                              <span style={{ display: 'flex', alignItems: 'center' }}>
                                <span title={full} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: '0 1 auto' }}>
                                  {full}
                                </span>
                                <BiPlusCircle 
                                  style={{ fontSize: '1.2em', cursor: 'pointer', color: '#0066cc', marginLeft: '4px', flexShrink: 0 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEducationExpanded(true);
                                  }}
                                />
                              </span>
                            ) : (
                              <span style={{ wordBreak: 'break-word' }}>{full}</span>
                            )}
                          </span>
                        );
                      })()}
                    </div>
                  </div>
                  <div className="meta-item">
                    <BiCalendar className="bi" />
                    <div>
                      <span className="meta-label">Posted</span>
                      <span className="meta-value">{formatDateDDMMMYYYY(job.postedDate)}</span>
                    </div>
                  </div>
                  <div className="meta-item">
                    <BiShow className="bi" />
                    <div>
                      <span className="meta-label">Views</span>
                      <span className="meta-value">{job.viewCount !== undefined && job.viewCount !== null ? job.viewCount : 0}</span>
                    </div>
                  </div>
                  <div className="meta-item" onClick={handleLike} style={{ cursor: 'pointer' }}>
                    {isLiked ? <BiSolidHeart className="bi" /> : <BiHeart className="bi" />}
                    <div>
                      <span className="meta-label">Likes</span>
                      <span className="meta-value">{likeCount}</span>
                    </div>
                  </div>
                  <div className="meta-item meta-ref-id">
                    <BiHash className="bi" />
                    <div>
                      <span className="meta-label">Ref ID</span>
                      <span className="meta-value">{job.referralCode || '—'}</span>
                    </div>
                  </div>
                  {job.salary && (
                    <div className="meta-item">
                      <BiMoney className="bi" />
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
                      {isSaved ? <BiSolidBookmark className="bi" /> : <BiBookmark className="bi" />} {isSaved ? 'Saved' : 'Save'}
                    </button>

                    <Link to="/suggestion" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none', fontWeight: '500', height: '40px' }}>
                      <BiBulb className="bi" /> Suggestion
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <GoogleAd slot="2859289867" immediate={true} fullWidthResponsive="true" />

          {/* Content Sections */}
          <div className="content-sections">

            {/* Job Description */}
            <section className="content-section">
              <div className="section-title-bar">
                <BiFile className="bi" />
                <h3>Job Description</h3>
              </div>
              <div className="section-content" dangerouslySetInnerHTML={{ __html: renderEnhancedContent(job.description) }} />
            </section>



            {/* Required Skills (stacked) */}
            {job.skills && (
              <section className="content-section">
                <div className="section-title-bar">
                  <BiWrench className="bi" />
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

            <GoogleAd slot="9233126529" immediate={true} fullWidthResponsive="true" />
            {/* Qualifications (stacked below skills) */}
            {job.qualifications && (
              <section className="content-section">
                <div className="section-title-bar">
                  <BiCheckCircle className="bi" />
                  <h3>Qualifications</h3>
                </div>
                <div className="section-content" dangerouslySetInnerHTML={{ __html: renderEnhancedContent(job.qualifications) }} />
              </section>
            )}

            {/* Additional Details */}
            {job.details && (
              <section className="content-section">
                <div className="section-title-bar">
                  <BiInfoCircle className="bi" />
                  <h3>Additional Details</h3>
                </div>
                <div className="section-content" dangerouslySetInnerHTML={{ __html: renderEnhancedContent(job.details) }} />
              </section>
            )}

            {job.walkin_details && (
              <section className="content-section">
                <div className="section-title-bar">
                  <BiMapPin className="bi" />
                  <h3>Walk-In Details</h3>
                </div>
                {typeof job.walkin_details === 'string' ? (
                  <div className="section-content">
                    {walkinDetails ? (
                      <div style={{ textAlign: 'center', color: '#333' }}>
                        <div style={{ fontWeight: 700, marginBottom: '8px' }}>Time and Venue</div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          
                          {/* Date and Time */}
                          <div style={{ fontWeight: 700 }}>
                            {(walkinDetails.date ? `${walkinDetails.date} , ` : '')}{walkinDetails.timeRange || 'Missing'}
                          </div>

                          {/* Venue */}
                          <div style={{ fontWeight: 700 }}>
                            {walkinDetails.venue || (walkinDetails.locationsArr.length > 0 ? walkinDetails.locationsArr.join(', ') : 'Missing')}
                            {walkinDetails.mapQuery && (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(walkinDetails.mapQuery)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#0d6efd', marginLeft: 8, whiteSpace: 'nowrap', textDecoration: 'none' }}
                              >
                                (View on map)
                              </a>
                            )}
                          </div>

                          {/* Contact */}
                          <div style={{ fontWeight: 700 }}>
                            Contact - {walkinDetails.contactParts.length > 0 ? walkinDetails.contactParts.join(' ') : 'Missing'}
                          </div>

                        </div>
                      </div>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: renderEnhancedContent(String(job.walkin_details)) }} />
                    )}
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
                <BiShareAlt className="bi" />
                <h3>Share This Job</h3>
              </div>
              <div className="share-grid">
                <button className="share-button whatsapp" onClick={() => handleShare('whatsapp')}>
                  <BiLogoWhatsapp className="bi" />
                  <span>WhatsApp</span>
                </button>
                <button className="share-button linkedin" onClick={() => handleShare('linkedin')}>
                  <BiLogoLinkedin className="bi" />
                  <span>LinkedIn</span>
                </button>
                <button className="share-button facebook" onClick={() => handleShare('facebook')}>
                  <BiLogoFacebook className="bi" />
                  <span>Facebook</span>
                </button>
                <button className="share-button twitter" onClick={() => handleShare('twitter')}>
                  <BiLogoTwitter className="bi" />
                  <span>Twitter</span>
                </button>
                <button className="share-button telegram" onClick={() => handleShare('telegram')}>
                  <BiLogoTelegram className="bi" />
                  <span>Telegram</span>
                </button>
                <button className="share-button copy" onClick={() => handleShare('copy')}>
                  <BiLink className="bi" />
                  <span>Copy Link</span>
                </button>
              </div>
            </section>

            <GoogleAd slot="9894830873" minHeight="280px" immediate={true} fullWidthResponsive="true" />

            {/* About Company Section - Unique Design */}
            {(job.companyName || company?.name) && (job.companyLogoUrl || company?.logoUrl) && (job.aboutCompany || company?.about) && (
              <section className="content-section company-info-section">
                <div className="section-title-bar">
                  <BiBuilding className="bi" />
                  <h3>About the Company</h3>
                </div>
                <div className="company-info-header">
                  <div className="company-info-brand">
                      <div className="company-info-logo">
                         <img 
                           src={job.companyLogoUrl || company?.logoUrl} 
                           alt={job.companyName || company?.name} 
                           width="80"
                           height="80"
                           loading="lazy"
                           decoding="async"
                           sizes="(max-width: 640px) 60px, 80px"
                         />
                      </div>
                    <div className="company-info-text">
                      <h4>{job.companyName || company?.name}</h4>
                      {(job.companyWebsite || company?.website) && (
                        <a href={job.companyWebsite || company?.website} target="_blank" rel="noopener noreferrer" className="company-website-link">
                          <BiLinkExternal className="bi" /> Visit Website
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="company-info-body" dangerouslySetInnerHTML={{ __html: renderEnhancedContent(job.aboutCompany || company?.about) }}>
                </div>
              </section>
            )}

             <GoogleAd slot="6883129508" immediate={true} fullWidthResponsive="true" />

            <section className="community-section">
              <h3 className="community-title">Join Our Community</h3>
              <div className="community-actions">
                <a href="https://www.whatsapp.com/channel/0029VasadwXLikgEikBhWE1o" target="_blank" rel="noopener noreferrer" className="community-btn btn-whatsapp">
                  <BiLogoWhatsapp className="bi" /> Join WhatsApp Group
                </a>
                <a href="https://t.me/bcvworld" target="_blank" rel="noopener noreferrer" className="community-btn btn-telegram">
                  <BiLogoTelegram className="bi" /> Join Telegram Channel
                </a>
              </div>
            </section>

            <section className="comments-section">
              <h3 className="comments-title"><BiCommentDots className="bi" /> Comments ({comments.length})</h3>

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
                    <BiChat style={{ fontSize: '2rem', marginBottom: '12px', display: 'block', margin: '0 auto' }} />
                    <p style={{ margin: 0 }}>No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
            </section>

            {(loadingRelated || relatedJobs.length > 0) && (
              <section className="content-section company-jobs-section">
                <div className="section-title-bar">
                  <BiBriefcase className="bi" />
                  <h3>More from {job.companyName}</h3>
                </div>
                <div className="company-jobs-list">
                  {loadingRelated ? (
                     Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="company-job-item" style={{ pointerEvents: 'none' }}>
                         <div className="company-job-logo-wrapper" style={{ background: '#f0f0f0', border: 'none' }}></div>
                         <div className="company-job-details" style={{ width: '100%' }}>
                            <div style={{ height: '20px', width: '70%', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px' }}></div>
                            <div style={{ height: '14px', width: '40%', background: '#f0f0f0', borderRadius: '4px' }}></div>
                         </div>
                      </div>
                    ))
                  ) : (
                    relatedJobs.map(rJob => {
                      const slug = `${clean(rJob.jobTitle)}-${clean(job.companyName)}`;
                      return (
                      <Link
                        to={`/job?type=private&job_id=${rJob.id}&slug=${slug}&ref=${Math.random().toString(36).substring(7)}&token=${Math.random().toString(36).substring(7)}&src=bcvworld.com`}
                        key={rJob.id}
                        className="company-job-item"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      >
                      <div className="company-job-logo-wrapper">
                        <img 
                          src={job.companyLogoUrl || company?.logoUrl} 
                          alt={job.companyName || company?.name} 
                          width="48" 
                          height="48" 
                          loading="lazy" 
                        />
                      </div>
                      <div className="company-job-details">
                        <h4 className="company-job-title">{rJob.jobTitle}</h4>
                        <div className="company-job-meta">
                          {rJob.locations && rJob.locations.length > 0 && (
                            <span className="company-job-location"><BiMapPin className="bi" /> {rJob.locations[0]}</span>
                          )}
                          <span className="company-job-date">Posted {rJob.postedDate ? formatDateDDMMMYYYY(rJob.postedDate) : 'Recently'}</span>
                        </div>
                      </div>
                      <div className="company-job-arrow">
                        <BiChevronRight className="bi" />
                      </div>
                    </Link>
                  );
                }))}
                </div>
              </section>
            )}

            <section className="job-link-section">
              {isApplyMailto ? (
                <div className="job-link-row">
                  <span className="job-link-label">Job Link:</span>
                  <a href={applyHref} className="email-apply-link">
                    <BiEnvelope className="bi" /> {applyDisplayValue}
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
                    onClick={handleApply}
                  >
                    <BiLinkExternal className="bi" /> Click here to Apply Now
                  </a>
                </div>
              )}
            </section>

            <div className="job-navigation-section">
              <div className="job-navigation-wrapper">
                {prevJob && (
                  <Link
                    to={`/job?type=private&job_id=${prevJob.id}&slug=${clean(prevJob.jobTitle)}-${clean(prevJob.companyName)}&ref=${Math.random().toString(36).substring(7)}&token=${Math.random().toString(36).substring(7)}&src=bcvworld.com`}
                    className="nav-job-item previous-job"
                  >
                    <BiChevronLeft className="bi text-3xl text-gray-500" />
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
                    to={`/job?type=private&job_id=${nextJob.id}&slug=${clean(nextJob.jobTitle)}-${clean(nextJob.companyName)}&ref=${Math.random().toString(36).substring(7)}&token=${Math.random().toString(36).substring(7)}&src=bcvworld.com`}
                    className="nav-job-item next-job"
                  >
                    <div className="nav-job-details">
                      <span className="nav-direction-label">
                        Next Opportunity
                      </span>
                      <h4 className="nav-job-title">{nextJob.jobTitle}</h4>
                      <span className="nav-company-name">{nextJob.companyName}</span>
                    </div>
                    <div className="nav-logo-wrapper">
                      {(nextJob.companyLogoUrl) ? (
                        <img src={nextJob.companyLogoUrl} alt={nextJob.companyName || ''} className="nav-logo-img" width="48" height="48" loading="lazy" decoding="async" sizes="(max-width: 640px) 48px, 48px" />
                      ) : (
                        <div className="nav-logo-img"></div>
                      )}
                    </div>
                    <BiChevronRight className="bi text-3xl text-gray-500" />
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
              onClick={handleApply}
            >
              <BiLinkExternal className="bi" />
              <span>Apply Now</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
