import React, { useEffect, useRef, useState } from 'react';

function GoogleAd({ slot, className, format = 'auto', layout = null, fullWidthResponsive = 'true', style = { display: 'block' }, minHeight = '280px', loadDelay = 500, rootMargin = '600px', immediate = true, containerMaxWidth = null, showPlaceholderOnNoFill = true, adTest = undefined, collapseIfNoFill = false, fallbackSlot = null }) {
  const adRef = useRef(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [noFill, setNoFill] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !adRef.current) return;
    
    // Function to inject script and push ad
    const loadAd = () => {
        if (adLoaded) return;
        
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

    // No-fill detector: if status not present after a grace period, show placeholder
    const checkTimer = setTimeout(() => {
      const el = adRef.current;
      if (el && !el.getAttribute('data-adsbygoogle-status')) {
        if (fallbackSlot && !triedFallback) {
          el.setAttribute('data-ad-slot', fallbackSlot);
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (_) {}
          setTriedFallback(true);
        } else {
          setNoFill(true);
        }
      }
    }, 4000);

    if (immediate) {
        // Load immediately, bypassing IntersectionObserver and requestIdleCallback
        loadAd();
        return () => clearTimeout(checkTimer);
    }

    // Use IntersectionObserver to load ads only when near viewport
    const observerCallback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              setTimeout(() => loadAd(), loadDelay);
            });
          } else {
            setTimeout(loadAd, loadDelay);
          }
          observer.disconnect();
        }
      });
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(observerCallback, {
        rootMargin: rootMargin,
        threshold: 0.1
      });
      if (adRef.current) {
        observer.observe(adRef.current);
      }
      return () => {
        observer.disconnect();
        clearTimeout(checkTimer);
      };
    } else {
      // Fallback for older browsers
      setTimeout(loadAd, 2500);
      return () => clearTimeout(checkTimer);
    }
  }, [adLoaded, loadDelay, rootMargin, immediate, fallbackSlot, triedFallback]);

  const containerStyle = (() => {
    if (collapseIfNoFill && noFill) {
      return { minHeight: 0, width: '100%', display: 'none' };
    }
    return {
      minHeight,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    };
  })();

  const innerStyle = {
    width: '100%',
    maxWidth: containerMaxWidth || (layout === 'in-article' ? '700px' : undefined),
    margin: '0 auto'
  };

  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const finalAdTest = adTest !== undefined ? adTest : (isLocal ? 'on' : undefined);

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        <ins
          ref={adRef}
          className={`adsbygoogle${className ? ` ${className}` : ''}`}
          style={{ ...style, display: 'block', width: '100%', textAlign: layout ? 'center' : (style.textAlign || 'inherit') }}
          data-ad-client="ca-pub-6284022198338659"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={fullWidthResponsive}
          {...(layout ? { 'data-ad-layout': layout } : {})}
          {...(finalAdTest ? { 'data-adtest': finalAdTest } : {})}
        ></ins>
        {showPlaceholderOnNoFill && !collapseIfNoFill && noFill && (
          <div style={{ position: 'relative', marginTop: '-100%', height: 0 }}>
            <div style={{ minHeight, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px' }}>
              Advertisement
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoogleAd;
