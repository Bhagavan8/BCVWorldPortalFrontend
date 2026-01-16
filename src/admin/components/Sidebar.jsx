import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService';
import logo from '../../portal/assets/logo/logo.svg';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const [jobsOpen, setJobsOpen] = useState(true);
    const [financeOpen, setFinanceOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const checkAuth = () => {
            const user = AuthService.getCurrentUser();
            setCurrentUser(user);
            setIsAdmin(AuthService.isAdmin());
        };
        
        checkAuth();

        const handleAuthChange = (user) => {
            setCurrentUser(user);
            setIsAdmin(user && (user.role === 'ADMIN' || user.role === 'admin'));
        };

        AuthService.subscribe(handleAuthChange);
        return () => AuthService.unsubscribe(handleAuthChange);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-wrapper d-flex align-items-center justify-content-center w-100">
                    <img src={logo} alt="BCVWORLD" className="rounded-circle me-2" style={{ height: '40px', width: '40px', objectFit: 'cover' }} />
                    <span className="fw-bold fs-5 text-white">BCV<span style={{ color: '#4fc3f7' }}>WORLD</span></span>
                </div>
                <button className="sidebar-toggle d-lg-none" onClick={toggleSidebar}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>

            <div className="sidebar-menu">
                <ul className="nav flex-column" id="sidebarMenu">
                    <li className="nav-item">
                        <Link className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`} to="/admin/dashboard">
                            <i className="bi bi-speedometer2"></i>
                            <span>Dashboard</span>
                            <span className="badge bg-primary rounded-pill ms-auto">New</span>
                        </Link>
                    </li>

                    {isAdmin && (
                        <>
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/admin/upload-news') ? 'active' : ''}`} to="/admin/upload-news">
                                    <i className="bi bi-newspaper"></i>
                                    <span>Upload News</span>
                                </Link>
                            </li>

                            <li className="nav-item dropdown">
                                <a 
                                    className={`nav-link dropdown-toggle ${jobsOpen ? '' : 'collapsed'}`} 
                                    href="#" 
                                    onClick={(e) => { e.preventDefault(); setJobsOpen(!jobsOpen); }}
                                    aria-expanded={jobsOpen}
                                >
                                    <i className="bi bi-briefcase"></i>
                                    <span>Jobs</span>
                                    <i className="bi bi-chevron-down dropdown-arrow"></i>
                                </a>
                                <div className={`collapse ${jobsOpen ? 'show' : ''}`} id="jobs-collapse">
                                    <ul className="nav flex-column sub-menu">
                                        <li className="nav-item">
                                            <Link className={`nav-link ${isActive('/admin/job-management') ? 'active' : ''}`} to="/admin/job-management">
                                                <i className="bi bi-list-check"></i>
                                                <span>Manage Jobs</span>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={`nav-link ${isActive('/admin/jobs-upload') ? 'active' : ''}`} to="/admin/jobs-upload">
                                                <i className="bi bi-building"></i>
                                                <span>Private Jobs</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item mt-auto pt-4 px-3">
                                <Link className="nav-link back-to-portal-btn" to="/">
                                    <i className="bi bi-box-arrow-left"></i>
                                    <span>Back to Portal</span>
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>

            <div className="sidebar-footer">
                <div className="user-profile-container">
                    <div className="user-profile">
                        <div className="profile-img-placeholder">
                            <i className="bi bi-person-circle"></i>
                        </div>
                        <div className="profile-info">
                            <h6 className="profile-name">{currentUser ? currentUser.name : 'Guest'}</h6>
                            <span className="profile-role">{currentUser ? currentUser.role : 'Visitor'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
