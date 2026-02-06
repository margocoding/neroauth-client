import { useEffect } from 'react';

export default function MobileOptimizer() {
  useEffect(() => {
    const applyIOSViewportVars = () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (!viewport || !isIOS) return;
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      setVH();
      window.addEventListener('resize', setVH, { passive: true });
      window.addEventListener('orientationchange', setVH, { passive: true });
      return () => {
        window.removeEventListener('resize', setVH);
        window.removeEventListener('orientationchange', setVH);
      };
    };

    const fixAndroidIframes = () => {
      const isAndroid = /Android/.test(navigator.userAgent);
      
      if (isAndroid) {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          iframe.style.transform = 'none';
          iframe.style.backfaceVisibility = 'visible';
        });
      }
    };

    const fixMobileTouch = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        const buttons = document.querySelectorAll('button, a');
        buttons.forEach(button => {
          button.style.touchAction = 'manipulation';
          button.style.webkitTapHighlightColor = 'transparent';
        });
        
        document.documentElement.style.webkitOverflowScrolling = 'touch';
      }
    };

    const optimizeMobilePerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        const animatedElements = document.querySelectorAll('.animate-fadeInUp, .animate-ping');
        animatedElements.forEach(element => {
          element.style.animationDuration = '0.4s';
        });
        
        const transformElements = document.querySelectorAll('.telegram-post-card');
        transformElements.forEach(element => {
          element.style.willChange = 'auto';
          element.style.transform = 'none';
        });
      }
    };

    const cleanups = [];
    const iosCleanup = applyIOSViewportVars();
    if (typeof iosCleanup === 'function') cleanups.push(iosCleanup);
    fixAndroidIframes();
    fixMobileTouch();
    optimizeMobilePerformance();

    return () => {
      cleanups.forEach((fn) => {
        try { fn(); } catch {}
      });
    };
  }, []);

  return null;
}
