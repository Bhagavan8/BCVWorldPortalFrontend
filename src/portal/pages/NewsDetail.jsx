import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NewsService from '../services/NewsService';
import '../assets/css/News.css';
import { FaCalendarAlt, FaUser, FaTag, FaArrowLeft } from 'react-icons/fa';

const NewsDetail = () => {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNewsDetail = async () => {
            try {
                const res = await NewsService.getNewsById(id);
                setNews(res.data);
            } catch (err) {
                console.error("Error fetching news detail:", err);
                setError("Failed to load article.");
            } finally {
                setLoading(false);
            }
        };

        fetchNewsDetail();
    }, [id]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    if (!news) return (
        <div className="container py-5 text-center">
            <h3>Article not found</h3>
            <Link to="/news" className="btn btn-primary mt-3">Back to News</Link>
        </div>
    );

    return (
        <div className="news-detail-page bg-white pb-5">
            {/* Hero Image Section */}
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                         <Link to="/news" className="btn btn-link text-decoration-none text-muted mb-4 p-0 d-inline-flex align-items-center">
                            <FaArrowLeft className="me-2" /> Back to News
                        </Link>

                        <div className="news-detail-header" data-aos="fade-in">
                            <div className="d-flex justify-content-center gap-2 mb-3">
                                <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">
                                    {news.category}
                                </span>
                                {news.section && (
                                    <span className="badge bg-secondary-subtle text-secondary rounded-pill px-3 py-2">
                                        {news.section}
                                    </span>
                                )}
                            </div>
                            <h1 className="news-detail-title">{news.title}</h1>
                            
                            <div className="news-detail-meta">
                                <div className="d-flex align-items-center gap-2">
                                    <FaCalendarAlt />
                                    <span>{new Date(news.date).toLocaleDateString()}</span>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <FaUser />
                                    <span>{news.author || 'BCV World'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="news-detail-image-wrapper" data-aos="zoom-in">
                            <img 
                                src={news.imageUrl || 'https://via.placeholder.com/1200x600'} 
                                alt={news.title} 
                                className="news-detail-image"
                            />
                        </div>

                        <div className="news-content" data-aos="fade-up">
                            {news.content.map((paragraph, index) => (
                                <div key={index} className="news-paragraph">
                                    <p>{paragraph.text}</p>
                                    {paragraph.subPoints && paragraph.subPoints.length > 0 && (
                                        <ul className="news-subpoints">
                                            {paragraph.subPoints.map((sub, sIndex) => (
                                                <li key={sIndex} className={`news-subpoint ${sub.isBold ? 'bold' : ''}`}>
                                                    {sub.text}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-5 pt-4 border-top">
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                                <div>
                                    <span className="fw-bold me-2">Share this:</span>
                                    <button className="btn btn-sm btn-outline-primary rounded-circle me-2"><i className="bi bi-facebook"></i></button>
                                    <button className="btn btn-sm btn-outline-info rounded-circle me-2"><i className="bi bi-twitter"></i></button>
                                    <button className="btn btn-sm btn-outline-danger rounded-circle"><i className="bi bi-linkedin"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsDetail;
