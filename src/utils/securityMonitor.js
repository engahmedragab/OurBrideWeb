/**
 * Security utilities to prevent malicious requests and memory leaks
 */

// Known malicious domains that cause memory leaks, browser freezing, and redirect loops
const MALICIOUS_DOMAINS = [
    'malicious-api.com',
    'suspicious-domain.com',
    'bad-extension.com',
    'memory-leak.com',
    'redirect-loop.com',
    'infinite-redirect.com'
];

// Whitelisted legitimate domains that should never be blocked
const WHITELISTED_DOMAINS = [
    'analytics.google.com',
    'www.google-analytics.com',
    'www.googletagmanager.com',
    'connect.facebook.net',
    'analytics.tiktok.com',
    'api.our-bride.com',
    'api.ipify.org'
];

// Redirect loop detection patterns
const REDIRECT_LOOP_PATTERNS = [
    /events\/.*redirect/i,
    /infinite.*redirect/i,
    /loop.*redirect/i
];

// Request monitoring and blocking
class SecurityMonitor {
    constructor() {
        this.blockedRequests = new Set();
        this.requestCount = 0;
        this.maxRequests = 1000;
        this.memoryCheckInterval = 30000; // 30 seconds
        this.lastMemoryCheck = 0;
        this.redirectLoopCount = new Map();
        this.maxRedirects = 3; // Maximum allowed redirects per domain

        this.initializeMonitoring();
        this.detectBrowserExtensions();
    }

    initializeMonitoring() {
        // Monitor fetch requests
        this.interceptFetch();

        // Monitor XMLHttpRequest
        this.interceptXHR();

        // Monitor WebSocket connections
        this.interceptWebSocket();

        // Periodic cleanup
        setInterval(() => this.cleanup(), this.memoryCheckInterval);
    }

    interceptFetch() {
        const originalFetch = window.fetch;
        const self = this;

        window.fetch = async function (input, init) {
            const url = typeof input === 'string' ? input : input.toString();

            // Debug: Monitor suspicious domains silently

            if (self.isMaliciousRequest(url)) {
                // Silently block malicious requests without logging to reduce noise
                return Promise.reject(new Error('Blocked malicious request'));
            }

            // Check for redirect loop patterns
            if (self.isRedirectLoopRequest(url)) {
                return Promise.reject(new Error('Blocked redirect loop request'));
            }

            self.requestCount++;
            self.checkMemoryUsage();

            try {
                const response = await originalFetch.call(window, input, init);

                // Check for redirect responses and track them
                if (response.redirected || (response.status >= 300 && response.status < 400)) {
                    self.trackRedirect(url, response);
                }

                return response;
            } catch (error) {
                throw error;
            }
        };
    }

    interceptXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const self = this;

