import React, { useEffect, useRef, useState } from 'react';

function GoogleAd({ slot, className, format = 'auto', fullWidthResponsive = 'true', style = { display: 'block' }, minHeight = '280px' }) {
  const adRef = useRef(null);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !adRef.current) return;
    
    // Function to inject script and push ad
    const loadAd = () => {
        if (adLoaded) return;
        
        // Ensure the element is visible (has width) before pushing
        // Note: offsetHeight check removed as empty ins tags start with 0 height
        if (!adRef.current || adRef.current.offsetWidth === 0) {
            // Check again in a moment if it might be a layout timing issue
            setTimeout(() => {
                 if (adRef.current && adRef.current.offsetWidth > 0) {
                     loadAd();
                 }
            }, 500);
            return;
        }

        const src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6284022198338659';
        const scriptExists = Array.from(document.getElementsByTagName('script')).some(s => s.src.includes('client=ca-pub-6284022198338659'));
        
        if (!scriptExists) {
            const script = document.createElement('script');
            script.async = true;
            script.src = src;
            script.crossOrigin = 'anonymous';
            script.onerror = (e) => console.error('AdSense script failed to load', e);
            document.head.appendChild(script);
        }

        const adElement = adRef.current;
        if (adElement && !adElement.getAttribute('data-adsbygoogle-status')) {
            // Use requestAnimationFrame to avoid forced reflow during the push
            requestAnimationFrame(() => {
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                    setAdLoaded(true);
                } catch (e) {
                    console.error('AdSense error:', e);
                }
            });
        }
    };

    // Use IntersectionObserver to load ads only when near viewport
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add small delay to ensure it's not just scrolling past quickly
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => loadAd());
          } else {
            setTimeout(loadAd, 200);
          }
          observer.disconnect();
        }
      });
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(observerCallback, {
        rootMargin: '200px', // Load when ad is 200px away from viewport
        threshold: 0.1
      });
      if (adRef.current) {
        observer.observe(adRef.current);
      }
      return () => observer.disconnect();
    } else {
      // Fallback for older browsers
      setTimeout(loadAd, 2500);
    }
  }, [adLoaded]);

  return (
    <div style={{ minHeight, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f8fafc' }}>
      <ins
        ref={adRef}
        className={`adsbygoogle${className ? ` ${className}` : ''}`}
        style={{ ...style, display: 'block', width: '100%' }}
        data-ad-client="ca-pub-6284022198338659"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive}
      ></ins>
    </div>
  );
}

export default GoogleAd;
