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
import GoogleAd from '../components/GoogleAd';
import './WorkFromHome.css';

const WorkFromHome = () => {
  // Schema.org Structured Data for Rich Results
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "Ultimate Work From Home Guide 2026: Daily Payouts & Genuine Jobs",
        "image": "https://bcvworld.com/assets/wfh-guide-cover.jpg",
        "author": {
          "@type": "Organization",
          "name": "BCVWORLD"
        },
        "publisher": {
          "@type": "Organization",
          "name": "BCVWORLD",
          "logo": {
            "@type": "ImageObject",
            "url": "https://bcvworld.com/logo192.png"
          }
        },
        "datePublished": "2026-01-29",
        "dateModified": "2026-01-29",
        "description": "Discover 100% verified Work From Home jobs for 2026. Instant approval for data entry, typing, and chat support roles. Start earning ₹15,000/week without fees."
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How can I earn money online without investment?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can start with zero investment by using platforms like Upwork, Fiverr, and Internshala. Focus on skills like Data Entry, Content Writing, and Transcription which require no startup fees."
            }
          },
          {
            "@type": "Question",
            "name": "Which work from home jobs pay daily?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Many freelance micro-task sites and survey platforms offer daily payouts via PayPal. Data entry projects on Freelancer.com often release milestone payments immediately upon completion."
            }
          },
          {
            "@type": "Question",
            "name": "Is experience required for online data entry jobs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No, most data entry jobs are beginner-friendly. Basic typing speed and attention to detail are the only requirements."
            }
          },
          {
            "@type": "Question",
            "name": "Do I need a laptop to work from home?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "While a laptop is recommended for most jobs, there are tasks like surveys, social media management, and testing apps that can be done on a smartphone."
            }
          },
          {
            "@type": "Question",
            "name": "How can I avoid fake job scams?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Never pay for registration fees. Legitimate companies pay you, they don't ask for money. If someone asks for an ID card fee or security deposit, block them."
            }
          },
          {
            "@type": "Question",
            "name": "Can I do these jobs part-time?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, most freelance and remote jobs are flexible. You can choose your own working hours, making it perfect for students, housewives, and employees looking for side income."
            }
          },
          {
            "@type": "Question",
            "name": "How much can I earn monthly?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Beginners usually earn between ₹5,000 to ₹15,000 per month. With experience, professionals can earn ₹50,000 to ₹1,00,000+ per month."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="wfh-container">
      <SEO 
        title="Best Work From Home Jobs 2026 | Daily Payouts | No Fees" 
        description="Legit Work From Home Jobs 2026. Instant Hiring for Data Entry, Typing, Chat Support. Earn ₹500-₹2000/hr. No Investment Required. Perfect for Students & Housewives."
        keywords="work from home jobs 2026, daily payment jobs, online data entry jobs no investment, typing jobs from home, chat support jobs remote, google jobs for freshers, amazon work from home, legit online jobs, earn money online fast, part time jobs for students, freelance writing, passive income ideas 2026, ai training jobs"
        url="https://bcvworld.com/work-from-home"
      />
      
      {/* Inject Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>

      {/* Hero Section */}
      <section className="wfh-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 animate-fade-in-up">
            <span className="mr-2">�</span> Trending in 2026: Remote & AI Jobs
          </div>
          <h1 className="animate-fade-in-up delay-100">
            Stop Searching. Start Earning.<br/>
            <span className="text-blue-600">100% Verified</span> Work From Home Jobs
          </h1>
          <p className="animate-fade-in-up delay-200 mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Join thousands of students, homemakers, and professionals earning <strong>₹20,000 - ₹1,00,000/month</strong>. 
            No hidden fees. No experience needed. Instant access to global opportunities.
          </p>
          
          <div className="wfh-countries animate-fade-in-up delay-300 mt-8">
            <div className="wfh-country-badge"><BiWorld /> Global</div>
            <div className="wfh-country-badge">🇺🇸 USA</div>
            <div className="wfh-country-badge">🇬🇧 UK</div>
            <div className="wfh-country-badge">🇮🇳 India</div>
          </div>
        </div>
      </section>

      {/* Ad Break 1 */}
      <div className="max-w-4xl mx-auto my-8 px-4">
        <p className="text-xs text-center text-slate-400 mb-2">SPONSORED</p>
        <GoogleAd slot="6187491900" format="auto" responsive="true" />
      </div>

      {/* Scam Alert - Crucial for WFH */}
      <div className="max-w-4xl mx-auto px-4 mt-8 relative z-10 mb-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col sm:flex-row gap-4 items-start shadow-sm hover:shadow-md transition-shadow">
          <div className="bg-red-100 p-3 rounded-full text-red-600 shrink-0 hidden sm:block">
            <BiShieldQuarter className="text-3xl" />
          </div>
          <div>
            <h3 className="font-bold text-red-800 text-lg flex items-center gap-2">
              <span className="sm:hidden"><BiShieldQuarter /></span> 
              🛡️ 100% Safety Guarantee Zone
            </h3>
            <p className="text-red-700 mt-2">
              <strong>We protect you from scams.</strong> Real jobs <em>never</em> ask for money. 
              <br/>
              <span className="text-sm opacity-90">If a "recruiter" asks for registration fees, ID card charges, or security deposits, block them immediately. Genuine platforms pay YOU, not the other way around.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Top Platforms Section - "Where can we find jobs?" */}
      <section className="wfh-section bg-white">
        <h2 className="wfh-section-title">💎 Trusted "Goldmine" Platforms</h2>
        <p className="text-center text-slate-600 max-w-2xl mx-auto mb-12">
          Stop wasting time on fake sites. We have verified these 6 platforms where millions of people are earning <strong>real Money (₹) daily</strong>.
        </p>
        <div className="wfh-grid">
          
          {/* Upwork */}
          <div className="wfh-card border-t-4 border-t-green-500 relative group hover:bg-green-50/10 transition-all hover:-translate-y-1">
            <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">High Paying</div>
            <h3 className="flex items-center gap-2"><span className="text-green-600 text-2xl">●</span> Upwork</h3>
            <p className="mb-3 text-slate-800"><strong>Best For:</strong> Professionals, Developers, Designers, Writers.</p>
            <p className="text-sm text-slate-600 mb-4">The world's largest marketplace. Create a profile, bid on projects, and earn in Dollars (paid in ₹ directly to Bank).</p>
            <a href="https://www.upwork.com" target="_blank" rel="noopener noreferrer" className="text-green-600 font-bold text-sm hover:underline flex items-center gap-1">
              Start Earning on Upwork <BiLinkExternal />
            </a>
          </div>

          {/* Fiverr */}
          <div className="wfh-card border-t-4 border-t-green-500 relative group hover:bg-green-50/10 transition-all hover:-translate-y-1">
            <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Easiest to Start</div>
            <h3 className="flex items-center gap-2"><span className="text-green-600 text-2xl">●</span> Fiverr</h3>
            <p className="mb-3 text-slate-800"><strong>Best For:</strong> Creative services, Logo Design, Voiceovers, Digital Marketing.</p>
            <p className="text-sm text-slate-600 mb-4">No bidding required. Post a "Gig" (service) and let clients come to you. Starts at $5 (approx ₹400).</p>
            <a href="https://www.fiverr.com" target="_blank" rel="noopener noreferrer" className="text-green-600 font-bold text-sm hover:underline flex items-center gap-1">
              Create Your Gig <BiLinkExternal />
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

      {/* Ad Break 2 */}
      <div className="max-w-4xl mx-auto my-8 px-4">
        <p className="text-xs text-center text-slate-400 mb-2">SPONSORED</p>
        <GoogleAd slot="2248246891" format="auto" responsive="true" />
      </div>

      {/* Step-by-Step Guide - "How to start?" */}
      <section className="wfh-section bg-slate-50">
        <h2 className="wfh-section-title">🚀 How to Start Your First Online Job</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Step 1 */}
          <div className="flex gap-6 items-start bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">1</div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Choose an Easy Skill to Start</h3>
              <p className="text-slate-600 mb-3">
                You don't need to be an expert. Start with what you know.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg text-sm border border-blue-100">
                <span className="font-bold text-blue-700 block mb-1">Easiest Skills for Beginners:</span>
                <ul className="list-disc list-inside text-slate-700 space-y-1">
                  <li><strong>Data Entry:</strong> Typing into Excel sheets.</li>
                  <li><strong>Transcription:</strong> Listening to audio and typing it out.</li>
                  <li><strong>Virtual Assistant:</strong> Replying to emails and scheduling meetings.</li>
                  <li><strong>Canva Design:</strong> Making simple social media posts.</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="flex gap-6 items-start bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">2</div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Create Your "Online Resume"</h3>
              <p className="text-slate-600 mb-3">
                Sign up on <strong>Upwork.com</strong> or <strong>Fiverr.com</strong>. Your profile is your shop.
              </p>
              <div className="bg-slate-50 p-4 rounded-lg text-sm border border-slate-200">
                <span className="font-bold text-slate-700 block mb-1">📝 What to write in your profile:</span>
                "Hi, I am [Your Name]. I am a hard-working [Skill Name] who can help you with [Task]. I am available to start immediately."
              </div>
            </div>
          </div>

          {/* Ad Break 3 */}
          <div className="max-w-4xl mx-auto my-8 px-4">
             <p className="text-xs text-center text-slate-400 mb-2">SPONSORED</p>
             <GoogleAd slot="7309001888" format="auto" responsive="true" />
          </div>

          {/* Step 3 */}
          <div className="flex gap-6 items-start bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-200">3</div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Apply to 10 Jobs Daily</h3>
              <p className="text-slate-600 mb-2">
                <strong>The Golden Rule:</strong> You might not get a reply immediately. This is normal.
              </p>
              <p className="text-slate-600">
                If you apply to 10 jobs every day, you will likely get 1 interview within a week. Be persistent!
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-6 items-start bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-green-200">4</div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">How You Get Paid</h3>
              <p className="text-slate-600 mb-3">
                Clients pay the website (Upwork/Fiverr), and the website pays you.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">PayPal</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">Bank Transfer</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">Payoneer</span>
              </div>
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

      {/* Ad Break 4 */}
      <div className="max-w-4xl mx-auto my-8 px-4">
        <p className="text-xs text-center text-slate-400 mb-2">SPONSORED</p>
        <GoogleAd slot="5455690708" format="auto" responsive="true" />
      </div>

      {/* Blogging & YouTube Detail Section */}
      <section className="wfh-section bg-orange-50 rounded-3xl my-8 mx-4 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="wfh-section-title text-center mb-4">💡 The Passive Income Blueprint</h2>
          <p className="text-center text-slate-600 max-w-2xl mx-auto mb-12">
            Passive income means you do the work once and get paid repeatedly. Here is exactly how to start, step-by-step, even if you have zero experience.
          </p>

          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Blogging Guide */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
              <div className="bg-blue-600 p-6 text-white">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <FaWordpress className="text-3xl" /> Start a Blog
                </h3>
                <p className="opacity-90 mt-2">Best for: Writers, thinkers, and those who prefer staying behind the scenes.</p>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Step 1 */}
                <div className="relative pl-8 border-l-2 border-blue-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600"></div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2">Step 1: Pick a Specific Topic (Niche)</h4>
                  <p className="text-slate-600 mb-3">Don't start a generic blog like "My Life". Pick something people search for.</p>
                  <div className="bg-blue-50 p-4 rounded-lg text-sm border border-blue-100">
                    <span className="font-bold text-blue-700 block mb-1">✅ Good Examples:</span>
                    <ul className="list-disc list-inside text-slate-700 space-y-1">
                      <li>"Vegan Recipes for Beginners" (Specific)</li>
                  <li>"Best Laptops for Students under ₹40,000" (Specific)</li>
                  <li>"Yoga for Back Pain" (Specific)</li>
                    </ul>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-8 border-l-2 border-blue-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600"></div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2">Step 2: Get a Domain & Hosting</h4>
                  <p className="text-slate-600 mb-2">
                    <strong className="text-blue-700">Domain:</strong> Your website name (e.g., www.myblog.com).
                    <br/>
                    <strong className="text-blue-700">Hosting:</strong> Where your website lives on the internet.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg text-sm border border-blue-100">
                    👉 <strong>Recommendation:</strong> Use <a href="https://www.hostinger.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Hostinger</a> or <a href="https://www.bluehost.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Bluehost</a>. They cost about ₹250/month and give you a free domain.
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-8 border-l-2 border-blue-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600"></div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2">Step 3: Write Helpful Content</h4>
                  <p className="text-slate-600 mb-3">Write 20-30 articles before you expect money. Each article should solve a problem.</p>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">📝 Article Structure:</span>
                    1. <strong>Catchy Title:</strong> "How to fix X"<br/>
                    2. <strong>Intro:</strong> "Do you have this problem? Here is the solution."<br/>
                    3. <strong>Body:</strong> Step-by-step solution.<br/>
                    4. <strong>Conclusion:</strong> Summary.
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative pl-8 border-l-2 border-transparent">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2">Step 4: Make Money</h4>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">₹</span> 
                      <span><strong>Google AdSense:</strong> Google shows ads on your site. You get paid when people view/click.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">₹</span> 
                      <span><strong>Affiliate Marketing:</strong> Recommend products (e.g., Amazon). If someone buys, you get a commission.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* YouTube Guide */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
              <div className="bg-red-600 p-6 text-white">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <FaYoutube className="text-3xl" /> Start a YouTube Channel
                </h3>
                <p className="opacity-90 mt-2">Best for: Speakers, educators, gamers, and video creators.</p>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Step 1 */}
                <div className="relative pl-8 border-l-2 border-red-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-600"></div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2">Step 1: Choose Your Channel Type</h4>
                  <p className="text-slate-600 mb-3">You don't need to show your face if you are shy.</p>
                  <div className="bg-red-50 p-4 rounded-lg text-sm border border-red-100">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-bold text-red-700 block mb-1">🎥 Personal Channel</span>
                        <p className="text-xs text-slate-600">Vlogging, Teaching, Fitness, Comedy.</p>
                      </div>
                      <div>
                        <span className="font-bold text-red-700 block mb-1">🎭 Faceless Channel</span>
                        <p className="text-xs text-slate-600">Gaming, Top 10 Lists, Meditation Music, Coding Tutorials.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative pl-8 border-l-2 border-red-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-600"></div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2">Step 2: Create & Upload</h4>
                  <p className="text-slate-600 mb-3">
                    Use your smartphone camera. You don't need expensive gear.
                  </p>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm border border-slate-200">
                    <span className="font-bold text-slate-700 block mb-1">🛠️ Free Tools:</span>
                    <ul className="list-disc list-inside text-slate-700 space-y-1">
                      <li><strong>Editing:</strong> CapCut, InShot, or DaVinci Resolve.</li>
                      <li><strong>Thumbnails:</strong> Canva (Free version is enough).</li>
                    </ul>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative pl-8 border-l-2 border-red-100">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-red-600"></div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2">Step 3: Consistency is King</h4>
                  <p className="text-slate-600 mb-3">
                    The algorithm loves consistency. Upload <strong>1 long video</strong> per week and <strong>3 Shorts</strong> per week.
                  </p>
                  <p className="text-sm text-slate-500 italic">
                    "Don't give up before your 30th video. Most channels grow after 6 months."
                  </p>
                </div>

                {/* Step 4 */}
                <div className="relative pl-8 border-l-2 border-transparent">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500"></div>
                  <h4 className="font-bold text-lg text-slate-900 mb-2">Step 4: Unlock Earnings</h4>
                  <p className="text-slate-600 mb-2">To join the YouTube Partner Program, you need:</p>
                  <div className="flex gap-2 mb-3">
                     <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">1,000 Subscribers</span>
                     <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">4,000 Watch Hours</span>
                  </div>
                  <p className="text-slate-600 text-sm">
                    Once qualified, YouTube places ads on your videos and shares the revenue with you (55% to you).
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      

      {/* FAQ Section with Schema Support */}
      <section className="wfh-section bg-slate-50">
        <h2 className="wfh-section-title">❓ Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">Is it really possible to earn without investment?</h3>
            <p className="text-slate-600">Yes! Platforms like Upwork, Fiverr, and LinkedIn are 100% free to join. You only pay a small service fee <em>after</em> you earn money.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">How do I get paid in India?</h3>
            <p className="text-slate-600">Most international clients pay via PayPal or Payoneer, which automatically transfers money to your local bank account in Rupees.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">I am a student, can I do this?</h3>
            <p className="text-slate-600">Absolutely. Many jobs like Data Entry, Transcription, and Content Writing are perfect for part-time work alongside studies.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">Do I need a laptop to work from home?</h3>
            <p className="text-slate-600">While a laptop is recommended for most jobs, there are tasks like surveys, social media management, and testing apps that can be done on a smartphone.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">How can I avoid fake job scams?</h3>
            <p className="text-slate-600">Never pay for registration fees. Legitimate companies pay you, they don't ask for money. If someone asks for an ID card fee or security deposit, block them.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">Can I do these jobs part-time?</h3>
            <p className="text-slate-600">Yes, most freelance and remote jobs are flexible. You can choose your own working hours, making it perfect for students, housewives, and employees looking for side income.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg mb-2">How much can I earn monthly?</h3>
            <p className="text-slate-600">Beginners usually earn between ₹5,000 to ₹15,000 per month. With experience and skill development, professionals can earn ₹50,000 to ₹1,00,000+ per month.</p>
          </div>
        </div>
      </section>

      {/* Ad Break 5 - Multiplex */}
      <div className="max-w-4xl mx-auto my-8 px-4">
        <p className="text-xs text-center text-slate-400 mb-2">SPONSORED</p>
        <GoogleAd slot="7890282351" format="autorelaxed" responsive="true" />
      </div>

    </div>
  );
};

export default WorkFromHome;
