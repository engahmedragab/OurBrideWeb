// Comprehensive Analytics System for Beauty E-commerce
// Supports GA4, Meta Pixel, TikTok Pixel with e-commerce tracking

import { ANALYTICS_CONFIG } from '../config/analytics';
import { tiktokOptimizer } from './tiktokOptimizer';
import { facebookOptimizer } from './facebookOptimizer';
import { ga4Optimizer } from './ga4Optimizer';

class AnalyticsManager {
    constructor(config) {
        if (!config) {
            throw new Error('Analytics config is required');
        }
        this.config = config;
        this.isInitialized = false;
        this.lastPageView = '';
        this.requestThrottle = new Map();
    }

    // Hash function for PII data (SHA-256)
    async hashData(data) {
        if (typeof window !== 'undefined' && window.crypto) {
            try {
                const encoder = new TextEncoder();
                const dataBuffer = encoder.encode(data);
                const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            } catch (error) {
                return data; // Fallback if crypto API fails
            }
        }
        return data; // Fallback if crypto API not available
    }

    // Initialize all analytics platforms
    async initialize() {
        if (this.isInitialized) return;

        try {

            // Check if config is available
            if (!this.config) {
                return;
            }

            await Promise.all([
                this.initializeGA4(),
                this.initializeMetaPixel(),
                this.initializeTikTokPixel()
            ]);

            this.isInitialized = true;

        } catch (error) {
            // Initialization failed silently
        }
    }

