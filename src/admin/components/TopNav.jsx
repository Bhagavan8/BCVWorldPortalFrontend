import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
    BiListUl, BiBell, BiBellOff, BiSolidUserPlus, BiSolidChat, BiSolidBulb, 
    BiSolidUser, BiChevronDown, BiLogOut, BiLogIn, BiUserPlus, BiUser
} from 'react-icons/bi';
import AuthService from '../services/AuthService';
import NotificationService from '../services/NotificationService';

const TopNav = ({ toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(undefined);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = React.useRef(null);
    const notifRef = React.useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            fetchNotifications();
        }

        const handleAuthChange = (newUser) => {
            setCurrentUser(newUser);
            if (newUser) fetchNotifications();
        };

        AuthService.subscribe(handleAuthChange);
        
        // Poll every 2 hours (7200000 ms)
        const intervalId = setInterval(() => {
            if (AuthService.getCurrentUser()) {
                fetchNotifications();
            }
        }, 7200000);

        return () => {
            AuthService.unsubscribe(handleAuthChange);
            clearInterval(intervalId);
        };
    }, []);

    const fetchNotifications = async () => {
        try {
            const rawNotifications = await NotificationService.getRecentNotifications();
            
            const lastReadTime = localStorage.getItem('lastNotificationReadTime') || new Date(0).toISOString();
            
            // Calculate unread count and process list
            const processed = rawNotifications.map(n => {
                const isUnread = new Date(n.createdAt) > new Date(lastReadTime);
                return { ...n, isUnread };
            });

            setNotifications(processed);
            setUnreadCount(processed.filter(n => n.isUnread).length);
        } catch (error) {
            console.error('TopNav: Error loading notifications', error);
        }
    };

    const handleMarkAllRead = () => {
        const now = new Date().toISOString();
        localStorage.setItem('lastNotificationReadTime', now);
        
        // Optimistically update UI
        setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
        setUnreadCount(0);
    };

    const formatTimeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

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
            case '/profile':
                return 'Profile';
            default:
                return 'Dashboard Overview';
        }
    };

    return (
        <nav className="top-nav">
            <style>
                {`
                    .notifications-dropdown-menu {
                        width: 360px;
                        max-width: 90vw;
                        max-height: 80vh;
                        overflow-y: auto;
                        border-radius: 12px;
                        overflow-x: hidden;
                        right: 0 !important;
                        left: auto !important;
                        transform: none !important;
                    }

                    @media (max-width: 768px) {
                        .notifications-dropdown-responsive {
                            position: fixed !important;
                            top: 70px !important;
                            left: 50% !important;
                            transform: translateX(-50%) !important;
                            width: 90vw !important;
                            max-width: 360px !important;
                            right: auto !important;
                            max-height: 80vh !important;
                            margin-top: 0 !important;
                            z-index: 1060 !important;
                            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
                        }
                    }
                `}
            </style>
            <div className="d-flex align-items-center">
                <button className="sidebar-toggle d-lg-none me-3" onClick={toggleSidebar}>
                    <BiListUl className="bi" />
                </button>
                <h4 className="page-title mb-0">{getPageTitle(location.pathname)}</h4>
            </div>

            <div className="top-nav-actions">
                {currentUser && (
                    <div className="dropdown me-3 position-relative" id="notificationsDropdownContainer" ref={notifRef}>
                        <button 
                            className={`btn position-relative p-0 ${showNotifications ? 'show' : ''}`} 
                            type="button" 
                            onClick={() => setShowNotifications(!showNotifications)}
                            aria-expanded={showNotifications}
                            style={{overflow: 'visible'}}
                        >
                            <BiBell className="bi fs-4" />
                            {unreadCount > 0 && (
                                <span className="position-absolute badge rounded-pill bg-danger" style={{top: '-5px', right: '-5px', zIndex: 1050, border: '2px solid white'}}>
                                    {unreadCount}
                                </span>
                            )}
                        </button>
                        <div className={`dropdown-menu dropdown-menu-end p-0 shadow-lg border-0 mt-2 notifications-dropdown-menu notifications-dropdown-responsive ${showNotifications ? 'show' : ''}`}>
                            <div className="d-flex justify-content-between align-items-center py-3 px-3 border-bottom sticky-top bg-white" style={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px', zIndex: 1 }}>
                                <h6 className="mb-0 fw-bold text-dark">Notifications</h6>
                                {unreadCount > 0 && (
                                    <button className="btn btn-link btn-sm text-decoration-none p-0 fw-semibold" style={{fontSize: '0.85rem'}} onClick={handleMarkAllRead}>
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className="list-group list-group-flush">
                                {notifications.length === 0 ? (
                                    <div className="text-center p-5 text-muted">
                                        <div className="mb-3">
                                            <BiBellOff className="bi fs-1 text-secondary opacity-50" />
                                        </div>
                                        <p className="mb-0 fw-medium">No new notifications</p>
                                    </div>
                                ) : (
                                    notifications.map(notif => (
                                        <Link 
                                            key={`${notif.type}-${notif.id}`} 
                                            to={notif.link} 
                                            className="list-group-item list-group-item-action py-3 px-3 border-bottom-0 d-flex align-items-start position-relative"
                                            style={{ 
                                                backgroundColor: notif.isUnread ? '#f0f7ff' : '#fff',
                                                transition: 'background-color 0.2s ease'
                                            }}
                                        >
                                            <div className={`rounded-circle p-2 me-3 d-flex align-items-center justify-content-center flex-shrink-0 ${
                                                notif.type === 'USER' ? 'bg-success bg-opacity-10 text-success' :
                                                notif.type === 'COMMENT' ? 'bg-primary bg-opacity-10 text-primary' :
                                                'bg-warning bg-opacity-10 text-warning'
                                            }`} style={{ width: '42px', height: '42px' }}>
                                                {notif.type === 'USER' ? <BiSolidUserPlus className="bi fs-5" /> :
                                                 notif.type === 'COMMENT' ? <BiSolidChat className="bi fs-5" /> :
                                                 <BiSolidBulb className="bi fs-5" />}
                                            </div>
                                            <div className="flex-grow-1 min-w-0">
                                                <div className="d-flex justify-content-between align-items-baseline mb-1">
                                                    <span className={`text-uppercase small ${notif.isUnread ? 'fw-bold text-primary' : 'fw-semibold text-secondary'}`} style={{fontSize: '0.75rem', letterSpacing: '0.5px'}}>
                                                        {notif.title}
                                                    </span>
                                                    <small className="text-muted ms-2 flex-shrink-0" style={{fontSize: '0.7rem'}}>
                                                        {formatTimeAgo(notif.createdAt)}
                                                    </small>
                                                </div>
                                                <p className={`mb-0 small text-break ${notif.isUnread ? 'text-dark fw-medium' : 'text-muted'}`} style={{lineHeight: '1.4'}}>
                                                    {notif.description}
                                                </p>
                                            </div>
                                            {notif.isUnread && (
                                                <span className="position-absolute bg-primary rounded-circle" 
                                                      style={{width: '8px', height: '8px', top: '15px', right: '10px'}}>
                                                </span>
                                            )}
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                {currentUser ? (
                    <div className="user-menu" id="userMenuDropdown" ref={dropdownRef}>
                        <button 
                            className={`user-dropdown d-flex align-items-center border-0 bg-transparent ${showUserMenu ? 'show' : ''}`} 
                            type="button" 
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            aria-expanded={showUserMenu}
                        >
                            <div className="rounded-circle me-2 d-flex align-items-center justify-content-center bg-light text-primary" style={{width: '36px', height: '36px'}}>
                                <BiSolidUser className="bi" />
                            </div>
                            <span className="d-none d-md-block fw-medium">{currentUser.name || 'User'}</span>
                            <BiChevronDown className="bi ms-2 small" />
                        </button>
                        <ul className={`dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2 ${showUserMenu ? 'show' : ''}`}>
                            <li><Link className="dropdown-item py-2 d-flex align-items-center" to="/profile"><BiUser className="bi me-2" />My Profile</Link></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item py-2 text-danger d-flex align-items-center" onClick={handleLogout}><BiLogOut className="bi me-2" />Logout</button></li>
                        </ul>
                    </div>
                ) : (
                    <div className="user-menu" ref={dropdownRef}>
                        <button 
                            className={`user-dropdown d-flex align-items-center border-0 bg-transparent fw-medium ${showUserMenu ? 'show' : ''}`} 
                            type="button" 
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            aria-expanded={showUserMenu}
                        >
                            Account
                            <BiChevronDown className="bi ms-2 small" />
                        </button>
                        <ul className={`dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2 ${showUserMenu ? 'show' : ''}`}>
                            <li>
                                <Link className="dropdown-item py-2 d-flex align-items-center" to="/admin/auth" state={{ isRegister: false }}>
                                    <BiLogIn className="bi me-2 text-primary" />
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item py-2 d-flex align-items-center" to="/admin/auth" state={{ isRegister: true }}>
                                    <BiUserPlus className="bi me-2 text-primary" />
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
