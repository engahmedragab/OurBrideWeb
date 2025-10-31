// React Hook for Analytics
// Provides easy access to analytics functions in React components

import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getAnalytics } from '../utils/AnalyticsManager';
import { ANALYTICS_CONFIG } from '../config/analytics';
import { transformProductForAnalytics } from '../utils/contentIdUtils';

export const useAnalytics = () => {
    const location = useLocation();
    const analytics = getAnalytics();
    const scrollTracked = useRef(new Set());
    const timeOnPageStart = useRef(Date.now());

    // Track page views on route changes
    useEffect(() => {
        if (analytics) {
            analytics.trackPageView(location.pathname, document.title);
        }
    }, [location.pathname, analytics]);

    // Track scroll depth
    useEffect(() => {
        if (!analytics || !ANALYTICS_CONFIG.EVENTS.TRACK_SCROLL) return;

        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

            // Track scroll milestones
            ANALYTICS_CONFIG.EVENTS.SCROLL_THRESHOLDS.forEach(threshold => {
                if (scrollPercentage >= threshold && !scrollTracked.current.has(threshold)) {
                    analytics.trackScrollDepth(threshold);
                    scrollTracked.current.add(threshold);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [analytics]);

    // Track time on page
    useEffect(() => {
        if (!analytics || !ANALYTICS_CONFIG.EVENTS.TRACK_TIME_ON_PAGE) return;

        const startTime = Date.now();

        return () => {
            const timeOnPage = Math.round((Date.now() - startTime) / 1000);
            if (timeOnPage > 5) { // Only track if user spent more than 5 seconds
                analytics.trackCustomEvent('time_on_page', {
                    time_seconds: timeOnPage,
                    page_path: location.pathname
                });
            }
        };
    }, [location.pathname, analytics]);

    // Track outbound links
    useEffect(() => {
        if (!analytics || !ANALYTICS_CONFIG.EVENTS.TRACK_OUTBOUND_LINKS) return;

        const handleClick = (event) => {
            const link = event.target.closest('a');
            if (link && link.href) {
                const url = new URL(link.href);
                const currentDomain = window.location.hostname;

                if (url.hostname !== currentDomain) {
                    analytics.trackCustomEvent('outbound_link_click', {
                        link_url: link.href,
                        link_text: link.textContent?.trim() || 'Unknown',
                        page_path: location.pathname
                    });
                }
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [analytics, location.pathname]);

    // Track file downloads
    useEffect(() => {
        if (!analytics || !ANALYTICS_CONFIG.EVENTS.TRACK_DOWNLOADS) return;

        const handleClick = (event) => {
            const link = event.target.closest('a');
            if (link && link.href) {
                const url = new URL(link.href);
                const extension = url.pathname.split('.').pop()?.toLowerCase();

                if (extension && ANALYTICS_CONFIG.EVENTS.DOWNLOAD_EXTENSIONS.includes(extension)) {
                    analytics.trackCustomEvent('file_download', {
                        file_url: link.href,
                        file_extension: extension,
                        file_name: url.pathname.split('/').pop() || 'Unknown',
                        page_path: location.pathname
                    });
                }
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [analytics, location.pathname]);

    // Core Analytics functions - only keeping used ones
    const trackCustomEvent = useCallback((eventName, parameters) => {
        if (analytics) {
            analytics.trackCustomEvent(eventName, parameters);
        }
    }, [analytics]);

    const identifyUser = useCallback(async (email, phoneNumber, externalId) => {
        if (analytics) {
            await analytics.identifyUser(email, phoneNumber, externalId);
        }
    }, [analytics]);

    // Form tracking helper
    const trackFormSubmission = useCallback((formName, formData = {}) => {
        if (analytics) {
            analytics.trackCustomEvent('form_submission', {
                form_name: formName,
                page_path: location.pathname,
                ...formData
            });
        }
    }, [analytics, location.pathname]);


    // Button click tracking helper
    const trackButtonClick = useCallback((buttonName, buttonLocation, additionalData = {}) => {
        if (analytics) {
            analytics.trackCustomEvent('button_click', {
                button_name: buttonName,
                button_location: buttonLocation,
                page_path: location.pathname,
                ...additionalData
            });
        }
    }, [analytics, location.pathname]);

    // Product interaction tracking
    const trackProductInteraction = useCallback((interactionType, product, additionalData = {}) => {
        if (analytics) {
            const analyticsProduct = transformProductForAnalytics(product);
            analytics.trackCustomEvent('product_interaction', {
                interaction_type: interactionType,
                product_id: analyticsProduct?.item_id,
                product_name: analyticsProduct?.item_name,
                product_category: analyticsProduct?.item_category,
                page_path: location.pathname,
                ...additionalData
            });
        }
    }, [analytics, location.pathname]);


    return {
        // Core tracking functions (only keeping used ones)
        trackCustomEvent,
        identifyUser,

        // Helper functions
        trackFormSubmission,
        trackButtonClick,
        trackProductInteraction,

        // Analytics instance
        analytics,

        // Status
        isInitialized: !!analytics?.isInitialized,
        config: ANALYTICS_CONFIG
    };
};

// Hook for tracking specific product interactions (updated to use trackProductInteraction)
export const useProductAnalytics = (product) => {
    const { trackProductInteraction } = useAnalytics();

    const trackView = useCallback(() => {
        if (product) {
            trackProductInteraction('view', product);
        }
    }, [product, trackProductInteraction]);

    const trackAddToCartProduct = useCallback(() => {
        if (product) {
            trackProductInteraction('add_to_cart', product);
        }
    }, [product, trackProductInteraction]);

    const trackWishlist = useCallback(() => {
        if (product) {
            trackProductInteraction('add_to_wishlist', product);
        }
    }, [product, trackProductInteraction]);

    const trackReview = useCallback((rating) => {
        if (product) {
            trackProductInteraction('review', product, { rating });
        }
    }, [product, trackProductInteraction]);

    const trackInteraction = useCallback((interactionType, additionalData = {}) => {
        if (product) {
            trackProductInteraction(interactionType, product, additionalData);
        }
    }, [product, trackProductInteraction]);

    return {
        trackView,
        trackAddToCart: trackAddToCartProduct,
        trackWishlist,
        trackReview,
        trackInteraction
    };
};

// Hook for tracking form analytics
export const useFormAnalytics = (formName) => {
    const { trackFormSubmission, trackCustomEvent } = useAnalytics();

    const trackFormStart = useCallback(() => {
        trackCustomEvent('form_start', {
            form_name: formName
        });
    }, [formName, trackCustomEvent]);

    const trackFormSubmit = useCallback((formData = {}) => {
        trackFormSubmission(formName, formData);
    }, [formName, trackFormSubmission]);

    const trackFormError = useCallback((errorMessage, fieldName = null) => {
        trackCustomEvent('form_error', {
            form_name: formName,
            error_message: errorMessage,
            field_name: fieldName
        });
    }, [formName, trackCustomEvent]);

    const trackFormFieldFocus = useCallback((fieldName) => {
        trackCustomEvent('form_field_focus', {
            form_name: formName,
            field_name: fieldName
        });
    }, [formName, trackCustomEvent]);

    return {
        trackFormStart,
        trackFormSubmit,
        trackFormError,
        trackFormFieldFocus
    };
};

export default useAnalytics;
