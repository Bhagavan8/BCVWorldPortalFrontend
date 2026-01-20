import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const TopNav = ({ toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
        }

        const handleAuthChange = (newUser) => {
            setCurrentUser(newUser);
        };

        AuthService.subscribe(handleAuthChange);

        return () => {
            AuthService.unsubscribe(handleAuthChange);
        };
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        navigate('/admin/auth');
    };

    const getPageTitle = (pathname) => {
        switch (pathname) {
            case '/admin/dashboard':
                return 'Dashboard Overview';
            case '/admin/jobs-upload':
                return 'Upload Job Posting';
            case '/admin/upload-news':
                return 'Upload News';
            case '/admin/govt-jobs-upload':
                return 'Upload Government Job';
            case '/admin/bank-jobs-upload':
                return 'Upload Banking Job';
            case '/admin/profile-upload':
                return 'Profile Upload';
            case '/admin/jobs':
                return 'Manage Jobs';
            case '/admin/users':
                return 'Users Management';
            case '/admin/profile':
                return 'Profile';
            default:
                return 'Dashboard Overview';
        }
    };

    return (
        <nav className="top-nav">
            <div className="d-flex align-items-center">
                <button className="sidebar-toggle d-lg-none me-3" onClick={toggleSidebar}>
                    <i className="bi bi-list"></i>
                </button>
                <h4 className="page-title mb-0">{getPageTitle(location.pathname)}</h4>
            </div>

            <div className="top-nav-actions">
                {currentUser && (
                    <div className="dropdown me-3" id="notificationsDropdownContainer">
                        <button className="btn position-relative p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false" style={{overflow: 'visible'}}>
                            <i className="bi bi-bell fs-4"></i>
                            <span className="position-absolute badge rounded-pill bg-danger" id="notificationBadge" style={{top: '-5px', right: '-5px', display: 'none', zIndex: 1050, border: '2px solid white'}}>
                                0
                            </span>
                        </button>
                        <div className="dropdown-menu dropdown-menu-end p-0 shadow-lg border-0" style={{width: '320px', maxHeight: '400px', overflowY: 'auto'}}>
                            <div className="card border-0">
                                <div className="card-header bg-white py-2 border-bottom d-flex justify-content-between align-items-center sticky-top bg-white">
                                    <h6 className="mb-0 fw-bold">Notifications</h6>
                                    <button className="btn btn-link btn-sm text-decoration-none p-0" id="markAllReadBtn">Mark all read</button>
                                </div>
                                <div className="list-group list-group-flush" id="notificationsList">
                                    <div className="text-center p-4 text-muted">
                                        <small>No new notifications</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {currentUser ? (
                    <div className="user-menu" id="userMenuDropdown">
                        <button className="user-dropdown d-flex align-items-center border-0 bg-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <div className="rounded-circle me-2 d-flex align-items-center justify-content-center bg-light text-primary" style={{width: '36px', height: '36px'}}>
                                <i className="bi bi-person-fill"></i>
                            </div>
                            <span className="d-none d-md-block fw-medium">{currentUser.name || 'User'}</span>
                            <i className="bi bi-chevron-down ms-2 small"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
                            <li><Link className="dropdown-item py-2" to="/profile"><i className="bi bi-person me-2"></i>My Profile</Link></li>
                            <li><Link className="dropdown-item py-2" to="/settings"><i className="bi bi-gear me-2"></i>Settings</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item py-2 text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    <div className="user-menu">
                        <button className="user-dropdown d-flex align-items-center border-0 bg-transparent fw-medium" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Account
                            <i className="bi bi-chevron-down ms-2 small"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2">
                            <li>
                                <Link className="dropdown-item py-2" to="/admin/auth" state={{ isRegister: false }}>
                                    <i className="bi bi-box-arrow-in-right me-2 text-primary"></i>
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item py-2" to="/admin/auth" state={{ isRegister: true }}>
                                    <i className="bi bi-person-plus me-2 text-primary"></i>
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default TopNav;