        XMLHttpRequest.prototype.open = function (method, url, ...args) {
            const urlString = url.toString();

            // Debug: Monitor suspicious XHR requests silently

            if (self.isMaliciousRequest(urlString)) {
                // Silently block malicious XHR requests
                throw new Error('Blocked malicious request');
            }

            return originalOpen.call(this, method, url, ...args);
        };
    }

    interceptWebSocket() {
        const originalWebSocket = window.WebSocket;
        const self = this;

        window.WebSocket = class extends originalWebSocket {
            constructor(url, protocols) {
                const urlString = url.toString();

                if (self.isMaliciousRequest(urlString)) {
                    // Silently block malicious WebSocket connections
                    throw new Error('Blocked malicious WebSocket connection');
                }

                super(url, protocols);
            }
        };
    }

    isMaliciousRequest(url) {
        try {
            const urlObj = new URL(url);

            // First check if it's a whitelisted domain - never block these
            for (const domain of WHITELISTED_DOMAINS) {
                if (urlObj.hostname.includes(domain)) {
                    return false;
                }
            }

            // Check against known malicious domains
            for (const domain of MALICIOUS_DOMAINS) {
                if (urlObj.hostname.includes(domain)) {
                    this.blockedRequests.add(url);
                    return true;
                }
            }

            // Check for suspicious patterns
            if (this.hasSuspiciousPattern(url)) {
                this.blockedRequests.add(url);
                return true;
            }

            return false;
        } catch (error) {
            // Invalid URL, block it
            return true;
        }
    }

    hasSuspiciousPattern(url) {
        const suspiciousPatterns = [
            /malicious/i,
            /suspicious/i,
            /memory-leak/i,
            /browser-freeze/i
        ];

        return suspiciousPatterns.some(pattern => pattern.test(url));
    }

    isRedirectLoopRequest(url) {
        try {
            const urlObj = new URL(url);

            // Check against known redirect loop patterns
            for (const pattern of REDIRECT_LOOP_PATTERNS) {
                if (pattern.test(url)) {
                    return true;
                }
            }

            // Check if this domain has exceeded redirect limit
            const domain = urlObj.hostname;
            const redirectCount = this.redirectLoopCount.get(domain) || 0;

            if (redirectCount >= this.maxRedirects) {
                return true;
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    trackRedirect(url, response) {
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname;

            const currentCount = this.redirectLoopCount.get(domain) || 0;
            this.redirectLoopCount.set(domain, currentCount + 1);

            // If too many redirects, block this domain
            if (currentCount + 1 >= this.maxRedirects) {
                this.blockedRequests.add(domain);
            }
        } catch (error) {
            // Error tracking redirect handled silently
        }
    }

    checkMemoryUsage() {
        const now = Date.now();

        // Only check memory every 30 seconds to avoid performance impact
        if (now - this.lastMemoryCheck < this.memoryCheckInterval) {
            return;
        }

        this.lastMemoryCheck = now;

        if ('memory' in performance) {
            const memory = performance.memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
            const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
            const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);

            // If using more than 80% of available memory, trigger cleanup
            if (usedMB > (limitMB * 0.8)) {
                this.forceCleanup();
            }

            // If using more than 200MB, it's likely a memory leak
            if (usedMB > 200) {
                this.forceCleanup();
            }
        }
    }

    forceCleanup() {
        // Clear blocked requests cache
        this.blockedRequests.clear();

        // Reset request counter
        this.requestCount = 0;

        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }

        // Clear any cached data
        if ('caches' in window) {
            caches.keys().then(cacheNames => {
                cacheNames.forEach(cacheName => {
                    if (cacheName.includes('malicious') || cacheName.includes('blocked')) {
                        caches.delete(cacheName);
                    }
                });
            });
        }
    }

    cleanup() {
        // Regular cleanup every 30 seconds
        this.checkMemoryUsage();

        // Clear old blocked requests (keep only last 100)
        if (this.blockedRequests.size > 100) {
            const requestsArray = Array.from(this.blockedRequests);
            this.blockedRequests.clear();
            requestsArray.slice(-50).forEach(req => this.blockedRequests.add(req));
        }
    }

    detectBrowserExtensions() {
        // Detect common browser extensions that might make suspicious requests
        const suspiciousExtensions = [];

        // Check for Chrome extensions
        if (typeof window !== 'undefined' && window.chrome?.runtime) {
            try {
                // Extensions are protected, which is normal
            } catch (error) {
                // Extensions are protected, which is normal
            }
        }

        // Check for injected scripts
        const scripts = document.querySelectorAll('script');
        scripts.forEach((script) => {
            if (script.src && (script.src.includes('capig') || script.src.includes('datah04'))) {
                suspiciousExtensions.push(script.src);
            }
        });

        // Check for suspicious global variables
        const suspiciousGlobals = ['capig', 'datah04', 'maliciousTracker'];
        suspiciousGlobals.forEach(globalName => {
            if (window[globalName]) {
                suspiciousExtensions.push(globalName);
            }
        });
    }

    // Public methods
    getBlockedRequests() {
        return Array.from(this.blockedRequests);
    }

    getRequestCount() {
        return this.requestCount;
    }

    addMaliciousDomain(domain) {
        MALICIOUS_DOMAINS.push(domain);
    }

    isBlocked(url) {
        return this.blockedRequests.has(url);
    }
}

// Initialize security monitor
const securityMonitor = new SecurityMonitor();

// Export for debugging
if (typeof window !== 'undefined') {
    window.securityMonitor = securityMonitor;
}

export default securityMonitor;

