import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import GoogleAd from '../components/GoogleAd';
import { BiTime, BiListCheck, BiCodeAlt, BiCheckCircle, BiRupee, BiDownload, BiX, BiLinkExternal, BiFile, BiFolder } from 'react-icons/bi';

const TcsNqtSyllabus = () => {
  const data = useMemo(() => ({
    updated: '2026',
    official: {
      yop: ['2024', '2025', '2026'],
      lastDate: '20 March 2026',
      testStart: '10 March 2026 onwards',
      profileType: 'IT (not BPS)',
      testMode: 'In-centre at TCS iON test centre',
      applyNote: '“Apply for Drive” is mandatory after registration to be considered.',
      applyHref: 'https://bcvworld.com/job?type=private&job_id=171&slug=tcs-all-india-nqt-hiring-tata-consultancy-services-tcs&ref=jh4bzm&token=ktyzke&src=bcvworld.com',
    },
    salary: {
      bands: [
        { title: 'IT Entry (NQT - Ninja/Associate)', range: '₹3.5 – ₹3.75 LPA (indicative)', notes: 'Typical fresher entry package. Final CTC varies by location & policy.' },
        { title: 'Digital / Elevate (Advanced track)', range: '₹6.5 – ₹7+ LPA (indicative)', notes: 'Higher package for advanced roles based on shortlist & performance.' },
      ],
      primeDigital: [
        {
          category: 'Prime',
          exp0to1: { ug: '9.09 – 9.30 LPA', pg: '11.59 – 11.80 LPA' },
          exp1to2: { ug: '9.45 – 9.66 LPA', pg: '12.05 – 12.26 LPA' },
        },
        {
          category: 'Digital',
          exp0to1: { ug: '7.09 – 7.30 LPA', pg: '7.39 – 7.60 LPA' },
          exp1to2: { ug: '7.50 – 7.72 LPA', pg: '7.82 – 8.04 LPA' },
        },
      ],
      roles: [
        { category: 'Prime', items: ['Software Engineer', 'Systems Engineer', 'Application Developer'] },
        { category: 'Digital', items: ['Digital Engineer', 'Full Stack Developer', 'Cloud/Data/AI (as per project)'] },
      ],
      note: 'Ranges are indicative and depend on role fitment, experience band, location, and prevailing TCS policy. Refer to the Letter of Offer for final CTC.',
    },
    overview: {
      title: 'TCS NQT Syllabus & Exam Pattern',
      subtitle: 'Complete, mobile‑first guide to TCS National Qualifier Test: sections, pattern, and topic‑wise syllabus with practical tips.',
    },
    pattern: {
      note: 'Integrated test of 190 minutes: two mandatory parts as announced officially.',
      rounds: [
        {
          name: 'Part A: Foundation',
          duration: '75 minutes',
          sections: [
            { name: 'Numerical Ability', approx: '' },
            { name: 'Verbal Ability', approx: '' },
            { name: 'Reasoning Ability', approx: '' },
          ],
        },
        {
          name: 'Part B: Advanced',
          duration: '115 minutes',
          sections: [
            { name: 'Advanced Quantitative & Reasoning', approx: '' },
            { name: 'Advanced Coding', approx: '1–2 problems' },
          ],
        },
      ],
    },
    syllabus: [
      {
        id: 'verbal',
        title: 'Verbal Ability',
        points: [
          'Reading Comprehension (short and medium passages)',
          'Sentence Completion, Para Jumbles',
          'Error Spotting, Grammar (Tenses, Subject–Verb, Articles, Prepositions)',
          'Vocabulary: Synonyms/Antonyms, Cloze Tests, One‑word Substitution, Idioms',
        ],
      },
      {
        id: 'quant',
        title: 'Numerical Ability',
        points: [
          'Number System, LCM/HCF, Divisibility, Factors',
          'Arithmetic: Percentages, Profit & Loss, SI/CI, Ratio & Proportion, Averages',
          'Algebra & Equations, Progressions',
          'Time, Speed & Distance; Time & Work; Pipes & Cisterns; Boats & Streams',
          'Permutation & Combination, Probability, Set Theory, Data Interpretation',
          'Geometry basics: Angles, Triangles, Mensuration (2D/3D)',
          'Allegations & Mixtures; Clocks & Calendar',
          'Numbers & Decimal Fractions; Area, Shapes & Perimeters'
        ],
      },
      {
        id: 'reasoning',
        title: 'Reasoning Ability',
        points: [
          'Arrangements & Seating, Puzzles (Linear/Circular/Box)',
          'Syllogisms, Logical Deduction, Statements & Assumptions',
          'Series, Analogies, Odd‑one‑out',
          'Coding–Decoding, Blood Relations, Directions',
          'Data Sufficiency, Visual/Non‑verbal reasoning (pattern‑based)',
          'Meaningful Word Creation; Number Series (Missing/Analogy)',
          'Rank‑based logic, Ages; Symbols & Notations',
          'Mathematical Operational Arrangement'
        ],
      },
      {
        id: 'prog',
        title: 'Programming Logic',
        points: [
          'Data Types, Operators, Control Flow (if‑else, loops), Functions',
          'Arrays, Strings, Basic Pointers/References',
          'OOP Basics (Class, Object, Inheritance, Encapsulation, Polymorphism)',
          'Basic Data Structures: Stacks, Queues, Linked Lists; Searching/Sorting',
          'Time/Space complexity fundamentals',
          'Input/Output (C style), Command Line Programming',
          'Inbuilt Libraries & Header Files; Call by Value/Reference',
          'Iteration & Recursion; Variables & Registers'
        ],
      },
      {
        id: 'coding',
        title: 'Hands‑on Coding',
        points: [
          'Common themes: string processing, arrays, math, maps/sets, greedy & simulation',
          'I/O handling and edge cases; avoid floating precision pitfalls',
          'Languages typically allowed: C, C++, Java, Python (check test instructions)',
        ],
      },
      {
        id: 'advanced',
        title: 'Advanced (for Digital/Elevate)',
        points: [
          'Deeper Quant/Reasoning with multi‑step logic & higher difficulty',
          'Coding on DS/Algo topics: trees/graphs, DP, backtracking (varies by drive)',
        ],
      },
    ],
    eligibility: [
      'BE/B.Tech/ME/M.Tech/MCA/MSc (as per official notification)',
      'Academic criteria & YOP may vary by drive; check the TCS Careers portal/email',
      'No active backlogs at the time of test; gap criteria per TCS policy',
    ],
    tips: [
      'Accuracy matters more than attempting everything—avoid random guesses.',
      'Use scratchpad for DI and arithmetic. For coding, start with clear I/O parsing.',
      'Practice timing: simulate full‑length tests to build endurance.',
    ],
    faq: [
      {
        q: 'Is there negative marking?',
        a: 'Typically, TCS NQT does not use negative marking, but rules can vary. Follow the instructions on your test dashboard.',
      },
      {
        q: 'Will everyone get the Advanced section?',
        a: 'Advanced is usually for candidates shortlisted for Digital/Elevate profiles. Foundation is common to all.',
      },
      {
        q: 'Can I choose the coding language?',
        a: 'Yes, from the options provided in the test platform (commonly C/C++/Java/Python).',
      },
    ],
    disclaimer:
      'This page summarizes the TCS NQT pattern and syllabus based on public information and candidate experiences. Always cross‑check with the latest notification and your test dashboard.',
  }), []);

  const sectionsOrder = useMemo(() => ['dates-apply', 'pattern', 'weightage', ...data.syllabus.map(s => s.id), 'salary', 'eligibility', 'pyq', 'sources', 'tips', 'faq'], [data]);
  const [activeId, setActiveId] = useState('pattern');
  const [showLeftAd, setShowLeftAd] = useState(true);
  const [showRightAd, setShowRightAd] = useState(true);
  const [hideStickyAds, setHideStickyAds] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pyqSets = useMemo(() => ({
    quant: [
      { q: 'A & B complete a task in 12 days together. A works alone for 4 days, remaining finished by B in 10 days. Find individual days.', a: 'A: 20 days, B: 30 days' },
      { q: 'Train A (120m) crosses Train B (180m) in opposite directions in 12s at 60 km/h. Speed of Train B?', a: '90 km/h' },
      { q: 'Simple Interest on a sum at 12% for 3 years is ₹540. Find principal.', a: '₹1,500' },
      { q: 'Probability of drawing 2 red balls from an urn with 5R, 3B without replacement.', a: '10/28 = 5/14' },
      { q: 'Find the LCM of 18, 24, 40.', a: '720' },
      { q: 'Boat speed 12 km/h, stream 3 km/h. Time upstream for 18 km?', a: '2 hours' },
    ],
    reasoning: [
      { q: 'If P is the sister of Q, Q is the brother of R, and R is the husband of S, how is P related to S?', a: 'Sister-in-law' },
      { q: 'Statements: All A are B. Some B are C. Conclusions: I) Some C are A. II) Some B are A.', a: 'Only II follows' },
      { q: 'Arrange by height: J < K < L, M > L, N < J. Who is second tallest?', a: 'M is tallest, second is L' },
      { q: 'Series: 2, 6, 12, 20, 30, ? ', a: '42' },
      { q: 'Coding-Decoding: FOOD → GPPD, THEN → UIFO. What is CODE?', a: 'DPEF' },
      { q: 'Direction: Start North, turn right → East, right → South, left → East; final direction?', a: 'East' },
    ],
    verbal: [
      { q: 'Find error: “Each of the students have submitted their assignment.”', a: '“have” → “has”; “their” → “his/her”' },
      { q: 'Synonym of “Mitigate”.', a: 'Alleviate' },
      { q: 'Fill in the blank: He is good ___ mathematics.', a: 'at' },
      { q: 'Antonym of “Scarce”.', a: 'Plentiful' },
      { q: 'Choose the correct order (Para jumbles): A-B-D-C.', a: 'ABDC' },
      { q: 'Cloze test tip: maintain tense consistency and collocations.', a: 'Apply grammar context' },
    ],
    coding: [
      { q: 'Given an array, print the length of the longest subarray with sum 0.', a: 'Use prefix sum with hashmap; O(n).' },
      { q: 'Check if two strings are anagrams.', a: 'Sort or count frequency; O(n log n) or O(n).' },
      { q: 'Find first unique character in a string.', a: 'Count then second pass to pick freq==1.' },
      { q: 'Print Fibonacci up to N terms iteratively.', a: 'Use two variables, avoid recursion for large N.' },
      { q: 'Rotate array by k positions to the right.', a: 'Reverse method: reverse full, reverse first k, reverse rest.' },
      { q: 'Two-sum problem.', a: 'Use hash map to track complements; O(n).' },
    ],
  }), []);

  const printPyq = (type) => {
    const title = `TCS NQT PYQs - ${type[0].toUpperCase()}${type.slice(1)}`;
    const items = pyqSets[type] || [];
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<!doctype html>
<html><head><meta charset="utf-8"><title>${title}</title>
<style>
  body{font-family: Arial, sans-serif; padding:32px; color:#0f172a;}
  h1{font-size:20px; margin-bottom:8px;}
  .meta{color:#475569; font-size:12px; margin-bottom:16px;}
  .qa{margin-bottom:14px; page-break-inside: avoid;}
  .q{font-weight:600;}
  .a{color:#0f766e;}
  @page { margin: 24mm; }
</style>
</head><body>
<h1>${title}</h1>
<div class="meta">Generated for quick practice. This is not an official question paper.</div>
${items.map((it,i)=>`<div class="qa"><div class="q">Q${i+1}. ${it.q}</div><div class="a">Ans: ${it.a}</div></div>`).join('')}
</body></html>`);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 300);
  };

  const externalDocs = [
    { title: 'Numerical Ability Notes (Google Doc)', href: 'https://docs.google.com/document/d/16z8WsvutfQ13_HfcSylpS3xJMY3m40slCr4US8LFgI8/edit?tab=t.0' },
    { title: 'PYQ Drive Folder', href: 'https://drive.google.com/drive/folders/1gFPwRS4JHpDSiOJd0Syyhh0AErn5XRfq' },
    { title: 'Topic Mind Map (Google Doc)', href: 'https://docs.google.com/document/d/128x6Ee8kWy-PQ2SWNz4Da_ixQOckR6PC/edit' },
    { title: 'Mega Prep Folder', href: 'https://drive.google.com/drive/folders/1JqghptQyJBRu1duNCAOVzXClKM5el3nl' },
  ];
  const assetUrl = (name) => new URL(`../assets/tcs/${name}`, import.meta.url).href;
  const tcsFiles = [
    'Aptitude notes.pdf',
    'AptitudeFormulas.pdf',
    'quantitative-aptitude-cheat-sheet.pdf',
    'TALENT BATTLE LOGICAL REASONING FORMULA BOOK (2) (1).pdf',
    'TALENT BATTLE QUANT FORMULA BANK (1) (1).pdf',
    'TCS-NQT-Old-Test-Paper.pdf',
    'TCS-NQT-12th-September-2021-Slot-1-Question-Paper.pdf',
    'TCS-NQT-12th-September-2021-Slot-3-Question-Paper.pdf',
    'TCS-NQT-13th-September-2021-Slot-1-Question-Paper.pdf',
    'TCS-NQT-13th-September-2021-Slot-2-Question-Paper.pdf',
    'TCS-NQT-14th-September-2021-Slot-1-Question-Paper.pdf',
    'Coding Sheet.xlsx',
    'TCS-20250310T090942Z-001.zip',
  ];
  const sectionsOrder2 = ['dates-apply', 'pattern', 'weightage', ...data.syllabus.map(s => s.id), 'salary', 'eligibility', 'resources', 'sources', 'tips', 'faq'];
  const [orderOverride] = useState(sectionsOrder2);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0.1 }
    );
    orderOverride.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [orderOverride]);

  useEffect(() => {
    const onScroll = () => {
      if (typeof window === 'undefined') return;
      const scrollPosition = window.scrollY + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const distanceToBottom = docHeight - scrollPosition;
      setHideStickyAds(distanceToBottom < 400);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* sticky ads - desktop only, hidden on mobile */}
      {!isMobile && (
        <div>
          {showLeftAd && (
            <div className="fixed left-4 top-1/2 -translate-y-1/2 w-40 hidden lg:block" style={{ zIndex: 9999, opacity: hideStickyAds ? 0 : 1, pointerEvents: hideStickyAds ? 'none' : 'auto', transition: 'opacity 0.3s ease' }}>
              <div className="relative rounded-xl border border-slate-200 bg-white/90 backdrop-blur p-2 shadow-sm">
                <button aria-label="Close ad" onClick={() => setShowLeftAd(false)} className="absolute -top-2 -right-2 bg-white border border-slate-200 rounded-full w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-700 shadow">
                  <BiX />
                </button>
                <div className="text-center text-gray-500 text-xs mb-1">Advertisement</div>
                <GoogleAd slot="7154180521" adTest="on" minHeight="600px" immediate={true} containerMaxWidth="160px" />
              </div>
            </div>
          )}
          {showRightAd && (
            <div className="fixed right-4 top-1/2 -translate-y-1/2 w-40 hidden lg:block" style={{ zIndex: 9999, opacity: hideStickyAds ? 0 : 1, pointerEvents: hideStickyAds ? 'none' : 'auto', transition: 'opacity 0.3s ease' }}>
              <div className="relative rounded-xl border border-slate-200 bg-white/90 backdrop-blur p-2 shadow-sm">
                <button aria-label="Close ad" onClick={() => setShowRightAd(false)} className="absolute -top-2 -right-2 bg-white border border-slate-200 rounded-full w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-700 shadow">
                  <BiX />
                </button>
                <div className="text-center text-gray-500 text-xs mb-1">Advertisement</div>
                <GoogleAd slot="4512539469" fallbackSlot="7460239222" adTest="on" minHeight="600px" immediate={true} containerMaxWidth="160px" />
              </div>
            </div>
          )}
        </div>
      )}

      <SEO
        title="TCS NQT Syllabus 2026 | Pattern, Sections, PYQ PDFs, Salary"
        description="Official-style TCS NQT 2026 syllabus with integrated pattern (190 mins), Dates & Apply, section-wise topics, salary bands, and downloadable PYQ PDFs."
        keywords="TCS NQT syllabus 2026, TCS NQT exam pattern 2026, TCS NQT PDF, TCS NQT previous year questions, TCS NQT salary, TCS NQT apply link, TCS NQT dates, foundation advanced pattern, TCS NQT eligibility, TCS NQT registration, TCS NQT coding questions, TCS NQT preparation"
        image={typeof window !== 'undefined' ? window.location.origin + '/assets/images/tcs/tcs-nqt-hero.svg' : ''}
        url={typeof window !== 'undefined' ? window.location.origin + '/tcs-nqt-syllabus' : ''}
        type="article"
        structuredData={[
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": typeof window !== 'undefined' ? window.location.origin + "/" : "" },
              { "@type": "ListItem", "position": 2, "name": "TCS NQT Syllabus", "item": typeof window !== 'undefined' ? window.location.href : "" }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "TCS NQT Syllabus Sections",
            "itemListElement": data.syllabus.map((s, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "name": s.title,
              "url": (typeof window !== 'undefined' ? window.location.origin : '') + "/tcs-nqt-syllabus#" + s.id
            }))
          },
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "TCS NQT Syllabus 2026 | Exam Pattern, PYQs, Salary & Registration",
            "description": "Complete, mobile-first guide to TCS National Qualifier Test with section-wise syllabus, exam pattern, PYQ PDFs and salary details.",
            "image": [typeof window !== 'undefined' ? window.location.origin + "/assets/images/tcs/tcs-nqt-hero.svg" : ""],
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString(),
            "author": { "@type": "Organization", "name": "BCVWORLD" },
            "publisher": {
              "@type": "Organization",
              "name": "BCVWORLD",
              "logo": { "@type": "ImageObject", "url": typeof window !== 'undefined' ? window.location.origin + "/logo192.png" : "" }
            },
            "mainEntityOfPage": typeof window !== 'undefined' ? window.location.origin + "/tcs-nqt-syllabus" : ""
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "Which batches can apply?", "acceptedAnswer": { "@type": "Answer", "text": `Batches ${data.official.yop.join(', ')} (as per eligibility).` } },
              { "@type": "Question", "name": "What are the official dates?", "acceptedAnswer": { "@type": "Answer", "text": `Last date ${data.official.lastDate}; tests from ${data.official.testStart}.` } },
              { "@type": "Question", "name": "What is the test mode?", "acceptedAnswer": { "@type": "Answer", "text": `${data.official.testMode}.` } },
              { "@type": "Question", "name": "How to apply correctly?", "acceptedAnswer": { "@type": "Answer", "text": `Create IT profile and click “Apply for Drive”. Apply link: ${data.official.applyHref}` } }
            ]
          }
        ]}
      />

      {/* main container: full width on mobile, constrained with padding on desktop */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-14 max-w-7xl mx-auto">
        {/* breadcrumb & updated tag */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-200 pb-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-slate-600 hover:text-blue-700">Home</Link>
            <span className="text-slate-400">›</span>
            <span className="text-slate-900 font-medium">TCS NQT Syllabus</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 w-fit">
            Updated {data.updated}
          </div>
        </div>

        {/* top ad - hidden on mobile? we keep it but ensure it doesn't overflow */}
        <div className="ad-section-responsive mb-4 w-full overflow-hidden">
          <div className="text-center text-gray-500 text-sm mb-1">Advertisement</div>
          <GoogleAd slot="2494539347" fallbackSlot="7460239222" adTest="on" format="autorelaxed" minHeight="260px" immediate={true} fullWidthResponsive="true" loadDelay={50} rootMargin="1200px" />
        </div>

        {/* header section */}
        <header className="mb-6 space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            {data.overview.title}
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-3xl">
            {data.overview.subtitle}
          </p>
          <figure className="mt-2">
            <img
              src="/assets/images/tcs/tcs-nqt-hero.jpg"
              alt="TCS NQT Syllabus & Exam Pattern 2026 hero visual"
              className="w-full h-48 md:h-64 lg:h-72 rounded-2xl border border-slate-200 object-cover"
              width="1200"
              height="600"
              loading="eager"
              decoding="async"
            />
            <figcaption className="sr-only">TCS NQT 2026 Syllabus & Exam Pattern</figcaption>
          </figure>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <div className="shrink-0 w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <BiListCheck />
              </div>
              <div>
                <div className="text-xs text-slate-500">Core Sections</div>
                <div className="text-sm font-semibold text-slate-900">{data.syllabus.length} sections</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <div className="shrink-0 w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <BiCodeAlt />
              </div>
              <div>
                <div className="text-xs text-slate-500">Coding</div>
                <div className="text-sm font-semibold text-slate-900">1–2 problems</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
              <div className="shrink-0 w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <BiTime />
              </div>
              <div>
                <div className="text-xs text-slate-500">Round Duration</div>
                <div className="text-sm font-semibold text-slate-900">190 minutes total</div>
              </div>
            </div>
          </div>
        </header>

        {/* mobile quick nav - scrollable pills */}
        <div className="lg:hidden mb-4 -mx-2 px-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 w-max">
            <a href="#dates-apply" className="px-3 py-2 rounded-full border text-xs text-slate-700">Dates</a>
            <a href="#pattern" className="px-3 py-2 rounded-full border text-xs text-slate-700">Pattern</a>
            <a href="#weightage" className="px-3 py-2 rounded-full border text-xs text-slate-700">Weightage</a>
            {data.syllabus.map(s => (
              <a key={`pill-${s.id}`} href={`#${s.id}`} className="px-3 py-2 rounded-full border text-xs text-slate-700 whitespace-nowrap">{s.title}</a>
            ))}
            <a href="#salary" className="px-3 py-2 rounded-full border text-xs text-slate-700">Salary</a>
            <a href="#eligibility" className="px-3 py-2 rounded-full border text-xs text-slate-700">Eligibility</a>
            <a href="#resources" className="px-3 py-2 rounded-full border text-xs text-slate-700">Resources</a>
            <a href="#tips" className="px-3 py-2 rounded-full border text-xs text-slate-700">Tips</a>
            <a href="#faq" className="px-3 py-2 rounded-full border text-xs text-slate-700">FAQs</a>
          </div>
        </div>

        {/* main grid: desktop has sidebar, mobile is single column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* desktop sidebar */}
          <aside className="hidden lg:block lg:col-span-3 order-2 lg:order-1">
            <div className="sticky top-28 space-y-3">
              <div className="rounded-2xl border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900 mb-3">On this page</h3>
                <nav className="text-sm space-y-2">
                  <a href="#dates-apply" className={`block ${activeId==='dates-apply' ? 'text-blue-700 font-semibold' : 'text-slate-700 hover:text-blue-700'}`}>Dates & Apply</a>
                  <a href="#pattern" className={`block ${activeId==='pattern' ? 'text-blue-700 font-semibold' : 'text-slate-700 hover:text-blue-700'}`}>Exam Pattern</a>
                  <a href="#weightage" className={`block ${activeId==='weightage' ? 'text-blue-700 font-semibold' : 'text-slate-700 hover:text-blue-700'}`}>Section-wise Weightage</a>
                  {data.syllabus.map(s => (
                    <a key={s.id} href={`#${s.id}`} className={`block ${activeId===s.id ? 'text-blue-700 font-semibold' : 'text-slate-700 hover:text-blue-700'}`}>{s.title}</a>
                  ))}
                  <a href="#salary" className={`block ${activeId==='salary' ? 'text-blue-700 font-semibold' : 'text-slate-700 hover:text-blue-700'}`}>Salary & Compensation</a>
                  <a href="#eligibility" className={`block ${activeId==='eligibility' ? 'text-blue-700 font-semibold' : 'text-slate-700 hover:text-blue-700'}`}>Eligibility</a>
                  <a href="#resources" className={`block ${activeId==='resources' ? 'text-blue-700 font-semibold' : 'text-slate-700 hover:text-blue-700'}`}>Prep Resources</a>
                  <a href="#sources" className={`block ${activeId==='sources' ? 'text-blue-700 font-semibold' : 'text-slate-700 hover:text-blue-700'}`}>Sources</a>
                  <a href="#tips" className={`block ${activeId==='tips' ? 'text-blue-700 font-semibold' : 'text-slate-700 hover:text-blue-700'}`}>Tips</a>
                  <a href="#faq" className={`block ${activeId==='faq' ? 'text-blue-700 font-semibold' : 'text-slate-700 hover:text-blue-700'}`}>FAQs</a>
                </nav>
              </div>
              <div className="rounded-2xl border border-slate-200 p-3">
                <div className="text-center text-gray-500 text-sm mb-2">Advertisement</div>
                <GoogleAd slot="8401472140" adTest="on" format="auto" immediate={true} fullWidthResponsive="true" />
              </div>
            </div>
          </aside>

          {/* main content - takes full width on mobile */}
          <main className="lg:col-span-9 order-1 lg:order-2 space-y-8 w-full max-w-full overflow-hidden">
            {/* inline ad after header */}
            <div className="ad-section-responsive mb-4 w-full">
              <div className="text-center text-gray-500 text-sm mb-1">Advertisement</div>
              <GoogleAd slot="3199457791" fallbackSlot="7460239222" adTest="on" format="auto" minHeight="280px" immediate={true} fullWidthResponsive="true" loadDelay={50} rootMargin="1200px" />
            </div>

            {/* Dates & Apply */}
            <section id="dates-apply" className="rounded-2xl border border-slate-200 p-5 scroll-mt-28 md:scroll-mt-32 w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">Dates & Apply</h2>
                  <ul className="text-slate-700 text-sm space-y-1">
                    <li><span className="font-medium text-slate-900">Eligible YOP:</span> {data.official.yop.join(', ')}</li>
                    <li><span className="font-medium text-slate-900">Last date to register:</span> {data.official.lastDate}</li>
                    <li><span className="font-medium text-slate-900">Test schedule:</span> {data.official.testStart}</li>
                    <li><span className="font-medium text-slate-900">Profile type:</span> {data.official.profileType}</li>
                    <li><span className="font-medium text-slate-900">Mode of test:</span> {data.official.testMode}</li>
                    <li><span className="font-medium text-amber-700">{data.official.applyNote}</span></li>
                  </ul>
                </div>
                <div className="shrink-0">
                  <a
                    href={data.official.applyHref}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-5 py-3 font-semibold hover:bg-blue-700 transition w-full md:w-auto"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            </section>

            {/* Weightage */}
            <section id="weightage" className="rounded-2xl border border-slate-200 p-5 scroll-mt-28 md:scroll-mt-32 w-full">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Section-wise Weightage (Practice Reference)</h2>
              <p className="text-slate-600 text-sm mb-4">For preparation planning, the following split reflects a commonly observed pattern: 92 questions in ~180 minutes across five papers. Your actual slot may vary and TCS can change the structure.</p>
              <div className="overflow-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="text-left px-4 py-2">Paper</th>
                      <th className="text-left px-4 py-2">Questions</th>
                      <th className="text-left px-4 py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-800">
                    <tr className="border-t">
                      <td className="px-4 py-2">Numerical Ability</td>
                      <td className="px-4 py-2">26</td>
                      <td className="px-4 py-2">40 min</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">Verbal Ability</td>
                      <td className="px-4 py-2">24</td>
                      <td className="px-4 py-2">30 min</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">Reasoning Ability</td>
                      <td className="px-4 py-2">30</td>
                      <td className="px-4 py-2">50 min</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">Programming Logic</td>
                      <td className="px-4 py-2">10</td>
                      <td className="px-4 py-2">15 min</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-2">Hands-on Coding</td>
                      <td className="px-4 py-2">2 (1 + 1)</td>
                      <td className="px-4 py-2">15 min + 30 min</td>
                    </tr>
                    <tr className="border-t bg-slate-50 font-semibold">
                      <td className="px-4 py-2">Total</td>
                      <td className="px-4 py-2">92</td>
                      <td className="px-4 py-2">≈180 min</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Pattern */}
            <section id="pattern" className="rounded-2xl border border-slate-200 p-5 scroll-mt-28 md:scroll-mt-32 w-full">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Exam Pattern (Latest)</h2>
              <p className="text-slate-600 text-sm mb-4">{data.pattern.note}</p>
              <div className="space-y-4">
                {data.pattern.rounds.map((r, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <h3 className="font-semibold text-slate-900">{r.name}</h3>
                      <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-700 w-fit">{r.duration}</span>
                    </div>
                    <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm text-slate-700">
                      {r.sections.map((s, i) => (
                        <li key={i} className="flex justify-between border rounded-lg px-3 py-2">
                          <span>{s.name}</span>
                          <span className="text-slate-500">{s.approx}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* mid ad */}
            <div className="ad-section-responsive w-full">
              <div className="text-center text-gray-500 text-sm mb-1">Advertisement</div>
              <GoogleAd slot="1886376123" fallbackSlot="7460239222" adTest="on" format="auto" minHeight="280px" immediate={false} fullWidthResponsive="true" loadDelay={200} rootMargin="800px" />
            </div>

            {/* syllabus sections */}
            {data.syllabus.map((sec, idx) => (
              <React.Fragment key={sec.id}>
                <section id={sec.id} className="rounded-2xl border border-slate-200 p-5 scroll-mt-28 md:scroll-mt-32 w-full">
                  <h2 className="text-xl font-semibold text-slate-900 mb-3">{sec.title}</h2>
                  <div className="space-y-2 text-slate-700">
                    {sec.points.map((p, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="mt-1 text-emerald-600 shrink-0"><BiCheckCircle /></span>
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>
                </section>
                {idx === 2 && (
                  <div className="ad-section-responsive w-full">
                    <div className="text-center text-gray-500 text-sm mb-1">Advertisement</div>
                    <GoogleAd slot="8938035482" fallbackSlot="7460239222" adTest="on" format="auto" minHeight="280px" immediate={false} fullWidthResponsive="true" loadDelay={200} rootMargin="700px" />
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* salary */}
            <section id="salary" className="rounded-2xl border border-slate-200 p-5 scroll-mt-28 md:scroll-mt-32 w-full">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Salary & Compensation</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {data.salary.bands.map((b, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-4 flex items-start gap-3">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center">
                      <BiRupee />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{b.title}</div>
                      <div className="text-sm text-slate-700">{b.range}</div>
                      <div className="text-xs text-slate-500 mt-1">{b.notes}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 overflow-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-2 text-left align-bottom">Offer Category</th>
                      <th className="px-4 py-2 text-left" colSpan="2">Experience: 0 to 1 year</th>
                      <th className="px-4 py-2 text-left" colSpan="2">Experience: 1 to 2 years</th>
                    </tr>
                    <tr className="bg-slate-50 text-slate-500">
                      <th className="px-4 py-2"></th>
                      <th className="px-4 py-2">CTC Range - UG</th>
                      <th className="px-4 py-2">CTC Range - PG</th>
                      <th className="px-4 py-2">CTC Range - UG</th>
                      <th className="px-4 py-2">CTC Range - PG</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-800">
                    {data.salary.primeDigital.map((row, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="px-4 py-3 font-medium">{row.category}</td>
                        <td className="px-4 py-3">{row.exp0to1.ug}</td>
                        <td className="px-4 py-3">{row.exp0to1.pg}</td>
                        <td className="px-4 py-3">{row.exp1to2.ug}</td>
                        <td className="px-4 py-3">{row.exp1to2.pg}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-slate-900 mb-2">Roles & Tracks</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {data.salary.roles.map((r, i) => (
                    <div key={i} className="rounded-xl border border-slate-200 p-4">
                      <div className="text-slate-900 font-medium mb-1">{r.category}</div>
                      <ul className="text-sm text-slate-700 list-disc pl-5">
                        {r.items.map((it, j) => <li key={j}>{it}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3">{data.salary.note}</p>
            </section>

            {/* eligibility */}
            <section id="eligibility" className="rounded-2xl border border-slate-200 p-5 scroll-mt-28 md:scroll-mt-32 w-full">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Eligibility & Policy Highlights</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                {data.eligibility.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </section>

            {/* tips */}
            <section id="tips" className="rounded-2xl border border-slate-200 p-5 scroll-mt-28 md:scroll-mt-32 w-full">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Preparation Tips</h2>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                {data.tips.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </section>

            {/* resources */}
            <section id="resources" className="rounded-2xl border border-slate-200 p-5 scroll-mt-28 md:scroll-mt-32 w-full">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Prep Resources</h2>
              <p className="text-slate-600 text-sm mb-4">Curated documents, drive folders, and locally hosted PDFs for quick practice.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
                {externalDocs.map((d, i) => (
                  <a key={i} href={d.href} target="_blank" rel="noopener" className="group rounded-xl border border-slate-200 p-4 flex items-start gap-3 hover:border-blue-600 hover:bg-blue-50/40 transition">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                      {d.href.includes('drive.google.com') ? <BiFolder /> : <BiLinkExternal />}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 group-hover:text-blue-800">{d.title}</div>
                      <div className="text-xs text-slate-500">{new URL(d.href).hostname}</div>
                    </div>
                  </a>
                ))}
              </div>
              <div className="rounded-xl border border-slate-200">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <div className="font-semibold text-slate-900">Local PDFs & Sheets</div>
                  <div className="text-xs text-slate-500">Hosted in app for fast access</div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
                  {tcsFiles.map((name) => (
                    <a key={name} href={assetUrl(name)} target="_blank" className="rounded-lg border border-slate-200 p-3 flex items-start gap-3 hover:bg-slate-50 transition">
                      <div className="shrink-0 w-8 h-8 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center">
                        {name.toLowerCase().endsWith('.zip') ? <BiDownload /> : <BiFile />}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-slate-900">{name.replace(/\.[^/.]+$/, '')}</div>
                        <div className="text-xs text-slate-500">{name.split('.').pop()?.toUpperCase()}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </section>

            {/* sources */}
            <section id="sources" className="rounded-2xl border border-slate-200 p-5 scroll-mt-28 md:scroll-mt-32 w-full">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">Sources</h2>
              <p className="text-slate-600 text-sm mb-3">This page consolidates official announcements and widely observed exam trends so you can prepare without leaving the page.</p>
              <ul className="list-disc pl-5 space-y-2 text-slate-700">
                <li>
                  <a className="text-blue-700 hover:underline" href="https://www.tcs.com/careers/india/tcs-all-india-nqt-hiring" rel="noopener" target="_blank">
                    TCS All India NQT Hiring (Official)
                  </a>
                </li>
                <li>Section-wise weightage and expanded topic lists have been integrated directly above.</li>
              </ul>
            </section>

            {/* faq */}
            <section id="faq" className="rounded-2xl border border-slate-200 p-5 scroll-mt-28 md:scroll-mt-32 w-full">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">FAQs</h2>
              <div className="divide-y divide-slate-200">
                <details className="py-3">
                  <summary className="font-medium text-slate-900 cursor-pointer">Which batches can apply?</summary>
                  <p className="mt-2 text-slate-700">Graduation batches {data.official.yop.join(', ')} with B.E/B.Tech/M.E/M.Tech/MCA/M.Sc/M.S (as per eligibility) are considered.</p>
                </details>
                <details className="py-3">
                  <summary className="font-medium text-slate-900 cursor-pointer">What is the last date and when are tests?</summary>
                  <p className="mt-2 text-slate-700">Last date to register: {data.official.lastDate}. Tests scheduled {data.official.testStart}.</p>
                </details>
                <details className="py-3">
                  <summary className="font-medium text-slate-900 cursor-pointer">How do I apply correctly?</summary>
                  <p className="mt-2 text-slate-700">Create your profile under {data.official.profileType}. After registration, click “Apply for Drive” to be considered.</p>
                </details>
                <details className="py-3">
                  <summary className="font-medium text-slate-900 cursor-pointer">What is the test mode?</summary>
                  <p className="mt-2 text-slate-700">{data.official.testMode}.</p>
                </details>
                {data.faq.map((f, i) => (
                  <details key={`extra-${i}`} className="py-3">
                    <summary className="font-medium text-slate-900 cursor-pointer">{f.q}</summary>
                    <p className="mt-2 text-slate-700">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* disclaimer */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 text-sm w-full">
              {data.disclaimer}
            </div>

            {/* footer ad */}
            <div className="ad-section-responsive w-full">
              <div className="text-center text-gray-500 text-sm mb-2">Advertisement</div>
              <GoogleAd slot="2109749740" format="auto" minHeight="280px" immediate={true} fullWidthResponsive="true" />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default TcsNqtSyllabus;