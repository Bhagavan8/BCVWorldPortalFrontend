import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import AuthService from '../services/AuthService';
import adminApi from '../../api/admin';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedRange, setSelectedRange] = useState('This Month');

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
                } catch (error) {
                    console.error('Error fetching stats:', error);
                    let errorMsg = 'Failed to load dashboard statistics.';
                    
                    if (error.response) {
                        console.error('Error response:', error.response.status, error.response.data);
                        if (error.response.status === 403) {
                            errorMsg = 'Access Denied (403): Your session may have expired or you do not have permission. Please log in again.';
                        } else if (error.response.status === 401) {
                            errorMsg = 'Unauthorized (401): Please log in again.';
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
                                <i className="bi bi-person-check display-1 text-primary mb-4"></i>
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

    const chartData = {
        labels: stats.months || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Private Jobs',
                data: stats.privateJobsData || [],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            },
            {
                label: 'Govt Jobs',
                data: stats.govtJobsData || [],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Bank Jobs',
                data: stats.bankJobsData || [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Jobs Overview',
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className="content-wrapper">
            {/* Row 1 Stats */}
            <div className="row g-4 mb-4">
                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-primary">
                        <div className="card-icon">
                            <i className="bi bi-briefcase"></i>
                        </div>
                        <div className="card-info">
                            <h3>{stats.totalJobs}</h3>
                            <p>Total Jobs</p>
                        </div>
                        <div className="card-growth positive">
                            <i className="bi bi-arrow-up"></i> 0%
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-success">
                        <div className="card-icon">
                            <i className="bi bi-people"></i>
                        </div>
                        <div className="card-info">
                            <h3>{stats.activeUsers}</h3>
                            <p>Active Users</p>
                        </div>
                        <div className="card-growth positive">
                            <i className="bi bi-arrow-up"></i> 0%
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-info">
                        <div className="card-icon">
                            <i className="bi bi-graph-up"></i>
                        </div>
                        <div className="card-info">
                            <h3>{stats.newsViews}</h3>
                            <p>Total News Views</p>
                        </div>
                        <div className="card-growth positive">
                            <i className="bi bi-arrow-up"></i> 0%
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-warning">
                        <div className="card-icon">
                            <i className="bi bi-newspaper"></i>
                        </div>
                        <div className="card-info">
                            <h3>{stats.newsArticles}</h3>
                            <p>News Articles</p>
                        </div>
                        <div className="card-growth negative">
                            <i className="bi bi-arrow-down"></i> 0%
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-danger">
                        <div className="card-icon">
                            <i className="bi bi-eye"></i>
                        </div>
                        <div className="card-info">
                            <h3>{stats.totalJobsViews}</h3>
                            <p>Total Job Views</p>
                        </div>
                        <div className="card-growth positive">
                            <i className="bi bi-arrow-up"></i> 0%
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-secondary">
                        <div className="card-icon">
                            <i className="bi bi-calendar-day"></i>
                        </div>
                        <div className="card-info">
                            <h3>{stats.todayJobsViews}</h3>
                            <p>Today's Jobs Views</p>
                        </div>
                        <div className="card-growth positive">
                            <i className="bi bi-arrow-up"></i> 0%
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-dark">
                        <div className="card-icon">
                            <i className="bi bi-calendar-minus"></i>
                        </div>
                        <div className="card-info">
                            <h3>{stats.yesterdayJobsViews}</h3>
                            <p>Yesterday's Jobs Views</p>
                        </div>
                        <div className="card-growth negative">
                            <i className="bi bi-arrow-down"></i> 0%
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-purple" style={{ backgroundColor: '#6f42c1' }}>
                        <div className="card-icon">
                            <i className="bi bi-calendar-week"></i>
                        </div>
                        <div className="card-info">
                            <h3>{stats.weeklyJobsViews}</h3>
                            <p>Weekly Jobs Views</p>
                        </div>
                        <div className="card-growth positive">
                            <i className="bi bi-arrow-up"></i> 0%
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 2 Stats (Job Applies Row) */}
            <div className="row g-4 mt-2 mb-4">
                 <div className="col-md-6 col-lg-3">
                    <div className="stats-card bg-success">
                        <div className="card-icon">
                            <i className="bi bi-file-earmark-check"></i>
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
                            <i className="bi bi-chat-dots"></i>
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
                            <i className="bi bi-lightbulb"></i>
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
                            <i className="bi bi-eye"></i>
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
                            <h5><i className="bi bi-rocket-takeoff me-2"></i>Welcome to Jobs Admin</h5>
                        </div>
                        <div className="card-body">
                            <div className="welcome-content">
                                <h3>Empower Your Job Portal</h3>
                                <p className="lead">Transform your job posting experience with our comprehensive admin platform designed for modern recruiters and job portals.</p>

                                <ul className="features-list list-unstyled">
                                    <li className="mb-2">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        <span>Seamless job posting across multiple categories</span>
                                    </li>
                                    <li className="mb-2">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        <span>Integrated news and content management</span>
                                    </li>
                                    <li className="mb-2">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        <span>Advanced user profile management</span>
                                    </li>
                                    <li className="mb-2">
                                        <i className="bi bi-check-circle-fill text-success me-2"></i>
                                        <span>Real-time analytics and reporting</span>
                                    </li>
                                </ul>

                                <div className="welcome-actions mt-4">
                                    <button className="btn btn-primary me-3">
                                        <i className="bi bi-lightning-charge-fill me-2"></i>Quick Start Guide
                                    </button>
                                    <button className="btn btn-outline-secondary">
                                        <i className="bi bi-question-circle me-2"></i>Help Center
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
                            <h5 className="mb-0"><i className="bi bi-bar-chart me-2"></i>Jobs Overview</h5>
                            <div className="dropdown">
                                <button 
                                    className="btn btn-sm dropdown-toggle" 
                                    type="button" 
                                    onClick={toggleDropdown}
                                    aria-expanded={dropdownOpen}
                                >
                                    {selectedRange}
                                </button>
                                <ul className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`} style={{ right: 0 }}>
                                    <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setSelectedRange('Today'); setDropdownOpen(false); }}>Today</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setSelectedRange('This Week'); setDropdownOpen(false); }}>This Week</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setSelectedRange('This Month'); setDropdownOpen(false); }}>This Month</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={(e) => { e.preventDefault(); setSelectedRange('This Year'); setDropdownOpen(false); }}>This Year</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="chart-container" style={{ height: '300px' }}>
                                <Bar options={chartOptions} data={chartData} />
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
                            <h5><i className="bi bi-lightning-charge me-2"></i>Quick Actions</h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-md-3 col-6">
                                    <a href="/jobs-upload" className="quick-action d-block text-center p-3 border rounded text-decoration-none text-dark hover-shadow">
                                        <div className="action-icon bg-primary-light text-primary mb-2 mx-auto d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(13, 110, 253, 0.1)'}}>
                                            <i className="bi bi-briefcase fs-4"></i>
                                        </div>
                                        <span>Post New Job</span>
                                    </a>
                                </div>
                                <div className="col-md-3 col-6">
                                    <a href="/upload-news" className="quick-action d-block text-center p-3 border rounded text-decoration-none text-dark hover-shadow">
                                        <div className="action-icon bg-success-light text-success mb-2 mx-auto d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(25, 135, 84, 0.1)'}}>
                                            <i className="bi bi-newspaper fs-4"></i>
                                        </div>
                                        <span>Add News</span>
                                    </a>
                                </div>
                                <div className="col-md-3 col-6">
                                    <a href="/profile-upload" className="quick-action d-block text-center p-3 border rounded text-decoration-none text-dark hover-shadow">
                                        <div className="action-icon bg-warning-light text-warning mb-2 mx-auto d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(255, 193, 7, 0.1)'}}>
                                            <i className="bi bi-person-plus fs-4"></i>
                                        </div>
                                        <span>Add Profile</span>
                                    </a>
                                </div>
                                <div className="col-md-3 col-6">
                                    <a href="/affiliate-marketing" className="quick-action d-block text-center p-3 border rounded text-decoration-none text-dark hover-shadow">
                                        <div className="action-icon bg-info-light text-info mb-2 mx-auto d-flex align-items-center justify-content-center" style={{width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'rgba(13, 202, 240, 0.1)'}}>
                                            <i className="bi bi-graph-up-arrow fs-4"></i>
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
