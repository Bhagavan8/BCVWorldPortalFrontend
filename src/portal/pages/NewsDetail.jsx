import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import NewsService from '../services/NewsService';
import '../assets/css/News.css';
import '../assets/css/NewsDetailRef.css';
import { FaCalendarAlt, FaUser, FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { BiSolidBadgeCheck } from 'react-icons/bi';
import SEO from '../components/SEO';
import GoogleAd from '../components/GoogleAd';

const NewsDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const res = await NewsService.getNewsById(id);
                let d = res?.data;

                // If backend accidentally returns a list, pick the item matching id
                if (Array.isArray(d)) {
                    const picked = d.find(item => String(item?.id) === String(id)) || d[0];
                    d = picked || {};
                } else if (d && typeof d === 'object' && String(d?.id) !== String(id)) {
                    // If id mismatched due to proxy/caching, accept object but log
                    console.warn('NewsDetail: Response id mismatch', d?.id, 'expected', id);
                }

                const normalizeSubPoints = (arr) => {
                    if (!Array.isArray(arr)) return [];
                    return arr
                      .map(sp => {
                        const text = (sp?.text ?? '').toString().trim();
                        const boldVal = sp?.bold === true || sp?.isBold === true;
                        return text ? { id: sp?.id, text, bold: boldVal, isBold: boldVal } : null;
                      })
                      .filter(Boolean);
                };

                const normalizePara = (p) => {
                    if (!p) return null;
                    let text = (p?.text ?? '').toString().trim();
                    const subPoints = normalizeSubPoints(p?.subPoints);
                    if (!text && subPoints.length === 0) return null;
                    const bold = p?.bold === true || p?.isBold === true;
                    return { id: p?.id, text, subPoints, bold };
                };

                const normalizeContent = (c) => {
                    if (!c) return [];
                    if (typeof c === 'string') {
                        try {
                            const parsed = JSON.parse(c);
                            if (Array.isArray(parsed)) return parsed.map(normalizePara).filter(Boolean);
                            const single = normalizePara(parsed);
                            return single ? [single] : [];
                        } catch {
                            const single = normalizePara({ text: c });
                            return single ? [single] : [];
                        }
                    }
                    if (Array.isArray(c)) return c.map(normalizePara).filter(Boolean);
                    const single = normalizePara(c);
                    return single ? [single] : [];
                };

                const content = normalizeContent(d?.content);
                setNews({ ...d, content });
            } catch (err) {
                console.error("Error fetching news detail:", err);
                // Fallback: fetch all news and pick by id
                try {
                    const allRes = await NewsService.getAllNews();
                    const list = Array.isArray(allRes?.data) ? allRes.data : [];
                    const picked = list.find(item => String(item?.id) === String(id));
                    if (picked) {
                        const content = (Array.isArray(picked?.content) ? picked.content : []);
                        setNews({ ...picked, content });
                        return;
                    }
                } catch (e2) {
                    console.warn('Fallback to getAllNews failed', e2);
                }
                setError("Failed to load article.");
            } finally {
                setLoading(false);
            }
        };

        fetchNewsDetail();
    }, [id]);

    // Slug generator used for share URLs
    const slugify = (str) => {
        if (!str) return 'news';
        return str
            .toString()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 80);
    };

    // Ensure the URL includes a long share-friendly query once data is available
    useEffect(() => {
        if (!news || !news.title) return;
        const rand = Math.random().toString(36).slice(2, 8);
        const slug = `${slugify(news.title)}-${rand}`;
        const params = new URLSearchParams(location.search);
        const currentTitle = params.get('title');
        const currentSrc = params.get('src');
        if (currentTitle !== slug || currentSrc !== 'bcvworld.com') {
            navigate({ pathname: location.pathname, search: `?title=${encodeURIComponent(slug)}&src=bcvworld.com` }, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [news?.id, news?.title]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (!news) return (
        <div className="news-detail-page bg-white">
            <div className="container py-5 text-center main-content">
                <h3>Article not found</h3>
                <Link to="/news" className="btn btn-primary mt-3">Back to News</Link>
            </div>
        </div>
    );

    const paragraphs = Array.isArray(news.content) ? news.content : [];
    const primaryText = paragraphs[0]?.text;
    const dateValue = news.date || news.createdAt || news.updatedAt || Date.now();

    const wordCount = paragraphs.reduce((acc, p) => {
        const base = (p?.text || '').trim();
        const sub = Array.isArray(p?.subPoints) ? p.subPoints.map(s => s?.text || '').join(' ') : '';
        return acc + (base.split(/\s+/).filter(Boolean).length) + (sub.split(/\s+/).filter(Boolean).length);
    }, 0);
    const readingTime = Math.max(1, Math.round(wordCount / 200));

    const capitalizeFirst = (str) => {
        if (!str || typeof str !== 'string') return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    const categoryLabel = capitalizeFirst(news.category || 'News');
    const sectionLabel = news.section ? capitalizeFirst(news.section) : null;

    const buildShareUrl = () => {
        const rand = Math.random().toString(36).slice(2, 8);
        const slug = `${slugify(news.title)}-${rand}`;
        return `${window.location.origin}/news/${news.id || id}?title=${encodeURIComponent(slug)}&src=bcvworld.com`;
    };

    return (
        <div className="news-detail-page bg-white pb-5">
            <SEO title={news.title} description={primaryText ? primaryText.substring(0, 150) : "Latest news from BCVWORLD"} url={typeof window !== 'undefined' ? window.location.href : undefined} />
            <div className="container-fluid py-4 main-content">
                <div className="row">
                    <div className="col-lg-2 d-none d-lg-block">
                        <div className="sticky-sidebar">
                            <div className="ad-space vertical-ad mb-4">
                                <div className="text-center text-muted small mb-2">Advertisement</div>
                                <GoogleAd slot="1586380841" minHeight="600px" immediate={true} fullWidthResponsive="true" />
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <article className="news-article">
                            <div className="back-navigation-bar">
                                <Link to="/news" className="back-btn">
                                    <span className="bi bi-chevron-left me-1" /> Back to News
                                </Link>
                                <div className="breadcrumb-nav">
                                    <Link to="/">Home</Link> ›
                                    <Link to="/news">News</Link> ›
                                    <span className="current" title={news.title}>
                                        {(news.title || '').length > 25 ? (news.title || '').slice(0,25) + '...' : (news.title || '')}
                                    </span>
                                </div>
                            </div>

                            <div className="ad-section-responsive mb-3">
                                <div className="ad-label text-center text-muted small mb-1">Advertisement</div>
                                <GoogleAd slot="6166965127" format="autorelaxed" minHeight="260px" immediate={true} fullWidthResponsive="true" loadDelay={50} rootMargin="1400px" collapseIfNoFill={true} showPlaceholderOnNoFill={false} />
                            </div>

                            <div className="article-header mb-3">
                                <h1 className="article-title" style={{ marginBottom: '6px' }}>{news.title}</h1>
                                <div className="news-subhead" style={{ marginBottom: '6px' }}>
                                    <span className="brand-link" style={{ color: '#2563eb', fontWeight: 600 }}>
                                        {categoryLabel}
                                    </span>
                                    {sectionLabel && (
                                        <span className="text-success" style={{ marginLeft: 8, fontWeight: 600 }}>
                                            ({sectionLabel})
                                        </span>
                                    )}
                                </div>
                                <div className="news-detail-meta compact" style={{ gap: '6px', flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <span className="d-inline-flex align-items-center gap-1">
                                        <FaUser />
                                        <span>By {news.author || 'BCVWorld'}</span>
                                        <BiSolidBadgeCheck style={{ color: '#0066cc' }} />
                                    </span>
                                    <span className="d-inline-flex align-items-center gap-1 text-muted">
                                        <FaCalendarAlt />
                                        <span>Published on: {new Date(dateValue).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="featured-image-container mb-4">
                                <img 
                                    src={news.imageUrl || '/assets/images/news/story.webp'} 
                                    alt={news.title}
                                    className="news-detail-image"
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/news/story.webp'; }}
                                />
                            </div>

                            <div className="social-share mb-4">
                                <button className="share-btn facebook" aria-label="Share to Facebook" onClick={() => { const u = buildShareUrl(); window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`, '_blank'); }}><FaFacebook /></button>
                                <button className="share-btn twitter" aria-label="Share to Twitter" onClick={() => { const u = buildShareUrl(); window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(news.title)}`, '_blank'); }}><FaTwitter /></button>
                                <button className="share-btn whatsapp" aria-label="Share to WhatsApp" onClick={() => { const u = buildShareUrl(); window.open(`https://wa.me/?text=${encodeURIComponent(news.title + ' ' + u)}`, '_blank'); }}><FaWhatsapp /></button>
                            </div>

                            <div className="article-content">
                                {(() => {
                                    // Show at most one ad after each of the first five paragraphs only
                                    const adSlots = [
                                        { slot: '5689277386', format: 'auto' },          // after paragraph 1
                                        { slot: '5489966834', format: 'autorelaxed' },    // after paragraph 2
                                        { slot: '5045455146', format: 'auto' },           // after paragraph 3
                                        { slot: '3732373472', format: 'auto' },           // after paragraph 4
                                        { slot: '2419291807', format: 'auto' },           // after paragraph 5
                                    ];

                                    const items = [];
                                    let adIndex = 0;

                                    for (let i = 0; i < paragraphs.length; i++) {
                                        const paragraph = paragraphs[i];
                                        items.push(
                                            <div key={`p-${paragraph.id ?? i}`}>
                                                {paragraph.text && <p className={paragraph.bold ? 'fw-semibold text-dark' : undefined}>{paragraph.text}</p>}
                                                {Array.isArray(paragraph.subPoints) && paragraph.subPoints.length > 0 && (
                                                    <ul className="paragraph-subpoints">
                                                        {paragraph.subPoints.map((sub, sIndex) => (
                                                            <li key={sub.id ?? sIndex} className={(sub.isBold || sub.bold) ? 'bold' : undefined}>
                                                                {sub.text}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        );

                                        if (adIndex < adSlots.length) {
                                            const { slot, format } = adSlots[adIndex++];
                                            const fast = i < 2;
                                            items.push(
                                                <div className="ad-section-responsive mt-4" key={`ad-after-p-${slot}-${i}`}>
                                                    <GoogleAd slot={slot} format={format} minHeight={format === 'autorelaxed' ? '320px' : '280px'} immediate={fast} loadDelay={fast ? 50 : 200} rootMargin={fast ? '1200px' : '800px'} fullWidthResponsive="true" />
                                                </div>
                                            );
                                        }
                                    }

                                    return items;
                                })()}
                            </div>

                        </article>
                    </div>

                    <div className="col-lg-2 d-none d-lg-block">
                        <div className="sticky-sidebar">
                            <div className="text-center text-muted small mb-2">Advertisement</div>
                            <GoogleAd slot="6813822643" fallbackSlot="7460239222" format="auto" minHeight="600px" immediate={true} fullWidthResponsive="true" containerMaxWidth="300px" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
