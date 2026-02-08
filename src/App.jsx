import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './portal/App.css';

import { RoleGuard } from './auth/RoleGuard';
import IdleTimer from './auth/IdleTimer';

import SEO from './portal/components/SEO';

// Layouts
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const UserLayout = lazy(() => import('./layouts/UserLayout'));

// Portal Pages
const Home = lazy(() => import('./portal/pages/Home'));
const Jobs = lazy(() => import('./portal/pages/Jobs'));
const JobDetails = lazy(() => import('./portal/pages/JobDetails'));
const NewsList = lazy(() => import('./portal/pages/NewsList'));
const NewsDetail = lazy(() => import('./portal/pages/NewsDetail'));
const NewsCognizantFreshers2026 = lazy(() => import('./portal/pages/NewsCognizantFreshers2026'));
const AboutUs = lazy(() => import('./portal/pages/AboutUs'));
const Mentorship = lazy(() => import('./portal/pages/Mentorship'));
const Suggestion = lazy(() => import('./portal/pages/Suggestion'));
const WorkFromHome = lazy(() => import('./portal/pages/WorkFromHome'));
const FinanceCalculators = lazy(() => import('./portal/pages/FinanceCalculators'));
const Login = lazy(() => import('./portal/pages/Login'));
const Register = lazy(() => import('./portal/pages/Register'));
const Profile = lazy(() => import('./portal/pages/Profile'));
const Terms = lazy(() => import('./portal/pages/Terms'));
const ForgotPassword = lazy(() => import('./portal/pages/ForgotPassword'));
const JavaLearning = lazy(() => import('./portal/pages/JavaLearning'));
const ImportantQuestions = lazy(() => import('./portal/pages/ImportantQuestions'));

// Admin Pages
const JobManagement = lazy(() => import('./admin/pages/JobManagement'));
const MarketingAdsFinance = lazy(() => import('./admin/pages/MarketingAdsFinance'));
const TotalFinanceOverview = lazy(() => import('./admin/pages/TotalFinanceOverview'));
const FinanceTracking = lazy(() => import('./admin/pages/FinanceTracking'));
const UsersManagement = lazy(() => import('./admin/pages/UsersManagement'));
const MessagesSuggestions = lazy(() => import('./admin/pages/MessagesSuggestions'));
const CommentsManagement = lazy(() => import('./admin/pages/CommentsManagement'));
const MentorshipAdmin = lazy(() => import('./admin/pages/MentorshipAdmin'));
const BCVWorldAuth = lazy(() => import('./admin/pages/BCVWorldAuth'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const JobUploadForm = lazy(() => import('./admin/components/JobUploadForm'));
const NewsUpload = lazy(() => import('./admin/pages/NewsUpload'));

// Loading Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

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

function SimplePage({ title, description, Icon, heading, subtitle, children }) {
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
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center">
                {Icon && <Icon className="me-3 text-blue-600" />}
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
      Icon={FaFileAlt}
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
              <FaExclamationTriangle className="text-amber-500 text-lg" />
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
      Icon={FaAd}
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
              <FaBolt className="text-blue-500 text-lg" />
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
      Icon={FaLock}
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
              <FaUserShield className="text-emerald-500 text-lg" />
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

function AdSenseLoader() {
  const location = useLocation();

  useEffect(() => {
    // Don't load on mentorship pages
    if (location.pathname.startsWith('/mentorship')) {
      return;
    }

    const src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6284022198338659';
    const scriptExists = Array.from(document.getElementsByTagName('script')).some(s => s.src.includes('client=ca-pub-6284022198338659'));

    if (!scriptExists) {
      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, [location]);

  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <IdleTimer />
      <AdSenseLoader />
      <div className="min-h-screen bg-white">
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
        <Suspense fallback={<PageLoader />}>
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
              <Route path="users" element={<UsersManagement />} />
              <Route path="messages" element={<MessagesSuggestions />} />
              <Route path="comments" element={<CommentsManagement />} />
              <Route path="mentorship" element={<MentorshipAdmin />} />
              
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
                <Route path="/news/cognizant-25k-freshers-2026" element={<NewsCognizantFreshers2026 />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/java-learning" element={<JavaLearning />} />
                <Route path="/important-questions-solutions" element={<ImportantQuestions />} />
                <Route path="/mentorship" element={<Mentorship />} />
                <Route path="/suggestion" element={<Suggestion />} />
                <Route path="/work-from-home" element={<WorkFromHome />} />
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
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
