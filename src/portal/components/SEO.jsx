import React, { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, url }) => {
  useEffect(() => {
    const defaultTitle = 'BCVWORLD - The Future Starts Here';
    const finalTitle = title ? `${title} | BCVWORLD` : defaultTitle;
    const finalDesc = description || 'BCVWORLD - Your complete career growth partner offering job referrals, 1:1 mentoring, resume building, and financial planning.';
    const finalUrl = url || window.location.href;
    const finalImage = image || window.location.origin + '/logo192.png';
    const finalKeywords = keywords || 'jobs, career, recruitment, mentoring, resume building, financial planning, bcvworld, referrals';

    // 1. Standard Meta Tags
    document.title = finalTitle;

    // Helper to update or create meta tag
    const setMeta = (name, content, attribute = 'name') => {
        let element = document.querySelector(`meta[${attribute}="${name}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attribute, name);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    setMeta('description', finalDesc);
    setMeta('keywords', finalKeywords);

    // 2. Open Graph / Facebook / LinkedIn
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', finalUrl, 'property');
    setMeta('og:title', finalTitle, 'property');
    setMeta('og:description', finalDesc, 'property');
    setMeta('og:image', finalImage, 'property');
    setMeta('og:site_name', 'BCVWORLD', 'property');

    // 3. Twitter
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:url', finalUrl);
    setMeta('twitter:title', finalTitle);
    setMeta('twitter:description', finalDesc);
    setMeta('twitter:image', finalImage);
    
    // 4. Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', finalUrl);

  }, [title, description, keywords, image, url]);

  return null;
};

export default SEO;
