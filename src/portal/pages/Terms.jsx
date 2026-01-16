import React from 'react';
import SEO from '../components/SEO';

const Terms = () => {
  return (
    <div className="min-h-[calc(100vh-6rem)] bg-slate-50">
      <SEO title="Terms of Service" description="BCVWorld terms and acceptable use" />
      <div className="max-w-5xl mx-auto px-4 pt-28 md:pt-32 pb-20">
        <div className="mb-4 text-xs font-semibold tracking-widest text-blue-500 uppercase">
          Legal & Policies
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                <i className="bi bi-file-earmark-check me-2"></i>
                Terms of Service
              </h1>
              <p className="mt-2 text-sm md:text-base text-slate-600 max-w-2xl">
                By using BCVWorld, you agree to these terms. Please read them carefully so you understand how to use the platform safely.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Updated 2026
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900">Using Our Services</h2>
                <ul className="list-disc pl-5 space-y-2 text-sm md:text-base text-slate-700">
                  <li>Provide accurate information and keep your profile up to date.</li>
                  <li>Use the platform respectfully and avoid harmful, illegal, or misleading content.</li>
                  <li>Follow community guidelines when posting comments, suggestions, or job details.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900">Content and Ownership</h2>
                <p className="text-slate-700">
                  All trademarks, logos, and brands shown on BCVWorld remain the property of their respective owners.
                  By submitting content (such as job posts, feedback, or comments), you grant us permission to process
                  and display that content as part of operating the service.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900">Disclaimers</h2>
                <p className="text-slate-700">
                  We provide our services on an &quot;as is&quot; basis and strive to maintain accuracy and availability.
                  However, we are not liable for changes to job details, external links, or third-party listings.
                  Always verify critical information on official company or exam websites.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-semibold text-slate-900">Termination</h2>
                <p className="text-slate-700">
                  We may suspend or terminate access to BCVWorld if we detect abuse, fraud, or violations of these terms.
                  You may stop using the platform at any time by logging out and clearing your data from shared devices.
                </p>
              </section>
            </div>

            <aside className="lg:col-span-1">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4 text-sm">
                <div className="flex items-center gap-2">
                  <i className="bi bi-shield-check text-blue-500"></i>
                  <span className="font-semibold text-slate-900">Quick tips</span>
                </div>
                <ul className="list-disc pl-4 space-y-2 text-slate-700">
                  <li>Do not share login details with anyone.</li>
                  <li>Report suspicious job posts or messages to our support.</li>
                  <li>Log out and clear storage when using public or shared systems.</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
