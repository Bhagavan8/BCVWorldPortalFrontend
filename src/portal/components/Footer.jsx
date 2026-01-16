import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo/logo.svg';
import '../assets/css/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top d-flex flex-column align-items-center justify-content-center mb-4">
           <div className="d-flex align-items-center mb-3">
             <img src={logo} alt="BCVWorld logo" className="rounded-circle me-3" style={{ height: '60px', width: '60px' }} width="60" height="60" decoding="async" loading="lazy" />
             <span className="fw-bold fs-3 text-white">BCV<span style={{ color: '#4fc3f7' }}>WORLD</span></span>
           </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-legal-links">
             <span>&copy; {currentYear} BCV World. All Rights Reserved.</span>
             <span className="separator">|</span>
             <Link to="/disclaimer">Disclaimer</Link>
             <span className="separator">|</span>
             <Link to="/ads-disclosure">Ads Disclosure</Link>
          </div>
          <div className="footer-disclaimer-text">
            <p><strong>Disclaimer:</strong> This website provides job updates, finance, and news content for informational purposes only. We do not guarantee job placements or financial outcomes. Content should not be considered financial, legal, or professional advice. We do not charge any fees—any payment requests claiming association with us are fraudulent.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
