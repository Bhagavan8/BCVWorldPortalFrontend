import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-bottom">
          <div className="footer-legal-links">
             <span>&copy; {currentYear} BCV World. All Rights Reserved.</span>
             <span className="separator">|</span>
             <a href="/disclaimer">Disclaimer</a>
             <span className="separator">|</span>
             <a href="/ads-disclosure">Ads Disclosure</a>
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
