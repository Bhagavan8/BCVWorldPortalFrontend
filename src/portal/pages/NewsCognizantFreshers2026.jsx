import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import SEO from '../components/SEO';
import '../assets/css/News.css';
import '../assets/css/NewsDetailRef.css';
import './JobDetails.css';
import { BiHome, BiChevronRight, BiUser, BiLogoFacebook, BiLogoInstagram, BiLogoWhatsapp, BiCommentDots, BiChat } from 'react-icons/bi';
import GoogleAd from '../components/GoogleAd';
import {BiSolidBadgeCheck,BiSolidUser } from 'react-icons/bi';
import { API_BASE_URL } from '../../utils/config';

const NewsCognizantFreshers2026 = () => {
  const title = 'Cognizant to Hire About 25,000 Freshers in 2026 – Complete Guide to Prepare, Get Shortlisted, and Crack the Interview';
  const description = 'Cognizant targets ~24,000–25,000 fresher hires in 2026, expanding its bottom-of-the-pyramid workforce strategy.';
  const keywords = 'Cognizant GenC, GenC Pro, GenC Next, 2026–2027 hiring, freshers, IT jobs';
  const image = '/assets/images/news/story.webp';
  const url = 'https://bcvworld.com/news/cognizant-25k-freshers-2026';
  const slug = 'cognizant-25k-freshers-2026';
  const returnToPath = (typeof window !== 'undefined' && window.location?.pathname) ? (window.location.pathname + window.location.search) : `/news/${slug}`;
  const publishedTime = new Date().toISOString();
  const section = 'Featured News';
  const tags = ['Cognizant', 'Freshers Hiring', 'IT Jobs 2026'];
  

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    image: [typeof window !== 'undefined' ? window.location.origin + image : image],
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: { '@type': 'Organization', name: 'BCVWORLD' },
    publisher: {
      '@type': 'Organization',
      name: 'BCVWORLD',
      logo: { '@type': 'ImageObject', url: (typeof window !== 'undefined' ? window.location.origin : '') + '/logo192.png' }
    },
    mainEntityOfPage: url
  };

  const [showMore, setShowMore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showLeftAd, setShowLeftAd] = useState(true);
  const [showRightAd, setShowRightAd] = useState(true);
  const [hideStickyAds, setHideStickyAds] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [postingComment, setPostingComment] = useState(false);
  const [user, setUser] = useState(null);
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const emphasize = (t) => {
    const keys = [
      'Cognizant','25,000','freshers','2026','2026–2027','GenC','GenC Pro','GenC Next',
      'Java','Python','C#','OOPs','collections','exception handling','multithreading','SQL',
      'Data Structures and Algorithms','DSA','projects','resume','interview','React','Spring Boot','Node.js','full-stack',
      'coding','aptitude','technical interview','HR interview', 'Cognizant’s'
    ];
    let out = t;
    keys.forEach(k => {
      const re = new RegExp(`\\b${escapeRegExp(k)}\\b`, 'gi');
      out = out.replace(re, (m) => `<strong>${m}</strong>`);
    });
    return out;
  };
  const websites = [
    { label: 'leetcode.com', url: 'https://leetcode.com', purpose: 'DSA problems' },
    { label: 'hackerrank.com', url: 'https://hackerrank.com', purpose: 'Coding + SQL' },
    { label: 'code360.com', url: 'https://code360.com', purpose: 'Interview practice' },
    { label: 'geeksforgeeks.org', url: 'https://geeksforgeeks.org', purpose: 'Concepts + theory' },
    { label: 'indiabix.com', url: 'https://indiabix.com', purpose: 'Quant + Logical' },
    { label: 'prepinsta.com', url: 'https://prepinsta.com', purpose: 'Company-specific questions' },
    { label: 'freshersworld.com', url: 'https://freshersworld.com', purpose: 'Placement tests' },
    { label: 'youtube.com', url: 'https://youtube.com', purpose: 'Free tutorials' },
    { label: 'freecodecamp.org', url: 'https://freecodecamp.org', purpose: 'Full stack courses' },
    { label: 'roadmap.sh', url: 'https://roadmap.sh', purpose: 'Learning paths' },
    { label: 'spring.io/guides', url: 'https://spring.io/guides', purpose: 'Spring Boot official docs' },
    { label: 'react.dev', url: 'https://react.dev', purpose: 'React docs' },
    { label: 'linkedin.com', url: 'https://linkedin.com', purpose: 'Networking + jobs' },
    { label: 'naukri.com', url: 'https://naukri.com', purpose: 'Off-campus hiring' },
    { label: 'indeed.com', url: 'https://indeed.com', purpose: 'Job search' },
    { label: 'github.com', url: 'https://github.com', purpose: 'Host projects' }
  ];
  useEffect(() => {
    const progressEl = document.querySelector('.reading-progress');
    const onScroll = () => {
      const article = document.getElementById('newsDetail');
      if (!article || !progressEl) return;
      const top = article.offsetTop;
      const total = article.scrollHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(window.scrollY - top, 0), total);
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      progressEl.style.setProperty('--scroll', `${pct}%`);
      const scrollPosition = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const distanceToBottom = docHeight - scrollPosition;
      setHideStickyAds(distanceToBottom < 400);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    const onResize = () => setIsMobile(window.innerWidth < 992);
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {}
    }
  }, []);

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const endpoints = [
          `${API_BASE_URL}/api/public/news/${slug}/comments`,
          `${API_BASE_URL}/api/news/${slug}/comments`,
          `${API_BASE_URL}/api/comments?type=NEWS&slug=${encodeURIComponent(slug)}`
        ];
        let loaded = false;
        for (const urlTry of endpoints) {
          const res = await fetch(urlTry, { headers: { Accept: 'application/json' } });
          if (res.ok) {
            const data = await res.json();
            setComments(Array.isArray(data) ? data : (data?.content || []));
            loaded = true;
            break;
          }
        }
        if (!loaded) setComments([]);
      } catch {}
    };
    fetchComments();
  }, []);

  const handlePostComment = async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      toast.error('Please login to comment');
      return;
    }
    let userObj;
    try {
      userObj = JSON.parse(userStr);
    } catch {
      toast.error('Invalid user session');
      return;
    }
    if (!commentText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    const actualUser = userObj.data || userObj.user || userObj;
    let userId = actualUser.id || actualUser.userId || actualUser.uid;
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
      toast.error('Invalid user session. Please logout and login again.');
      return;
    }
    // Match JobDetails behavior: simple JSON headers, no auth/CSRF
    const headers = { 'Content-Type': 'application/json' };
    setPostingComment(true);
    try {
      const payload = JSON.stringify({
        userId,
        user_id: userId,
        userName,
        email: userEmail,
        content: commentText,
        type: 'NEWS',
        slug
      });
      const postEndpoints = [
        `${API_BASE_URL}/api/public/news/${slug}/comments`,
        `${API_BASE_URL}/api/news/${slug}/comments`,
        `${API_BASE_URL}/api/comments`
      ];
      let success = false;
      let lastError = '';
      for (const urlTry of postEndpoints) {
        const response = await fetch(urlTry, { method: 'POST', headers, body: payload });
        if (response.ok) {
          const newComment = await response.json();
          setComments(prev => [newComment, ...prev]);
          setCommentText('');
          toast.success('Comment posted successfully!');
          success = true;
          break;
        } else {
          lastError = `${response.status} ${response.statusText}`;
          try {
            const txt = await response.text();
            if (txt) lastError += `: ${txt}`;
          } catch {}
        }
      }
      if (!success) toast.error(`Failed to post comment (${lastError || 'unknown error'})`);
    } catch {
      toast.error('Something went wrong');
    } finally {
      setPostingComment(false);
    }
  };
 
  return (
    <div className="job-details-page">
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        image={image}
        url={url}
        type="article"
        publishedTime={publishedTime}
        section={section}
        tags={tags}
        structuredData={structuredData}
      />

      <main className={`container-fluid py-4 main-content main-content-area ${(!isMobile && showLeftAd) ? 'has-left-ad' : ''} ${(!isMobile && showRightAd) ? 'has-right-ad' : ''}`}>
        <div className="news-hero" style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="news-hero-inner">
            <h1 className="news-hero-title">{title}</h1>
            <div className="news-hero-meta">
              
                         </div>
           
          </div>
        </div>
        {!isMobile && showLeftAd && (
          <div className="ad-column ad-left" style={{ opacity: hideStickyAds ? 0 : 1, pointerEvents: hideStickyAds ? 'none' : 'auto', transition: 'opacity 0.3s ease' }}>
            <div className="ad-sidebar">
              <button className="ad-close-btn" onClick={() => setShowLeftAd(false)} title="Close Ad">×</button>
              <div className="text-center text-gray-500 text-sm mb-2">Advertisement</div>
              <GoogleAd slot="7861382254" minHeight="600px" immediate={true} />
            </div>
          </div>
        )}
        {!isMobile && showRightAd && (
          <div className="ad-column ad-right" style={{ opacity: hideStickyAds ? 0 : 1, pointerEvents: hideStickyAds ? 'none' : 'auto', transition: 'opacity 0.3s ease' }}>
            <div className="ad-sidebar">
              <button className="ad-close-btn" onClick={() => setShowRightAd(false)} title="Close Ad">×</button>
              <div className="text-center text-gray-500 text-sm mb-2">Advertisement</div>
              <GoogleAd slot="2609055575" minHeight="600px" immediate={true} />
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-12">
            <article id="newsDetail" className="news-article">
              <div className="breadcrumb-wrapper">
               
                  <nav aria-label="breadcrumb" className="custom-breadcrumb">
                    <ol className="breadcrumb align-items-center">
                      <li className="breadcrumb-item">
                        <Link to="/" className="home-link">
                          <BiHome className="me-1" />
                          <span>Home</span>
                        </Link>
                      </li>
                      <li className="breadcrumb-separator">
                        <BiChevronRight />
                      </li>
                      <li className="breadcrumb-item active news-title text-truncate">
                        <span className="truncate-text">{title}</span>
                        <span className="ellipsis">...</span>
                      </li>
                    </ol>
                  </nav>
            
          
            <div className="post-meta-block">
              <div className="post-meta-author-row">
                <BiSolidUser style={{ fontSize: '18px' }} />
                <span className="post-meta-author">By BCVWORLD</span>
                <BiSolidBadgeCheck style={{ color: '#0066cc', fontSize: '14px' }} />
              </div>
              <div className="post-meta-date">Published on: {new Date(publishedTime).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div className="post-meta-share">
                <a className="share-mini fb" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" aria-label="Share to Facebook">
                  <BiLogoFacebook />
                </a>
                <a className="share-mini ig" href={`https://www.instagram.com/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" aria-label="Share to Instagram">
                  <BiLogoInstagram />
                </a>
                <a className="share-mini wa" href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`} target="_blank" rel="noreferrer" aria-label="Share to WhatsApp">
                  <BiLogoWhatsapp />
                </a>
              </div>
            </div>
          
              </div>

        
              

              <div className="article-content">
                <h2 className="article-heading">
                  Cognizant to Hire About <strong>25,000 Freshers</strong> in <strong>2026</strong> – Complete Guide to Prepare, Get Shortlisted, and Crack the Interview
                </h2>
                <div className="ad-section-responsive">
                  <div className="text-center text-gray-500 text-sm mb-2">Advertisement</div>
                  <GoogleAd slot="8604344637" layout="in-article" format="fluid" fullWidthResponsive="true" immediate={true} />
                </div>
                <p className="fs-5 lh-lg text-dark">
                  <span dangerouslySetInnerHTML={{ __html: emphasize('The year 2026 is shaping up to be a golden opportunity for fresh graduates who want to enter the IT industry. Cognizant, one of the world’s leading IT services and consulting companies, is expected to hire nearly 25,000 freshers across India and other global locations. This large-scale hiring plan means thousands of opportunities in software development, testing, support, cloud, and data-related roles. For students and recent graduates, this is not just another hiring drive — it is a career-defining chance to start with a reputed multinational company that offers strong learning, stable growth, and international exposure. However, while the number sounds huge, competition will also be intense. Only candidates with the right preparation, skills, and presentation will stand out.') }} />
                </p>
                <p className="fs-5 lh-lg text-dark">
                  <span dangerouslySetInnerHTML={{ __html: emphasize('To succeed in such mass hiring, the first thing you must understand is that companies like Cognizant do not expect freshers to know everything, but they expect strong fundamentals. Your core programming knowledge must be solid. Choose at least one primary language such as Java, Python, or C#, and learn it deeply instead of learning many languages superficially. If you choose Java, focus clearly on concepts like OOPs, collections, exception handling, multithreading basics, and database connectivity. Interviewers often test how well you understand fundamentals rather than advanced frameworks. If you can explain concepts clearly and write clean code, you are already ahead of many candidates.') }} />
                </p>
                <div className="ad-section-responsive">
                  <div className="text-center text-gray-500 text-sm mb-2">Advertisement</div>
                  <GoogleAd slot="9585517720" layout="in-article" format="fluid" fullWidthResponsive="true" immediate={true} />
                </div>
                <p className="fs-5 lh-lg text-dark">
                  <span dangerouslySetInnerHTML={{ __html: emphasize('Along with programming, Data Structures and Algorithms play a major role in shortlisting. Many candidates get rejected in the coding round because they lack problem-solving skills. You should practice arrays, strings, linked lists, stacks, queues, hash maps, recursion, trees, sorting, and searching techniques regularly. The goal is not memorizing solutions but developing logical thinking. Spend time solving problems daily and learn how to optimize your approach. Even medium-level questions can become easy once you build consistency. Recruiters look for candidates who can think logically under pressure, not just those who know syntax.') }} />
                </p>
                <p className="fs-5 lh-lg text-dark">
                  <span dangerouslySetInnerHTML={{ __html: emphasize('Another area that freshers often underestimate is databases and SQL. In real-world projects, most applications interact with databases, so SQL knowledge becomes essential. You must know how to write queries using SELECT, JOIN, GROUP BY, and subqueries. You should also understand indexes, normalization, and transactions. During interviews, simple SQL questions are frequently asked, and being comfortable with them creates a strong impression. Good database knowledge also helps you design better projects, which improves your resume quality.') }} />
                </p>
                <p className="fs-5 lh-lg text-dark">
                  <span dangerouslySetInnerHTML={{ __html: emphasize('In today’s market, web development skills significantly increase your chances of selection. Companies prefer candidates who can build end-to-end applications rather than only writing basic programs. Learning HTML, CSS, JavaScript, and a frontend framework like React will help you create modern interfaces. Pair this with a backend technology such as Spring Boot or Node.js to build complete full-stack applications. When you show that you can develop both frontend and backend, recruiters see you as more job-ready. Full-stack developers are often given priority because they can contribute to projects quickly.') }} />
                </p>
                <p className="fs-5 lh-lg text-dark">
                  <span dangerouslySetInnerHTML={{ __html: emphasize('Preparation becomes easier when you follow a structured roadmap. Instead of studying randomly, divide your preparation month by month. Spend the first couple of months mastering programming basics and SQL. Then dedicate time to Data Structures and Algorithms practice. After that, move into frontend and backend development and start building real projects. Finally, focus on resume preparation, mock interviews, and applying for jobs. A clear plan avoids burnout and keeps you progressing steadily. Consistency for six months can completely transform your profile.') }} />
                </p>
                <div className="ad-section-responsive">
                  <div className="text-center text-gray-500 text-sm mb-2">Advertisement</div>
                  <GoogleAd slot="8861804438" layout="in-article" format="fluid" fullWidthResponsive="true" immediate={true} />
                </div>
                <p className="fs-5 lh-lg text-dark">
                  <span dangerouslySetInnerHTML={{ __html: emphasize('Projects are one of the most important elements that help you get shortlisted. Recruiters rarely pay attention to simple academic projects like calculators or static websites. They want to see real-world applications that demonstrate problem-solving and technical skills. Building projects such as a job portal, employee management system, e-commerce platform, or bug tracking system shows practical understanding. Your project should include authentication, APIs, database integration, and deployment. Hosting your project online and sharing the GitHub link adds credibility. When interviewers see a live application, they immediately recognize your effort and seriousness.') }} />
                </p>
                <p className="fs-5 lh-lg text-dark">
                  <span dangerouslySetInnerHTML={{ __html: emphasize('While building projects, focus on quality rather than quantity. Two strong projects are better than ten weak ones. Write clean code, follow proper folder structure, and add documentation. Mention challenges you faced and how you solved them. These details become great talking points during interviews. Often, technical interviews revolve around your project discussion. If you can confidently explain architecture, database design, and implementation choices, you will stand out naturally without needing fancy answers.') }} />
                </p>
                 <div className="ad-section-responsive">
                  <div className="text-center text-gray-500 text-sm mb-2">Advertisement</div>
                  <GoogleAd slot="4010601300" layout="in-article" format="fluid" fullWidthResponsive="true" immediate={true} />
                </div>
                <p className="fs-5 lh-lg text-dark">
                  <span dangerouslySetInnerHTML={{ __html: emphasize('Your resume acts as your first impression, so it must be clean, simple, and impactful. Keep it to one page and avoid unnecessary information. Clearly group your skills into languages, frameworks, databases, and tools. Highlight your projects with bullet points and measurable achievements, such as performance improvements or features implemented. Add GitHub and LinkedIn links so recruiters can verify your work. Avoid long paragraphs or complex designs. A well-structured resume that quickly communicates your strengths increases your chances of getting shortlisted significantly.') }} />
                </p>
                <p className="fs-5 lh-lg text-dark">
                  Understanding the selection process also helps you prepare smartly. Typically, Cognizant’s hiring process includes an aptitude test, a coding round, a technical interview, and an HR round. Aptitude checks logical reasoning and basic mathematics. Coding rounds test problem-solving skills. Technical interviews focus on programming fundamentals and projects. HR interviews evaluate communication skills and cultural fit. If you prepare for each stage systematically, the process becomes much less stressful. Many candidates fail simply because they don’t know what to expect.
                </p>
                <p className="fs-5 lh-lg text-dark">
                  During interviews, confidence and clarity matter as much as knowledge. Speak slowly, explain your thoughts clearly, and don’t rush answers. If you don’t know something, admit honestly and try to reason it out. Interviewers appreciate honesty more than guessing. Most importantly, know your projects inside out. Be prepared to explain every line of code and design decision. Your project is your strongest weapon, so treat it seriously.
                </p>
                <p className="fs-5 lh-lg text-dark">
                  Daily habits can make a big difference over time. Spend a few hours each day coding, solving problems, and improving your project. Read about new technologies, contribute to GitHub, and update your LinkedIn profile regularly. Networking with professionals and applying to jobs consistently also increases your exposure. Opportunities often come when preparation meets visibility. The more active you are, the higher your chances of getting noticed.
                </p>
                <p className="fs-5 lh-lg text-dark">
                  In conclusion, the upcoming fresher hiring drive by Cognizant is a huge opportunity, but success will depend on preparation and smart work. Focus on fundamentals, practice coding daily, build strong projects, create a clean resume, and prepare confidently for interviews. With the right strategy and consistency, you can absolutely secure your place among the selected candidates. Treat this journey as an investment in yourself, and stay disciplined. If you start today and stick to your plan, 2026 could very well be the year you launch your professional career with one of the most respected IT companies in the world.
                </p>

               
                  <div className="ad-section-responsive">
                  <div className="text-center text-gray-500 text-sm mb-2">Advertisement</div>
                  <GoogleAd slot="1982359870" layout="in-article" format="fluid" fullWidthResponsive="true" immediate={true} />
                </div>
                <div className="content-section">
                  <h3>1. What to Study – Skill Preparation (Core Technical)</h3>
                  <div className="table-container">
                    <table className="responsive-table">
                      <thead>
                        <tr>
                          <th>Area</th>
                          <th>Topics to Cover</th>
                          <th>Level Needed</th>
                          <th>Why Important</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Programming (Java/Python/C#)</td>
                          <td>OOPs, Collections, Exception Handling, Loops, APIs</td>
                          <td>Strong</td>
                          <td>Used in coding + interviews</td>
                        </tr>
                        <tr>
                          <td>DSA</td>
                          <td>Arrays, Strings, Stack, Queue, HashMap, Trees, Sorting</td>
                          <td>Medium</td>
                          <td>Coding round elimination</td>
                        </tr>
                        <tr>
                          <td>SQL/DBMS</td>
                          <td>SELECT, JOIN, GROUP BY, Index, Normalization</td>
                          <td>Medium</td>
                          <td>Real project + interviews</td>
                        </tr>
                        <tr>
                          <td>Web Basics</td>
                          <td>HTML, CSS, JS</td>
                          <td>Basic</td>
                          <td>Frontend knowledge</td>
                        </tr>
                        <tr>
                          <td>React/Angular</td>
                          <td>Components, State, API calls</td>
                          <td>Medium</td>
                          <td>Full stack roles</td>
                        </tr>
                        <tr>
                          <td>Backend (Spring Boot/Node)</td>
                          <td>REST APIs, CRUD, Auth</td>
                          <td>Medium</td>
                          <td>Backend roles</td>
                        </tr>
                        <tr>
                          <td>Testing</td>
                          <td>SDLC, STLC, Selenium basics</td>
                          <td>Basic</td>
                          <td>Testing/support roles</td>
                        </tr>
                        <tr>
                          <td>Cloud</td>
                          <td>AWS EC2, Deploy app, GitHub CI/CD</td>
                          <td>Basic–Medium</td>
                          <td>Resume booster</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-dark">If confused: Java + Spring Boot + React + SQL = safest combo</p>
                </div>

                <div className="content-section">
                  <h3>2. Cognizant Exam Pattern (Selection Process)</h3>
                  <div className="table-container">
                    <table className="responsive-table">
                      <thead>
                        <tr>
                          <th>Round</th>
                          <th>What They Test</th>
                          <th>Syllabus</th>
                          <th>How to Prepare</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Aptitude</td>
                          <td>Logical + Quant + English</td>
                          <td>Percentages, Time & Work, Puzzles, Grammar</td>
                          <td>Practice daily mock tests</td>
                        </tr>
                        <tr>
                          <td>Coding</td>
                          <td>1–2 programs</td>
                          <td>Arrays/Strings/Logic</td>
                          <td>LeetCode easy–medium</td>
                        </tr>
                        <tr>
                          <td>Technical Interview</td>
                          <td>Core knowledge</td>
                          <td>OOPs, SQL, Projects, APIs</td>
                          <td>Revise fundamentals + projects</td>
                        </tr>
                        <tr>
                          <td>HR Interview</td>
                          <td>Communication</td>
                          <td>Tell me about yourself, relocation, goals</td>
                          <td>Practice speaking</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="content-section">
                  <h3>3. Detailed Aptitude Syllabus</h3>
                  <div className="table-container">
                    <table className="responsive-table">
                      <thead>
                        <tr>
                          <th>Section</th>
                          <th>Topics</th>
                          <th>Preparation Websites</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Quantitative</td>
                          <td>Percentages, Profit & Loss, Ratio, Time & Work, Speed</td>
                          <td><a href="https://indiabix.com" target="_blank" rel="noreferrer">IndiaBix</a>, <a href="https://prepinsta.com" target="_blank" rel="noreferrer">PrepInsta</a></td>
                        </tr>
                        <tr>
                          <td>Logical</td>
                          <td>Puzzles, Seating, Blood relations, Coding-decoding</td>
                          <td><a href="https://freshersworld.com" target="_blank" rel="noreferrer">Freshersworld</a>, <a href="https://testbook.com" target="_blank" rel="noreferrer">Testbook</a></td>
                        </tr>
                        <tr>
                          <td>Verbal</td>
                          <td>Synonyms, Grammar, Reading comprehension</td>
                          <td><a href="https://www.grammarly.com/blog/" target="_blank" rel="noreferrer">Grammarly Blog</a>, <a href="https://indiabix.com" target="_blank" rel="noreferrer">IndiaBix</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="content-section">
                  <h3>4. Coding Preparation</h3>
                  <div className="table-container">
                    <table className="responsive-table">
                      <thead>
                        <tr>
                          <th>Topic</th>
                          <th>What to Practice</th>
                          <th>Problems Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>Arrays</td><td>Reverse, rotate, two sum</td><td>25</td></tr>
                        <tr><td>Strings</td><td>Palindrome, anagram, substring</td><td>25</td></tr>
                        <tr><td>Hashing</td><td>Frequency count, duplicates</td><td>20</td></tr>
                        <tr><td>Stack/Queue</td><td>Balanced brackets</td><td>15</td></tr>
                        <tr><td>Linked List</td><td>Reverse, detect loop</td><td>15</td></tr>
                        <tr><td>Trees</td><td>Traversals</td><td>20</td></tr>
                        <tr><td>Sorting/Search</td><td>Binary search, merge sort</td><td>20</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-dark">Total target: 150–200 problems</p>
                </div>

                <div className="content-section">
                  <h3>5. Project Ideas (Very Important for Resume)</h3>
                  <div className="table-container">
                    <table className="responsive-table">
                      <thead>
                        <tr>
                          <th>Project</th>
                          <th>Tech Stack</th>
                          <th>Features to Include</th>
                          <th>Difficulty</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>Job Portal</td><td>Spring Boot + React + MySQL</td><td>Login, Apply, Admin panel</td><td>⭐⭐⭐</td></tr>
                        <tr><td>E-commerce</td><td>Full stack</td><td>Cart, Orders, Payment mock</td><td>⭐⭐⭐</td></tr>
                        <tr><td>Employee Mgmt</td><td>Backend + DB</td><td>CRUD, roles, reports</td><td>⭐⭐</td></tr>
                        <tr><td>Bug Tracker</td><td>Testing + API</td><td>Tickets, status, logs</td><td>⭐⭐</td></tr>
                        <tr><td>Chat App</td><td>WebSocket + React</td><td>Real-time messages</td><td>⭐⭐⭐⭐</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-dark">Minimum: 2 strong projects</p>
                </div>
                <div className="ad-section-responsive">
                  <div className="text-center text-gray-500 text-sm mb-2">Advertisement</div>
                  <GoogleAd slot="6361432479" layout="in-article" format="fluid" fullWidthResponsive="true" immediate={true} />
                </div>

                <div className="content-section">
                  <h3>6. Resume Preparation Checklist</h3>
                  <div className="table-container">
                    <table className="responsive-table">
                      <thead>
                        <tr><th>Section</th><th>What to Add</th><th>Tips</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>Header</td><td>Name + Phone + Email + GitHub</td><td>Keep simple</td></tr>
                        <tr><td>Skills</td><td>Grouped properly</td><td>Don’t dump random tech</td></tr>
                        <tr><td>Projects</td><td>2–3 strong ones</td><td>Add metrics</td></tr>
                        <tr><td>Education</td><td>Degree + CGPA</td><td>Short</td></tr>
                        <tr><td>Certifications</td><td>Optional</td><td>Only relevant ones</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <ul className="mt-2 text-dark">
                    <li>Designed REST APIs handling 5k+ users</li>
                    <li>Reduced load time by 40%</li>
                  </ul>
                  <p className="text-dark">Metrics = recruiter attention 🚀</p>
                </div>
               

                <div className="content-section">
                  <h3>7. Best Websites to Prepare</h3>
                  <div className="table-container">
                    <table className="responsive-table">
                      <thead><tr><th>Website</th><th>Purpose</th></tr></thead>
                      <tbody>
                        {(showMore ? websites : websites.slice(0, 8)).map((w) => (
                          <tr key={w.label}>
                            <td><a href={w.url} target="_blank" rel="noreferrer">{w.label}</a></td>
                            <td>{w.purpose}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {!showMore && (
                    <div className="mt-2">
                      <button className="btn btn-outline-primary" onClick={() => setShowMore(true)}>Click to add more</button>
                    </div>
                  )}
                </div>
               

                <div className="content-section">
                  <h3>8. 6-Month Study Plan (Daily Routine)</h3>
                  <div className="table-container">
                    <table className="responsive-table">
                      <thead><tr><th>Month</th><th>Focus</th></tr></thead>
                      <tbody>
                        <tr><td>1</td><td>Programming basics</td></tr>
                        <tr><td>2</td><td>SQL + OOPs</td></tr>
                        <tr><td>3</td><td>DSA practice</td></tr>
                        <tr><td>4</td><td>Frontend (React)</td></tr>
                        <tr><td>5</td><td>Backend (Spring Boot) + Projects</td></tr>
                        <tr><td>6</td><td>Resume + Mock interviews + Apply</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <ul className="mt-2 text-secondary">
                    <li>2 hrs coding</li>
                    <li>2 hrs DSA</li>
                    <li>1 hr project with professional UI/UX, mobile responsive</li>
                  </ul>
                </div>
                <div className="ad-section-responsive">
                  <div className="text-center text-gray-500 text-sm mb-2">Advertisement</div>
                  <GoogleAd slot="1352648370" layout="in-article" format="fluid" fullWidthResponsive="true" immediate={true} />
                </div>

                <div className="content-section">
                  <h3>Cognizant GenC Selection Process (2026–2027)</h3>
                  <div className="table-container">
                    <table className="responsive-table">
                      <thead>
                        <tr><th>Round</th><th>Duration</th><th>Focus</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>Communication Assessment</td><td>~60 mins</td><td>Listening, speaking, reading, grammar (AI-based)</td></tr>
                        <tr><td>Aptitude Test</td><td>~80 mins</td><td>Quantitative Aptitude and Game-Based Aptitude</td></tr>
                        <tr><td>Technical Assessment</td><td>~120 mins</td><td>2 Coding, 2 SQL, 1 HTML/CSS task, 10 Cloud/Web MCQs</td></tr>
                        <tr><td>Technical + HR Interview</td><td>Varies</td><td>DSA, DBMS, OS, networking + behavioral</td></tr>
                      </tbody>
                    </table>
                  </div>
                  <ul className="mt-2 text-dark">
                    <li>No negative marking in assessments</li>
                    <li>Eligibility often requires 70% in 10th/12th/UG/PG with no active backlogs</li>
                    <li>Platform: online phases (typically Superset), single attempt per assessment</li>
                    <li>Applicable across 2026–2027 hiring phases</li>
                  </ul>

                  <div className="table-container mt-2">
                    <table className="responsive-table">
                      <thead>
                        <tr><th>Role</th><th>Package (Approx.)</th><th>Notes</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>GenC</td><td>₹4.0 LPA</td><td>Entry-level engineer</td></tr>
                        <tr><td>GenC Pro</td><td>₹5.4 LPA</td><td>Advanced technical proficiency</td></tr>
                        <tr><td>GenC Next</td><td>₹6.75 LPA</td><td>Higher performance and select roles</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="ad-section-responsive">
                  <div className="text-center text-gray-500 text-sm mb-2">Advertisement</div>
                  <GoogleAd slot="1384437960" layout="in-article" format="fluid" fullWidthResponsive="true" immediate={true} />
                </div>

                <div className="content-section">
                  <h3>Cognizant GenC Mandatory Section Breakdown</h3>
                  <div className="table-container">
                    <table className="responsive-table">
                      <thead>
                        <tr><th>Section</th><th>No. of Questions</th><th>Time</th><th>Difficulty</th></tr>
                      </thead>
                      <tbody>
                        <tr><td>Communication (Reading, Grammar, Listening, Speaking)</td><td>60</td><td>60 mins</td><td>Medium</td></tr>
                        <tr><td>Aptitude (Quant + Game-Based)</td><td>80</td><td>80 mins</td><td>High</td></tr>
                        <tr><td>Technical Assessment</td><td>2 Coding + 2 SQL + 1 HTML/CSS + 10 Cloud MCQs</td><td>120 mins</td><td>High</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="content-section">
                  <h3>Interview Focus Areas</h3>
                  <ul className="mt-1 text-dark">
                    <li>Problem articulation and algorithm capability</li>
                    <li>Programming concepts (Java/Python), cognitive abilities, right attitude</li>
                    <li>DBMS, OS, networking fundamentals</li>
                  </ul>
                </div>

                <div className="content-section">
                  <h3>Eligibility (GenC 2026)</h3>
                  <ul className="mt-1 text-dark">
                    <li>2026 pass-outs: B.Tech, B.E., M.E., M.Tech</li>
                    <li>No standing arrears; education gap ≤ 1 year</li>
                    <li>Aggregate ≥ 60% or CGPA  6</li>
                  </ul>
                </div>
              </div>

              

              

              

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
                      <Link to={`/login?returnTo=${encodeURIComponent(returnToPath)}`} className="login-btn">
                        Login to Comment
                      </Link>
                    </div>
                  )}
                </div>
                <div className="comments-list">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <div key={comment.id || `${comment.userId}-${comment.createdAt}`} className="comment-item">
                        <div className="comment-avatar">
                          {comment.userName ? comment.userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="comment-content">
                          <div className="comment-header">
                            <span className="comment-author">{comment.userName || 'User'}</span>
                            <span className="comment-date">
                              {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
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

              
            </article>

            

            

            {/* Related Articles removed */}
          </div>
        </div>
      </main>

      <div className="reading-progress"></div>
    </div>
  );
};

export default NewsCognizantFreshers2026;
