import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BiWorld, BiLaptop, BiMoney, BiTime, BiCheckCircle, 
  BiBriefcase, BiSearchAlt, BiBuildingHouse, BiUserVoice, 
  BiEdit, BiCodeAlt, BiTrendingUp, BiLinkExternal, 
  BiRightArrowAlt, BiShieldQuarter 
} from 'react-icons/bi';
import { FaGoogle, FaLinkedin, FaWordpress, FaYoutube } from 'react-icons/fa';
import SEO from '../components/SEO';
import './WorkFromHome.css';

const WorkFromHome = () => {
  return (
    <div className="wfh-container">
      <SEO 
        title="Ultimate Work From Home Guide 2026 - Jobs for All" 
        description="The complete guide to finding part-time jobs, starting a blog, and earning online. Top websites to find work for students, women, and freshers in US, UK, and India."
        keywords="work from home websites, best freelance sites, how to start blogging, online jobs for students, part time jobs for women, wfh india, wfh usa, upwork, fiverr, freelancer"
      />

      {/* Hero Section */}
      <section className="wfh-hero relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 animate-fade-in-up">
            <span className="mr-2">🚀</span> The Ultimate 2026 Guide
          </div>
          <h1 className="animate-fade-in-up delay-100">Your Roadmap to Financial Freedom: Work From Home & Part-Time Jobs</h1>
          <p className="animate-fade-in-up delay-200">
            Whether you are a student, a homemaker returning to work, or a professional looking for a side hustle, 
            opportunities are waiting for you. We've curated the best platforms and step-by-step guides to get you started.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-300">
            <Link to="/jobs" className="wfh-btn-primary">
              Browse 500+ Active Jobs
            </Link>
          </div>
          
          <div className="wfh-countries animate-fade-in-up delay-300">
            <div className="wfh-country-badge"><BiWorld /> Global</div>
            <div className="wfh-country-badge">🇺🇸 USA</div>
            <div className="wfh-country-badge">🇬🇧 UK</div>
            <div className="wfh-country-badge">🇮🇳 India</div>
          </div>
        </div>
      </section>

      {/* Scam Alert - Crucial for WFH */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 mb-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start shadow-sm">
          <div className="bg-red-100 p-2 rounded-full text-red-600 shrink-0 hidden sm:block">
            <BiShieldQuarter className="text-2xl" />
          </div>
          <div>
            <h3 className="font-bold text-red-800 text-lg flex items-center gap-2">
              <span className="sm:hidden"><BiShieldQuarter /></span> 
              ⚠️ Safety Warning
            </h3>
            <p className="text-red-700 text-sm mt-1">
              <strong>Never pay money to get a job.</strong> Genuine platforms like Upwork, Fiverr, or LinkedIn will <em>never</em> ask for registration fees, ID card charges, or "security deposits". If someone asks for money, it is a scam.
            </p>
          </div>
        </div>
      </div>

      {/* Top Platforms Section - "Where can we find jobs?" */}
      <section className="wfh-section bg-white">
        <h2 className="wfh-section-title">🏆 Top Websites to Find Genuine Work</h2>
        <p className="text-center text-slate-600 max-w-2xl mx-auto mb-12">
          Don't fall for scams. These are the most trusted platforms used by millions of freelancers and remote workers globally.
        </p>
        <div className="wfh-grid">
          
          {/* Upwork */}
          <div className="wfh-card border-t-4 border-t-green-500 relative group hover:bg-green-50/10">
            <h3 className="flex items-center gap-2"><span className="text-green-600 text-2xl">●</span> Upwork</h3>
            <p className="mb-3 text-slate-800"><strong>Best For:</strong> Professionals, Developers, Designers, Writers.</p>
            <p className="text-sm text-slate-600 mb-4">Create a profile, bid on projects, and get paid hourly or fixed price. High earning potential.</p>
            <a href="https://www.upwork.com" target="_blank" rel="noopener noreferrer" className="text-green-600 font-bold text-sm hover:underline flex items-center gap-1">
              Visit Upwork <BiLinkExternal />
            </a>
          </div>

          {/* Fiverr */}
          <div className="wfh-card border-t-4 border-t-green-500 relative group hover:bg-green-50/10">
            <h3 className="flex items-center gap-2"><span className="text-green-600 text-2xl">●</span> Fiverr</h3>
            <p className="mb-3 text-slate-800"><strong>Best For:</strong> Creative services, Logo Design, Voiceovers, Digital Marketing.</p>
            <p className="text-sm text-slate-600 mb-4">Post "Gigs" starting at $5. Clients come to you based on your portfolio.</p>
            <a href="https://www.fiverr.com" target="_blank" rel="noopener noreferrer" className="text-green-600 font-bold text-sm hover:underline flex items-center gap-1">
              Visit Fiverr <BiLinkExternal />
            </a>
          </div>

          {/* LinkedIn */}
          <div className="wfh-card border-t-4 border-t-blue-600 relative group hover:bg-blue-50/10">
            <h3 className="flex items-center gap-2"><FaLinkedin className="text-blue-600 text-xl" /> LinkedIn</h3>
            <p className="mb-3 text-slate-800"><strong>Best For:</strong> Corporate Remote Jobs, Networking.</p>
            <p className="text-sm text-slate-600 mb-4">Use the "Jobs" tab and filter by "Remote". Great for long-term contracts.</p>
            <a href="https://www.linkedin.com/jobs" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold text-sm hover:underline flex items-center gap-1">
              Visit LinkedIn Jobs <BiLinkExternal />
            </a>
          </div>

          {/* Freelancer */}
          <div className="wfh-card border-t-4 border-t-blue-500 relative group hover:bg-blue-50/10">
            <h3 className="flex items-center gap-2"><span className="text-blue-500 text-2xl">●</span> Freelancer.com</h3>
            <p className="mb-3 text-slate-800"><strong>Best For:</strong> Data Entry, Excel work, Contest-based designs.</p>
            <p className="text-sm text-slate-600 mb-4">Huge volume of projects. Good for beginners to gain initial experience.</p>
            <a href="https://www.freelancer.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 font-bold text-sm hover:underline flex items-center gap-1">
              Visit Freelancer <BiLinkExternal />
            </a>
          </div>

          {/* Internshala */}
          <div className="wfh-card border-t-4 border-t-orange-500 relative group hover:bg-orange-50/10">
            <h3 className="flex items-center gap-2"><span className="text-orange-500 text-2xl">●</span> Internshala</h3>
            <p className="mb-3 text-slate-800"><strong>Best For:</strong> Students & Freshers (India).</p>
            <p className="text-sm text-slate-600 mb-4">Find paid internships that often convert to full-time remote jobs.</p>
            <a href="https://internshala.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 font-bold text-sm hover:underline flex items-center gap-1">
              Visit Internshala <BiLinkExternal />
            </a>
          </div>

          {/* FlexJobs */}
          <div className="wfh-card border-t-4 border-t-purple-500 relative group hover:bg-purple-50/10">
            <h3 className="flex items-center gap-2"><span className="text-purple-600 text-2xl">●</span> FlexJobs</h3>
            <p className="mb-3 text-slate-800"><strong>Best For:</strong> Verified, scam-free remote listings.</p>
            <p className="text-sm text-slate-600 mb-4">Paid subscription service but guarantees 100% legitimate hand-screened jobs.</p>
            <a href="https://www.flexjobs.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 font-bold text-sm hover:underline flex items-center gap-1">
              Visit FlexJobs <BiLinkExternal />
            </a>
          </div>
        </div>
      </section>

      {/* Step-by-Step Guide - "How to start?" */}
      <section className="wfh-section bg-slate-50">
        <h2 className="wfh-section-title">🚀 How to Start: A Step-by-Step Process</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex gap-6 items-start bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">1</div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Identify Your Skill</h3>
              <p className="text-slate-600">
                What are you good at? Typing? Teaching? Designing? If you don't have a skill, <strong>learn one</strong>. 
                Platforms like <a href="https://www.coursera.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Coursera</a>, 
                <a href="https://www.udemy.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> Udemy</a>, and 
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline"> YouTube</a> offer free courses on Data Entry, SEO, and Coding.
              </p>
            </div>
          </div>
          
          <div className="flex gap-6 items-start bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">2</div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Build a Digital Presence</h3>
              <p className="text-slate-600">
                Create a professional profile on LinkedIn and Upwork. Use a clear photo. List your skills. 
                If you are a writer or designer, create a simple portfolio on Google Drive or Behance to show samples.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">3</div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Apply Consistently</h3>
              <p className="text-slate-600">
                Don't get discouraged if you don't get hired immediately. Apply to 5-10 jobs daily. 
                Customize your cover letter for each application—don't copy-paste!
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-green-200">4</div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Get Paid Securely</h3>
              <p className="text-slate-600">
                Never pay money to get a job. Legitimate clients pay <strong>you</strong>. 
                Use PayPal or direct bank transfer. Always communicate through the official platform to stay safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Specific Section */}
      <section className="wfh-section">
        <h2 className="wfh-section-title">👩‍💻 Opportunities for Everyone</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-pink-50 p-6 rounded-2xl border border-pink-100 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-xl text-pink-700 mb-4 flex items-center gap-2"><BiUserVoice /> For Women & Homemakers</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-2"><BiCheckCircle className="mt-1 text-pink-500 shrink-0"/> <span><strong>Virtual Assistant:</strong> Manage schedules and emails for clients.</span></li>
              <li className="flex items-start gap-2"><BiCheckCircle className="mt-1 text-pink-500 shrink-0"/> <span><strong>Online Tutoring:</strong> Teach kids Math, English, or localized languages.</span></li>
              <li className="flex items-start gap-2"><BiCheckCircle className="mt-1 text-pink-500 shrink-0"/> <span><strong>Reselling:</strong> Sell products on WhatsApp/Facebook (e.g., Meesho).</span></li>
            </ul>
          </div>

          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-xl text-indigo-700 mb-4 flex items-center gap-2"><BiLaptop /> For Students & Freshers</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-2"><BiCheckCircle className="mt-1 text-indigo-500 shrink-0"/> <span><strong>Content Writing:</strong> Write blogs/articles (Paid per word).</span></li>
              <li className="flex items-start gap-2"><BiCheckCircle className="mt-1 text-indigo-500 shrink-0"/> <span><strong>Data Entry:</strong> Excel work, form filling (Check verified sites only).</span></li>
              <li className="flex items-start gap-2"><BiCheckCircle className="mt-1 text-indigo-500 shrink-0"/> <span><strong>Social Media:</strong> Manage Instagram pages for small brands.</span></li>
            </ul>
          </div>

          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-xl text-emerald-700 mb-4 flex items-center gap-2"><BiBriefcase /> For Professionals</h3>
            <ul className="space-y-3 text-slate-700">
              <li className="flex items-start gap-2"><BiCheckCircle className="mt-1 text-emerald-500 shrink-0"/> <span><strong>Consulting:</strong> Offer expert advice in HR, Finance, or Legal.</span></li>
              <li className="flex items-start gap-2"><BiCheckCircle className="mt-1 text-emerald-500 shrink-0"/> <span><strong>Development:</strong> Full-time remote coding jobs.</span></li>
              <li className="flex items-start gap-2"><BiCheckCircle className="mt-1 text-emerald-500 shrink-0"/> <span><strong>Translation:</strong> High demand for bilingual professionals.</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Blogging & YouTube Detail Section */}
      <section className="wfh-section bg-orange-50 rounded-3xl my-8 mx-4">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h2 className="wfh-section-title text-center mb-8">💡 The Passive Income Blueprint</h2>
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Blogging */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FaWordpress className="text-blue-600" /> Start a Blog
              </h3>
              <p className="text-slate-700 mb-4">
                Blogging is a long-term game but pays the best. You own the platform.
              </p>
              <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <div className="flex gap-3">
                  <span className="font-bold text-orange-500 shrink-0">Step 1:</span>
                  <span>Pick a Niche (e.g., Healthy Recipes, Tech Reviews, Study Notes).</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-orange-500 shrink-0">Step 2:</span>
                  <span>Buy Domain & Hosting (<strong>Hostinger</strong> or <strong>Bluehost</strong> are popular).</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-orange-500 shrink-0">Step 3:</span>
                  <span>Write 20-30 helpful articles (SEO is key! Use tools like Google Trends).</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-orange-500 shrink-0">Step 4:</span>
                  <span>Apply for <strong>Google AdSense</strong> to show ads and earn money.</span>
                </div>
              </div>
            </div>

            {/* YouTube */}
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FaYoutube className="text-red-600" /> Start a YouTube Channel
              </h3>
              <p className="text-slate-700 mb-4">
                Video is the future. You don't even need to show your face (Faceless channels).
              </p>
              <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
                <div className="flex gap-3">
                  <span className="font-bold text-red-500 shrink-0">Step 1:</span>
                  <span>Create a Channel (It's free with a Google account).</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-red-500 shrink-0">Step 2:</span>
                  <span>Upload consistent videos (Shorts are great for growth).</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-red-500 shrink-0">Step 3:</span>
                  <span>Reach 1,000 subscribers & 4,000 watch hours.</span>
                </div>
                <div className="flex gap-3">
                  <span className="font-bold text-red-500 shrink-0">Step 4:</span>
                  <span>Monetize with Ads, Sponsorships, and Affiliate Links.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="wfh-section">
        <h2 className="wfh-section-title">Latest Remote Opportunities</h2>
        <div className="wfh-grid">
          {/* Mock Job 1 */}
          <div className="wfh-card border-l-4 border-l-green-500">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">New</span>
              <span className="text-slate-400 text-sm">2h ago</span>
            </div>
            <h3>Remote Data Entry Clerk</h3>
            <p className="mb-4">Global Tech Solutions • <span className="text-blue-600">US/Worldwide</span></p>
            <div className="flex gap-2 mb-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><BiBriefcase /> Full-time</span>
              <span className="flex items-center gap-1"><BiMoney /> $15-$20/hr</span>
            </div>
            <Link to="/jobs" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">View Details <BiRightArrowAlt /></Link>
          </div>

          {/* Mock Job 2 */}
          <div className="wfh-card border-l-4 border-l-purple-500">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded font-bold">Hot</span>
              <span className="text-slate-400 text-sm">5h ago</span>
            </div>
            <h3>Customer Success Agent</h3>
            <p className="mb-4">Amazon Support • <span className="text-blue-600">UK/Remote</span></p>
            <div className="flex gap-2 mb-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><BiBriefcase /> Shift</span>
              <span className="flex items-center gap-1"><BiMoney /> £12-£18/hr</span>
            </div>
            <Link to="/jobs" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">View Details <BiRightArrowAlt /></Link>
          </div>

          {/* Mock Job 3 */}
          <div className="wfh-card border-l-4 border-l-orange-500">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded font-bold">Urgent</span>
              <span className="text-slate-400 text-sm">1d ago</span>
            </div>
            <h3>Freelance React Developer</h3>
            <p className="mb-4">Startup Hub • <span className="text-blue-600">India/Remote</span></p>
            <div className="flex gap-2 mb-4 text-sm text-slate-500">
              <span className="flex items-center gap-1"><BiBriefcase /> Contract</span>
              <span className="flex items-center gap-1"><BiMoney /> ₹50k-₹1L/mo</span>
            </div>
            <Link to="/jobs" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">View Details <BiRightArrowAlt /></Link>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/jobs" className="wfh-btn-primary">
            View All 500+ Remote Jobs
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="wfh-section bg-white border-t border-slate-100">
        <h2 className="wfh-section-title">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="wfh-faq-item">
            <div className="wfh-faq-question">How can I identify a fake job?</div>
            <div className="wfh-faq-answer">Real jobs <strong>never</strong> ask you to pay for registration, ID cards, or training. If they ask for money, it's a scam.</div>
          </div>
          <div className="wfh-faq-item">
            <div className="wfh-faq-question">Do I need a laptop?</div>
            <div className="wfh-faq-answer">For most data entry and writing jobs, a laptop is preferred. However, some surveys and social media management can be done via smartphone.</div>
          </div>
          <div className="wfh-faq-item">
            <div className="wfh-faq-question">Is experience required?</div>
            <div className="wfh-faq-answer">Not always! Many client look for freshers for data entry, transcription, and basic virtual assistant tasks.</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WorkFromHome;
