import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import '../assets/css/News.css';
import '../assets/css/NewsDetailRef.css';
import GoogleAd from '../components/GoogleAd';
import { 
  BiHome, 
  BiChevronRight, 
  BiLogoFacebook, 
  BiLogoTwitter, 
  BiLogoWhatsapp 
} from 'react-icons/bi';

const NewsCognizantFreshers2026 = () => {
  const title = 'Cognizant to Hire 25,000 Freshers in 2026';
  const description = 'Cognizant plans to hire 24,000–25,000 freshers in 2026, a major opportunity for engineering and CS graduates focusing on digital, cloud, and AI services.';
  const keywords = 'Cognizant hiring 2026, freshers jobs, IT jobs, campus placements, software developer jobs, programmer analyst trainee, QA engineer, cloud associate, Java, Python, DSA, projects, job portal';
  const image = '/assets/images/news/story.webp';
  const url = 'https://bcvworld.com/news/cognizant-25k-freshers-2026';
  const publishedTime = new Date().toISOString();
  const section = 'Featured News';
  const tags = ['Cognizant', 'Freshers Hiring', 'IT Jobs 2026', 'Campus Placements', 'Digital', 'Cloud', 'AI'];
  const readingTime = '5 min read';
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    image: [window.location.origin + image],
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: { '@type': 'Organization', name: 'BCVWORLD' },
    publisher: {
      '@type': 'Organization',
      name: 'BCVWORLD',
      logo: { '@type': 'ImageObject', url: window.location.origin + '/logo192.png' }
    },
    mainEntityOfPage: url
  };

  useEffect(() => {
    const progressEl = document.querySelector('.reading-progress');
    const onScroll = () => {
      const article = document.getElementById('newsDetail');
      if (!article || !progressEl) return;
      const top = article.offsetTop;
      const total = article.scrollHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(window.scrollY - top, 0), total);
      const pct = total > 0 ? (scrolled / total) * 100 : 0;
      progressEl.style.width = `${pct}%`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="news-detail-page bg-white pb-5">
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

      <main className="container-fluid py-4 main-content">
        <div className="row">
          <div className="col-lg-2">
            <div className="sticky-sidebar">
              <div className="ad-space vertical-ad mb-4" id="left-sidebar-ad">
                <GoogleAd slot="9038226694" minHeight="280px" />
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <article id="newsDetail" className="news-article">
              <div className="breadcrumb-wrapper">
                <div className="container p-0">
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
                      <li className="breadcrumb-item">
                        <Link to="/news" className="home-link">
                          <span>News</span>
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
                </div>
              </div>

              <div className="ad-section-responsive">
                <GoogleAd slot="3330604448" minHeight="250px" immediate={true} />
              </div>

              <div className="article-header mb-4">
                <div className="category-badge">Featured</div>
                <h1 className="article-title">{title}</h1>
                <div className="article-meta">
                  <span className="author">BCVWORLD Editorial</span>
                  <span className="date">{new Date(publishedTime).toLocaleDateString()}</span>
                  <span className="reading-time">{readingTime}</span>
                </div>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <a className="btn btn-sm btn-outline-primary" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" aria-label="Share to Facebook">Facebook</a>
                  <a className="btn btn-sm btn-outline-info" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noreferrer" aria-label="Share to Twitter">Twitter</a>
                  <a className="btn btn-sm btn-outline-success" href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`} target="_blank" rel="noreferrer" aria-label="Share to WhatsApp">WhatsApp</a>
                </div>
              </div>

              <div className="featured-image-container mb-4">
                <img
                  src={image}
                  alt={title}
                  className="img-fluid rounded-4 shadow-sm"
                  style={{ maxHeight: '320px', width: '100%', height: 'auto', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/images/news/story.webp';
                  }}
                />
              </div>

              <div className="social-share-sidebar">
                <a className="social-share-btn facebook" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer" aria-label="Share to Facebook"><BiLogoFacebook /></a>
                <a className="social-share-btn twitter" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noreferrer" aria-label="Share to Twitter"><BiLogoTwitter /></a>
                <a className="social-share-btn whatsapp" href={`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`} target="_blank" rel="noreferrer" aria-label="Share to WhatsApp"><BiLogoWhatsapp /></a>
              </div>

              <div className="article-content" data-ad-slots="3297555670,3963785998,7711459312,2542893115,9887848907,1054551626">
                <p data-paragraph="0" className="lead text-secondary">
                  In a strong signal of confidence in the technology services market, Cognizant has announced plans to hire approximately
                  24,000–25,000 freshers in 2026, marking a 20% increase over its 2025 intake of nearly 20,000 graduates. This expansion
                  reflects the company’s long-term workforce strategy and growing demand for digital, cloud, and AI-driven services across
                  global clients. For thousands of engineering and computer science graduates, this could translate into one of the biggest
                  hiring opportunities in the IT services sector next year.
                </p>

                <h3 className="h5 mt-4 fw-semibold">Workforce Strategy</h3>
                <p data-paragraph="1" className="fs-5 lh-lg text-secondary">
                  Speaking during the quarterly earnings discussion, CEO Ravi Kumar S highlighted Cognizant’s focus on strengthening what is
                  often called the “bottom of the pyramid” workforce model. In simple terms, the company aims to build a larger base of
                  entry-level engineers who can be trained internally and deployed across projects. This approach not only helps control costs
                  but also ensures a steady pipeline of skilled professionals who can adapt quickly to evolving technologies and client
                  requirements.
                </p>

                <h3 className="h5 mt-4 fw-semibold">Entry-Level Roles</h3>
                <p data-paragraph="2" className="fs-5 lh-lg text-secondary">
                  For freshers, this strategy opens the door to multiple entry-level roles such as programmer analyst trainee, software
                  developer, quality assurance engineer, and support or cloud associates. These positions typically come with structured
                  onboarding programs, technical training, and real project exposure. Unlike lateral hiring, where experience is mandatory,
                  these roles prioritize learning ability, strong fundamentals, and problem-solving skills, making them ideal for recent
                  graduates.
                </p>

                <div className="bg-light p-4 rounded-3 border">
                  <h3 className="h6 mb-3 text-dark">Practical Projects</h3>
                  <ul className="mb-0">
                    <li>Task manager with authentication and REST APIs</li>
                    <li>Job portal with search, filters, and application tracking</li>
                    <li>E-commerce site with cart, orders, and admin dashboard</li>
                  </ul>
                </div>

                <h3 className="h5 mt-4 fw-semibold">Broader Skills</h3>
                <p className="fs-5 lh-lg text-secondary">
                  Building real-world projects is equally important. Recruiters prefer candidates who can demonstrate what they have built
                  rather than what they have memorized. Simple applications such as a task manager, job portal, or e-commerce website can
                  showcase problem-solving skills and technical confidence. Adding exposure to trending technologies like cloud platforms,
                  DevOps tools, automation testing, or data analytics can further strengthen employability and help candidates stand out
                  during resume shortlisting.
                </p>

                <h3 className="h5 mt-4 fw-semibold">Soft Skills</h3>
                <p className="fs-5 lh-lg text-secondary">
                  Apart from technical expertise, soft skills play a crucial role in service-based companies. Since employees interact
                  directly with clients, communication, teamwork, and adaptability are highly valued. Being able to clearly explain your
                  project, discuss challenges you solved, and show a willingness to learn can often make a stronger impression than complex
                  theoretical knowledge.
                </p>

                <div className="bg-white border rounded-3 p-4 mt-4">
                  <h3 className="h6 mb-3 text-dark">Key Highlights</h3>
                  <ul className="mb-0">
                    <li>Intake target: 24,000–25,000 freshers in 2026</li>
                    <li>Focus areas: Digital, Cloud, AI-driven services</li>
                    <li>Entry-level roles: Programmer Analyst, Developer, QA, Cloud/Support</li>
                    <li>Core skills: One language, DSA, databases, APIs, Git</li>
                    <li>Standout factor: Real projects and clear communication</li>
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-3 p-4 mt-4">
                  <h3 className="h6 mb-3 text-blue-700">How to Prepare</h3>
                  <ul className="mb-0">
                    <li>Pick Java or Python and complete a structured roadmap</li>
                    <li>Practice DSA daily; aim for 100+ problems</li>
                    <li>Build 2–3 projects and deploy them</li>
                    <li>Document work clearly in a portfolio and resume</li>
                  </ul>
                </div>

                <h3 className="h5 mt-4 fw-semibold">Outlook</h3>
                <p className="fs-5 lh-lg text-secondary">
                  Overall, Cognizant’s plan to hire 25,000 freshers represents more than just numbers — it signals renewed momentum in the IT
                  job market and a significant opportunity for aspiring engineers. For students willing to prepare strategically over the next
                  few months, this hiring wave could be the perfect gateway into the tech industry. With the right combination of
                  fundamentals, projects, and confidence, landing a role at Cognizant is not just possible — it’s well within reach.
                </p>
              </div>

              <div className="ad-section-responsive">
                <GoogleAd slot="6662935672" minHeight="250px" immediate={false} />
              </div>

              <div className="article-source mt-3" id="articleSourceContainer"></div>

              <div className="ad-section-responsive">
                <GoogleAd slot="6340320288" minHeight="250px" immediate={false} />
              </div>

              <div className="article-tags mt-4"></div>

              <div className="comments-section mt-4">
                <h3>Comments (<span id="commentCount">0</span>)</h3>
                <div id="commentsContainer" className="comments-list mb-4"></div>
                <div className="comment-form mt-4">
                  <div id="loginPrompt" className="alert alert-info d-none">
                    Please <Link to="/login" id="loginLink">login</Link> to post a comment.
                  </div>
                  <div id="commentFormContent">
                    <textarea id="commentText" className="form-control" placeholder="Write your comment..." rows="3"></textarea>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <small className="text-muted">Maximum 500 characters</small>
                      <button id="postComment" className="btn btn-primary">Post Comment</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ad-section-responsive">
                <GoogleAd slot="5885040623" format="fluid" style={{ textAlign: 'center' }} minHeight="180px" immediate={false} />
              </div>

              <nav className="article-navigation" aria-label="Article navigation">
                <div className="nav-links d-flex justify-content-between">
                  <Link to="/news" className="nav-item prev text-decoration-none" aria-label="Previous">
                    <div className="nav-content">
                      <span className="nav-label">Back</span>
                      <h4 className="nav-title">More News & Insights</h4>
                      <span className="nav-meta"><span className="nav-category">News</span></span>
                    </div>
                  </Link>

                  <Link to="/jobs" className="nav-item next text-decoration-none" aria-label="Next">
                    <div className="nav-content text-end">
                      <span className="nav-label">Explore</span>
                      <h4 className="nav-title">Latest Jobs on BCVWorld</h4>
                      <span className="nav-meta"><span className="nav-category">Jobs</span></span>
                    </div>
                  </Link>
                </div>
              </nav>

              <div className="ad-section-responsive mb-4">
                <GoogleAd slot="8172701732" minHeight="250px" immediate={false} />
              </div>

              {/* Related Articles section removed as requested */}

              <div className="ad-section-responsive mt-4">
                <GoogleAd slot="1606582944" minHeight="250px" immediate={false} />
              </div>
            </article>
          </div>

          <div className="col-lg-3">
            <div className="sticky-sidebar">
              <div className="ad-section-responsive">
                <GoogleAd slot="4120516902" minHeight="250px" />
              </div>
              <div className="ad-section-responsive">
                <GoogleAd slot="6722521710" minHeight="250px" />
              </div>
              <div className="ad-space sidebar-ad mb-4" id="right-sidebar-ad">
                <GoogleAd slot="4287736546" minHeight="280px" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="reading-progress"></div>
    </div>
  );
};

export default NewsCognizantFreshers2026;
