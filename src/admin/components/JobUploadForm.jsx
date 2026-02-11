import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobService from '../services/JobService';
import AuthService from '../services/AuthService';
import { BiInfoCircle, BiBuilding, BiEnvelope } from 'react-icons/bi';
import { FaArrowRight, FaArrowLeft, FaCog, FaCheckCircle, FaSearch } from 'react-icons/fa';
import { API_BASE_URL } from '../../utils/config';

const JobUploadForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('JobUploadForm mounted');
        if (id) {
            fetchJobDetails(id);
        }
    }, [id]);

    const fetchJobDetails = async (jobId) => {
        try {
            setLoading(true);
            const res = await JobService.getJobById(jobId);
            const job = res.data;
            console.log('Fetched job details:', job);

            // Map backend data to form state
            setFormData(prev => ({
                ...prev,
                jobTitle: job.jobTitle || '',
                jobCategory: job.jobCategory || 'IT',
                jobType: job.jobType || 'private',
                employmentType: job.employmentType || 'fulltime',
                locations: Array.isArray(job.locations) ? job.locations : (job.location ? [job.location] : []),
                educationLevels: Array.isArray(job.educationLevels) ? job.educationLevels : [],
                experienceRequired: job.experience || job.experienceRequired || 'Fresher',
                noticePeriod: job.noticePeriod || '',
                salaryRange: job.salaryRange || '',
                lastDateToApply: job.lastDate ? new Date(job.lastDate).toISOString().split('T')[0] : (job.lastDateToApply || ''),
                skills: job.skills || '',
                description: job.description || '',
                qualifications: job.qualifications || '',
                walkinDetails: job.walkinDetails || '',

                // Company details
                companyName: job.companyName || '',
                companyWebsite: job.companyWebsite || '',
                aboutCompany: job.aboutCompany || '',
                companyLogoUrl: job.logoUrl || job.companyLogoUrl || '',

                // Application details
                applicationMethod: job.applicationLink ? 'link' : (job.applicationEmail ? 'email' : ''),
                applicationLinkOrEmail: job.applicationLink || job.applicationEmail || '',

                listingStatus: job.listingStatus || 'public',
                isActive: job.active !== undefined ? job.active : (job.isActive !== undefined ? job.isActive : true),
                referralCode: job.referralCode || '',
                postedBy: job.postedBy || job.userId || null,
                postedByName: job.postedByName || job.posted_by_name || ''
            }));

            showToast('success', 'Job details loaded');
        } catch (error) {
            console.error('Error fetching job details:', error);
            showToast('danger', 'Failed to load job details');
        } finally {
            setLoading(false);
        }
    };

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ type: '', content: '', visible: false });
    const [companySearch, setCompanySearch] = useState('');
    const [companyResults, setCompanyResults] = useState([]);

    const [formData, setFormData] = useState({
        jobTitle: '',
        jobCategory: 'IT',
        jobType: 'private',
        employmentType: 'fulltime',
        locations: [],
        educationLevels: [],
        experienceRequired: 'Fresher',
        noticePeriod: '',
        salaryRange: '',
        lastDateToApply: '',
        skills: '',
        description: '',
        qualifications: '',
        walkinDetails: '',
        useExistingCompany: false,
        companyName: '',
        companyWebsite: '',
        aboutCompany: '',
        applicationMethod: '',
        applicationLinkOrEmail: '',
        listingStatus: 'public',
        isActive: true,
        referralCode: '',
        companyLogoUrl: '',
        companyId: null,
        postedBy: null,
        postedByName: ''
    });

    const locationsList = [
        "Remote", "Bengaluru", "Bangalore", "Mumbai", "Delhi NCR", "New Delhi", "Noida", "Greater Noida", "Gurugram", "Gurgaon", "Hyderabad",
        "Chennai", "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Lucknow",
        "Indore", "Kochi", "Chandigarh", "Pan India"
    ];

    const educationList = [
        "Any Graduate", "Bachelor's Degree", "Master's Degree", "PhD/Doctorate",
        "B.Tech/B.E.", "B.Sc", "B.Com", "B.A.", "BCA", "BBA",
        "M.Tech/M.E.", "M.Sc", "M.Com", "M.A.", "MCA", "MBA/PGDM",
        "Diploma", "12th Pass", "10th Pass"
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Custom dropdown state management
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (e, name) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenDropdown(prev => prev === name ? null : name);
    };

    const handleMultiSelectChange = (e, field) => {
        const { value, checked } = e.target;
        setFormData(prev => {
            const list = prev[field];
            if (checked) {
                return { ...prev, [field]: [...list, value] };
            } else {
                return { ...prev, [field]: list.filter(item => item !== value) };
            }
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.custom-dropdown-wrapper')) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogoChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) { showToast('danger', 'Please select an image file'); return; }
        if (file.size > 2 * 1024 * 1024) { showToast('danger', 'Image must be under 2MB'); return; }
        try {
            const res = await JobService.uploadCompanyLogo(file);
            const url = res.data.url;
            setFormData(prev => ({ ...prev, companyLogoUrl: url }));
            showToast('success', 'Logo uploaded');
        } catch (error) {
            console.error('Logo upload error:', error);
            showToast('danger', 'Logo upload failed');
        }
    };

    const searchCompanies = async () => {
        if (!companySearch.trim()) return;
        try {
            const res = await JobService.searchCompanies(companySearch.trim());
            setCompanyResults(res.data || []);
            if ((res.data || []).length === 0) {
                showToast('warning', 'No companies found');
            }
        } catch (error) {
            console.error('Company search error:', error);
            showToast('danger', 'Company search failed');
        }
    };

    const selectCompany = (c) => {
        setFormData(prev => ({
            ...prev,
            useExistingCompany: true,
            companyId: c.id,
            companyName: c.companyName || c.company_name || c.name || '',
            companyWebsite: c.companyWebsite || c.company_website || c.website || c.url || '',
            aboutCompany: c.aboutCompany || c.about_company || c.about || c.description || '',
            companyLogoUrl: c.logoUrl || c.logo_url || c.companyLogoUrl || c.company_logo_url || c.logo || ''
        }));
        setCompanyResults([]);
        showToast('success', 'Company details filled');
    };

    const showToast = (type, content) => {
        setToast({ type, content, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    };

    const validateStep1 = () => {
        if (!formData.jobTitle.trim()) { showToast('danger', 'Job Title is required'); return false; }
        if (!formData.jobCategory) { showToast('danger', 'Job Category is required'); return false; }
        if (!formData.employmentType) { showToast('danger', 'Employment Type is required'); return false; }
        if (!formData.experienceRequired) { showToast('danger', 'Experience Required is required'); return false; }
        if (formData.locations.length === 0) { showToast('danger', 'Select at least one Location'); return false; }
        if (formData.educationLevels.length === 0) { showToast('danger', 'Select at least one Education Level'); return false; }
        if (!formData.skills.trim()) { showToast('danger', 'Required Skills are required'); return false; }
        if (!formData.description.trim()) { showToast('danger', 'Job Description is required'); return false; }
        if (!formData.qualifications.trim()) { showToast('danger', 'Desired Qualifications are required'); return false; }
        return true;
    };

    const validateStep3 = () => {
        if (!formData.applicationMethod) { showToast('danger', 'Select an application method'); return false; }
        if (!formData.applicationLinkOrEmail.trim()) { showToast('danger', 'Enter application link or email'); return false; }
        if (formData.applicationMethod === 'email') {
            const ok = /\S+@\S+\.\S+/.test(formData.applicationLinkOrEmail.trim());
            if (!ok) { showToast('danger', 'Enter a valid email address'); return false; }
        }
        if (formData.applicationMethod === 'link') {
            const ok = /^https?:\/\//i.test(formData.applicationLinkOrEmail.trim());
            if (!ok) { showToast('danger', 'Enter a valid URL starting with http'); return false; }
        }
        return true;
    };

    const validateStep4 = () => {
        if (!formData.listingStatus) { showToast('danger', 'Listing Status is required'); return false; }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Debug Auth Status
        const token = AuthService.getToken();
        const role = AuthService.getRole();
        console.log('JobUploadForm: Submitting with Auth:', { 
            hasToken: !!token, 
            tokenLength: token ? token.length : 0,
            role 
        });

        if (!validateStep1() || !validateStep3() || !validateStep4()) return;

        setLoading(true);
        try {
            // Get user info from localStorage
            let currentUserPostedBy = null;
            let currentUserPostedByName = null;
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const userObj = JSON.parse(userStr);
                    const actualUser = userObj.data || userObj.user || userObj;
                    currentUserPostedBy = actualUser.id || actualUser.userId || actualUser._id || actualUser.uid;
                    currentUserPostedByName = actualUser.name || actualUser.username || actualUser.email;
                    console.log('JobUploadForm: Resolved current user:', { currentUserPostedBy, currentUserPostedByName });
                }
            } catch (err) {
                console.error('Error retrieving user info:', err);
            }

            // If updating (id exists), we exclude postedBy/postedByName to avoid 403 Forbidden
            // caused by trying to update ownership fields (which might be restricted).
            // For creation, we must include them.
            
            const payload = {
                ...formData,
                experience: formData.experienceRequired,
                logoUrl: formData.companyLogoUrl,
                applicationLink: formData.applicationMethod === 'link' ? formData.applicationLinkOrEmail : null,
                applicationEmail: formData.applicationMethod === 'email' ? formData.applicationLinkOrEmail : null,
            };

            if (id) {
                // Remove ownership fields during update to prevent permission issues
                delete payload.postedBy;
                delete payload.postedByName;
                delete payload.posted_by;
                delete payload.posted_by_name;
                // Also ensure we don't send internal fields that might confuse backend
                delete payload.userId; 
            } else {
                // Only set these for new jobs
                const finalPostedBy = (formData.postedBy) ? formData.postedBy : currentUserPostedBy;
                const finalPostedByName = (formData.postedByName) ? formData.postedByName : currentUserPostedByName;

                // Send both camelCase and snake_case to ensure backend compatibility
                payload.postedBy = finalPostedBy;
                payload.postedByName = finalPostedByName;
                payload.posted_by = finalPostedBy;
                payload.posted_by_name = finalPostedByName;
            }

            console.log('Submitting Job Payload:', payload);

            if (id) {
                await JobService.updateJob(id, payload);
                showToast('success', 'Job updated successfully');
                setTimeout(() => navigate('/admin/job-management'), 1500);
            } else {
                const res = await JobService.createJob(payload);
                try {
                    const created = res?.data || {};
                    const jobId = created.id || created.jobId || created._id || null;
                    const title = `New Job: ${payload.jobTitle}`;
                    const company = payload.companyName ? ` at ${payload.companyName}` : '';
                    const locations = Array.isArray(payload.locations) && payload.locations.length > 0 ? ` • ${payload.locations.join(', ')}` : '';
                    const url = jobId ? `/job?id=${jobId}` : `/jobs`;
                    // Try backend broadcast endpoint
                    {
                        const token = AuthService.getToken();
                        const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
                        if (token) headers['Authorization'] = `Bearer ${token}`;
                        // Fire-and-forget to avoid blocking job creation UX
                        fetch(`${API_BASE_URL}/api/notifications/broadcast-job`, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify({ job: { ...payload, id: jobId } })
                        }).catch(() => {});
                    }
                } catch {}
                showToast('success', 'Job posted successfully');
                setFormData({
                    jobTitle: '',
                    jobCategory: 'IT',
                    jobType: 'private',
                    employmentType: 'fulltime',
                    experienceRequired: 'Fresher',
                    locations: [],
                    educationLevels: [],
                    noticePeriod: '',
                    salaryRange: '',
                    lastDateToApply: '',
                    skills: '',
                    description: '',
                    qualifications: '',
                    walkinDetails: '',
                    useExistingCompany: false,
                    companyName: '',
                    companyWebsite: '',
                    aboutCompany: '',
                    applicationMethod: '',
                    applicationLinkOrEmail: '',
                    listingStatus: 'public',
                    isActive: true,
                    referralCode: '',
                    companyLogoUrl: '',
                    companyId: null,
                    postedBy: null,
                    postedByName: ''
                });
                setStep(1);
                setCompanySearch('');
                setCompanyResults([]);
            }
        } catch (error) {
            console.error('Job save error:', error);
            let msg = id ? 'Failed to update job' : 'Failed to post job';

            if (error.code === 'ERR_NETWORK') {
                msg = 'Network Error: Backend not reachable';
            } else if (error.response) {
                console.error('Job Save Error Response:', error.response.status, error.response.data);
                if (error.response.status === 403 || error.response.status === 401) {
                    const serverMsg = error.response.data?.message || error.response.data?.error;
                    msg = serverMsg ? `Permission Error: ${serverMsg}` : 'Session expired or permission denied. Please logout and login again.';
                } else {
                    msg = `Error ${error.response.status}: ${error.response.data?.message || 'Server rejected request'}`;
                }
            }

            showToast('danger', msg);
        } finally {
            setLoading(false);
        }
    };


    const nextStep = () => {
        if (step === 1 && !validateStep1()) return;
        if (step === 3 && !validateStep3()) return;
        setStep(prev => prev + 1);
    };
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className="container-fluid page-container">
            {toast.visible && (
                <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 1080 }}>
                    <div className={`toast align-items-center text-bg-${toast.type} show`}>
                        <div className="d-flex">
                            <div className="toast-body">{toast.content}</div>
                            <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast(prev => ({ ...prev, visible: false }))}></button>
                        </div>
                    </div>
                </div>
            )}

            <div className="row g-4">

                <div className="col-12">
                    <form onSubmit={handleSubmit}>
                        {step === 1 && (
                            <div className="card shadow-sm">
                                <div className="card-header bg-white">
                                    <h5 className="mb-0 d-flex align-items-center"><BiInfoCircle className="me-2" />Basic Job Information</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Job Title</label>
                                            <input type="text" className="form-control" name="jobTitle" value={formData.jobTitle} onChange={handleChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Job Category</label>
                                            <select className="form-select" name="jobCategory" value={formData.jobCategory} onChange={handleChange} required>
                                                <option value="">Select Category</option>
                                                <option value="IT">IT & Software</option>
                                                <option value="marketing">Marketing</option>
                                                <option value="finance">Finance</option>
                                                <option value="sales">Sales</option>
                                                <option value="hr">Human Resources</option>
                                                <option value="internship">Internship</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Job Type</label>
                                            <select className="form-select" name="jobType" value={formData.jobType} onChange={handleChange}>
                                                <option value="private">Private Jobs</option>
                                                <option value="govt">Govt Jobs</option>
                                                <option value="bank">Bank Jobs</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Employment Type</label>
                                            <select className="form-select" name="employmentType" value={formData.employmentType} onChange={handleChange} required>
                                                <option value="">Select Type</option>
                                                <option value="fulltime">Full Time</option>
                                                <option value="parttime">Part Time</option>
                                                <option value="internship">Internship</option>
                                                <option value="freelance">Freelance</option>
                                                <option value="remote">Remote</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Experience Required</label>
                                            <select className="form-select" name="experienceRequired" value={formData.experienceRequired} onChange={handleChange} required>
                                                <option value="">Select Experience</option>
                                                <option value="Fresher">Fresher</option>
                                                <option value="0-1 Years">0-1 Years</option>
                                                <option value="0-2 Years">0-2 Years</option>
                                                <option value="0-3 Years">0-3 Years</option>
                                                <option value="0-4 Years">0-4 Years</option>
                                                <option value="0-5 Years">0-5 Years</option>
                                                <option value="1-2 Years">1-2 Years</option>
                                                <option value="1-3 Years">1-3 Years</option>
                                                <option value="1-4 Years">1-4 Years</option>
                                                <option value="1-5 Years">1-5 Years</option>
                                                <option value="2-3 Years">2-3 Years</option>
                                                <option value="2-4 Years">2-4 Years</option>
                                                <option value="2-5 Years">2-5 Years</option>
                                                <option value="3-5 Years">3-5 Years</option>
                                                <option value="5-7 Years">5-7 Years</option>
                                                <option value="7-10 Years">7-10 Years</option>
                                                <option value="10+ Years">10+ Years</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Location</label>
                                            <div className="dropdown custom-dropdown-wrapper">
                                                <button className={`form-select text-start ${openDropdown === 'location' ? 'show' : ''}`} type="button" onClick={(e) => toggleDropdown(e, 'location')}>
                                                    {formData.locations.length > 0 ? formData.locations.join(", ") : "Select Location"}
                                                </button>
                                                <ul className={`dropdown-menu w-100 p-2 ${openDropdown === 'location' ? 'show' : ''}`} style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                                    {locationsList.map(loc => (
                                                        <li key={loc} className="mb-1">
                                                            <label className="d-block">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input me-2"
                                                                    value={loc}
                                                                    checked={formData.locations.includes(loc)}
                                                                    onChange={(e) => handleMultiSelectChange(e, 'locations')}
                                                                /> {loc}
                                                            </label>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Education Level</label>
                                            <div className="dropdown custom-dropdown-wrapper">
                                                <button className={`form-select text-start ${openDropdown === 'education' ? 'show' : ''}`} type="button" onClick={(e) => toggleDropdown(e, 'education')}>
                                                    {formData.educationLevels.length > 0 ? formData.educationLevels.join(", ") : "Select Education"}
                                                </button>
                                                <ul className={`dropdown-menu w-100 p-2 ${openDropdown === 'education' ? 'show' : ''}`} style={{ maxHeight: '250px', overflowY: 'auto' }}>
                                                    {educationList.map(edu => (
                                                        <li key={edu} className="mb-1">
                                                            <label className="d-block">
                                                                <input
                                                                    type="checkbox"
                                                                    className="form-check-input me-2"
                                                                    value={edu}
                                                                    checked={formData.educationLevels.includes(edu)}
                                                                    onChange={(e) => handleMultiSelectChange(e, 'educationLevels')}
                                                                /> {edu}
                                                            </label>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Notice Period</label>
                                            <select className="form-select" name="noticePeriod" value={formData.noticePeriod} onChange={handleChange}>
                                                <option value="">Select Notice Period</option>
                                                <option value="immediate">Immediate Joining</option>
                                                <option value="15">15 Days</option>
                                                <option value="30">30 Days</option>
                                                <option value="60">60 Days</option>
                                                <option value="90">90 Days</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Salary Range</label>
                                            <input type="text" className="form-control" name="salaryRange" value={formData.salaryRange} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Last Date to Apply</label>
                                            <input type="date" className="form-control" name="lastDateToApply" value={formData.lastDateToApply} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Required Skills</label>
                                        <input type="text" className="form-control" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g. Java, React, SQL" required />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Job Description</label>
                                        <textarea className="form-control" name="description" rows="6" value={formData.description} onChange={handleChange} required></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Desired Qualifications</label>
                                        <textarea className="form-control" name="qualifications" rows="4" value={formData.qualifications} onChange={handleChange} required></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Walk-in Details (Optional)</label>
                                        <textarea className="form-control" name="walkinDetails" rows="4" value={formData.walkinDetails} onChange={handleChange}></textarea>
                                    </div>

                                    <div className="d-flex justify-content-end">
                                        <button type="button" className="btn btn-primary d-flex align-items-center" onClick={nextStep}>Next <FaArrowRight className="ms-2" /></button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="card shadow-sm">
                                <div className="card-header bg-white">
                                    <h5 className="mb-0 d-flex align-items-center"><BiBuilding className="me-2" />Company Information</h5>
                                </div>
                                <div className="card-body">
                                    <div className="form-check mb-3">
                                        <input className="form-check-input" type="checkbox" id="useExistingCompany" name="useExistingCompany" checked={formData.useExistingCompany} onChange={handleChange} />
                                        <label className="form-check-label" htmlFor="useExistingCompany">Use Existing Company</label>
                                    </div>

                                    <div className="row g-2 align-items-center mb-3">
                                        <div className="col">
                                            <input type="text" className="form-control" placeholder="Search company by name" value={companySearch} onChange={(e) => setCompanySearch(e.target.value)} />
                                        </div>
                                        <div className="col-auto">
                                            <button type="button" className="btn btn-outline-primary btn-sm d-flex align-items-center" onClick={searchCompanies}>
                                                <FaSearch className="me-2" /> Search
                                            </button>
                                        </div>
                                    </div>
                                    {companyResults.length > 0 && (
                                        <div className="list-group mb-3">
                                            {companyResults.map((c, index) => (
                                                <button type="button" key={c.id || index} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center" onClick={() => selectCompany(c)}>
                                                    <span>
                                                        <strong>{c.companyName || c.company_name || c.name}</strong> <span className="text-muted ms-2">{c.companyWebsite || c.company_website || c.website || c.url}</span>
                                                    </span>
                                                    <FaArrowRight />
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Company Name</label>
                                            <input type="text" className="form-control" name="companyName" value={formData.companyName} onChange={handleChange} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Company Website</label>
                                            <input type="url" className="form-control" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">About Company</label>
                                        <textarea className="form-control" name="aboutCompany" rows="3" value={formData.aboutCompany} onChange={handleChange}></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Company Logo</label>
                                        <input type="file" className="form-control" accept="image/*" onChange={handleLogoChange} />
                                        {formData.companyLogoUrl && (
                                            <div className="mt-2">
                                                <p className="small text-muted mb-1">Preview:</p>
                                                <img
                                                    src={formData.companyLogoUrl.startsWith('http') ? formData.companyLogoUrl : `${import.meta.env.VITE_API_BASE_URL || ''}${formData.companyLogoUrl}`}
                                                    alt="Logo Preview"
                                                    className="img-thumbnail"
                                                    style={{ maxHeight: '120px', maxWidth: '200px', objectFit: 'contain' }}
                                                    onError={(e) => {
                                                        console.error("Image load failed:", e.target.src);
                                                        e.target.style.display = 'none';
                                                        e.target.insertAdjacentHTML('afterend', '<span class="text-danger small">Failed to load image preview</span>');
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="d-flex justify-content-between mt-4">
                                        <button type="button" className="btn btn-outline-secondary d-flex align-items-center" onClick={prevStep}><FaArrowLeft className="me-2" /> Previous</button>
                                        <button type="button" className="btn btn-primary d-flex align-items-center" onClick={nextStep}>Next <FaArrowRight className="ms-2" /></button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="card shadow-sm">
                                <div className="card-header bg-white">
                                    <h5 className="mb-0 d-flex align-items-center"><BiEnvelope className="me-2" />Application Method</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">How to Apply</label>
                                            <select className="form-select" name="applicationMethod" value={formData.applicationMethod} onChange={handleChange} required>
                                                <option value="">Select Method</option>
                                                <option value="link">External Link</option>
                                                <option value="email">Email Application</option>
                                                <option value="form">Application Form</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Application Link/Email</label>
                                            <input type="text" className="form-control" name="applicationLinkOrEmail" value={formData.applicationLinkOrEmail} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between mt-4">
                                        <button type="button" className="btn btn-outline-secondary d-flex align-items-center" onClick={prevStep}><FaArrowLeft className="me-2" /> Previous</button>
                                        <button type="button" className="btn btn-primary d-flex align-items-center" onClick={nextStep}>Next <FaArrowRight className="ms-2" /></button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="card shadow-sm">
                                <div className="card-header bg-white">
                                    <h5 className="mb-0 d-flex align-items-center"><FaCog className="me-2" />Admin Settings</h5>
                                </div>
                                <div className="card-body">
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Listing Status</label>
                                            <select className="form-select" name="listingStatus" value={formData.listingStatus} onChange={handleChange} required>
                                                <option value="public">Public</option>
                                                <option value="private">Private</option>
                                                <option value="pending">Pending Review</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Job Status</label>
                                            <select className="form-select" name="isActive" value={formData.isActive.toString()} onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })} required>
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Referral Code (Optional)</label>
                                            <input type="text" className="form-control" name="referralCode" value={formData.referralCode} onChange={handleChange} />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-between mt-4">
                                        <button type="button" className="btn btn-outline-secondary d-flex align-items-center" onClick={prevStep}><FaArrowLeft className="me-2" /> Previous</button>
                                        <button type="submit" className="btn btn-success d-flex align-items-center" disabled={loading}>
                                            {loading ? 'Posting...' : 'Post Job'} <FaCheckCircle className="ms-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

            </div>
        </div>
    );
};

export default JobUploadForm;
