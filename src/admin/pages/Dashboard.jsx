import React, { useEffect, useState, lazy, Suspense } from 'react';
import { 
    BiUserCheck, BiUpArrow, BiDownArrow, BiBriefcase, BiGroup, BiTrendingUp, 
    BiNews, BiShow, BiCalendar, BiCalendarMinus, BiCalendarWeek, BiFile, 
    BiCommentDots, BiBulb, BiRocket, BiSolidCheckCircle, BiSolidBolt, BiQuestionMark, 
    BiBarChart, BiHelpCircle, BiUserPlus
} from 'react-icons/bi';
import AuthService from '../services/AuthService';
import adminApi from '../../api/admin';

// Lazy load chart component to reduce initial bundle size
const DashboardChart = lazy(() => import('../components/DashboardChart'));

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeUsers: 0,
        newsViews: 0,
        newsArticles: 0,
        totalJobsViews: 0,
        todayJobsViews: 0,
        yesterdayJobsViews: 0,
        weeklyJobsViews: 0,
        totalApplies: 0,
        totalComments: 0,
        totalSuggestions: 0,
        monthlyJobViews: 0
    });
    const [isAdmin, setIsAdmin] = useState(false);
    const [error, setError] = useState(null);
    const [statsError, setStatsError] = useState(null);

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };





    useEffect(() => {
        setIsAdmin(AuthService.isAdmin());
        
        const fetchStats = async () => {
            if (AuthService.isAdmin()) {
                const user = AuthService.getCurrentUser();
                console.log('Fetching stats with user:', user); // Debug log

                try {
                    const response = await adminApi.get('/stats');
                    console.log('API Stats Response:', response.data);
                    const d = response.data || {};
                    const normalized = {
                        totalJobs: d.totalJobs ?? d.totalJobCount ?? 0,
                        activeUsers: d.activeUsers ?? 0,
                        newsViews: d.newsViews ?? 0,
                        newsArticles: d.newsArticles ?? 0,
                        totalJobsViews: d.totalJobsViews ?? d.jobViews ?? d.totalJobViews ?? 0,
                        todayJobsViews: d.todayJobsViews ?? d.todayJobs ?? d.todayJobViews ?? 0,
                        yesterdayJobsViews: d.yesterdayJobsViews ?? d.yesterdayJobs ?? d.yesterdayJobViews ?? 0,
                        weeklyJobsViews: d.weeklyJobsViews ?? d.weeklyJobs ?? d.weeklyJobViews ?? 0,
                        totalApplies: d.totalApplies ?? 0,
                        totalComments: d.totalComments ?? 0,
                        totalSuggestions: d.totalSuggestions ?? 0,
                        monthlyJobViews: d.monthlyJobViews ?? 0,
                        months: d.months,
                        privateJobsData: d.privateJobsData ?? [],
                        govtJobsData: d.govtJobsData ?? [],
                        bankJobsData: d.bankJobsData ?? []
                    };
                    setStats(prevStats => ({ ...prevStats, ...normalized }));
                    setError(null);
                    setStatsError(null);
                } catch (error) {
                    console.error('Error fetching stats:', error);
                    let errorMsg = 'Failed to load dashboard statistics.';
                    
                    if (error.response) {
                        console.error('Error response:', error.response.status, error.response.data);
                        if (error.response.status === 403 || error.response.status === 401) {
                            const short = error.response.status === 403
                                ? 'Dashboard numbers could not be loaded (403).'
                                : 'Dashboard numbers could not be loaded (401).';
                            setStatsError(short + ' Other admin features will continue to work.');
                            return;
                        }
                    }
                    setError(errorMsg);
                }
            }
        };
        fetchStats();
    }, []);

    if (!isAdmin) {
        return (
            <div className="content-wrapper">
                <div className="row g-4">
                    <div className="col-12">
                         <div className="card welcome-card h-100 p-5 text-center">
                             <div className="card-body">
                                <BiUserCheck className="bi display-1 text-primary mb-4" />
                                <h1 className="mb-3">Welcome to BCVWorld Jobs!</h1>
                                <p className="lead mb-4">You have successfully logged in to your dashboard.</p>
                                <p className="text-muted">Explore the latest job opportunities and track your applications.</p>
                                <div className="mt-4">
                                    <button className="btn btn-primary btn-lg px-4 me-3">Browse Jobs</button>
                                    <button className="btn btn-outline-primary btn-lg px-4">Update Profile</button>
                                </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        const user = AuthService.getCurrentUser();
        return (
            <div className="content-wrapper">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">Error!</h4>
                    <p>{error}</p>
                    <hr />
                    <div className="mb-0">
                        <p><strong>Debug Information:</strong></p>
                        <ul className="list-unstyled">
                            <li><strong>User Role:</strong> {user?.role || 'None'}</li>
                            <li><strong>Token Present:</strong> {user?.token ? 'Yes' : 'No'}</li>
                            {user?.token && <li><strong>Token Preview:</strong> {user.token.substring(0, 15)}...</li>}
                        </ul>
                        <p className="mt-2 text-sm">
                            <em>Note for Backend Developer: Ensure the backend accepts the "Authorization: Bearer" header and verifies the "ADMIN" role correctly.</em>
                        </p>
                    </div>
                    <button 
                        className="btn btn-outline-danger mt-3" 
                        onClick={() => {
                            AuthService.logout();
                            window.location.href = '/admin/auth';
                        }}
                    >
                        Logout & Try Again
                    </button>
                </div>
            </div>
        );
    }

    const calculateGrowth = (current, previous) => {
        if (!previous || previous === 0) return { value: 0, isPositive: true, isZero: true };
        const growth = ((current - previous) / previous) * 100;
        return {
            value: Math.abs(growth).toFixed(1),
            isPositive: growth >= 0,
            isZero: growth === 0
        };
    };

    const renderGrowth = (current, previous, label = null) => {
        if (label === 'todayJobsViews') {
            const { value, isPositive, isZero } = calculateGrowth(current, stats.yesterdayJobsViews);
             if (isZero && value === 0 && current === 0 && stats.yesterdayJobsViews === 0) return null; 
            
            return (
                <div className={`card-growth ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? <BiUpArrow className="bi" /> : <BiDownArrow className="bi" />} {value}%
                </div>
            );
        }
        return null; 
    };

    return (
        <div className="content-wrapper">
            {statsError && (
                <div className="alert alert-warning mb-4" role="alert">
                    {statsError}
                </div>
            )}
            {/* Row 1 Stats */}
            <div className="row g-4 mb-4">
                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-primary">
                        <div className="card-icon">
                            <BiBriefcase className="bi" />
                        </div>
                        <div className="card-info">
                            <h3>{stats.totalJobs}</h3>
                            <p>Total Jobs</p>
                        </div>
                        {renderGrowth(stats.totalJobs, null)}
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-success">
                        <div className="card-icon">
                            <BiGroup className="bi" />
                        </div>
                        <div className="card-info">
                            <h3>{stats.activeUsers}</h3>
                            <p>Active Users</p>
                        </div>
                        {renderGrowth(stats.activeUsers, null)}
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-info">
                        <div className="card-icon">
                            <BiTrendingUp className="bi" />
                        </div>
                        <div className="card-info">
                            <h3>{stats.newsViews}</h3>
                            <p>Total News Views</p>
                        </div>
                        {renderGrowth(stats.newsViews, null)}
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-warning">
                        <div className="card-icon">
                            <BiNews className="bi" />
                        </div>
                        <div className="card-info">
                            <h3>{stats.newsArticles}</h3>
                            <p>News Articles</p>
                        </div>
                        {renderGrowth(stats.newsArticles, null)}
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-danger">
                        <div className="card-icon">
                            <BiShow className="bi" />
                        </div>
                        <div className="card-info">
                            <h3>{stats.totalJobsViews}</h3>
                            <p>Total Job Views</p>
                        </div>
                        {renderGrowth(stats.totalJobsViews, null)}
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-secondary">
                        <div className="card-icon">
                            <BiCalendar className="bi" />
                        </div>
                        <div className="card-info">
                            <h3>{stats.todayJobsViews}</h3>
                            <p>Today's Jobs Views</p>
                        </div>
                        {renderGrowth(stats.todayJobsViews, stats.yesterdayJobsViews, 'todayJobsViews')}
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-dark">
                        <div className="card-icon">
                            <BiCalendarMinus className="bi" />
                        </div>
                        <div className="card-info">
                            <h3>{stats.yesterdayJobsViews}</h3>
                            <p>Yesterday's Jobs Views</p>
                        </div>
                        {renderGrowth(stats.yesterdayJobsViews, null)}
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-purple" style={{ backgroundColor: '#6f42c1', color: 'white' }}>
                        <div className="card-icon">
                            <BiCalendarWeek className="bi" />
                        </div>
                        <div className="card-info">
                            <h3>{stats.weeklyJobsViews}</h3>
                            <p>Weekly Jobs Views</p>
                        </div>
                        {renderGrowth(stats.weeklyJobsViews, null)}
                    </div>
                </div>
            </div>

            {/* Row 2 Stats (Job Applies Row) */}
            <div className="row g-4 mt-2 mb-4">
                 <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-success">
                        <div className="card-icon">
                            <BiFile className="bi" />
                        </div>
                        <div className="card-info">
                            <h3>{stats.totalApplies}</h3>
                            <p>Total Applies</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-info">
                        <div className="card-icon">
                            <BiCommentDots className="bi" />
                        </div>
                        <div className="card-info">
                            <h3>{stats.totalComments}</h3>
                            <p>Total Comments</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-primary">
                        <div className="card-icon">
                            <BiBulb className="bi" />
                        </div>
                        <div className="card-info">
                            <h3>{stats.totalSuggestions}</h3>
                            <p>Total Suggestions</p>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-warning">
                        <div className="card-icon">
                            <BiShow className="bi" />
                        </div>
                        <div className="card-info">
                            <h3>{stats.monthlyJobViews}</h3>
                            <p>Monthly Job Views</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Row */}
            <div className="row g-4">
                {/* Welcome Card */}
                <div className="col-lg-6">
                    <div className="card welcome-card h-100">
                         <div className="card-header">
                            <h5><BiRocket className="bi me-2" />Welcome to Jobs Admin</h5>
                        </div>
                        <div className="card-body">
                            <div className="welcome-content">
                                <h3>Empower Your Job Portal</h3>
                                <p className="lead">Transform your job posting experience with our comprehensive admin platform designed for modern recruiters and job portals.</p>

                                <ul className="features-list list-unstyled">
                                    <li className="mb-2">
                                        <BiSolidCheckCircle className="bi text-success me-2" />
                                        <span>Seamless job posting across multiple categories</span>
                                    </li>
                                    <li className="mb-2">
                                        <BiSolidCheckCircle className="bi text-success me-2" />
                                        <span>Integrated news and content management</span>
                                    </li>
                                    <li className="mb-2">
                                        <BiSolidCheckCircle className="bi text-success me-2" />
                                        <span>Advanced user profile management</span>
                                    </li>
                                    <li className="mb-2">
                                        <BiSolidCheckCircle className="bi text-success me-2" />
                                        <span>Real-time analytics and reporting</span>
                                    </li>
                                </ul>

                                <div className="welcome-actions mt-4">
                                    <button className="btn btn-primary me-3">
                                        <BiSolidBolt className="bi me-2" />Quick Start Guide
                                    </button>
                                    <button className="btn btn-outline-secondary">
                                        <BiHelpCircle className="bi me-2" />Help Center
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Jobs Overview Card */}
                <div className="col-lg-6">
                     <div className="card jobs-overview-card h-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0"><BiBarChart className="bi me-2" />Jobs Overview</h5>
                            <div className="dropdown">
                                <button 
                                    className="btn btn-sm dropdown-toggle" 
                                    type="button" 
                                    onClick={toggleDropdown}
                                    aria-expanded={dropdownOpen}
                                >
                                    This Month
                                </button>
                                <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`} style={{ right: 0 }}>
                                    <li><a className="dropdown-item" href="#">Today</a></li>
                                    <li><a className="dropdown-item" href="#">This Week</a></li>
                                    <li><a className="dropdown-item" href="#">This Month</a></li>
                                    <li><a className="dropdown-item" href="#">This Year</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="chart-container" style={{ height: '300px' }}>
                                <Suspense fallback={<div className="d-flex justify-content-center align-items-center h-100"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>}>
                                    <DashboardChart stats={stats} />
                                </Suspense>
                            </div>
                            <div className="jobs-stats d-flex justify-content-around mt-3">
                                <div className="stat-item text-center">
                                    <span className="stat-label d-block text-muted">Private Jobs</span>
                                    <span className="stat-value fw-bold">{stats.privateJobsData?.reduce((a, b) => a + b, 0) || 0}</span>
                                </div>
                                <div className="stat-item text-center">
                                    <span className="stat-label d-block text-muted">Govt Jobs</span>
                                    <span className="stat-value fw-bold">{stats.govtJobsData?.reduce((a, b) => a + b, 0) || 0}</span>
                                </div>
                                <div className="stat-item text-center">
                                    <span className="stat-label d-block text-muted">Bank Jobs</span>
                                    <span className="stat-value fw-bold">{stats.bankJobsData?.reduce((a, b) => a + b, 0) || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                {isAdmin && (
                <div className="col-12" id="quickActionsSection">
                    <div className="card quick-actions-card">
                        <div className="card-header">
                            <h5><BiSolidBolt className="bi me-2" />Quick Actions</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-3 col-6">
                                    <a href="/jobs-upload" className="quick-action d-block text-center p-3 border rounded text-decoration-none text-dark hover-shadow">
                                        <div className="action-icon bg-primary-light text-primary mb-2 mx-auto d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(13, 110, 253, 0.1)'}}>
                                            <BiBriefcase className="fs-4" />
                                        </div>
                                        <span>Post New Job</span>
                                    </a>
                                </div>
                                <div className="col-md-3 col-6">
                                    <a href="/upload-news" className="quick-action d-block text-center p-3 border rounded text-decoration-none text-dark hover-shadow">
                                        <div className="action-icon bg-success-light text-success mb-2 mx-auto d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(25, 135, 84, 0.1)'}}>
                                            <BiNews className="fs-4" />
                                        </div>
                                        <span>Add News</span>
                                    </a>
                                </div>
                                <div className="col-md-3 col-6">
                                    <a href="/profile-upload" className="quick-action d-block text-center p-3 border rounded text-decoration-none text-dark hover-shadow">
                                        <div className="action-icon bg-warning-light text-warning mb-2 mx-auto d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
                                            <BiUserPlus className="fs-4" />
                                        </div>
                                        <span>Add Profile</span>
                                    </a>
                                </div>
                                <div className="col-md-3 col-6">
                                    <a href="/affiliate-marketing" className="quick-action d-block text-center p-3 border rounded text-decoration-none text-dark hover-shadow">
                                        <div className="action-icon bg-info-light text-info mb-2 mx-auto d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(13, 202, 240, 0.1)'}}>
                                            <BiTrendingUp className="fs-4" />
                                        </div>
                                        <span>View Reports</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
