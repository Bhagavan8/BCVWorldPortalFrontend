import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BiSearch, BiFilter, BiBriefcase, BiMap, BiBuilding, BiCalendar, BiX, BiXCircle, BiArrowBack, BiUser, BiTime, BiFolder } from 'react-icons/bi';

import { toast } from 'react-hot-toast';
import SEO from '../components/SEO';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [companyMap, setCompanyMap] = useState({});
  const rawBase = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';
  const API_BASE = (typeof rawBase === 'string' ? rawBase.trim() : '');
  
  // Filter States
  // Helper for local date string YYYY-MM-DD
  const getTodayString = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('All');
  const [experience, setExperience] = useState({ fresher: false, experienced: false });
  const [dateFilter, setDateFilter] = useState(getTodayString());
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Derived lists for filters
  const [uniqueCompanies, setUniqueCompanies] = useState([]);
  const [uniqueLocations, setUniqueLocations] = useState([]);

  // ... (keep existing state)

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
  }, [searchParams]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const base = API_BASE ? API_BASE : '';
      const jobsUrl = `${base}/api/jobs`;
      
      const response = await fetch(jobsUrl); // Fetch all jobs
      if (response.ok) {
        let rawData = await response.json();
        console.log('Fetched jobs:', rawData);
        rawData = Array.isArray(rawData) ? rawData : [];
        
        // Normalize data to match component expectations
        // Backend (bcvworld.backend) uses: title, company, location (string), category, experience, jobCode
        // Frontend expects: jobTitle, companyName, locations (array), jobCategory, experienceRequired, referralCode
        const data = rawData.map(j => {
          let parsedLocations = [];
          if (Array.isArray(j.locations)) {
             parsedLocations = j.locations;
          } else if (typeof j.location === 'string') {
             parsedLocations = j.location.split(',').map(s => s.trim());
          }
          
          return {
            ...j,
            jobTitle: j.title || j.jobTitle,
            companyName: j.company || j.companyName,
            locations: parsedLocations,
            jobCategory: j.category || j.jobCategory,
            experienceRequired: j.experience || j.experienceRequired,
            referralCode: j.jobCode || j.referralCode,
            companyLogoUrl: j.logoUrl || j.companyLogoUrl, // Map logoUrl to companyLogoUrl
            lastDateToApply: j.lastDateToApply || null, 
            postedDate: j.postedDate || getTodayString()
        }});

        setJobs(data);
        const baseJobs = data;
        
        // Extract unique companies and locations for filter
        const companies = new Set();
        const locs = new Set();
        
        baseJobs.forEach(j => {
            if (j.companyName) companies.add(j.companyName);
            if (Array.isArray(j.locations)) {
                j.locations.forEach(l => {
                    if (l) locs.add(l);
                });
            }
        });
        setUniqueCompanies(Array.from(companies).sort());
        setUniqueLocations(Array.from(locs).sort());

        const idsToFetch = baseJobs
          .filter(j => j.useExistingCompany && j.companyId && (!j.companyName || !j.companyLogoUrl))
          .map(j => j.companyId);
        const uniqueIds = Array.from(new Set(idsToFetch));
        
        if (uniqueIds.length) {
          const results = await Promise.all(uniqueIds.map(async (cid) => {
            try {
              const r = await fetch(`${API_BASE}/api/companies/${cid}`);
              if (r.ok) {
                const c = await r.json();
                return [cid, { name: c.name, website: c.website, about: c.about, logoUrl: c.logoUrl }];
              }
              return [cid, null];
            } catch {
              return [cid, null];
            }
          }));
          const map = {};
          results.forEach(([cid, val]) => { if (val) map[cid] = val; });
          setCompanyMap(map);
          
          // Update unique companies with fetched names
          const allCompanies = new Set();
          baseJobs.forEach(j => {
             const name = j.useExistingCompany && j.companyId && map[j.companyId] ? map[j.companyId].name : j.companyName;
             if (name) allCompanies.add(name);
          });
          setUniqueCompanies(Array.from(allCompanies).sort());
        }
      } else {
        console.error('Failed to fetch jobs:', response.status, response.statusText);
        toast.error(`Failed to load jobs (Status: ${response.status}). Please try again later.`, { id: 'fetch-jobs-error' });
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Unable to connect to the server. Please check your internet connection.', { id: 'fetch-jobs-network-error' });
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, API_BASE]);
  
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]); 

  // Automatic Filtering Effect
  useEffect(() => {
    let result = [...jobs];

    // Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(job => (job.jobCategory || '').toLowerCase() === selectedCategory.toLowerCase());
    }

    // Company Filter
    if (companyFilter !== 'All') {
      result = result.filter(job => {
        const cName = job.useExistingCompany && job.companyId && companyMap[job.companyId] ? companyMap[job.companyId].name : job.companyName;
        return (cName || '').toLowerCase() === companyFilter.toLowerCase();
      });
    }

    // Search Filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(job => {
        const title = (job.jobTitle || '').toLowerCase();
        const comp = (job.companyName || '').toLowerCase();
        const compFromMap = job.companyId && companyMap[job.companyId]?.name ? companyMap[job.companyId].name.toLowerCase() : '';
        const locs = Array.isArray(job.locations) ? job.locations.join(' ').toLowerCase() : '';
        const skills = (job.skills || '').toLowerCase();
        const ref = (job.referralCode || '').toLowerCase();
        
        return title.includes(lowerTerm) || 
               comp.includes(lowerTerm) || 
               compFromMap.includes(lowerTerm) || 
               locs.includes(lowerTerm) ||
               skills.includes(lowerTerm) ||
               ref.includes(lowerTerm);
      });
    }

    // Location Filter
    if (location !== 'all') {
      result = result.filter(job => Array.isArray(job.locations) ? job.locations.some(l => (l || '').toLowerCase().includes(location.toLowerCase())) : false);
    }

    // Experience Filter
    if (experience.fresher && !experience.experienced) {
      result = result.filter(job => (job.experienceRequired || '').toLowerCase().includes('0') || (job.experienceRequired || '').toLowerCase().includes('fresher'));
    } else if (!experience.fresher && experience.experienced) {
      result = result.filter(job => {
        const e = (job.experienceRequired || '').toLowerCase();
        return !e.includes('0') && !e.includes('fresher');
      });
    }

    // Date Filter
    if (dateFilter) {
      result = result.filter(job => {
          if (!job.postedDate) return false;
          // Compare just the date part (YYYY-MM-DD)
          return job.postedDate.substring(0, 10) === dateFilter;
      });
    }

    setFilteredJobs(result);
  }, [jobs, selectedCategory, companyFilter, searchTerm, location, experience, dateFilter, companyMap]);

  const clearFilters = () => {
    setSearchTerm('');
    setLocation('all');
    setCompanyFilter('All');
    setExperience({ fresher: false, experienced: false });
    setDateFilter(getTodayString()); // Reset to today
    setSelectedCategory('All');
    setSearchParams({});
    // filteredJobs will update via useEffect
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    
    if (val.length >= 3) {
      const lowerVal = val.toLowerCase();
      const suggestionsSet = new Set();
      
      jobs.forEach(job => {
        // Companies
        const cName = job.useExistingCompany && job.companyId && companyMap[job.companyId] ? companyMap[job.companyId].name : job.companyName;
        if (cName && cName.toLowerCase().includes(lowerVal)) suggestionsSet.add(cName);
        
        // Skills
        if (job.skills) {
            job.skills.split(',').forEach(s => {
                if (s.trim().toLowerCase().includes(lowerVal)) suggestionsSet.add(s.trim());
            });
        }
        
        // Locations
        if (job.locations) {
            job.locations.forEach(l => {
                if (l.toLowerCase().includes(lowerVal)) suggestionsSet.add(l);
            });
        }
        
        // Referral IDs
        if (job.referralCode && job.referralCode.toLowerCase().includes(lowerVal)) {
            suggestionsSet.add(job.referralCode);
        }
      });
      
      setSuggestions(Array.from(suggestionsSet).slice(0, 10)); // Limit to 10
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (val) => {
      setSearchTerm(val);
      setShowSuggestions(false);
  };

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat);
    setSearchParams({ category: cat });
  };

  const handleLocationClick = (loc) => {
    setLocation(loc);
  };

  const categories = ['IT', 'Government', 'Bank', 'BPO', 'Core', 'Civil', 'Mechanical'];
  const locations = ['Andhra Pradesh', 'Bangalore', 'Chennai', 'Delhi', 'Gurgaon', 'Hyderabad', 'Mumbai', 'NCR', 'Noida', 'Pune'];

  return (
    <div className="pt-32 pb-12 bg-white min-h-screen font-sans">
      <SEO 
        title="Jobs" 
        description="Browse thousands of job opportunities in IT, Banking, Government, and more. Find your next career move with BCVWORLD." 
        keywords="jobs, recruitment, vacancies, hiring, IT jobs, government jobs, bank jobs, freshers, experienced"
      />
      <div className="w-full px-4 md:px-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button 
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg font-semibold shadow-md"
          >
            <BiFilter className="text-xl" />
            {showMobileFilter ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR: Jobs By Category */}
          <div className={`${showMobileFilter ? 'block' : 'hidden'} lg:block lg:col-span-2`}>
            <div className="mb-4">
              <h6 className="font-bold mb-3 pb-2 border-b-2 border-blue-600 text-sm text-gray-800">
                Jobs By Category
              </h6>
              <div className="flex flex-col">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`text-left px-0 py-1 text-sm text-gray-500 hover:text-blue-600 transition ${selectedCategory === cat ? 'font-bold text-blue-600' : ''}`}
                  >
                    {cat} Jobs
                  </button>
                ))}
              </div>
            </div>
            
            
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-8">
            
            {/* Filter Section Card */}
            <div className="bg-white rounded-lg shadow-sm mb-4 border border-gray-200">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white rounded-t-lg">
                <h2 className="text-base font-bold text-gray-800 m-0">Filter Jobs</h2>
                <button 
                  className="lg:hidden text-gray-500 hover:text-blue-600"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <BiFilter size={20} />
                </button>
              </div>

              {isFilterOpen && (
                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    
                    {/* Search */}
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Search Jobs</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition placeholder-gray-400"
                          placeholder="Skills, Company, etc."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          onFocus={() => { if (searchTerm.length >= 3) setShowSuggestions(true); }}
                          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        />
                        {showSuggestions && suggestions.length > 0 && (
                          <div className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto mt-1">
                            {suggestions.map((s, idx) => (
                                <div 
                                    key={idx} 
                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                                    onClick={() => selectSuggestion(s)}
                                >
                                    {s}
                                </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Company Filter (Replaces Category) */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Company</label>
                      <select 
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700"
                        value={companyFilter}
                        onChange={(e) => setCompanyFilter(e.target.value)}
                      >
                        <option value="All">All Companies</option>
                        {uniqueCompanies.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                      <select 
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      >
                        <option value="all">All Locations</option>
                        {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                      </select>
                    </div>

                    {/* Experience Level */}
                    <div>
                       <label className="block text-sm font-bold text-gray-700 mb-2">Experience Level</label>
                       <div className="flex gap-2">
                         <label className={`flex-1 cursor-pointer py-1.5 px-2 text-sm border rounded text-center transition select-none ${experience.fresher ? 'bg-gray-600 text-white border-gray-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                           <input 
                             type="checkbox" 
                             className="hidden" 
                             checked={experience.fresher}
                             onChange={() => setExperience({...experience, fresher: !experience.fresher})}
                           />
                           Fresher
                         </label>
                         <label className={`flex-1 cursor-pointer py-1.5 px-2 text-sm border rounded text-center transition select-none ${experience.experienced ? 'bg-gray-600 text-white border-gray-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}>
                           <input 
                             type="checkbox" 
                             className="hidden"
                             checked={experience.experienced}
                             onChange={() => setExperience({...experience, experienced: !experience.experienced})}
                           />
                           Experienced
                         </label>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-stretch gap-3 mt-4">
                    <div className="flex-grow md:flex-grow-0">
                       <div className="flex rounded border border-gray-300 overflow-hidden h-[31px]">
                         <span className="px-3 bg-gray-100 border-r border-gray-300 text-gray-500 flex items-center">
                           <BiCalendar />
                         </span>
                         <input 
                           type="date" 
                           className="px-3 text-sm outline-none bg-white text-gray-600"
                           value={dateFilter}
                           onChange={(e) => setDateFilter(e.target.value)}
                         />
                         <button 
                           onClick={() => setDateFilter('')}
                           className="px-2 bg-white border-l border-gray-300 text-gray-500 hover:text-red-500 flex items-center"
                           title="Clear date filter"
                         >
                           <BiX size={16} />
                         </button>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 md:flex">
                       {/* Apply Filters Button Removed (Auto-apply enabled) */}
                       <button 
                         onClick={clearFilters}
                         className="col-span-2 md:col-span-1 px-4 py-1.5 bg-white border border-gray-300 text-gray-600 text-sm font-medium rounded hover:bg-gray-50 transition flex items-center justify-center"
                       >
                         <BiXCircle className="mr-1" /> Clear All
                       </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Header - No Card Style */}
            <div className="mb-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 px-1">
               <div className="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
                 {/* Total Jobs Stats */}
                 <div className="flex items-center gap-2 w-full md:w-auto p-0 rounded">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
                      <BiBriefcase className="text-lg" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Total Jobs</div>
                      <div className="flex items-baseline">
                         <span className="text-lg font-bold text-blue-600">{jobs.length}</span>
                         <span className="text-xs text-gray-500 ml-1">positions</span>
                      </div>
                    </div>
                 </div>

                 {/* Filtered Stats */}
                 <div className="flex items-center gap-2 w-full md:w-auto p-0 rounded">
                    <div className="p-2 bg-green-50 text-green-600 rounded-full">
                      <BiCalendar className="text-lg" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Filtered</div>
                      <div className="flex items-baseline">
                         <span className="text-lg font-bold text-green-600">{filteredJobs.length}</span>
                         <span className="text-xs text-gray-500 ml-1">matches</span>
                      </div>
                    </div>
                 </div>
               </div>

               <Link 
                 to="/" 
                 className="btn btn-sm bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition text-sm font-medium"
               >
                 <BiArrowBack /> Back to Home
               </Link>
            </div>

            {/* Job List */}
            <div className="space-y-0 min-h-[200px]">
              {loading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => {
                   const compName = job.useExistingCompany && job.companyId ? (companyMap[job.companyId]?.name || job.companyName || '') : (job.companyName || '');
                   const logo = job.useExistingCompany && job.companyId ? (companyMap[job.companyId]?.logoUrl || job.companyLogoUrl || '') : (job.companyLogoUrl || '');
                   const primaryLoc = Array.isArray(job.locations) && job.locations.length ? job.locations[0] : '';
                   const headerTitle = [job.jobTitle, compName, primaryLoc].filter(Boolean).join(' | ');
                   const plainTextDesc = job.description ? job.description.replace(/<[^>]+>/g, '').substring(0, 180) + (job.description.length > 180 ? '...' : '') : '';
                   const applyBy = job.lastDateToApply ? new Date(job.lastDateToApply).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
                   
                   const clean = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                   const slug = `${clean(job.jobTitle)}-${clean(compName)}-${clean(primaryLoc)}`;
                   // Generate random strings for URL obfuscation
                   const r1 = Math.random().toString(36).substring(2, 10);
                   const r2 = Math.random().toString(36).substring(2, 10);
                   const r3 = Math.random().toString(36).substring(2, 10);
                   const jobUrl = `/job?type=private&job_id=${job.id}&slug=${slug}~${job.id}&ref=${r1}&token=${r2}&s=${r3}&src=bcvworld.com`;

                   return (
                  <div key={job.id} className="w-full bg-white border-b border-[#e0e0e0] py-6 hover:bg-[#fcfcfc] transition-colors duration-200 last:border-b-0">
                    <div className="flex flex-col md:flex-row gap-5 items-start">
                      
                      {/* Logo Wrapper */}
                      <div className="shrink-0 w-20 md:w-[100px] flex items-center justify-center">
                           {logo ? (
                             <img 
                               loading="lazy" 
                               src={logo} 
                               alt={compName} 
                               className="max-w-full h-auto object-contain max-h-[60px] md:max-h-[80px]" 
                               onError={(e) => {
                                 e.target.style.display = 'none';
                                 e.target.nextSibling.style.display = 'block';
                               }} 
                             />
                           ) : null}
                           <BiBuilding 
                             className={`${(job.jobCategory || '').toLowerCase() === 'government' ? 'text-red-600' : 'text-blue-600'} text-[32px]`} 
                             style={{ display: logo ? 'none' : 'block' }}
                           />
                      </div>

                      {/* Content Wrapper */}
                      <div className="flex-grow min-w-0 w-full">
                          <h3 className="text-base md:text-[1.1rem] font-medium mb-2 leading-snug font-sans text-[#2ea3f2] hover:text-[#1b8ad3] transition-colors">
                            <Link to={jobUrl} className="">{headerTitle}</Link>
                          </h3>
                          
                          <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4 items-center">
                              <span className="flex items-center gap-1.5">
                                <BiUser className="text-gray-400 text-sm" /> <span>bcvworld</span>
                              </span>
                              {job.postedDate && (
                                <span className="flex items-center gap-1.5">
                                  <BiCalendar className="text-gray-400 text-sm" /> 
                                  <span>{new Date(job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </span>
                              )}
                              {applyBy && (
                                <span className="flex items-center gap-1.5">
                                  <BiTime className="text-gray-400 text-sm" /> <span>{applyBy}</span>
                                </span>
                              )}
                              <span className="flex items-center gap-1.5">
                                <BiFolder className="text-gray-400 text-sm" /> <span>{primaryLoc}</span>
                              </span>
                          </div>

                          <div className="text-sm text-[#555] leading-relaxed mb-4 line-clamp-2">
                            {plainTextDesc}
                          </div>
                          
                          <div className="">
                             <Link 
                                to={jobUrl} 
                                className="inline-block w-full md:w-auto text-center px-4 py-1.5 md:py-[6px] text-xs font-semibold text-[#555] bg-[#fcfcfc] border border-[#ddd] rounded-[2px] hover:bg-[#f0f0f0] hover:border-[#ccc] hover:text-[#333] transition-all duration-200"
                             >
                                Continue Reading
                             </Link>
                          </div>

                      </div>
                    </div>
                  </div>
                )})
              ) : (
                <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
                  <div className="text-gray-300 text-6xl mb-4 mx-auto w-fit"><BiSearch /></div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-500 mb-6">We couldn't find any jobs matching your criteria.</p>
                  <button onClick={clearFilters} className="px-6 py-2 bg-blue-50 text-blue-600 font-medium rounded hover:bg-blue-100 transition">
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT SIDEBAR: Jobs By Location */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="mb-4">
              <h6 className="font-bold mb-3 pb-2 border-b-2 border-cyan-500 text-sm text-gray-800">
                Jobs By Location
              </h6>
              <div className="flex flex-col">
                {uniqueLocations.length > 0 ? uniqueLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleLocationClick(loc)}
                    className={`text-left px-0 py-1 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition ${location === loc ? 'font-bold text-cyan-600' : ''}`}
                  >
                    Jobs in {loc}
                  </button>
                )) : (
                   <span className="text-sm text-gray-400">No locations found</span>
                )}
              </div>
            </div>

            
          </div>

        </div>
      </div>
    </div>
  );
}
