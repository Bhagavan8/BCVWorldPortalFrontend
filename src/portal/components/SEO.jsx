import React, { useEffect } from 'react';

const SEO = ({ title, description, keywords, image, url, noindex, type = 'website', structuredData, publishedTime, section, tags }) => {
  useEffect(() => {
    const defaultTitle = 'BCVWORLD - The Future Starts Here';
    const finalTitle = title ? `${title} | BCVWORLD` : defaultTitle;
    const finalDesc = description || 'BCVWORLD - Your complete career growth partner offering job referrals, 1:1 mentoring, resume building, and financial planning.';
    const finalUrl = url || window.location.href;
    const finalImage = image || window.location.origin + '/logo192.png';
    const finalKeywords = keywords || 'jobs, career, recruitment, mentoring, resume building, financial planning, bcvworld, referrals';
    const finalType = type || 'website';

    document.title = finalTitle;

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
    
    if (noindex) {
        setMeta('robots', 'noindex, nofollow');
    } else {
        setMeta('robots', 'index, follow');
    }

    setMeta('og:type', finalType, 'property');
    setMeta('og:url', finalUrl, 'property');
    setMeta('og:title', finalTitle, 'property');
    setMeta('og:description', finalDesc, 'property');
    setMeta('og:image', finalImage, 'property');
    setMeta('og:site_name', 'BCVWORLD', 'property');
    if (finalType === 'article') {
      if (publishedTime) setMeta('article:published_time', publishedTime, 'property');
      if (section) setMeta('article:section', section, 'property');
      if (Array.isArray(tags)) {
        tags.forEach(t => setMeta('article:tag', t, 'property'));
      }
    }

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:url', finalUrl);
    setMeta('twitter:title', finalTitle);
    setMeta('twitter:description', finalDesc);
    setMeta('twitter:image', finalImage);
    
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', finalUrl);

    const scriptId = 'structured-data';
    let scriptTag = document.getElementById(scriptId);
    const data = structuredData || (finalType === 'article' ? {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: title || 'BCVWORLD',
      description: finalDesc,
      image: [finalImage],
      datePublished: publishedTime || new Date().toISOString(),
      dateModified: publishedTime || new Date().toISOString(),
      author: { '@type': 'Organization', name: 'BCVWORLD' },
      publisher: {
        '@type': 'Organization',
        name: 'BCVWORLD',
        logo: { '@type': 'ImageObject', url: window.location.origin + '/logo192.png' }
      },
      mainEntityOfPage: finalUrl
    } : null);
    if (data) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.type = 'application/ld+json';
        scriptTag.id = scriptId;
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(data);
    } else if (scriptTag) {
      scriptTag.remove();
    }

  }, [title, description, keywords, image, url, type, structuredData, publishedTime, section, tags]);

  return null;
};

export default SEO;
