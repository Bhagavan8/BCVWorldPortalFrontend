import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Global Styles
import './portal/App.css';

// Layouts & Auth
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import { RoleGuard } from './auth/RoleGuard';

// Portal Pages
import Home from './portal/pages/Home';
import Jobs from './portal/pages/Jobs';
import JobDetails from './portal/pages/JobDetails';
import NewsList from './portal/pages/NewsList';
import NewsDetail from './portal/pages/NewsDetail';
import AboutUs from './portal/pages/AboutUs';
import Suggestion from './portal/pages/Suggestion';
import FinanceCalculators from './portal/pages/FinanceCalculators';
import Login from './portal/pages/Login';
import Register from './portal/pages/Register';
import JobManagement from './admin/pages/JobManagement';
import Disclaimer from './portal/pages/Disclaimer';
import AdsDisclosure from './portal/pages/AdsDisclosure';
import Profile from './portal/pages/Profile';

// Admin Pages
import BCVWorldAuth from './admin/pages/BCVWorldAuth';
import Dashboard from './admin/pages/Dashboard';
import JobUploadForm from './admin/components/JobUploadForm';
import NewsUpload from './admin/pages/NewsUpload';

// ScrollToTop component to handle route changes and hash scrolling
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  return (
    <Router>
      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '14px',
          },
          success: {
            style: {
              background: '#059669',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#059669',
            },
          },
          error: {
            style: {
              background: '#DC2626',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#DC2626',
            },
          },
        }}
      />
      <ScrollToTop />
      <Routes>
        {/* --- Admin Routes --- */}
        <Route path="/admin/auth" element={<BCVWorldAuth />} />
        
        <Route path="/admin" element={
          <RoleGuard allowedRoles={['ADMIN']}>
            <AdminLayout />
          </RoleGuard>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="job-management" element={<JobManagement />} />
          <Route path="jobs-upload" element={<JobUploadForm />} />
          <Route path="jobs-edit/:id" element={<JobUploadForm />} />
          
          <Route path="upload-news" element={<NewsUpload />} />
          <Route path="govt-jobs-upload" element={<div className="p-4"><h2>Government Jobs (Placeholder)</h2></div>} />
          <Route path="bank-jobs-upload" element={<div className="p-4"><h2>Banking Jobs (Placeholder)</h2></div>} />
          <Route path="profile-upload" element={<div className="p-4"><h2>Profile Upload (Placeholder)</h2></div>} />
        </Route>

        {/* Redirects for direct access */}
        <Route path="/jobs-upload" element={<Navigate to="/admin/jobs-upload" replace />} />

        {/* --- User Routes --- */}
        <Route element={<UserLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/job" element={<JobDetails />} />
            <Route path="/news" element={<NewsList />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/suggestion" element={<Suggestion />} />
            <Route path="/calculators" element={<FinanceCalculators />} />
            <Route path="/contact" element={<Home />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/ads-disclosure" element={<AdsDisclosure />} />
            <Route path="/profile" element={<Profile />} />
        </Route>
        
        {/* Pages without Header (Login/Register) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 404 */}
        <Route path="*" element={<div className="pt-24 text-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
