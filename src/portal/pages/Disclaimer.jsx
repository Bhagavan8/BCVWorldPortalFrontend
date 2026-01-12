import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import '../assets/css/LegalPages.css';

const Disclaimer = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page-container">
      <SEO 
        title="Disclaimer - BCV World" 
        description="Read our disclaimer regarding job postings, financial information, and content accuracy on BCV World."
      />
      
      <div className="legal-content-wrapper">
        <div className="legal-header">
          <h1 className="legal-title">Disclaimer</h1>
          <p className="legal-subtitle">Important information about our services and content</p>
          <span className="last-updated">Last Updated: {new Date().getFullYear()}</span>
        </div>

        <div className="legal-body">
          <section className="legal-section">
            <h2><i className="bi bi-info-circle-fill"></i> General Information</h2>
            <p>
              The information provided by <strong>BCV World</strong> ("we," "us," or "our") on this website is for general informational purposes only. 
              All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, 
              regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
            </p>
          </section>

          <section className="legal-section">
            <h2><i className="bi bi-briefcase-fill"></i> Job Listings Disclaimer</h2>
            <p>
              BCV World acts as a platform to aggregate job openings from various sources including company websites, job boards, and user submissions. 
              While we strive to verify the authenticity of job postings, we cannot guarantee the validity of every job listing.
            </p>
            <div className="legal-alert">
              <h4><i className="bi bi-exclamation-triangle-fill"></i> Important Warning</h4>
              <p>
                <strong>BCV World never asks for money</strong> for job applications or interviews. If anyone asks you for payment in the name of BCV World or for any job listed here, please do not pay and report it immediately. Beware of fraudulent recruitment practices.
              </p>
            </div>
            <ul>
              <li>We are not a recruitment agency and do not conduct interviews on behalf of companies unless explicitly stated.</li>
              <li>Candidates are advised to verify the details of the company and job role before applying or attending interviews.</li>
              <li>We are not responsible for any fraudulent communications or financial losses incurred by users.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><i className="bi bi-graph-up-arrow"></i> Financial & Educational Content</h2>
            <p>
              The financial calculators, investment insights, and educational materials provided on BCV World are for educational purposes only. 
              They should not be considered as professional financial advice.
            </p>
            <ul>
              <li>Calculations provided by our tools (SIP, EMI, etc.) are estimates and may differ from actual bank figures.</li>
              <li>We recommend consulting with a qualified financial advisor before making any investment decisions.</li>
              <li>We are not liable for any financial losses arising from the use of our tools or information.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><i className="bi bi-link-45deg"></i> External Links</h2>
            <p>
              Our website may contain links to third-party websites or content. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
            </p>
            <p>
              We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.
            </p>
          </section>

          <section className="legal-section">
            <h2><i className="bi bi-shield-check"></i> No Professional Relationship</h2>
            <p>
              Your use of this website does not create a professional-client relationship between you and BCV World. 
              Any reliance you place on such information is therefore strictly at your own risk.
            </p>
          </section>

          <div className="contact-box">
            <h3>Have Questions?</h3>
            <p>If you require any more information or have any questions about our site's disclaimer, please feel free to contact us.</p>
            <Link to="/contact" className="btn-contact">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disclaimer;
