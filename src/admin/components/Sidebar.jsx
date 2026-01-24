import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    FaTimes, FaTachometerAlt, FaNewspaper, FaBriefcase, FaChevronDown, 
    FaClipboardList, FaBuilding, FaUsers, FaEnvelope, FaComments, 
    FaChalkboardTeacher, FaUniversity, FaThLarge, FaBullhorn, FaChartLine, 
    FaSignOutAlt, FaUserCircle 
} from 'react-icons/fa';
import AuthService from '../services/AuthService';
import logo from '../../portal/assets/logo/logo.png';

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
                    <FaTimes className="sidebar-icon" />
                </button>
            </div>

            <div className="sidebar-menu">
                <ul className="nav flex-column" id="sidebarMenu">
                    <li className="nav-item">
                        <Link className={`nav-link ${isActive('/admin/dashboard') ? 'active' : ''}`} to="/admin/dashboard">
                            <FaTachometerAlt className="sidebar-icon" />
                            <span>Dashboard</span>
                            <span className="badge bg-primary rounded-pill ms-auto">New</span>
                        </Link>
                    </li>

                    {isAdmin && (
                        <>
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/admin/upload-news') ? 'active' : ''}`} to="/admin/upload-news">
                                    <FaNewspaper className="sidebar-icon" />
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
                                    <FaBriefcase className="sidebar-icon" />
                                    <span>Jobs</span>
                                    <FaChevronDown className="sidebar-icon dropdown-arrow" />
                                </a>
                                <div className={`collapse ${jobsOpen ? 'show' : ''}`} id="jobs-collapse">
                                    <ul className="nav flex-column sub-menu">
                                        <li className="nav-item">
                                            <Link className={`nav-link ${isActive('/admin/job-management') ? 'active' : ''}`} to="/admin/job-management">
                                                <FaClipboardList className="sidebar-icon" />
                                                <span>Manage Jobs</span>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className={`nav-link ${isActive('/admin/jobs-upload') ? 'active' : ''}`} to="/admin/jobs-upload">
                                                <FaBuilding className="sidebar-icon" />
                                                <span>Private Jobs</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`} to="/admin/users">
                                    <FaUsers className="sidebar-icon" />
                                    <span>Users Management</span>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/admin/messages') ? 'active' : ''}`} to="/admin/messages">
                                    <FaEnvelope className="sidebar-icon" />
                                    <span>Messages</span>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/admin/comments') ? 'active' : ''}`} to="/admin/comments">
                                    <FaComments className="sidebar-icon" />
                                    <span>Comments</span>
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/admin/mentorship') ? 'active' : ''}`} to="/admin/mentorship">
                                    <FaChalkboardTeacher className="sidebar-icon" />
                                    <span>Mentorship</span>
                                </Link>
                            </li>

                            <li className="nav-item dropdown">
                                <a
                                    className={`nav-link dropdown-toggle ${financeOpen ? '' : 'collapsed'}`}
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); setFinanceOpen(!financeOpen); }}
                                    aria-expanded={financeOpen}
                                >
                                    <FaUniversity className="sidebar-icon" />
                                    <span>Finance</span>
                                    <FaChevronDown className="sidebar-icon dropdown-arrow" />
                                </a>
                                <div className={`collapse ${financeOpen ? 'show' : ''}`} id="finance-collapse">
                                    <ul className="nav flex-column sub-menu">
                                        <li className="nav-item">
                                            <Link
                                                className={`nav-link ${isActive('/admin/finance/overview') ? 'active' : ''}`}
                                                to="/admin/finance/overview"
                                            >
                                                <FaThLarge className="sidebar-icon" />
                                                <span>Total Overview</span>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link
                                                className={`nav-link ${isActive('/admin/finance/marketing-ads') ? 'active' : ''}`}
                                                to="/admin/finance/marketing-ads"
                                            >
                                                <FaBullhorn className="sidebar-icon" />
                                                <span>Marketing Ads Finance</span>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link
                                                className={`nav-link ${isActive('/admin/finance/tracking') ? 'active' : ''}`}
                                                to="/admin/finance/tracking"
                                            >
                                                <FaChartLine className="sidebar-icon" />
                                                <span>Financial Tracking</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item mt-auto pt-4 px-3">
                                <Link className="nav-link back-to-portal-btn" to="/">
                                    <FaSignOutAlt className="sidebar-icon" />
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
                            <FaUserCircle className="sidebar-icon" />
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
