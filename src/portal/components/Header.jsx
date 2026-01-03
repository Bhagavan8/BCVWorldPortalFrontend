import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BiChevronDown, BiMenu, BiUser, BiLogIn, BiLogOut, BiGridAlt, BiBriefcase, BiEnvelope } from 'react-icons/bi';
import logo from '../assets/logo/logo.png';

export default function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const authRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          setUser(parsedUser);
          setIsLoggedIn(true);
        }
      } catch (e) {
        console.error("Invalid user data in localStorage", e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (authRef.current && !authRef.current.contains(event.target)) {
        setIsAuthOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isJobDetailsPage = location.pathname === '/job';

  const getUserInitial = () => {
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserFirstName = () => {
    if (user && user.name) {
      return user.name.split(' ')[0];
    }
    return 'User';
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 justify-center pt-6 px-4 pointer-events-none ${isJobDetailsPage ? 'hidden min-[769px]:flex' : 'flex'}`}>
      <div className={`w-full max-w-7xl bg-white shadow-xl pointer-events-auto transition-all duration-300 ${isMobileNavOpen ? 'rounded-3xl' : 'rounded-full'}`}>
        <div className="px-8 sm:px-12">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img src={logo} alt="BCVWORLD" className="h-12 w-12 object-cover rounded-full" />
              <span className="text-xl font-bold text-gray-900 tracking-tight">BCV<span className="text-blue-600">WORLD</span></span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex space-x-8">
              <Link to="/#hero" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium">About</Link>
              <Link to="/jobs" className="text-gray-700 hover:text-blue-600 font-medium">Jobs</Link>
              <Link to="/suggestion" className="text-gray-700 hover:text-blue-600 font-medium">Suggestion</Link>
              <Link to="/calculators" className="text-gray-700 hover:text-blue-600 font-medium">Calculators</Link>
              
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
                  Blogs <BiChevronDown className="ml-1" />
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 hidden group-hover:block border border-gray-100">
                  <Link to="/infosys-prep" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Infosys SP Prep 2025</Link>
                  <Link to="/java-resources" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Java Resources</Link>
                  <Link to="/file-tools" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">File Tools</Link>
                  <Link to="/news" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">News</Link>
                </div>
              </div>

              <Link to="/#contact" className="text-gray-700 hover:text-blue-600 font-medium">Contact</Link>
            </nav>

            {/* Auth & Mobile Toggle */}
            <div className="flex items-center space-x-4">
              
              {/* Auth Dropdown */}
            {!isLoggedIn ? (
              <div className="relative" ref={authRef}>
                <button 
                  onClick={() => setIsAuthOpen(!isAuthOpen)}
                    className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                  >
                    <span className="mr-2">Account</span>
                    <BiChevronDown />
                  </button>
                  
                  {isAuthOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-100">
                      <Link to="/login" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <BiLogIn className="mr-2" /> Sign In
                      </Link>
                      <Link to="/register" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <BiUser className="mr-2" /> Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
              <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2"
                  title={user ? `${user.name || 'User'} (${user.email || ''})` : 'User Profile'}
                >
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {getUserInitial()}
                    </div>
                    <span className="hidden md:block text-gray-700">{getUserFirstName()}</span>
                    <BiChevronDown />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 border border-gray-100">
                       <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 flex items-center">
                            <BiUser className="mr-2 text-blue-600" />
                            {user ? user.name : 'Guest'}
                          </p>
                          <p className="text-sm text-gray-500 truncate flex items-center mt-1">
                            <BiEnvelope className="mr-2 text-blue-600" />
                            {user ? user.email : ''}
                          </p>
                       </div>
                       {(user?.role === 'ADMIN' || user?.role === 'admin') && (
                          <Link to="/admin/dashboard" className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-gray-100 font-medium">
                            <BiGridAlt className="mr-2" /> Admin Dashboard
                          </Link>
                       )}
                       <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <BiUser className="mr-2" /> My Profile
                       </Link>
                       <Link to="/applications" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <BiBriefcase className="mr-2" /> My Applications
                       </Link>
                       <button onClick={() => {
                           localStorage.removeItem('user');
                           setUser(null);
                           setIsLoggedIn(false);
                           window.location.href = '/';
                       }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                          <BiLogOut className="mr-2" /> Log Out
                       </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button 
                className="xl:hidden text-gray-700 text-2xl"
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              >
                <BiMenu />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileNavOpen && (
          <div className="xl:hidden border-t border-gray-100 px-8 pb-6 rounded-b-3xl">
            <div className="pt-2 space-y-1">
              <Link to="/#hero" onClick={() => setIsMobileNavOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Home</Link>
              <Link to="/about" onClick={() => setIsMobileNavOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">About</Link>
              <Link to="/jobs" onClick={() => setIsMobileNavOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Jobs</Link>
              <Link to="/suggestion" onClick={() => setIsMobileNavOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Suggestion</Link>
              <Link to="/calculators" onClick={() => setIsMobileNavOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Finance Calculators</Link>
              <div className="pl-4 border-l-2 border-gray-200 ml-3">
                <span className="block px-3 py-2 text-sm font-semibold text-gray-500">Blogs</span>
                <Link to="/infosys-prep" onClick={() => setIsMobileNavOpen(false)} className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-blue-600">Infosys SP Prep</Link>
                <Link to="/java-resources" onClick={() => setIsMobileNavOpen(false)} className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-blue-600">Java Resources</Link>
                <Link to="/file-tools" onClick={() => setIsMobileNavOpen(false)} className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-blue-600">File Tools</Link>
                <Link to="/news" onClick={() => setIsMobileNavOpen(false)} className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:text-blue-600">News</Link>
              </div>
              <Link to="/#contact" onClick={() => setIsMobileNavOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50">Contact</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
