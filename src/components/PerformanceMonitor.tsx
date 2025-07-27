'use client';

import { useEffect } from 'react';

interface PerformanceMetrics {
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
  fcp?: number;
}

export default function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    // Track Core Web Vitals
    const trackWebVitals = () => {
      if ('web-vitals' in window) {
        // @ts-ignore
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
          getCLS((metric: any) => {
            console.log('CLS:', metric.value);
            // Send to analytics
            sendMetric('CLS', metric.value);
          });

          getFID((metric: any) => {
            console.log('FID:', metric.value);
            sendMetric('FID', metric.value);
          });

          getFCP((metric: any) => {
            console.log('FCP:', metric.value);
            sendMetric('FCP', metric.value);
          });

          getLCP((metric: any) => {
            console.log('LCP:', metric.value);
            sendMetric('LCP', metric.value);
          });

          getTTFB((metric: any) => {
            console.log('TTFB:', metric.value);
            sendMetric('TTFB', metric.value);
          });
        });
      }
    };

    // Track page load performance
    const trackPageLoad = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const metrics = {
            ttfb: navigation.responseStart - navigation.requestStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
          };

          console.log('Page Load Metrics:', metrics);
          sendMetrics('page_load', metrics);
        }
      }
    };

    // Track user interactions
    const trackUserInteractions = () => {
      let interactionCount = 0;
      let lastInteraction = Date.now();

      const trackInteraction = () => {
        interactionCount++;
        lastInteraction = Date.now();

        // Send interaction data every 10 interactions
        if (interactionCount % 10 === 0) {
          sendMetrics('user_interactions', {
            count: interactionCount,
            lastInteraction,
            sessionDuration: Date.now() - performance.timing.navigationStart
          });
        }
      };

      // Track clicks, scrolls, and form interactions
      document.addEventListener('click', trackInteraction);
      document.addEventListener('scroll', trackInteraction);
      document.addEventListener('submit', trackInteraction);

      return () => {
        document.removeEventListener('click', trackInteraction);
        document.removeEventListener('scroll', trackInteraction);
        document.removeEventListener('submit', trackInteraction);
      };
    };

    // Track resource loading
    const trackResourceLoading = () => {
      if ('performance' in window) {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'resource') {
              const resourceEntry = entry as PerformanceResourceTiming;
              if (resourceEntry.duration > 3000) { // Track slow resources
                console.log('Slow Resource:', {
                  name: resourceEntry.name,
                  duration: resourceEntry.duration,
                  size: resourceEntry.transferSize
                });
                sendMetrics('slow_resource', {
                  name: resourceEntry.name,
                  duration: resourceEntry.duration,
                  size: resourceEntry.transferSize
                });
              }
            }
          });
        });

        observer.observe({ entryTypes: ['resource'] });

        return () => observer.disconnect();
      }
    };

    // Track errors
    const trackErrors = () => {
      const handleError = (event: ErrorEvent) => {
        console.error('JavaScript Error:', event.error);
        sendMetrics('error', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        });
      };

      const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
        console.error('Unhandled Promise Rejection:', event.reason);
        sendMetrics('error', {
          type: 'unhandled_rejection',
          reason: event.reason
        });
      };

      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleUnhandledRejection);

      return () => {
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      };
    };

    // Send metrics to analytics (mock implementation)
    const sendMetric = (name: string, value: number) => {
      // In a real implementation, this would send to your analytics service
      console.log(`Metric: ${name} = ${value}`);

      // Example: Send to Vercel Analytics
      if (typeof window !== 'undefined' && 'va' in window) {
        // @ts-ignore
        window.va?.track('web_vital', { name, value });
      }
    };

    const sendMetrics = (type: string, data: any) => {
      // In a real implementation, this would send to your analytics service
      console.log(`Metrics: ${type}`, data);

      // Example: Send to Vercel Analytics
      if (typeof window !== 'undefined' && 'va' in window) {
        // @ts-ignore
        window.va?.track('performance_metrics', { type, data });
      }
    };

    // Initialize tracking
    trackWebVitals();
    trackPageLoad();
    const cleanupInteractions = trackUserInteractions();
    const cleanupResources = trackResourceLoading();
    const cleanupErrors = trackErrors();

    // Cleanup on unmount
    return () => {
      cleanupInteractions();
      cleanupResources();
      cleanupErrors();
    };
  }, []);

  // This component doesn't render anything
  return null;
} 