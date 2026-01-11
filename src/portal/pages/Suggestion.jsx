import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BiSend, BiLogoWhatsapp, BiHelpCircle, BiSearchAlt } from 'react-icons/bi';
import SEO from '../components/SEO';
import '../assets/css/Suggestion.css';

// Import WhatsApp QR if available, otherwise use placeholder or text
// import qrCode from '../assets/images/whatsapp-qr.png'; 

const Suggestion = () => {
  const [formData, setFormData] = useState({
    jobType: '',
    helpRequired: '',
    suggestion: '',
    email: '',
    whatsapp: '',
    agreed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobTypes = [
    "Fresher / Entry Level",
    "Java Developer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Analyst",
    "QA / Testing",
    "DevOps Engineer",
    "Business Analyst",
    "Other"
  ];

  const helpOptions = [
    "Resume Review",
    "Mock Interview",
    "Career Guidance",
    "Job Referral",
    "Technical Doubts",
    "Course / Certification Advice",
    "Other"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Custom Validation
    if (!formData.jobType) {
      toast.error('Please select a job type.');
      return;
    }
    if (!formData.helpRequired) {
      toast.error('Please select the type of help required.');
      return;
    }
    if (!formData.suggestion.trim()) {
      toast.error('Please provide your suggestion or feedback.');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please provide your email address.');
      return;
    }
    if (!formData.whatsapp.trim()) {
      toast.error('Please provide your WhatsApp number.');
      return;
    }
    if (!formData.agreed) {
      toast.error('Please agree to receive updates to proceed.');
      return;
    }

    setIsSubmitting(true);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://bcvworldwebsitebackend-production.up.railway.app';

    const submitPromise = axios.post(`${API_BASE_URL}/api/suggestion`, formData)
      .then(response => {
        if (!response.data.success) {
          throw new Error('Something went wrong. Please try again.');
        }
        return response;
      });

    await toast.promise(submitPromise, {
      loading: 'Submitting your suggestion...',
      success: () => {
        setFormData({
          jobType: '',
          helpRequired: '',
          suggestion: '',
          email: '',
          whatsapp: '',
          agreed: false
        });
        return 'Thank you! Your suggestion has been received.';
      },
      error: (err) => {
        console.error('Submission error:', err);
        return 'Failed to submit. Please check your connection.';
      }
    });

    setIsSubmitting(false);
  };

  return (
    <div className="suggestion-page">
      <SEO title="Suggestions" description="Help us improve BCVWORLD. Share your feedback, request job roles, or ask for career guidance." />
      <div className="suggestion-container">
        
        <div className="suggestion-header">
          <h1 className="suggestion-title">Shape the Future of BCVWorld</h1>
          <p className="suggestion-subtitle">
            Your voice matters! Use this form to request specific job roles, suggest new features, 
            or ask for personalized career guidance. We review every suggestion to make our platform better for you.
          </p>
        </div>

        <div className="suggestion-content">
          
          {/* Left Side: Form */}
          <div className="suggestion-form-wrapper">
            <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label className="form-label">
                  What kind of jobs are you looking for?
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="" disabled>Select Job Type</option>
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  What help is required?
                </label>
                <select
                  name="helpRequired"
                  value={formData.helpRequired}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="" disabled>Select Help Required</option>
                  {helpOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Your Suggestions / Feedback / Query
                </label>
                <textarea
                  name="suggestion"
                  value={formData.suggestion}
                  onChange={handleChange}
                  placeholder="Tell us how we can serve you better..."
                  className="form-textarea"
                ></textarea>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="form-input"
                />
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  name="agreed"
                  id="agreed"
                  checked={formData.agreed}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <label htmlFor="agreed" className="checkbox-label">
                  I agree to receive daily job alerts and referral opportunities via email/WhatsApp.
                </label>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Submitting...'
                ) : (
                  <>
                    Submit Feedback <BiSend />
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Right Side: WhatsApp & Info */}
          <div className="info-sidebar">
            
            <div className="whatsapp-card">
              <BiLogoWhatsapp className="wa-icon-large" />
              <h2 className="wa-title">Connect on WhatsApp</h2>
              <p className="wa-desc">
                Scan the QR code or click the button below to reach us directly for guidance and referrals.
              </p>
              
              {/* QR Code Placeholder */}
              <div className="qr-placeholder">
                 <img 
                   src="/assets/images/whatsapp-qr.png" 
                   alt="WhatsApp QR Code" 
                   className="qr-img"
                   onError={(e) => {
                     e.target.style.display = 'none'; // Hide if fails, don't use external API
                   }}
                 />
              </div>

              <div>
                <a 
                  href="https://wa.me/917013765836" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="wa-btn"
                >
                  <BiLogoWhatsapp size={24} /> Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="info-card">
              <h3><BiHelpCircle className="text-blue-600" /> How We Use Your Feedback?</h3>
              <p>
                Every suggestion is reviewed by our core team within 24 hours. We use your inputs to:
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px', color: '#64748b' }}>
                <li>Add new job categories that match your skills.</li>
                <li>Develop study materials for requested topics.</li>
                <li>Improve website features and user experience.</li>
                <li>Organize community events and webinars.</li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Suggestion;