    // Initialize Google Analytics 4
    async initializeGA4() {
        if (!this.config || !this.config.ga4MeasurementId) {
            return;
        }

        return new Promise((resolve) => {
            // Load gtag script
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.ga4MeasurementId}`;
            document.head.appendChild(script);

            script.onload = () => {
                // Initialize dataLayer
                window.dataLayer = window.dataLayer || [];
                window.gtag = function () {
                    window.dataLayer.push(arguments);
                };

                // Configure GA4
                window.gtag('js', new Date());
                window.gtag('config', this.config.ga4MeasurementId, {
                    currency: ANALYTICS_CONFIG.DEFAULT_CURRENCY,
                    country: ANALYTICS_CONFIG.DEFAULT_COUNTRY,
                    language: ANALYTICS_CONFIG.DEFAULT_LANGUAGE,
                    anonymize_ip: ANALYTICS_CONFIG.PRIVACY.ANONYMIZE_IP
                });

                resolve();
            };

            script.onerror = () => {
                resolve(); // Still resolve to prevent blocking other analytics
            };
        });
    }

    // Initialize Meta Pixel (Facebook)
    async initializeMetaPixel() {
        if (!this.config || !this.config.metaPixelId) {
            return;
        }

        return new Promise((resolve) => {
            try {
                // Meta Pixel code
                (function (f, b, e, v, n, t, s) {
                    if (f.fbq) return;
                    n = f.fbq = function () {
                        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                    };
                    if (!f._fbq) f._fbq = n;
                    n.push = n;
                    n.loaded = !0;
                    n.version = '2.0';
                    n.queue = [];
                    t = b.createElement(e);
                    t.async = !0;
                    t.src = v;
                    s = b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t, s);
                })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

                window.fbq('init', this.config.metaPixelId);
                // Don't call fbq('track', 'PageView') here - it will be called by usePageTracking

                resolve();
            } catch (error) {
                resolve(); // Still resolve to prevent blocking other analytics
            }
        });
    }

    // Initialize TikTok Pixel
    async initializeTikTokPixel() {
        if (!this.config || !this.config.tiktokPixelId) {
            return;
        }

        return new Promise((resolve) => {
            try {
                // Capture the pixel ID before entering the IIFE to avoid 'this' context issues
                const pixelId = this.config.tiktokPixelId;

                if (!pixelId) {
                    resolve();
                    return;
                }

                // TikTok Pixel code - matching the working code from index.html
                (function (w, d, t, pixelId) {
                    w.TiktokAnalyticsObject = t;
                    var ttq = w[t] = w[t] || [];
                    ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"];
                    ttq.setAndDefer = function (t, e) {
                        t[e] = function () {
                            t.push([e].concat(Array.prototype.slice.call(arguments, 0)))
                        }
                    };
                    for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
                    ttq.instance = function (t) {
                        for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]);
                        return e
                    };
                    ttq.load = function (e, n) {
                        var r = "https://analytics.tiktok.com/i18n/pixel/events.js";
                        var o = n && n.partner;
                        ttq._i = ttq._i || {};
                        ttq._i[e] = [];
                        ttq._i[e]._u = r;
                        ttq._t = ttq._t || {};
                        ttq._t[e] = +new Date;
                        ttq._o = ttq._o || {};
                        ttq._o[e] = n || {};
                        n = document.createElement("script");
                        n.type = "text/javascript";
                        n.async = !0;
                        n.src = r + "?sdkid=" + e + "&lib=" + t;
                        e = document.getElementsByTagName("script")[0];
                        e.parentNode.insertBefore(n, e)
                    };

                    ttq.load(pixelId);
                    // Don't call ttq.page() here - it will be called by usePageTracking
                })(window, document, 'ttq', pixelId);

                resolve();
            } catch (error) {
                resolve(); // Still resolve to prevent blocking other analytics
            }
        });
    }

    // Track page views
    trackPageView(pagePath, pageTitle) {
        if (!this.isInitialized) return;

        // Prevent duplicate page views for the same path
        const currentPath = pagePath || window.location.pathname;
        if (this.lastPageView === currentPath) {
            return;
        }
        this.lastPageView = currentPath;

        try {
            // GA4 - use optimizer for page views
            if (this.config.ga4MeasurementId && window.gtag) {
                ga4Optimizer.queueEvent('page_view', {
                    measurementId: this.config.ga4MeasurementId,
                    page_path: pagePath,
                    page_title: pageTitle
                });
            }

            // Meta Pixel - use optimizer for page views
            if (this.config.metaPixelId && window.fbq) {
                facebookOptimizer.queueEvent('PageView', { page_path: pagePath, page_title: pageTitle });
            }

            // TikTok Pixel - use optimizer for page views
            if (this.config.tiktokPixelId && window.ttq) {
                tiktokOptimizer.queueEvent('page_view', { page_path: pagePath, page_title: pageTitle });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            // Page view error handled silently
        }
    }


    // Track scroll depth
    trackScrollDepth(percentage) {
        if (!this.isInitialized) return;

        try {
            // GA4 (optimized)
            if (this.config.ga4MeasurementId && window.gtag) {
                ga4Optimizer.queueEvent('scroll', {
                    event_category: 'engagement',
                    event_label: `${percentage}%`,
                    value: percentage
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            // Scroll depth error handled silently
        }
    }

    // Track custom events
    trackCustomEvent(eventName, parameters = {}) {
        if (!this.isInitialized) return;

        try {
            // GA4 (optimized)
            if (this.config.ga4MeasurementId && window.gtag) {
                ga4Optimizer.queueEvent(eventName, parameters);
            }

            // Meta Pixel Custom Event (optimized)
            if (this.config.metaPixelId && window.fbq) {
                facebookOptimizer.queueEvent(eventName, parameters);
            }

            // TikTok Pixel Custom Event (optimized)
            if (this.config.tiktokPixelId && window.ttq) {
                tiktokOptimizer.queueEvent(eventName, parameters);
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            // Custom event error handled silently
        }
    }

    // Identify user for TikTok (for PII data)
    async identifyUser(email, phoneNumber, externalId) {
        if (!this.isInitialized || !this.config.tiktokPixelId || !window.ttq) return;

        try {
            const hashedEmail = email ? await this.hashData(email) : undefined;
            const hashedPhone = phoneNumber ? await this.hashData(phoneNumber) : undefined;
            const hashedExternalId = externalId ? await this.hashData(externalId) : undefined;

            window.ttq.identify({
                email: hashedEmail,
                phone_number: hashedPhone,
                external_id: hashedExternalId
            });

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            // Identify error handled silently
        }
    }

}

// Create singleton instance
let analyticsInstance = null;

export const initializeAnalytics = (config) => {
    if (!analyticsInstance) {
        try {
            analyticsInstance = new AnalyticsManager(config);
            analyticsInstance.initialize().catch(() => {
                // Initialization failed silently
            });
        } catch (error) {
            throw error;
        }
    }
    return analyticsInstance;
};

export const getAnalytics = () => {
    return analyticsInstance;
};

export default AnalyticsManager;
