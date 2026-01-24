import React from 'react';
import '../assets/css/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container mx-auto px-4">
        <div className="footer-top flex flex-col items-center justify-center mb-4">
          <div className="flex items-center mb-3">
            <img
              src="/assets/images/icon-192x192.webp"
              alt="BCVWORLD"
              className="rounded-full mr-3"
              style={{ height: '60px', width: '60px', objectFit: 'cover' }}
              width="60"
              height="60"
              srcSet="/assets/images/favicon-96x96.webp 96w, /assets/images/icon-192x192.webp 192w"
              sizes="60px"
              loading="lazy"
              decoding="async"
            />
            <span className="font-bold text-2xl text-white">
              BCV<span style={{ color: '#4fc3f7' }}>WORLD</span>
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-legal-links">
             <span>&copy; {currentYear} BCVWorld. All Rights Reserved.</span>
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
