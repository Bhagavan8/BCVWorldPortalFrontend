import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';
import '../assets/css/LegalPages.css';

const AdsDisclosure = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="legal-page-container">
      <SEO 
        title="Ads Disclosure - BCV World" 
        description="Transparency about advertising, affiliate links, and how we support BCV World."
      />
      
      <div className="legal-content-wrapper">
        <div className="legal-header">
          <h1 className="legal-title">Ads Disclosure</h1>
          <p className="legal-subtitle">Transparency in our operations and funding</p>
          <span className="last-updated">Last Updated: {new Date().getFullYear()}</span>
        </div>

        <div className="legal-body">
          <section className="legal-section">
            <h2><i className="bi bi-eye-fill"></i> Transparency Commitment</h2>
            <p>
              At <strong>BCV World</strong>, we believe in full transparency with our community. 
              To maintain this website as a free resource for everyone (100% free access to jobs, tools, and learning materials), 
              we may utilize various monetization methods including advertisements and affiliate partnerships.
            </p>
          </section>

          <section className="legal-section">
            <h2><i className="bi bi-window-sidebar"></i> Display Advertising</h2>
            <p>
              We may use third-party advertising companies to serve ads when you visit our website. 
              These companies may use information (not including your name, address, email address, or telephone number) 
              about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
            </p>
            <ul>
              <li><strong>Google AdSense:</strong> We may use Google AdSense to display ads. Google uses cookies to serve ads based on a user's prior visits to our website or other websites.</li>
              <li><strong>User Experience:</strong> We strive to ensure that ads do not intrude on your browsing experience. If you find any ad offensive or intrusive, please report it to us.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><i className="bi bi-cart-check-fill"></i> Affiliate Disclosure</h2>
            <p>
              Some of the links on BCV World may be "affiliate links." This means if you click on the link and purchase an item or sign up for a service, 
              we may receive an affiliate commission.
            </p>
            <div className="legal-alert">
              <h4><i className="bi bi-star-fill"></i> Our Promise</h4>
              <p>
                This comes at <strong>no extra cost to you</strong>. We only recommend products or services that we believe will add value to our users. 
                Our editorial content is not influenced by affiliate partnerships.
              </p>
            </div>
            <p>
              Examples of affiliate partnerships may include:
            </p>
            <ul>
              <li>Links to recommended books or courses.</li>
              <li>Referrals to hosting providers or software tools.</li>
              <li>Financial product applications (credit cards, demat accounts) where applicable.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2><i className="bi bi-cookie"></i> Cookies and Tracking</h2>
            <p>
              Our advertising partners may use cookies and web beacons on our site. 
              You can choose to disable cookies through your individual browser options. 
              However, this may affect your ability to interact with our site or other websites.
            </p>
          </section>

          <section className="legal-section">
            <h2><i className="bi bi-heart-fill"></i> Supporting BCV World</h2>
            <p>
              By using our links and allowing ads, you support the maintenance and development of BCV World. 
              This allows us to keep our core services—like job postings and educational content—completely free for everyone.
            </p>
            <p>
              Thank you for your support!
            </p>
          </section>

          <div className="contact-box">
            <h3>Concerns about Ads?</h3>
            <p>If you see an inappropriate ad or have questions about our policies, please let us know.</p>
            <Link to="/contact" className="btn-contact">Report an Issue</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsDisclosure;
