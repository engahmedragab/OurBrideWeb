// Comprehensive Analytics Event Logger
// Tracks all possible user actions across the website

import { getAnalytics } from './AnalyticsManager';
import { ANALYTICS_CONFIG } from '../config/analytics';

class AnalyticsLogger {
    constructor() {
        this.analytics = getAnalytics();
        this.sessionStartTime = Date.now();
        this.userActions = [];
        this.engagementFactors = [];
    }

    // Log all user actions with timestamps
    logAction(actionType, actionData = {}) {
        const timestamp = new Date().toISOString();
        const action = {
            type: actionType,
            data: actionData,
            timestamp,
            sessionDuration: Date.now() - this.sessionStartTime,
            pageUrl: window.location.href,
            userAgent: navigator.userAgent
        };

        this.userActions.push(action);

        // Track with analytics if available
        if (this.analytics) {
            this.analytics.trackCustomEvent(actionType, {
                ...actionData,
                timestamp,
                session_duration: action.sessionDuration
            });
        }

        // Log to console in development
        if (ANALYTICS_CONFIG.DEBUG) {
        }
    }

    // Track page interactions
    logPageInteraction(interactionType, elementData = {}) {
        this.logAction('page_interaction', {
            interaction_type: interactionType,
            element_data: elementData,
            page_path: window.location.pathname
        });
    }

    // Track navigation events
    logNavigation(fromPage, toPage, navigationMethod = 'click') {
        this.logAction('navigation', {
            from_page: fromPage,
            to_page: toPage,
            navigation_method: navigationMethod,
            navigation_time: Date.now() - this.sessionStartTime
        });
    }

    // Track user engagement
    logEngagement(engagementType, engagementData = {}) {
        this.engagementFactors.push(engagementType);

        this.logAction('user_engagement', {
            engagement_type: engagementType,
            engagement_data: engagementData,
            total_engagements: this.engagementFactors.length,
            engagement_score: this.calculateEngagementScore()
        });
    }

    // Calculate engagement score based on user actions
    calculateEngagementScore() {
        const weights = {
            'page_view': 1,
            'product_view': 3,
            'add_to_cart': 5,
            'purchase': 10,
            'form_submission': 4,
            'video_play': 2,
            'social_share': 3,
            'search': 2,
            'filter_apply': 2,
            'tab_switch': 1,
            'scroll_depth': 1,
            'time_on_page': 1
        };

        let score = 0;
        this.engagementFactors.forEach(factor => {
            score += weights[factor] || 1;
        });

        return Math.min(score, 100); // Cap at 100
    }

    // Track form interactions
    logFormInteraction(formName, fieldName, interactionType, fieldValue = null) {
        this.logAction('form_interaction', {
            form_name: formName,
            field_name: fieldName,
            interaction_type: interactionType,
            field_value: fieldValue ? fieldValue.toString().substring(0, 50) : null, // Truncate for privacy
            form_progress: this.calculateFormProgress(formName)
        });
    }

    // Calculate form completion progress
    calculateFormProgress(formName) {
        const formInteractions = this.userActions.filter(
            action => action.data.form_name === formName
        );
        return Math.min(formInteractions.length * 10, 100);
    }

    // Track product interactions
    logProductInteraction(productId, productName, interactionType, additionalData = {}) {
        this.logAction('product_interaction', {
            product_id: productId,
            product_name: productName,
            interaction_type: interactionType,
            product_category: additionalData.category || 'Unknown',
            product_price: additionalData.price || 0,
            ...additionalData
        });
    }

    // Track UI component interactions
    logUIInteraction(componentType, componentName, interactionType, componentData = {}) {
        this.logAction('ui_interaction', {
            component_type: componentType,
            component_name: componentName,
            interaction_type: interactionType,
            component_data: componentData,
            ui_hierarchy: this.getUIHierarchy()
        });
    }

