import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { BiSend, BiLogoWhatsapp, BiHelpCircle, BiSearchAlt } from 'react-icons/bi';
import '../assets/css/Suggestion.css';

// Import WhatsApp QR if available, otherwise use placeholder or text
// import qrCode from '../assets/images/whatsapp-qr.png'; 

const Suggestion = () => {
  const [formData, setFormData] = useState({
    jobType: '',
    helpRequired: '',
    suggestion: '',
    agreed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreed) {
      toast.error('Please agree to receive updates to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      // POST to our backend API
      const response = await axios.post('/api/suggestion', formData);
      
      if (response.data.success) {
        toast.success('Thank you! Your suggestion has been received.');
        setFormData({
          jobType: '',
          helpRequired: '',
          suggestion: '',
          agreed: false
        });
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="suggestion-page">
      <div className="suggestion-container">
        
        <div className="suggestion-header">
          <h1 className="suggestion-title">Help Us Improve</h1>
          <p className="suggestion-subtitle">Your feedback shapes the future of BCVWorld.</p>
        </div>

        <div className="suggestion-content">
          
          {/* Left Side: Form */}
          <div className="suggestion-form-wrapper">
            <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label className="form-label">
                  What kind of jobs are you looking for?
                </label>
                <input
                  type="text"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  placeholder="e.g. Java Developer, Data Analyst, Fresher..."
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  What help is required?
                </label>
                <input
                  type="text"
                  name="helpRequired"
                  value={formData.helpRequired}
                  onChange={handleChange}
                  placeholder="e.g. Resume review, Mock interview..."
                  className="form-input"
                  required
                />
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
                  required
                ></textarea>
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
              
              {/* QR Code Placeholder - Replace with actual image path if available */}
              <div className="qr-placeholder">
                 <img 
                   src="/assets/images/whatsapp-qr.png" 
                   alt="WhatsApp QR Code" 
                   className="qr-img"
                   onError={(e) => {
                     e.target.onerror = null; 
                     e.target.src = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://wa.me/919876543210';
                   }}
                 />
              </div>

              <div>
                <a 
                  href="https://wa.me/919876543210" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="wa-btn"
                >
                  <BiLogoWhatsapp size={24} /> Chat on WhatsApp
                </a>
              </div>
            </div>

            <div className="info-card">
              <h3><BiHelpCircle className="text-blue-600" /> Why Feedback Matters?</h3>
              <p>
                We read every suggestion personally. Your input helps us prioritize new features, 
                add relevant job categories, and improve our study resources.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Suggestion;
