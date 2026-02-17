import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NewsService from '../services/NewsService';
import '../assets/css/News.css';
import { FaCalendarAlt, FaArrowRight, FaTag } from 'react-icons/fa';
import SEO from '../components/SEO';

const NewsList = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getPreviewText = (item) => {
        const c = item?.content;
        if (!c) return '';
        if (typeof c === 'string') {
            try {
                const parsed = JSON.parse(c);
                if (Array.isArray(parsed)) return parsed[0]?.text || '';
                if (parsed && parsed.text) return parsed.text || '';
            } catch {
                return c.substring(0, 100);
            }
        }
        if (Array.isArray(c)) return c[0]?.text || '';
        if (c && c.text) return c.text || '';
        return '';
    };

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await NewsService.getAllNews();
                setNewsList(res.data);
            } catch (err) {
                console.error("Error fetching news:", err);
                setError("Failed to load news.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="news-page bg-light py-5">
            <SEO title="News & Insights" description="Stay informed with the latest career news, technology updates, and announcements from BCVWORLD." />
            <div className="container">
                <div className="text-center mb-5" data-aos="fade-up">
                    <h6 className="text-primary fw-bold text-uppercase letter-spacing-2">Latest Updates</h6>
                    <h2 className="display-5 fw-bold text-dark">News & Insights</h2>
                </div>

                <div className="row g-4">
                    {newsList.map((news, index) => (
                        <div key={news.id} className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay={index * 100}>
                            <div className="card news-card h-100">
                                <Link to={`/news/${news.id}`} className="text-decoration-none text-dark">
                                    <div className="news-card-img-wrapper">
                                        <span className="news-badge">{news.category}</span>
                                        <img 
                                            src={news.imageUrl || '/assets/images/news/story.webp'} 
                                            alt={news.title} 
                                            className="news-card-img"
                                            onError={(e) => { e.target.onerror = null; e.target.src = '/assets/images/news/story.webp'; }}
                                        />
                                    </div>
                                </Link>
                                <div className="news-card-body">
                                    <div className="news-date">
                                        <FaCalendarAlt size={12} />
                                        <span>{new Date(news.date || news.createdAt || news.updatedAt || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="news-title">
                                        <Link to={`/news/${news.id}`} className="text-decoration-none text-dark stretched-link">
                                            {news.title}
                                        </Link>
                                    </h3>
                                    {getPreviewText(news) && (
                                        <p className="news-excerpt">
                                            {(getPreviewText(news) || '').substring(0, 100)}{getPreviewText(news) ? '...' : ''}
                                        </p>
                                    )}
                                    <div className="mt-auto pt-3 border-top border-light">
                                        <span className="news-read-more">
                                            Read Article <FaArrowRight size={12} />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewsList;
