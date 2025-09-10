// Comprehensive Analytics System for Beauty E-commerce
// Supports GA4, Meta Pixel, TikTok Pixel with e-commerce tracking

import { ANALYTICS_CONFIG } from '../config/analytics';
import { generateContentId, transformProductForAnalytics, logContentIdIssue } from './contentIdUtils';

class AnalyticsManager {
    constructor(config) {
        if (!config) {
            throw new Error('Analytics config is required');
        }
        this.config = config;
        this.isInitialized = false;
    }

    // Generate unique event ID for TikTok
    generateEventId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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
                console.error('Failed to hash data:', error);
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
                console.error('❌ Analytics config is not available');
                return;
            }

            await Promise.all([
                this.initializeGA4(),
                this.initializeMetaPixel(),
                this.initializeTikTokPixel()
            ]);

            this.isInitialized = true;

        } catch (error) {
            console.error('❌ Analytics initialization failed:', error);
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
                console.error('❌ Failed to load GA4 script');
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
                window.fbq('track', 'PageView');

                resolve();
            } catch (error) {
                console.error('❌ Meta Pixel initialization failed:', error);
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
                    console.warn('⚠️ TikTok Pixel ID is empty, skipping initialization');
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
                    ttq.page();
                })(window, document, 'ttq', pixelId);

                resolve();
            } catch (error) {
                console.error('❌ TikTok Pixel initialization failed:', error);
                resolve(); // Still resolve to prevent blocking other analytics
            }
        });
    }

    // Track page views
    trackPageView(pagePath, pageTitle) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('config', this.config.ga4MeasurementId, {
                    page_path: pagePath,
                    page_title: pageTitle
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('track', 'PageView');
            }

            // TikTok Pixel
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.page();
            }


            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics page view error:', error);
        }
    }

    // Track product views
    trackProductView(product) {
        if (!this.isInitialized) return;

        try {
            // Transform product data with consistent content IDs
            const analyticsProduct = transformProductForAnalytics(product);

            if (!analyticsProduct) {
                console.warn('Failed to transform product for analytics');
                return;
            }

            // Log content ID issues in development
            if (ANALYTICS_CONFIG.DEBUG) {
                logContentIdIssue(product, 'Product view tracking');
            }

            // GA4 Enhanced Ecommerce
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'view_item', {
                    currency: analyticsProduct.currency,
                    value: analyticsProduct.price,
                    items: [{
                        item_id: analyticsProduct.item_id,
                        item_name: analyticsProduct.item_name,
                        item_category: analyticsProduct.item_category,
                        item_brand: analyticsProduct.item_brand,
                        item_variant: analyticsProduct.item_variant,
                        price: analyticsProduct.price,
                        quantity: 1
                    }]
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('track', 'ViewContent', {
                    content_ids: [analyticsProduct.content_id],
                    content_type: 'product',
                    content_name: analyticsProduct.content_name,
                    content_category: analyticsProduct.content_category,
                    value: analyticsProduct.price,
                    currency: analyticsProduct.currency
                });
            }

            // TikTok Pixel - ViewContent event
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track('ViewContent', {
                    contents: [{
                        content_id: analyticsProduct.content_id,
                        content_type: 'product',
                        content_name: analyticsProduct.content_name,
                        content_category: analyticsProduct.content_category,
                        price: analyticsProduct.price,
                        num_items: 1,
                        brand: analyticsProduct.item_brand
                    }],
                    value: analyticsProduct.price,
                    currency: analyticsProduct.currency
                });
            }


            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics product view error:', error);
        }
    }

    // Track add to cart
    trackAddToCart(product) {
        if (!this.isInitialized) return;

        try {
            // Transform product data with consistent content IDs
            const analyticsProduct = transformProductForAnalytics(product);

            if (!analyticsProduct) {
                console.warn('Failed to transform product for analytics');
                return;
            }

            // Log content ID issues in development
            if (ANALYTICS_CONFIG.DEBUG) {
                logContentIdIssue(product, 'Add to cart tracking');
            }

            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'add_to_cart', {
                    currency: analyticsProduct.currency,
                    value: analyticsProduct.price * (analyticsProduct.quantity || 1),
                    items: [{
                        item_id: analyticsProduct.item_id,
                        item_name: analyticsProduct.item_name,
                        item_category: analyticsProduct.item_category,
                        item_brand: analyticsProduct.item_brand,
                        item_variant: analyticsProduct.item_variant,
                        price: analyticsProduct.price,
                        quantity: analyticsProduct.quantity || 1
                    }]
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('track', 'AddToCart', {
                    content_ids: [analyticsProduct.content_id],
                    content_type: 'product',
                    content_name: analyticsProduct.content_name,
                    content_category: analyticsProduct.content_category,
                    value: analyticsProduct.price * (analyticsProduct.quantity || 1),
                    currency: analyticsProduct.currency
                });
            }

            // TikTok Pixel - AddToCart event
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track('AddToCart', {
                    contents: [{
                        content_id: analyticsProduct.content_id,
                        content_type: 'product',
                        content_name: analyticsProduct.content_name
                    }],
                    value: analyticsProduct.price * (analyticsProduct.quantity || 1),
                    currency: analyticsProduct.currency
                });
            }


            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics add to cart error:', error);
        }
    }

    // Track begin checkout
    trackBeginCheckout(cart) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'begin_checkout', {
                    currency: cart.currency,
                    value: cart.value,
                    items: cart.items.map(item => ({
                        item_id: item.id.toString(),
                        item_name: item.name,
                        item_category: item.category,
                        item_brand: item.brand,
                        item_variant: item.variant,
                        price: item.price,
                        quantity: item.quantity || 1
                    }))
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('track', 'InitiateCheckout', {
                    content_ids: cart.items.map(item => item.id.toString()),
                    content_type: 'product',
                    value: cart.value,
                    currency: cart.currency,
                    num_items: cart.items.length
                });
            }

            // TikTok Pixel - InitiateCheckout event
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track('InitiateCheckout', {
                    contents: cart.items.map(item => ({
                        content_id: item.id.toString(),
                        content_type: 'product',
                        content_name: item.name
                    })),
                    value: cart.value,
                    currency: cart.currency
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics begin checkout error:', error);
        }
    }

    // Track purchase
    trackPurchase(purchase) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'purchase', {
                    transaction_id: purchase.transaction_id,
                    value: purchase.value,
                    currency: purchase.currency,
                    tax: purchase.tax || 0,
                    shipping: purchase.shipping || 0,
                    coupon: purchase.coupon,
                    items: purchase.items.map(item => ({
                        item_id: item.id.toString(),
                        item_name: item.name,
                        item_category: item.category,
                        item_brand: item.brand,
                        item_variant: item.variant,
                        price: item.price,
                        quantity: item.quantity || 1
                    }))
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('track', 'Purchase', {
                    content_ids: purchase.items.map(item => item.id.toString()),
                    content_type: 'product',
                    value: purchase.value,
                    currency: purchase.currency,
                    num_items: purchase.items.length
                });
            }

            // TikTok Pixel - Purchase event
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track('PlaceAnOrder', {
                    contents: purchase.items.map(item => ({
                        content_id: item.id.toString(),
                        content_type: 'product',
                        content_name: item.name
                    })),
                    value: purchase.value,
                    currency: purchase.currency
                });
            }


            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics purchase error:', error);
        }
    }

    // Track search
    trackSearch(searchTerm, resultsCount) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'search', {
                    search_term: searchTerm,
                    results_count: resultsCount
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('track', 'Search', {
                    search_string: searchTerm
                });
            }

            // TikTok Pixel - Search event
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track('Search', {
                    contents: [],
                    value: 0,
                    currency: ANALYTICS_CONFIG.DEFAULT_CURRENCY,
                    search_string: searchTerm
                });
            }


            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics search error:', error);
        }
    }

    // Track WhatsApp clicks
    trackWhatsAppClick(action, productId, orderValue) {
        if (!this.isInitialized) return;

        try {
            // GA4 Custom Event
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'whatsapp_click', {
                    event_category: 'engagement',
                    event_label: action,
                    product_id: productId,
                    value: orderValue || 0
                });
            }

            // Meta Pixel Custom Event
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'WhatsAppClick', {
                    action: action,
                    product_id: productId,
                    value: orderValue || 0
                });
            }

            // TikTok Pixel Custom Event
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track('Contact', {
                    contents: productId ? [{
                        content_id: productId,
                        content_type: 'product',
                        content_name: 'Product Inquiry'
                    }] : [],
                    value: orderValue || 0,
                    currency: ANALYTICS_CONFIG.DEFAULT_CURRENCY
                });
            }


            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics WhatsApp click error:', error);
        }
    }

    // Track scroll depth
    trackScrollDepth(percentage) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'scroll', {
                    event_category: 'engagement',
                    event_label: `${percentage}%`,
                    value: percentage
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics scroll depth error:', error);
        }
    }

    // Track custom events
    trackCustomEvent(eventName, parameters = {}) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', eventName, parameters);
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', eventName, parameters);
            }

            // TikTok Pixel
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track(eventName, parameters);
            }


            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics custom event error:', error);
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
            console.error('TikTok identify error:', error);
        }
    }

    // Track add to wishlist
    trackAddToWishlist(product) {
        if (!this.isInitialized) return;

        try {
            const analyticsProduct = transformProductForAnalytics(product);

            if (!analyticsProduct) {
                console.warn('Failed to transform product for analytics');
                return;
            }

            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'add_to_wishlist', {
                    currency: analyticsProduct.currency,
                    value: analyticsProduct.price,
                    items: [{
                        item_id: analyticsProduct.item_id,
                        item_name: analyticsProduct.item_name,
                        item_category: analyticsProduct.item_category,
                        item_brand: analyticsProduct.item_brand,
                        price: analyticsProduct.price,
                        quantity: 1
                    }]
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('track', 'AddToWishlist', {
                    content_ids: [analyticsProduct.content_id],
                    content_type: 'product',
                    content_name: analyticsProduct.content_name,
                    value: analyticsProduct.price,
                    currency: analyticsProduct.currency
                });
            }

            // TikTok Pixel
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track('AddToWishlist', {
                    contents: [{
                        content_id: analyticsProduct.content_id,
                        content_type: 'product',
                        content_name: analyticsProduct.content_name
                    }],
                    value: analyticsProduct.price,
                    currency: analyticsProduct.currency
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics add to wishlist error:', error);
        }
    }

    // Track add payment info
    trackAddPaymentInfo(cart) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'add_payment_info', {
                    currency: cart.currency,
                    value: cart.value,
                    items: cart.items.map(item => ({
                        item_id: item.id.toString(),
                        item_name: item.name,
                        item_category: item.category,
                        price: item.price,
                        quantity: item.quantity || 1
                    }))
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('track', 'AddPaymentInfo', {
                    content_ids: cart.items.map(item => item.id.toString()),
                    content_type: 'product',
                    value: cart.value,
                    currency: cart.currency
                });
            }

            // TikTok Pixel
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track('AddPaymentInfo', {
                    contents: cart.items.map(item => ({
                        content_id: item.id.toString(),
                        content_type: 'product',
                        content_name: item.name
                    })),
                    value: cart.value,
                    currency: cart.currency
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics add payment info error:', error);
        }
    }

    // Track complete registration
    trackCompleteRegistration(value) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'sign_up', {
                    value: value || 0,
                    currency: ANALYTICS_CONFIG.DEFAULT_CURRENCY
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('track', 'CompleteRegistration', {
                    value: value || 0,
                    currency: ANALYTICS_CONFIG.DEFAULT_CURRENCY
                });
            }

            // TikTok Pixel
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track('CompleteRegistration', {
                    contents: [],
                    value: value || 0,
                    currency: ANALYTICS_CONFIG.DEFAULT_CURRENCY
                });
            }


            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics complete registration error:', error);
        }
    }

    // Track newsletter signup
    trackNewsletterSignup(email) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'newsletter_signup', {
                    event_category: 'engagement',
                    event_label: 'newsletter'
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('track', 'Subscribe', {
                    content_category: 'newsletter'
                });
            }

            // TikTok Pixel
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track('Subscribe', {
                    contents: [],
                    value: 0,
                    currency: ANALYTICS_CONFIG.DEFAULT_CURRENCY
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics newsletter signup error:', error);
        }
    }

    // Track product review
    trackProductReview(product, rating) {
        if (!this.isInitialized) return;

        try {
            const analyticsProduct = transformProductForAnalytics(product);

            if (!analyticsProduct) {
                console.warn('Failed to transform product for analytics');
                return;
            }

            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'product_review', {
                    currency: analyticsProduct.currency,
                    value: analyticsProduct.price,
                    items: [{
                        item_id: analyticsProduct.item_id,
                        item_name: analyticsProduct.item_name,
                        item_category: analyticsProduct.item_category,
                        item_brand: analyticsProduct.item_brand,
                        price: analyticsProduct.price,
                        quantity: 1
                    }],
                    rating: rating
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('track', 'CustomizeProduct', {
                    content_ids: [analyticsProduct.content_id],
                    content_type: 'product',
                    content_name: analyticsProduct.content_name,
                    value: analyticsProduct.price,
                    currency: analyticsProduct.currency
                });
            }

            // TikTok Pixel
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track('CustomizeProduct', {
                    contents: [{
                        content_id: analyticsProduct.content_id,
                        content_type: 'product',
                        content_name: analyticsProduct.content_name
                    }],
                    value: analyticsProduct.price,
                    currency: analyticsProduct.currency
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics product review error:', error);
        }
    }

    // Track user login
    trackUserLogin(loginMethod = 'email', userId = null) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'login', {
                    method: loginMethod,
                    user_id: userId
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('track', 'CompleteRegistration', {
                    content_category: 'user_login',
                    login_method: loginMethod
                });
            }

            // TikTok Pixel
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track('CompleteRegistration', {
                    contents: [],
                    value: 0,
                    currency: ANALYTICS_CONFIG.DEFAULT_CURRENCY,
                    login_method: loginMethod
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics user login error:', error);
        }
    }

    // Track user logout
    trackUserLogout() {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'logout', {
                    event_category: 'user_engagement'
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'UserLogout', {
                    content_category: 'user_engagement'
                });
            }

            // TikTok Pixel
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track('CustomizeProduct', {
                    contents: [],
                    value: 0,
                    currency: ANALYTICS_CONFIG.DEFAULT_CURRENCY
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics user logout error:', error);
        }
    }

    // Track video interactions
    trackVideoPlay(videoTitle, videoDuration, currentTime = 0) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'video_play', {
                    video_title: videoTitle,
                    video_duration: videoDuration,
                    video_current_time: currentTime
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('track', 'VideoPlay', {
                    content_name: videoTitle,
                    content_category: 'video'
                });
            }

            // TikTok Pixel
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track('VideoPlay', {
                    contents: [{
                        content_id: videoTitle,
                        content_type: 'video',
                        content_name: videoTitle
                    }],
                    value: 0,
                    currency: ANALYTICS_CONFIG.DEFAULT_CURRENCY
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics video play error:', error);
        }
    }

    // Track video pause
    trackVideoPause(videoTitle, currentTime) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'video_pause', {
                    video_title: videoTitle,
                    video_current_time: currentTime
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'VideoPause', {
                    content_name: videoTitle,
                    content_category: 'video'
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics video pause error:', error);
        }
    }

    // Track video complete
    trackVideoComplete(videoTitle, videoDuration) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'video_complete', {
                    video_title: videoTitle,
                    video_duration: videoDuration
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('track', 'VideoComplete', {
                    content_name: videoTitle,
                    content_category: 'video'
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics video complete error:', error);
        }
    }

    // Track image interactions
    trackImageClick(imageTitle, imageLocation, imageUrl) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'image_click', {
                    image_title: imageTitle,
                    image_location: imageLocation,
                    image_url: imageUrl
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'ImageClick', {
                    content_name: imageTitle,
                    content_category: 'image',
                    content_location: imageLocation
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics image click error:', error);
        }
    }

    // Track link clicks
    trackLinkClick(linkText, linkUrl, linkLocation) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'link_click', {
                    link_text: linkText,
                    link_url: linkUrl,
                    link_location: linkLocation
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'LinkClick', {
                    content_name: linkText,
                    content_category: 'link',
                    content_location: linkLocation
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics link click error:', error);
        }
    }

    // Track social media interactions
    trackSocialShare(platform, contentTitle, contentUrl) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'share', {
                    method: platform,
                    content_title: contentTitle,
                    content_url: contentUrl
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('track', 'Share', {
                    content_name: contentTitle,
                    content_category: 'social_share',
                    social_platform: platform
                });
            }

            // TikTok Pixel
            if (this.config.tiktokPixelId && window.ttq) {
                window.ttq.track('Share', {
                    contents: [{
                        content_id: contentUrl,
                        content_type: 'social_share',
                        content_name: contentTitle
                    }],
                    value: 0,
                    currency: ANALYTICS_CONFIG.DEFAULT_CURRENCY
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics social share error:', error);
        }
    }

    // Track file downloads
    trackFileDownload(fileName, fileType, fileSize, downloadLocation) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'file_download', {
                    file_name: fileName,
                    file_type: fileType,
                    file_size: fileSize,
                    download_location: downloadLocation
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'FileDownload', {
                    content_name: fileName,
                    content_category: 'file_download',
                    file_type: fileType
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics file download error:', error);
        }
    }

    // Track modal interactions
    trackModalOpen(modalName, modalTrigger) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'modal_open', {
                    modal_name: modalName,
                    modal_trigger: modalTrigger
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'ModalOpen', {
                    content_name: modalName,
                    content_category: 'modal',
                    trigger: modalTrigger
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics modal open error:', error);
        }
    }

    // Track modal close
    trackModalClose(modalName, modalDuration) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'modal_close', {
                    modal_name: modalName,
                    modal_duration: modalDuration
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'ModalClose', {
                    content_name: modalName,
                    content_category: 'modal',
                    duration: modalDuration
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics modal close error:', error);
        }
    }

    // Track tab switches
    trackTabSwitch(tabName, tabLocation) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'tab_switch', {
                    tab_name: tabName,
                    tab_location: tabLocation
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'TabSwitch', {
                    content_name: tabName,
                    content_category: 'tab',
                    content_location: tabLocation
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics tab switch error:', error);
        }
    }

    // Track accordion interactions
    trackAccordionToggle(accordionTitle, isOpen) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'accordion_toggle', {
                    accordion_title: accordionTitle,
                    is_open: isOpen
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'AccordionToggle', {
                    content_name: accordionTitle,
                    content_category: 'accordion',
                    action: isOpen ? 'open' : 'close'
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics accordion toggle error:', error);
        }
    }

    // Track carousel interactions
    trackCarouselSlide(slideNumber, slideTitle, carouselName) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'carousel_slide', {
                    slide_number: slideNumber,
                    slide_title: slideTitle,
                    carousel_name: carouselName
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'CarouselSlide', {
                    content_name: slideTitle,
                    content_category: 'carousel',
                    carousel_name: carouselName,
                    slide_number: slideNumber
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics carousel slide error:', error);
        }
    }

    // Track filter interactions
    trackFilterApply(filterType, filterValue, resultsCount) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'filter_apply', {
                    filter_type: filterType,
                    filter_value: filterValue,
                    results_count: resultsCount
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'FilterApply', {
                    content_name: filterValue,
                    content_category: 'filter',
                    filter_type: filterType,
                    results_count: resultsCount
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics filter apply error:', error);
        }
    }

    // Track sort interactions
    trackSortApply(sortType, sortDirection, resultsCount) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'sort_apply', {
                    sort_type: sortType,
                    sort_direction: sortDirection,
                    results_count: resultsCount
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'SortApply', {
                    content_name: `${sortType}_${sortDirection}`,
                    content_category: 'sort',
                    sort_type: sortType,
                    sort_direction: sortDirection
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics sort apply error:', error);
        }
    }

    // Track pagination
    trackPagination(pageNumber, totalPages, pageType) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'pagination', {
                    page_number: pageNumber,
                    total_pages: totalPages,
                    page_type: pageType
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'Pagination', {
                    content_name: `page_${pageNumber}`,
                    content_category: 'pagination',
                    page_type: pageType,
                    total_pages: totalPages
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics pagination error:', error);
        }
    }

    // Track error events
    trackError(errorType, errorMessage, errorContext = {}) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'exception', {
                    description: errorMessage,
                    fatal: false,
                    error_type: errorType,
                    ...errorContext
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'ErrorOccurred', {
                    content_name: errorType,
                    content_category: 'error',
                    error_message: errorMessage,
                    ...errorContext
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics error tracking error:', error);
        }
    }

    // Track performance metrics
    trackPerformance(metricName, value, unit = 'ms') {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'timing_complete', {
                    name: metricName,
                    value: value,
                    event_category: 'performance'
                });
            }

            // Meta Pixel
            if (this.config.metaPixelId && window.fbq) {
                window.fbq('trackCustom', 'PerformanceMetric', {
                    content_name: metricName,
                    content_category: 'performance',
                    metric_value: value,
                    metric_unit: unit
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics performance tracking error:', error);
        }
    }

    // Track user session events
    trackSessionStart() {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'session_start', {
                    event_category: 'user_engagement'
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics session start error:', error);
        }
    }

    // Track user session end
    trackSessionEnd(sessionDuration) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'session_end', {
                    event_category: 'user_engagement',
                    session_duration: sessionDuration
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics session end error:', error);
        }
    }

    // Track user engagement score
    trackEngagementScore(score, factors) {
        if (!this.isInitialized) return;

        try {
            // GA4
            if (this.config.ga4MeasurementId && window.gtag) {
                window.gtag('event', 'engagement_score', {
                    score: score,
                    factors: factors.join(','),
                    event_category: 'user_engagement'
                });
            }

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('Analytics engagement score error:', error);
        }
    }
}

// Create singleton instance
let analyticsInstance = null;

export const initializeAnalytics = (config) => {
    if (!analyticsInstance) {
        try {
            analyticsInstance = new AnalyticsManager(config);
            analyticsInstance.initialize().catch(error => {
                console.error('❌ Failed to initialize analytics:', error);
            });
        } catch (error) {
            console.error('❌ Failed to create AnalyticsManager:', error);
            throw error;
        }
    }
    return analyticsInstance;
};

export const getAnalytics = () => {
    return analyticsInstance;
};

export default AnalyticsManager;
