import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

import './portal/App.css';

import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout';
import { RoleGuard } from './auth/RoleGuard';

import SEO from './portal/components/SEO';

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
import Profile from './portal/pages/Profile';
import Terms from './portal/pages/Terms';
import ForgotPassword from './portal/pages/ForgotPassword';
import JobManagement from './admin/pages/JobManagement';
import MarketingAdsFinance from './admin/pages/MarketingAdsFinance';
import TotalFinanceOverview from './admin/pages/TotalFinanceOverview';
import FinanceTracking from './admin/pages/FinanceTracking';

import BCVWorldAuth from './admin/pages/BCVWorldAuth';
import Dashboard from './admin/pages/Dashboard';
import JobUploadForm from './admin/components/JobUploadForm';
import NewsUpload from './admin/pages/NewsUpload';

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

function SimplePage({ title, description, iconClass, heading, subtitle, children }) {
  return (
    <div className="min-h-[calc(100vh-6rem)] bg-slate-50">
      <SEO title={title} description={description} />
      <div className="max-w-5xl mx-auto px-4 pt-28 md:pt-32 pb-20">
        <div className="mb-4 text-xs font-semibold tracking-widest text-blue-500 uppercase">
          Legal & Policies
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {iconClass ? <i className={`${iconClass} me-2`}></i> : null}
                {heading}
              </h1>
              {subtitle ? (
                <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl">
                  {subtitle}
                </p>
              ) : null}
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Updated 2026
            </div>
          </div>
          <div className="text-slate-700 space-y-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function DisclaimerPage() {
  return (
    <SimplePage
      title="Disclaimer"
      description="Important usage disclaimer for BCVWorld job, finance, and news content."
      iconClass="bi bi-file-text"
      heading="Disclaimer"
    >
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Information Only</h2>
            <p>
              BCVWorld provides job updates, learning resources, and finance information to support your career growth.
              All content is shared for informational and educational purposes only and should not be treated as
              professional career, legal, tax, or investment advice.
            </p>
            <p>
              You are responsible for evaluating any opportunity, company, or financial decision before taking action.
              When in doubt, consult a qualified professional.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">No Guarantees</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
              <li>We do not guarantee job placements, interview calls, or salary outcomes.</li>
              <li>We do not guarantee returns or performance for any finance-related examples or calculators.</li>
              <li>Job descriptions, eligibility, and dates may change. Always verify with the official source.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Third-Party Content</h2>
            <p>
              Our platform may link to third-party websites, job portals, company pages, or external resources.
              These are provided for convenience only. BCVWorld is not responsible for the accuracy, security,
              or policies of external websites.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Fraud & Payment Alerts</h2>
            <p>
              BCVWorld does not charge any registration, referral, or placement fee. If anyone claims to represent
              BCVWorld and asks you to pay for a job opportunity, training, or interview, treat it as fraud and
              do not proceed.
            </p>
            <p className="text-sm text-red-600 font-medium">
              Never share OTPs, passwords, or banking credentials with recruiters or unknown contacts.
            </p>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-exclamation-triangle-fill text-amber-500"></i>
              <span className="font-semibold text-slate-900">Quick summary</span>
            </div>
            <ul className="list-disc pl-4 space-y-2">
              <li>Use BCVWorld as a guide, not as final authority.</li>
              <li>Verify all openings on official company or exam websites.</li>
              <li>Ignore anyone who asks for payment in our name.</li>
            </ul>
          </div>
        </aside>
      </div>
    </SimplePage>
  );
}

function AdsDisclosurePage() {
  return (
    <SimplePage
      title="Ads Disclosure"
      description="Information about advertisements and sponsored content on BCVWorld."
      iconClass="bi bi-window-sidebar"
      heading="Ads Disclosure"
    >
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Why We Show Ads</h2>
            <p>
              BCVWorld is committed to keeping access to jobs, learning, and finance tools free for everyone.
              To support hosting, maintenance, and future improvements, we may show third-party display ads
              and sponsored placements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Separation From Content</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
              <li>Ads are visually separated from regular job listings and articles.</li>
              <li>Sponsored labels may be used where required by policies or regulations.</li>
              <li>An ad appearing on BCVWorld does not mean we personally endorse the advertiser.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Your Choices</h2>
            <p>
              You can use browser-level tools, ad preferences, or privacy settings to control ad personalization.
              Some ad partners may use cookies or similar technologies in line with their own policies.
            </p>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-lightning-charge-fill text-blue-500"></i>
              <span className="font-semibold text-slate-900">What this means for you</span>
            </div>
            <ul className="list-disc pl-4 space-y-2">
              <li>BCVWorld remains free to use.</li>
              <li>You control how much data you share with advertisers.</li>
              <li>Always research any product or service before paying.</li>
            </ul>
          </div>
        </aside>
      </div>
    </SimplePage>
  );
}

function PrivacyPage() {
  return (
    <SimplePage
      title="Privacy Policy"
      description="How BCVWorld handles your data, privacy, and security."
      iconClass="bi bi-lock"
      heading="Privacy Policy"
    >
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Data We Collect</h2>
            <p>
              When you create an account or use BCVWorld, we may collect basic details such as your name,
              email address, profile information, and usage data needed to operate the platform.
            </p>
            <p>
              Some information is stored locally in your browser to keep you signed in and improve your experience.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
              <li>To personalize job recommendations and learning suggestions.</li>
              <li>To improve our features, performance, and reliability.</li>
              <li>To communicate important updates about your account or security.</li>
            </ul>
            <p>
              We do not sell your personal data. Limited data may be shared with trusted service providers
              only to run core features such as analytics or authentication.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Security & Your Choices</h2>
            <p>
              We aim to follow best practices to protect your account. Choose strong passwords, sign out on
              shared devices, and avoid sharing sensitive information over chat or email.
            </p>
            <p className="text-sm text-slate-600">
              You can clear local storage or cookies from your browser settings if you are using a public or shared device.
            </p>
          </section>
        </div>

        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4 text-sm">
            <div className="flex items-center gap-2">
              <i className="bi bi-shield-lock-fill text-emerald-500"></i>
              <span className="font-semibold text-slate-900">Stay safe online</span>
            </div>
            <ul className="list-disc pl-4 space-y-2">
              <li>Never share passwords or OTPs with anyone.</li>
              <li>Beware of emails or calls asking for payment in our name.</li>
              <li>Contact us if you notice suspicious activity on your account.</li>
            </ul>
          </div>
        </aside>
      </div>
    </SimplePage>
  );
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
          <Route path="finance/overview" element={<TotalFinanceOverview />} />
          <Route path="finance/marketing-ads" element={<MarketingAdsFinance />} />
          <Route path="finance/tracking" element={<FinanceTracking />} />
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
            <Route path="/profile" element={<Profile />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/ads-disclosure" element={<AdsDisclosurePage />} />
        </Route>
        
        {/* Pages without Header (Login/Register) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 404 */}
        <Route path="*" element={<div className="pt-24 text-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