    // Get UI hierarchy for context
    getUIHierarchy() {
        return {
            page: window.location.pathname,
            section: this.getCurrentSection(),
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
    }

    // Get current page section
    getCurrentSection() {
        const path = window.location.pathname;
        if (path === '/') return 'home';
        if (path.includes('/items')) return 'products';
        if (path.includes('/contact')) return 'contact';
        if (path.includes('/about')) return 'about';
        if (path.includes('/invitation')) return 'invitations';
        return 'other';
    }

    // Track error events
    logError(errorType, errorMessage, errorContext = {}) {
        this.logAction('error_occurred', {
            error_type: errorType,
            error_message: errorMessage,
            error_context: errorContext,
            error_stack: errorContext.stack || null,
            user_actions_before_error: this.userActions.slice(-5) // Last 5 actions before error
        });
    }

    // Track performance metrics
    logPerformance(metricName, value, unit = 'ms', context = {}) {
        this.logAction('performance_metric', {
            metric_name: metricName,
            metric_value: value,
            metric_unit: unit,
            performance_context: context,
            page_load_time: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : null
        });
    }

    // Track user session events
    logSessionEvent(eventType, sessionData = {}) {
        this.logAction('session_event', {
            event_type: eventType,
            session_duration: Date.now() - this.sessionStartTime,
            page_views: this.userActions.filter(action => action.type === 'page_view').length,
            total_actions: this.userActions.length,
            engagement_score: this.calculateEngagementScore(),
            ...sessionData
        });
    }

    // Track conversion events
    logConversion(conversionType, conversionValue, conversionData = {}) {
        this.logAction('conversion', {
            conversion_type: conversionType,
            conversion_value: conversionValue,
            conversion_data: conversionData,
            conversion_path: this.getConversionPath(),
            time_to_conversion: Date.now() - this.sessionStartTime
        });
    }

    // Get conversion path (sequence of actions leading to conversion)
    getConversionPath() {
        return this.userActions
            .filter(action => ['page_view', 'product_view', 'add_to_cart', 'purchase'].includes(action.type))
            .map(action => action.type)
            .slice(-10); // Last 10 relevant actions
    }

    // Track user behavior patterns
    logBehaviorPattern(patternType, patternData = {}) {
        this.logAction('behavior_pattern', {
            pattern_type: patternType,
            pattern_data: patternData,
            user_behavior_summary: this.getUserBehaviorSummary()
        });
    }

    // Get user behavior summary
    getUserBehaviorSummary() {
        const actionCounts = {};
        this.userActions.forEach(action => {
            actionCounts[action.type] = (actionCounts[action.type] || 0) + 1;
        });

        return {
            total_actions: this.userActions.length,
            action_distribution: actionCounts,
            session_duration: Date.now() - this.sessionStartTime,
            pages_visited: [...new Set(this.userActions.map(action => action.pageUrl))].length,
            engagement_score: this.calculateEngagementScore()
        };
    }

    // Track A/B testing events
    logABTest(testName, variant, testData = {}) {
        this.logAction('ab_test', {
            test_name: testName,
            variant: variant,
            test_data: testData,
            test_context: {
                page: window.location.pathname,
                timestamp: Date.now()
            }
        });
    }

    // Track feature usage
    logFeatureUsage(featureName, usageType, featureData = {}) {
        this.logAction('feature_usage', {
            feature_name: featureName,
            usage_type: usageType,
            feature_data: featureData,
            feature_context: {
                page: window.location.pathname,
                user_agent: navigator.userAgent
            }
        });
    }

    // Track search behavior
    logSearchBehavior(searchTerm, searchResults, searchContext = {}) {
        this.logAction('search_behavior', {
            search_term: searchTerm,
            search_results_count: searchResults.length,
            search_context: searchContext,
            search_timestamp: Date.now(),
            search_session: this.getSearchSession()
        });
    }

    // Get search session data
    getSearchSession() {
        const searchActions = this.userActions.filter(action => action.type === 'search_behavior');
        return {
            total_searches: searchActions.length,
            search_terms: searchActions.map(action => action.data.search_term),
            search_success_rate: searchActions.filter(action => action.data.search_results_count > 0).length / searchActions.length || 0
        };
    }

    // Track mobile-specific interactions
    logMobileInteraction(interactionType, mobileData = {}) {
        this.logAction('mobile_interaction', {
            interaction_type: interactionType,
            mobile_data: mobileData,
            device_info: {
                user_agent: navigator.userAgent,
                screen_size: `${window.screen.width}x${window.screen.height}`,
                viewport_size: `${window.innerWidth}x${window.innerHeight}`,
                orientation: window.screen.orientation?.type || 'unknown'
            }
        });
    }

    // Track browser capabilities
    logBrowserCapabilities() {
        this.logAction('browser_capabilities', {
            user_agent: navigator.userAgent,
            language: navigator.language,
            languages: navigator.languages,
            platform: navigator.platform,
            cookie_enabled: navigator.cookieEnabled,
            on_line: navigator.onLine,
            hardware_concurrency: navigator.hardwareConcurrency,
            max_touch_points: navigator.maxTouchPoints,
            webgl_support: this.checkWebGLSupport(),
            webgl_version: this.getWebGLVersion(),
            canvas_support: this.checkCanvasSupport(),
            video_support: this.checkVideoSupport(),
            audio_support: this.checkAudioSupport(),
            geolocation_support: 'geolocation' in navigator,
            notification_support: 'Notification' in window,
            service_worker_support: 'serviceWorker' in navigator,
            push_support: 'PushManager' in window,
            storage_support: this.checkStorageSupport(),
            connection_info: this.getConnectionInfo()
        });
    }

    // Track page performance metrics
    logPagePerformance() {
        if (performance.timing) {
            const timing = performance.timing;
            const navigation = performance.getEntriesByType('navigation')[0];

            this.logAction('page_performance', {
                navigation_start: timing.navigationStart,
                dom_loading: timing.domLoading,
                dom_interactive: timing.domInteractive,
                dom_content_loaded: timing.domContentLoadedEventEnd,
                dom_complete: timing.domComplete,
                load_event_end: timing.loadEventEnd,
                first_paint: this.getFirstPaint(),
                first_contentful_paint: this.getFirstContentfulPaint(),
                largest_contentful_paint: this.getLargestContentfulPaint(),
                cumulative_layout_shift: this.getCumulativeLayoutShift(),
                first_input_delay: this.getFirstInputDelay(),
                total_blocking_time: this.getTotalBlockingTime(),
                navigation_type: navigation?.type || 'unknown',
                redirect_count: navigation?.redirectCount || 0,
                transfer_size: navigation?.transferSize || 0,
                encoded_body_size: navigation?.encodedBodySize || 0,
                decoded_body_size: navigation?.decodedBodySize || 0
            });
        }
    }

    // Track resource performance
    logResourcePerformance() {
        const resources = performance.getEntriesByType('resource');
        resources.forEach(resource => {
            this.logAction('resource_performance', {
                name: resource.name,
                entry_type: resource.entryType,
                start_time: resource.startTime,
                duration: resource.duration,
                initiator_type: resource.initiatorType,
                next_hop_protocol: resource.nextHopProtocol,
                transfer_size: resource.transferSize,
                encoded_body_size: resource.encodedBodySize,
                decoded_body_size: resource.decodedBodySize,
                response_end: resource.responseEnd,
                response_start: resource.responseStart,
                request_start: resource.requestStart,
                connect_start: resource.connectStart,
                connect_end: resource.connectEnd,
                domain_lookup_start: resource.domainLookupStart,
                domain_lookup_end: resource.domainLookupEnd
            });
        });
    }

    // Track memory usage
    logMemoryUsage() {
        if (performance.memory) {
            this.logAction('memory_usage', {
                used_js_heap_size: performance.memory.usedJSHeapSize,
                total_js_heap_size: performance.memory.totalJSHeapSize,
                js_heap_size_limit: performance.memory.jsHeapSizeLimit
            });
        }
    }

    // Track battery status
    logBatteryStatus() {
        if (navigator.getBattery) {
            navigator.getBattery().then(battery => {
                this.logAction('battery_status', {
                    charging: battery.charging,
                    charging_time: battery.chargingTime,
                    discharging_time: battery.dischargingTime,
                    level: battery.level
                });
            });
        }
    }

    // Track geolocation
    logGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.logAction('geolocation_success', {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        altitude_accuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                        timestamp: position.timestamp
                    });
                },
                error => {
                    this.logAction('geolocation_error', {
                        error_code: error.code,
                        error_message: error.message
                    });
                }
            );
        }
    }

    // Track device motion
    logDeviceMotion() {
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', (event) => {
                this.logAction('device_motion', {
                    acceleration: {
                        x: event.acceleration?.x,
                        y: event.acceleration?.y,
                        z: event.acceleration?.z
                    },
                    acceleration_including_gravity: {
                        x: event.accelerationIncludingGravity?.x,
                        y: event.accelerationIncludingGravity?.y,
                        z: event.accelerationIncludingGravity?.z
                    },
                    rotation_rate: {
                        alpha: event.rotationRate?.alpha,
                        beta: event.rotationRate?.beta,
                        gamma: event.rotationRate?.gamma
                    },
                    interval: event.interval
                });
            });
        }
    }

    // Track device orientation
    logDeviceOrientation() {
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (event) => {
                this.logAction('device_orientation', {
                    alpha: event.alpha,
                    beta: event.beta,
                    gamma: event.gamma,
                    absolute: event.absolute
                });
            });
        }
    }

    // Track visibility changes
    logVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            this.logAction('visibility_change', {
                hidden: document.hidden,
                visibility_state: document.visibilityState,
                timestamp: Date.now()
            });
        });
    }

    // Track focus changes
    logFocusChange() {
        window.addEventListener('focus', () => {
            this.logAction('window_focus', {
                timestamp: Date.now()
            });
        });

        window.addEventListener('blur', () => {
            this.logAction('window_blur', {
                timestamp: Date.now()
            });
        });
    }

    // Track page unload
    logPageUnload() {
        window.addEventListener('beforeunload', () => {
            this.logAction('page_unload', {
                session_duration: Date.now() - this.sessionStartTime,
                total_actions: this.userActions.length,
                engagement_score: this.calculateEngagementScore()
            });
        });
    }

    // Track errors globally
    logGlobalErrors() {
        window.addEventListener('error', (event) => {
            this.logAction('global_error', {
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error?.stack,
                timestamp: Date.now()
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.logAction('unhandled_rejection', {
                reason: event.reason,
                promise: event.promise,
                timestamp: Date.now()
            });
        });
    }

    // Helper methods for browser capabilities
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    }

    getWebGLVersion() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                return debugInfo ? {
                    vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                    renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
                } : null;
            }
        } catch (e) {
            return null;
        }
    }

    checkCanvasSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext && canvas.getContext('2d'));
        } catch (e) {
            return false;
        }
    }

    checkVideoSupport() {
        const video = document.createElement('video');
        return !!(video.canPlayType);
    }

    checkAudioSupport() {
        const audio = document.createElement('audio');
        return !!(audio.canPlayType);
    }

    checkStorageSupport() {
        try {
            return {
                localStorage: 'localStorage' in window,
                sessionStorage: 'sessionStorage' in window,
                indexedDB: 'indexedDB' in window,
                webSQL: 'openDatabase' in window
            };
        } catch (e) {
            return { localStorage: false, sessionStorage: false, indexedDB: false, webSQL: false };
        }
    }

    getConnectionInfo() {
        if (navigator.connection) {
            return {
                effective_type: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                save_data: navigator.connection.saveData
            };
        }
        return null;
    }

    getFirstPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
        return firstPaint ? firstPaint.startTime : null;
    }

    getFirstContentfulPaint() {
        const paintEntries = performance.getEntriesByType('paint');
        const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
        return firstContentfulPaint ? firstContentfulPaint.startTime : null;
    }

    getLargestContentfulPaint() {
        const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
        return lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : null;
    }

    getCumulativeLayoutShift() {
        const clsEntries = performance.getEntriesByType('layout-shift');
        return clsEntries.reduce((sum, entry) => sum + entry.value, 0);
    }

    getFirstInputDelay() {
        const fidEntries = performance.getEntriesByType('first-input');
        return fidEntries.length > 0 ? fidEntries[0].processingStart - fidEntries[0].startTime : null;
    }

    getTotalBlockingTime() {
        const longTasks = performance.getEntriesByType('longtask');
        return longTasks.reduce((sum, task) => sum + task.duration - 50, 0);
    }

    // Track accessibility interactions
    logAccessibilityInteraction(accessibilityType, accessibilityData = {}) {
        this.logAction('accessibility_interaction', {
            accessibility_type: accessibilityType,
            accessibility_data: accessibilityData,
            accessibility_context: {
                page: window.location.pathname,
                timestamp: Date.now()
            }
        });
    }

    // Get comprehensive analytics report
    getAnalyticsReport() {
        return {
            session_summary: {
                start_time: new Date(this.sessionStartTime).toISOString(),
                duration: Date.now() - this.sessionStartTime,
                total_actions: this.userActions.length,
                engagement_score: this.calculateEngagementScore()
            },
            user_behavior: this.getUserBehaviorSummary(),
            action_timeline: this.userActions,
            performance_metrics: this.userActions.filter(action => action.type === 'performance_metric'),
            error_events: this.userActions.filter(action => action.type === 'error_occurred'),
            conversion_events: this.userActions.filter(action => action.type === 'conversion')
        };
    }

    // Export analytics data
    exportAnalyticsData() {
        const report = this.getAnalyticsReport();
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-report-${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Clear session data
    clearSessionData() {
        this.userActions = [];
        this.engagementFactors = [];
        this.sessionStartTime = Date.now();
    }
}

// Create singleton instance
let analyticsLoggerInstance = null;

export const getAnalyticsLogger = () => {
    if (!analyticsLoggerInstance) {
        analyticsLoggerInstance = new AnalyticsLogger();
    }
    return analyticsLoggerInstance;
};

// Convenience functions for common tracking
export const logPageView = (pageName, pageData = {}) => {
    const logger = getAnalyticsLogger();
    logger.logAction('page_view', {
        page_name: pageName,
        page_data: pageData
    });
};

export const logButtonClick = (buttonName, buttonLocation, buttonData = {}) => {
    const logger = getAnalyticsLogger();
    logger.logUIInteraction('button', buttonName, 'click', {
        button_location: buttonLocation,
        ...buttonData
    });
};

export const logFormFieldFocus = (formName, fieldName, fieldType) => {
    const logger = getAnalyticsLogger();
    logger.logFormInteraction(formName, fieldName, 'focus', { field_type: fieldType });
};

export const logFormFieldChange = (formName, fieldName, fieldValue, fieldType) => {
    const logger = getAnalyticsLogger();
    logger.logFormInteraction(formName, fieldName, 'change', {
        field_type: fieldType,
        field_value: fieldValue
    });
};

export const logImageClick = (imageTitle, imageLocation, imageUrl) => {
    const logger = getAnalyticsLogger();
    logger.logAction('image_click', {
        image_title: imageTitle,
        image_location: imageLocation,
        image_url: imageUrl
    });
};

export const logLinkClick = (linkText, linkUrl, linkLocation) => {
    const logger = getAnalyticsLogger();
    logger.logAction('link_click', {
        link_text: linkText,
        link_url: linkUrl,
        link_location: linkLocation
    });
};

export const logVideoInteraction = (videoTitle, interactionType, videoData = {}) => {
    const logger = getAnalyticsLogger();
    logger.logAction('video_interaction', {
        video_title: videoTitle,
        interaction_type: interactionType,
        video_data: videoData
    });
};

export const logError = (errorType, errorMessage, errorContext = {}) => {
    const logger = getAnalyticsLogger();
    logger.logError(errorType, errorMessage, errorContext);
};

export const logPerformance = (metricName, value, unit = 'ms') => {
    const logger = getAnalyticsLogger();
    logger.logPerformance(metricName, value, unit);
};

export default AnalyticsLogger;
