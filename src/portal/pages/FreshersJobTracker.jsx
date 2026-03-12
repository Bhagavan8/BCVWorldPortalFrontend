import React, { useEffect, useState } from 'react';
import { FaFileDownload, FaBriefcase, FaBuilding, FaClock, FaCheckCircle, FaFolderOpen, FaArrowLeft, FaBolt, FaLaptopCode, FaHeadset, FaCalculator, FaChartLine, FaUserTie, FaBullhorn, FaDatabase, FaUsers, FaTable, FaFilter, FaMousePointer, FaTasks, FaEye, FaDownload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import GoogleAd from '../components/GoogleAd';
import AuthService from '../../admin/services/AuthService';
import api from '../../api/general';

const StickyAd = ({ slot, position }) => (
  <div className={`hidden lg:flex fixed ${position === 'left' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 w-[160px] flex-col justify-center z-50`}>
      <GoogleAd slot={slot} format="vertical" fullWidthResponsive="false" style={{ height: '600px' }} immediate={true} />
  </div>
);

const FreshersJobTracker = () => {
  const [stats, setStats] = useState({ views: 0, downloads: 0 });
  const pageId = "freshers-job-tracker-2026";

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const res = await api.get(`/analytics/stats?pageId=${pageId}`);
            if (res.data) setStats(res.data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        }
    };

    const recordView = async () => {
        try {
            const user = AuthService.getCurrentUser();
            // If logged in, use ID (unique per user). If not, generate random ID (count every view).
            const userId = (user?.id || user?.user?.id) || `guest_view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            console.log("Tracking view for:", userId);
            await api.post('/analytics/view', null, {
                params: { userId, pageId }
            });
        } catch (error) {
            console.error("Failed to record view", error);
        }
        // Always fetch stats after attempting view record
        fetchStats();
    };

    recordView();
  }, []);

  const handleDownload = async () => {
      try {
          const user = AuthService.getCurrentUser();
          // If logged in, use ID (unique per user). If not, generate random ID (count every download).
          const userId = (user?.id || user?.user?.id) || `guest_dl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          
          console.log("Tracking download for:", userId);
          await api.post('/analytics/download', null, {
              params: { userId, pageId }
          });
          // Optimistically update download count
          setStats(prev => ({ ...prev, downloads: (prev.downloads || 0) + 1 }));
      } catch (error) {
          console.error("Failed to record download", error);
      }
  };

  const summaryData = [
    { label: 'Last 24h Jobs', value: 16, icon: FaBolt, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Last 36h Jobs', value: 6, icon: FaClock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Company Pages', value: 51, icon: FaBuilding, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Total Unique', value: 69, icon: FaCheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  const categoryData = [
    { category: 'Software Development', count: 41, icon: FaLaptopCode, color: 'text-blue-600' },
    { category: 'BPO / Customer Service', count: 8, icon: FaHeadset, color: 'text-orange-500' },
    { category: 'Finance & Accounts', count: 5, icon: FaCalculator, color: 'text-green-600' },
    { category: 'General / Others', count: 4, icon: FaFolderOpen, color: 'text-gray-500' },
    { category: 'Sales & Business Dev', count: 3, icon: FaChartLine, color: 'text-purple-600' },
    { category: 'Web Development', count: 2, icon: FaLaptopCode, color: 'text-cyan-600' },
    { category: 'Marketing & Content', count: 2, icon: FaBullhorn, color: 'text-pink-500' },
    { category: 'Data & Analytics', count: 2, icon: FaDatabase, color: 'text-teal-600' },
    { category: 'HR & Recruitment', count: 1, icon: FaUsers, color: 'text-rose-500' },
    { category: 'AI / ML / Data Science', count: 1, icon: FaDatabase, color: 'text-sky-600' },
  ];

  const sheetsData = [
    { name: 'Last 24h Jobs', desc: 'ALL categories — posted in last 24 hours', icon: FaBolt, color: 'text-yellow-500' },
    { name: 'Last 36h Jobs', desc: 'ALL categories — posted in last 36 hours', icon: FaClock, color: 'text-blue-500' },
    { name: 'Company Pages', desc: '51 companies — direct career links', icon: FaBuilding, color: 'text-indigo-500' },
    { name: 'All Jobs', desc: 'Everything combined', icon: FaCheckCircle, color: 'text-emerald-500' },
    { name: 'Software Dev', desc: 'Java • Python • Full Stack • Backend • Frontend', icon: FaLaptopCode, color: 'text-blue-600' },
    { name: 'AI and ML', desc: 'AI Engineer • ML • Data Science • NLP • LLM', icon: FaDatabase, color: 'text-teal-600' },
    { name: 'QA Testing', desc: 'Automation • Selenium • Manual Testing • SDET', icon: FaCheckCircle, color: 'text-purple-600' },
    { name: 'DevOps Cloud', desc: 'AWS • Azure • K8s • Linux • Cybersecurity', icon: FaDatabase, color: 'text-cyan-600' },
    { name: 'BPO', desc: 'Voice • Chat • Non-Voice • Telecalling • Back Office', icon: FaHeadset, color: 'text-orange-500' },
    { name: 'Non-IT', desc: 'Sales • Marketing • HR • Finance • Operations', icon: FaUserTie, color: 'text-pink-600' },
  ];

  const howToUseSteps = [
    { title: 'Start with Last 24h Jobs', desc: 'Freshest listings first', icon: FaBolt, color: 'bg-yellow-100 text-yellow-600' },
    { title: 'Use Category filter ▼', desc: 'Show only IT / BPO / Non-IT etc.', icon: FaFilter, color: 'bg-blue-100 text-blue-600' },
    { title: 'Click ▶ APPLY NOW', desc: 'Opens direct application page', icon: FaMousePointer, color: 'bg-emerald-100 text-emerald-600' },
    { title: 'Update Status column', desc: 'Track your applications', icon: FaTasks, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <SEO 
        title="Freshers Jobs 2026: AI Automation Job Report (IT, Non-IT & BPO) | BCVWorld"  
        description="Find the latest Freshers Jobs 2026 in IT, Non-IT, and BPO. Download the free AI Automation Job Tracker Report with direct application links for Off Campus Drives, Walk-ins, and Work from Home roles."
        keywords="freshers jobs 2026, off campus drive 2026, it jobs for freshers, non it jobs for freshers, bpo jobs, work from home for freshers, trainee engineer, recruitment 2026, job tracker, entry level jobs, software engineer freshers, latest job updates, bcvworld jobs, freshers hiring, walk in interview"
        type="website"
      />

      {/* Sticky Ads */}
      <StickyAd slot="7955279812" position="left" />
      <StickyAd slot="3414563297" position="right" />
      
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        <div className="pt-2">
            <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 font-medium transition-colors group">
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
        </div>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl overflow-hidden shadow-xl border border-slate-700 relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <FaBriefcase className="text-9xl" />
          </div>
          <div className="p-8 md:p-12 text-center relative z-10">
            <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold tracking-widest uppercase mb-4 border border-blue-500/30">
              Updated: 2026-03-09
            </div>
            
            {AuthService.isAdmin() && (
            <div className="flex items-center justify-center gap-4 text-slate-400 text-sm mb-6 font-medium">
                <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                    <FaEye className="text-blue-400" /> {stats.views || 0} Views
                </span>
                <span className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700/50">
                    <FaDownload className="text-emerald-400" /> {stats.downloads || 0} Downloads
                </span>
            </div>
            )}

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 leading-tight mb-4">
              <span className="text-blue-400">AI AUTOMATION</span>
              <span className="hidden md:inline text-slate-600">|</span>
              <span>FRESHERS JOBS REPORT</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto">
              Comprehensive automated report for IT, Non-IT, BPO, and All Roles. Updated daily.
            </p>
          </div>
          <div className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        </div>

        {/* Top Ad */}
        <div className="w-full flex justify-center my-6">
           <GoogleAd slot="7461144152" format="auto" fullWidthResponsive="true" immediate={true} minHeight="280px" />
        </div>

        {/* Scrape Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {summaryData.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <div className={`p-3 rounded-full ${item.bg} mb-3`}>
                  <item.icon className={`text-2xl ${item.color}`} />
                </div>
                <p className="text-3xl font-extrabold text-slate-800 mb-1">{item.value}</p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{item.label}</p>
              </div>
            ))}
        </div>
        
        {/* Middle Ad */}
        <div className="w-full flex justify-center my-6">
           <GoogleAd slot="3905517884" format="auto" fullWidthResponsive="true" immediate={true} minHeight="280px" />
        </div>

        {/* How to Use Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
             <div className="bg-slate-800 px-8 py-6 border-b border-slate-700 flex items-center">
               <h2 className="text-xl font-bold text-white flex items-center gap-3">
                 <FaCheckCircle className="text-emerald-400" /> How to Use
               </h2>
            </div>
            <div className="p-8">
               <div className="grid md:grid-cols-2 gap-6">
                  {howToUseSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                       <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${step.color}`}>
                         {index + 1}
                       </div>
                       <div>
                          <h3 className="font-bold text-slate-800 text-lg mb-1">{step.title}</h3>
                          <p className="text-slate-600 text-sm">{step.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

        {/* Jobs By Category */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-8 py-6 border-b border-slate-200 flex items-center justify-between">
             <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
               <FaFolderOpen className="text-blue-500" /> Jobs by Category
             </h2>
             <span className="text-sm text-slate-500 font-medium">9 Categories</span>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryData.map((item, index) => (
                <div key={index} className="group p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all duration-200 flex items-center justify-between cursor-default">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                      <item.icon className={`text-lg ${item.color}`} />
                    </div>
                    <span className="font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">{item.category}</span>
                  </div>
                  <span className="bg-white text-slate-700 py-1 px-3 rounded-full text-xs font-bold border border-slate-200 shadow-sm group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-100">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* New Autorelaxed Ad */}
        <div className="w-full flex justify-center my-6">
           <GoogleAd slot="1059387337" format="autorelaxed" fullWidthResponsive="true" immediate={true} minHeight="280px" />
        </div>

        {/* Sheets Guide */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-800 px-8 py-6 border-b border-slate-700 flex items-center">
               <h2 className="text-xl font-bold text-white flex items-center gap-3">
                 <FaTable className="text-blue-400" /> Report Sheets Guide
               </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sheet Name</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sheetsData.map((sheet, index) => (
                    <tr key={index} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <sheet.icon className={`text-lg ${sheet.color}`} />
                          <span className="font-bold text-slate-700">{sheet.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 text-sm">
                        {sheet.desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>

        {/* AI Automation Report Description - SEO Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
            <FaBolt className="text-yellow-500" /> About the AI Automation Report
          </h2>
          <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4">
            <p>
              Welcome to the <strong>AI Automation Report for Freshers Jobs 2026</strong>, the most comprehensive and automated job tracking resource for entry-level candidates. Our advanced AI algorithms scan thousands of company career pages, LinkedIn listings, and job portals daily to curate a verified list of opportunities.
            </p>
            <p>
              This report is specifically designed for:
            </p>
            <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
              <li><strong>IT & Software Roles:</strong> Software Developers, Data Analysts, AI/ML Engineers, QA Testers, and Web Developers.</li>
              <li><strong>Non-IT & Core Engineering:</strong> Mechanical, Electrical, Civil, and other core engineering domains.</li>
              <li><strong>BPO & Customer Support:</strong> High-paying voice and non-voice process roles in top MNCs.</li>
              <li><strong>All Educational Backgrounds:</strong> BE/B.Tech, BSc, BCom, MBA, and Diploma holders.</li>
            </ul>
            <p>
              Unlike manual job boards, our <em>AI Automation Report</em> ensures zero expired links and categorizes jobs by eligibility, making it easier for you to find the right fit. Whether you are looking for an off-campus drive, a walk-in interview, or a remote work-from-home opportunity, this report has it all covered.
            </p>
          </div>
        </div>

        {/* Download Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-4 tracking-tight">Download the AI Automation Report</h2>
            <p className="mb-8 text-blue-100 max-w-2xl mx-auto text-lg leading-relaxed font-light">
              Get instant access to the complete list of <span className="font-bold text-white">75+ verified jobs</span> covering IT, Non-IT, and BPO roles. Direct application links included.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/assets/files/Jobs_Tracker.xlsx" 
                download="Freshers_Jobs_AI_Automation_Report_For_IT_Non_IT_And_All_Roles_2026.xlsx"
                onClick={handleDownload}
                className="inline-flex items-center gap-3 bg-white text-blue-700 hover:bg-blue-50 font-bold py-4 px-8 rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-lg text-lg"
              >
                <FaFileDownload className="text-xl" />
                Download Excel Report
              </a>
            </div>
            <p className="mt-6 text-xs text-blue-200/80 font-medium uppercase tracking-wide">
              * Updated daily • AI Verified • Virus Free
            </p>
          </div>
        </div>

        {/* Bottom Ad */}
        <div className="w-full flex justify-center my-6">
           <GoogleAd slot="5313492962" format="auto" fullWidthResponsive="true" immediate={true} minHeight="280px" />
        </div>

        {/* Autorelaxed Ad */}
        <div className="w-full flex justify-center my-6">
           <GoogleAd slot="4000411290" format="autorelaxed" fullWidthResponsive="true" immediate={true} minHeight="280px" />
        </div>
      </div>
    </div>
  );
};

export default FreshersJobTracker;
