import React, { useEffect, useRef } from 'react';

function GoogleAd({ slot, className, format = 'auto', fullWidthResponsive = 'true', style = { display: 'block' } }) {
  const adRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !adRef.current) return;
    
    // Check if script is already loaded
    const src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6284022198338659';
    const scriptExists = Array.from(document.getElementsByTagName('script')).some(s => s.src === src);
    
    if (!scriptExists) {
      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    const adElement = adRef.current;
    if (!adElement.getAttribute('data-adsbygoogle-status')) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle${className ? ` ${className}` : ''}`}
      style={style}
      data-ad-client="ca-pub-6284022198338659"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={fullWidthResponsive}
    ></ins>
  );
}

export default GoogleAd;
