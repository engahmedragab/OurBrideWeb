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

    // Core E-commerce Analytics functions
    const trackProductView = useCallback((product) => {
        if (analytics) {
            analytics.trackProductView(product);
        }
    }, [analytics]);

    const trackAddToCart = useCallback((product) => {
        if (analytics) {
            analytics.trackAddToCart(product);
        }
    }, [analytics]);

    const trackPurchase = useCallback((purchase) => {
        if (analytics) {
            analytics.trackPurchase(purchase);
        }
    }, [analytics]);

    const trackSearch = useCallback((searchTerm, resultsCount) => {
        if (analytics) {
            analytics.trackSearch(searchTerm, resultsCount);
        }
    }, [analytics]);

    const trackWhatsAppClick = useCallback((action, productId, orderValue) => {
        if (analytics) {
            analytics.trackWhatsAppClick(action, productId, orderValue);
        }
    }, [analytics]);

    const trackCustomEvent = useCallback((eventName, parameters) => {
        if (analytics) {
            analytics.trackCustomEvent(eventName, parameters);
        }
    }, [analytics]);

    const trackBeginCheckout = useCallback((cart) => {
        if (analytics) {
            analytics.trackBeginCheckout(cart);
        }
    }, [analytics]);

    const trackAddToWishlist = useCallback((product) => {
        if (analytics) {
            analytics.trackAddToWishlist(product);
        }
    }, [analytics]);

    const trackAddPaymentInfo = useCallback((cart) => {
        if (analytics) {
            analytics.trackAddPaymentInfo(cart);
        }
    }, [analytics]);

    const trackCompleteRegistration = useCallback((value) => {
        if (analytics) {
            analytics.trackCompleteRegistration(value);
        }
    }, [analytics]);

    const trackNewsletterSignup = useCallback((email) => {
        if (analytics) {
            analytics.trackNewsletterSignup(email);
        }
    }, [analytics]);

    const trackProductReview = useCallback((product, rating) => {
        if (analytics) {
            analytics.trackProductReview(product, rating);
        }
    }, [analytics]);

    const identifyUser = useCallback(async (email, phoneNumber, externalId) => {
        if (analytics) {
            await analytics.identifyUser(email, phoneNumber, externalId);
        }
    }, [analytics]);

    // User Authentication Analytics
    const trackUserLogin = useCallback((loginMethod = 'email', userId = null) => {
        if (analytics) {
            analytics.trackUserLogin(loginMethod, userId);
        }
    }, [analytics]);

    const trackUserLogout = useCallback(() => {
        if (analytics) {
            analytics.trackUserLogout();
        }
    }, [analytics]);

    // Video Interaction Analytics
    const trackVideoPlay = useCallback((videoTitle, videoDuration, currentTime = 0) => {
        if (analytics) {
            analytics.trackVideoPlay(videoTitle, videoDuration, currentTime);
        }
    }, [analytics]);

    const trackVideoPause = useCallback((videoTitle, currentTime) => {
        if (analytics) {
            analytics.trackVideoPause(videoTitle, currentTime);
        }
    }, [analytics]);

    const trackVideoComplete = useCallback((videoTitle, videoDuration) => {
        if (analytics) {
            analytics.trackVideoComplete(videoTitle, videoDuration);
        }
    }, [analytics]);

    // Content Interaction Analytics
    const trackImageClick = useCallback((imageTitle, imageLocation, imageUrl) => {
        if (analytics) {
            analytics.trackImageClick(imageTitle, imageLocation, imageUrl);
        }
    }, [analytics]);

    const trackLinkClick = useCallback((linkText, linkUrl, linkLocation) => {
        if (analytics) {
            analytics.trackLinkClick(linkText, linkUrl, linkLocation);
        }
    }, [analytics]);

    const trackSocialShare = useCallback((platform, contentTitle, contentUrl) => {
        if (analytics) {
            analytics.trackSocialShare(platform, contentTitle, contentUrl);
        }
    }, [analytics]);

    const trackFileDownload = useCallback((fileName, fileType, fileSize, downloadLocation) => {
        if (analytics) {
            analytics.trackFileDownload(fileName, fileType, fileSize, downloadLocation);
        }
    }, [analytics]);

    // UI Interaction Analytics
    const trackModalOpen = useCallback((modalName, modalTrigger) => {
        if (analytics) {
            analytics.trackModalOpen(modalName, modalTrigger);
        }
    }, [analytics]);

    const trackModalClose = useCallback((modalName, modalDuration) => {
        if (analytics) {
            analytics.trackModalClose(modalName, modalDuration);
        }
    }, [analytics]);

    const trackTabSwitch = useCallback((tabName, tabLocation) => {
        if (analytics) {
            analytics.trackTabSwitch(tabName, tabLocation);
        }
    }, [analytics]);

    const trackAccordionToggle = useCallback((accordionTitle, isOpen) => {
        if (analytics) {
            analytics.trackAccordionToggle(accordionTitle, isOpen);
        }
    }, [analytics]);

    const trackCarouselSlide = useCallback((slideNumber, slideTitle, carouselName) => {
        if (analytics) {
            analytics.trackCarouselSlide(slideNumber, slideTitle, carouselName);
        }
    }, [analytics]);

    // Filter and Sort Analytics
    const trackFilterApply = useCallback((filterType, filterValue, resultsCount) => {
        if (analytics) {
            analytics.trackFilterApply(filterType, filterValue, resultsCount);
        }
    }, [analytics]);

    const trackSortApply = useCallback((sortType, sortDirection, resultsCount) => {
        if (analytics) {
            analytics.trackSortApply(sortType, sortDirection, resultsCount);
        }
    }, [analytics]);

    const trackPagination = useCallback((pageNumber, totalPages, pageType) => {
        if (analytics) {
            analytics.trackPagination(pageNumber, totalPages, pageType);
        }
    }, [analytics]);

    // Error and Performance Analytics
    const trackError = useCallback((errorType, errorMessage, errorContext = {}) => {
        if (analytics) {
            analytics.trackError(errorType, errorMessage, errorContext);
        }
    }, [analytics]);

    const trackPerformance = useCallback((metricName, value, unit = 'ms') => {
        if (analytics) {
            analytics.trackPerformance(metricName, value, unit);
        }
    }, [analytics]);

    // Session Analytics
    const trackSessionStart = useCallback(() => {
        if (analytics) {
            analytics.trackSessionStart();
        }
    }, [analytics]);

    const trackSessionEnd = useCallback((sessionDuration) => {
        if (analytics) {
            analytics.trackSessionEnd(sessionDuration);
        }
    }, [analytics]);

    const trackEngagementScore = useCallback((score, factors) => {
        if (analytics) {
            analytics.trackEngagementScore(score, factors);
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
        // Core E-commerce tracking functions
        trackProductView,
        trackAddToCart,
        trackPurchase,
        trackSearch,
        trackWhatsAppClick,
        trackCustomEvent,
        trackBeginCheckout,
        trackAddToWishlist,
        trackAddPaymentInfo,
        trackCompleteRegistration,
        trackNewsletterSignup,
        trackProductReview,
        identifyUser,

        // User Authentication Analytics
        trackUserLogin,
        trackUserLogout,

        // Video Interaction Analytics
        trackVideoPlay,
        trackVideoPause,
        trackVideoComplete,

        // Content Interaction Analytics
        trackImageClick,
        trackLinkClick,
        trackSocialShare,
        trackFileDownload,

        // UI Interaction Analytics
        trackModalOpen,
        trackModalClose,
        trackTabSwitch,
        trackAccordionToggle,
        trackCarouselSlide,

        // Filter and Sort Analytics
        trackFilterApply,
        trackSortApply,
        trackPagination,

        // Error and Performance Analytics
        trackError,
        trackPerformance,

        // Session Analytics
        trackSessionStart,
        trackSessionEnd,
        trackEngagementScore,

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

// Hook for tracking specific product interactions
export const useProductAnalytics = (product) => {
    const { trackProductView, trackAddToCart, trackAddToWishlist, trackProductReview, trackProductInteraction } = useAnalytics();

    const trackView = useCallback(() => {
        if (product) {
            trackProductView(product);
        }
    }, [product, trackProductView]);

    const trackAddToCartProduct = useCallback(() => {
        if (product) {
            trackAddToCart(product);
        }
    }, [product, trackAddToCart]);

    const trackWishlist = useCallback(() => {
        if (product) {
            trackAddToWishlist(product);
        }
    }, [product, trackAddToWishlist]);

    const trackReview = useCallback((rating) => {
        if (product) {
            trackProductReview(product, rating);
        }
    }, [product, trackProductReview]);

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
