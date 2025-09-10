// Auto Analytics Integration
// Automatically tracks all user interactions across the website

import { getAnalyticsLogger } from './analyticsLogger';
import { ANALYTICS_CONFIG } from '../config/analytics';

class AutoAnalytics {
    constructor() {
        this.logger = getAnalyticsLogger();
        this.isInitialized = false;
        this.trackedElements = new Set();
        this.sessionStartTime = Date.now();
    }

    // Initialize auto tracking
    initialize() {
        if (this.isInitialized) return;

        try {
            this.setupGlobalEventListeners();
            this.setupPageTracking();
            this.setupFormTracking();
            this.setupImageTracking();
            this.setupLinkTracking();
            this.setupVideoTracking();
            this.setupErrorTracking();
            this.setupPerformanceTracking();
            this.setupScrollTracking();
            this.setupResizeTracking();
            this.setupVisibilityTracking();
            this.setupKeyboardTracking();
            this.setupMouseTracking();
            this.setupComprehensiveTracking();

            this.isInitialized = true;
            this.logger.logAction('auto_analytics_initialized', {
                initialization_time: Date.now() - this.sessionStartTime,
                tracking_features: [
                    'page_tracking',
                    'form_tracking',
                    'image_tracking',
                    'link_tracking',
                    'video_tracking',
                    'error_tracking',
                    'performance_tracking',
                    'scroll_tracking',
                    'resize_tracking',
                    'visibility_tracking',
                    'keyboard_tracking',
                    'mouse_tracking'
                ]
            });

            if (ANALYTICS_CONFIG.DEBUG) {
            }
        } catch (error) {
            console.error('❌ Auto Analytics initialization failed:', error);
            this.logger.logError('auto_analytics_init_error', error.message, { error });
        }
    }

    // Setup global event listeners
    setupGlobalEventListeners() {
        // Track all clicks
        document.addEventListener('click', (event) => {
            this.trackClick(event);
        }, true);

        // Track all form submissions
        document.addEventListener('submit', (event) => {
            this.trackFormSubmit(event);
        }, true);

        // Track all input changes
        document.addEventListener('input', (event) => {
            this.trackInputChange(event);
        }, true);

        // Track all focus events
        document.addEventListener('focus', (event) => {
            this.trackFocus(event);
        }, true);

        // Track all blur events
        document.addEventListener('blur', (event) => {
            this.trackBlur(event);
        }, true);

        // Track all mouse events
        document.addEventListener('mousedown', (event) => {
            this.trackMouseEvent(event, 'mousedown');
        }, true);

        document.addEventListener('mouseup', (event) => {
            this.trackMouseEvent(event, 'mouseup');
        }, true);

        document.addEventListener('mouseover', (event) => {
            this.trackMouseEvent(event, 'mouseover');
        }, true);

        document.addEventListener('mouseout', (event) => {
            this.trackMouseEvent(event, 'mouseout');
        }, true);

        document.addEventListener('contextmenu', (event) => {
            this.trackMouseEvent(event, 'contextmenu');
        }, true);

        // Track all keyboard events
        document.addEventListener('keydown', (event) => {
            this.trackKeyboardEvent(event, 'keydown');
        }, true);

        document.addEventListener('keyup', (event) => {
            this.trackKeyboardEvent(event, 'keyup');
        }, true);

        document.addEventListener('keypress', (event) => {
            this.trackKeyboardEvent(event, 'keypress');
        }, true);

        // Track all touch events (mobile)
        document.addEventListener('touchstart', (event) => {
            this.trackTouchEvent(event, 'touchstart');
        }, true);

        document.addEventListener('touchend', (event) => {
            this.trackTouchEvent(event, 'touchend');
        }, true);

        document.addEventListener('touchmove', (event) => {
            this.trackTouchEvent(event, 'touchmove');
        }, true);

        // Track all drag events
        document.addEventListener('dragstart', (event) => {
            this.trackDragEvent(event, 'dragstart');
        }, true);

        document.addEventListener('dragend', (event) => {
            this.trackDragEvent(event, 'dragend');
        }, true);

        document.addEventListener('drop', (event) => {
            this.trackDragEvent(event, 'drop');
        }, true);

        // Track all selection events
        document.addEventListener('selectstart', (event) => {
            this.trackSelectionEvent(event, 'selectstart');
        }, true);

        document.addEventListener('selectionchange', (event) => {
            this.trackSelectionEvent(event, 'selectionchange');
        }, true);

        // Track all copy/paste events
        document.addEventListener('copy', (event) => {
            this.trackClipboardEvent(event, 'copy');
        }, true);

        document.addEventListener('paste', (event) => {
            this.trackClipboardEvent(event, 'paste');
        }, true);

        document.addEventListener('cut', (event) => {
            this.trackClipboardEvent(event, 'cut');
        }, true);

        // Track all wheel events
        document.addEventListener('wheel', (event) => {
            this.trackWheelEvent(event);
        }, true);

        // Track all resize events
        window.addEventListener('resize', (event) => {
            this.trackResizeEvent(event);
        }, true);

        // Track all orientation changes
        window.addEventListener('orientationchange', (event) => {
            this.trackOrientationChange(event);
        }, true);

        // Track all online/offline events
        window.addEventListener('online', (event) => {
            this.trackConnectionEvent(event, 'online');
        }, true);

        window.addEventListener('offline', (event) => {
            this.trackConnectionEvent(event, 'offline');
        }, true);

        // Track all beforeunload events
        window.addEventListener('beforeunload', (event) => {
            this.trackBeforeUnload(event);
        }, true);

        // Track all hashchange events
        window.addEventListener('hashchange', (event) => {
            this.trackHashChange(event);
        }, true);

        // Track all popstate events
        window.addEventListener('popstate', (event) => {
            this.trackPopState(event);
        }, true);
    }

    // Track click events
    trackClick(event) {
        const element = event.target;
        const elementData = this.getElementData(element);

        // Track different types of clicks
        if (element.tagName === 'BUTTON') {
            this.logger.logUIInteraction('button', elementData.text, 'click', {
                button_type: element.type || 'button',
                button_class: element.className,
                button_id: element.id
            });
        } else if (element.tagName === 'A') {
            this.logger.logAction('link_click', {
                link_text: elementData.text,
                link_url: element.href,
                link_location: elementData.location,
                is_external: this.isExternalLink(element.href)
            });
        } else if (element.tagName === 'IMG') {
            this.logger.logAction('image_click', {
                image_title: element.alt || element.title || 'Untitled',
                image_src: element.src,
                image_location: elementData.location
            });
        } else {
            this.logger.logPageInteraction('element_click', {
                element_tag: element.tagName.toLowerCase(),
                element_text: elementData.text,
                element_class: element.className,
                element_id: element.id
            });
        }
    }

    // Track form submissions
    trackFormSubmit(event) {
        const form = event.target;
        const formData = this.getFormData(form);

        this.logger.logAction('form_submission', {
            form_name: form.name || form.id || 'unnamed_form',
            form_data: formData,
            form_method: form.method || 'get',
            form_action: form.action || window.location.href
        });
    }

    // Track input changes
    trackInputChange(event) {
        const input = event.target;
        const form = input.closest('form');

        this.logger.logFormInteraction(
            form?.name || form?.id || 'unnamed_form',
            input.name || input.id || 'unnamed_field',
            'change',
            {
                field_type: input.type,
                field_value: input.value ? input.value.substring(0, 50) : null,
                field_required: input.required
            }
        );
    }

    // Track focus events
    trackFocus(event) {
        const element = event.target;
        const form = element.closest('form');

        if (form) {
            this.logger.logFormInteraction(
                form.name || form.id || 'unnamed_form',
                element.name || element.id || 'unnamed_field',
                'focus',
                { field_type: element.type }
            );
        }
    }

    // Track blur events
    trackBlur(event) {
        const element = event.target;
        const form = element.closest('form');

        if (form) {
            this.logger.logFormInteraction(
                form.name || form.id || 'unnamed_form',
                element.name || element.id || 'unnamed_field',
                'blur',
                { field_type: element.type }
            );
        }
    }

    // Setup page tracking
    setupPageTracking() {
        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.logger.logAction('page_visibility_change', {
                is_visible: !document.hidden,
                visibility_duration: Date.now() - this.sessionStartTime
            });
        });

        // Track beforeunload
        window.addEventListener('beforeunload', () => {
            this.logger.logSessionEvent('session_end', {
                session_duration: Date.now() - this.sessionStartTime,
                total_actions: this.logger.userActions.length
            });
        });
    }

    // Setup form tracking
    setupFormTracking() {
        // Track form field interactions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                // Track field focus
                input.addEventListener('focus', () => {
                    this.logger.logFormInteraction(
                        form.name || form.id || 'unnamed_form',
                        input.name || input.id || 'unnamed_field',
                        'focus',
                        { field_type: input.type }
                    );
                });

                // Track field blur
                input.addEventListener('blur', () => {
                    this.logger.logFormInteraction(
                        form.name || form.id || 'unnamed_form',
                        input.name || input.id || 'unnamed_field',
                        'blur',
                        { field_type: input.type }
                    );
                });
            });
        });
    }

    // Setup image tracking
    setupImageTracking() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Track image load
            img.addEventListener('load', () => {
                this.logger.logAction('image_load', {
                    image_src: img.src,
                    image_alt: img.alt,
                    image_title: img.title,
                    image_dimensions: `${img.naturalWidth}x${img.naturalHeight}`
                });
            });

            // Track image error
            img.addEventListener('error', () => {
                this.logger.logError('image_load_error', 'Failed to load image', {
                    image_src: img.src,
                    image_alt: img.alt
                });
            });
        });
    }

    // Setup link tracking
    setupLinkTracking() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (event) => {
                this.logger.logAction('link_click', {
                    link_text: link.textContent.trim(),
                    link_url: link.href,
                    link_location: this.getElementLocation(link),
                    is_external: this.isExternalLink(link.href),
                    link_target: link.target
                });
            });
        });
    }

    // Setup video tracking
    setupVideoTracking() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // Track video play
            video.addEventListener('play', () => {
                this.logger.logAction('video_play', {
                    video_src: video.src,
                    video_duration: video.duration,
                    video_current_time: video.currentTime
                });
            });

            // Track video pause
            video.addEventListener('pause', () => {
                this.logger.logAction('video_pause', {
                    video_src: video.src,
                    video_current_time: video.currentTime
                });
            });

            // Track video end
            video.addEventListener('ended', () => {
                this.logger.logAction('video_complete', {
                    video_src: video.src,
                    video_duration: video.duration
                });
            });

            // Track video progress
            video.addEventListener('timeupdate', () => {
                const progress = (video.currentTime / video.duration) * 100;
                if (progress % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                    this.logger.logAction('video_progress', {
                        video_src: video.src,
                        progress_percentage: progress,
                        current_time: video.currentTime
                    });
                }
            });
        });
    }

    // Setup error tracking
    setupErrorTracking() {
        // Track JavaScript errors
        window.addEventListener('error', (event) => {
            this.logger.logError('javascript_error', event.message, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error_stack: event.error?.stack
            });
        });

        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logger.logError('unhandled_promise_rejection', event.reason, {
                promise: event.promise,
                reason: event.reason
            });
        });
    }

    // Setup performance tracking
    setupPerformanceTracking() {
        // Track page load performance
        window.addEventListener('load', () => {
            if (performance.timing) {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;

                this.logger.logPerformance('page_load_time', loadTime, 'ms', {
                    dom_content_loaded: timing.domContentLoadedEventEnd - timing.navigationStart,
                    first_paint: performance.getEntriesByType('paint')[0]?.startTime || 0,
                    first_contentful_paint: performance.getEntriesByType('paint')[1]?.startTime || 0
                });
            }
        });

        // Track resource loading performance
        if (performance.getEntriesByType) {
            const resources = performance.getEntriesByType('resource');
            resources.forEach(resource => {
                this.logger.logPerformance('resource_load_time', resource.duration, 'ms', {
                    resource_name: resource.name,
                    resource_type: resource.initiatorType,
                    resource_size: resource.transferSize
                });
            });
        }
    }

    // Setup scroll tracking
    setupScrollTracking() {
        let scrollTimeout;
        let lastScrollTime = 0;

        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPercentage = Math.round(
                    (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
                );

                // Track scroll milestones
                ANALYTICS_CONFIG.EVENTS.SCROLL_THRESHOLDS.forEach(threshold => {
                    if (scrollPercentage >= threshold && lastScrollTime < threshold) {
                        this.logger.logAction('scroll_depth', {
                            scroll_percentage: threshold,
                            scroll_position: window.scrollY,
                            page_height: document.documentElement.scrollHeight
                        });
                        lastScrollTime = threshold;
                    }
                });
            }, 100);
        });
    }

    // Setup resize tracking
    setupResizeTracking() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.logger.logAction('window_resize', {
                    window_width: window.innerWidth,
                    window_height: window.innerHeight,
                    screen_width: window.screen.width,
                    screen_height: window.screen.height
                });
            }, 250);
        });
    }

    // Setup visibility tracking
    setupVisibilityTracking() {
        document.addEventListener('visibilitychange', () => {
            this.logger.logAction('page_visibility_change', {
                is_visible: !document.hidden,
                visibility_duration: Date.now() - this.sessionStartTime
            });
        });
    }

    // Setup keyboard tracking
    setupKeyboardTracking() {
        document.addEventListener('keydown', (event) => {
            // Track special key combinations
            if (event.ctrlKey || event.altKey || event.metaKey) {
                this.logger.logAction('keyboard_shortcut', {
                    key: event.key,
                    ctrl_key: event.ctrlKey,
                    alt_key: event.altKey,
                    meta_key: event.metaKey,
                    shift_key: event.shiftKey
                });
            }
        });
    }

    // Setup mouse tracking
    setupMouseTracking() {
        let mouseMoveCount = 0;
        let lastMouseMoveTime = 0;

        document.addEventListener('mousemove', () => {
            mouseMoveCount++;
            const now = Date.now();

            // Track mouse movement every 5 seconds
            if (now - lastMouseMoveTime > 5000) {
                this.logger.logAction('mouse_movement', {
                    movement_count: mouseMoveCount,
                    time_since_last_move: now - lastMouseMoveTime
                });
                lastMouseMoveTime = now;
                mouseMoveCount = 0;
            }
        });
    }

    // Setup comprehensive tracking
    setupComprehensiveTracking() {
        // Track browser capabilities on load
        window.addEventListener('load', () => {
            this.logger.logBrowserCapabilities();
            this.logger.logPagePerformance();
            this.logger.logResourcePerformance();
            this.logger.logMemoryUsage();
            this.logger.logBatteryStatus();
        });

        // Track device capabilities
        this.logger.logDeviceMotion();
        this.logger.logDeviceOrientation();
        this.logger.logGeolocation();

        // Track visibility and focus changes
        this.logger.logVisibilityChange();
        this.logger.logFocusChange();
        this.logger.logPageUnload();

        // Track global errors
        this.logger.logGlobalErrors();

        // Track periodic performance metrics
        setInterval(() => {
            this.logger.logMemoryUsage();
        }, 30000); // Every 30 seconds

        // Track user engagement periodically
        setInterval(() => {
            const engagementScore = this.logger.calculateEngagementScore();
            if (engagementScore > 0) {
                this.logger.logEngagement('periodic_engagement', {
                    score: engagementScore,
                    session_duration: Date.now() - this.sessionStartTime
                });
            }
        }, 60000); // Every minute

        // Track page visibility changes with detailed metrics
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.logger.logAction('page_hidden', {
                    hidden_duration: Date.now() - this.sessionStartTime,
                    total_actions: this.logger.userActions.length
                });
            } else {
                this.logger.logAction('page_visible', {
                    visible_duration: Date.now() - this.sessionStartTime,
                    total_actions: this.logger.userActions.length
                });
            }
        });

        // Track window focus/blur with context
        window.addEventListener('focus', () => {
            this.logger.logAction('window_focus', {
                focus_time: Date.now(),
                session_duration: Date.now() - this.sessionStartTime,
                total_actions: this.logger.userActions.length
            });
        });

        window.addEventListener('blur', () => {
            this.logger.logAction('window_blur', {
                blur_time: Date.now(),
                session_duration: Date.now() - this.sessionStartTime,
                total_actions: this.logger.userActions.length
            });
        });

        // Track network status changes
        window.addEventListener('online', () => {
            this.logger.logAction('network_online', {
                online_time: Date.now(),
                connection_type: navigator.connection?.effectiveType || 'unknown'
            });
        });

        window.addEventListener('offline', () => {
            this.logger.logAction('network_offline', {
                offline_time: Date.now(),
                connection_type: navigator.connection?.effectiveType || 'unknown'
            });
        });

        // Track page unload with comprehensive data
        window.addEventListener('beforeunload', () => {
            this.logger.logAction('page_unload', {
                session_duration: Date.now() - this.sessionStartTime,
                total_actions: this.logger.userActions.length,
                engagement_score: this.logger.calculateEngagementScore(),
                pages_visited: [...new Set(this.logger.userActions.map(action => action.pageUrl))].length,
                user_behavior_summary: this.logger.getUserBehaviorSummary()
            });
        });

        // Track hash changes (SPA navigation)
        window.addEventListener('hashchange', (event) => {
            this.logger.logAction('hash_change', {
                old_url: event.oldURL,
                new_url: event.newURL,
                hash: window.location.hash,
                pathname: window.location.pathname
            });
        });

        // Track popstate events (browser back/forward)
        window.addEventListener('popstate', (event) => {
            this.logger.logAction('popstate', {
                state: event.state,
                url: window.location.href,
                pathname: window.location.pathname,
                search: window.location.search
            });
        });

        // Track orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.logger.logAction('orientation_change', {
                    orientation: window.screen.orientation?.type || 'unknown',
                    angle: window.screen.orientation?.angle || 0,
                    window_width: window.innerWidth,
                    window_height: window.innerHeight,
                    screen_width: window.screen.width,
                    screen_height: window.screen.height
                });
            }, 100);
        });

        // Track resize events with throttling
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.logger.logAction('window_resize', {
                    window_width: window.innerWidth,
                    window_height: window.innerHeight,
                    screen_width: window.screen.width,
                    screen_height: window.screen.height,
                    device_pixel_ratio: window.devicePixelRatio,
                    orientation: window.screen.orientation?.type || 'unknown'
                });
            }, 250);
        });

        // Track scroll events with throttling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercentage = Math.round((scrollTop / scrollHeight) * 100);

                this.logger.logAction('scroll_position', {
                    scroll_top: scrollTop,
                    scroll_percentage: scrollPercentage,
                    scroll_height: scrollHeight,
                    window_height: window.innerHeight
                });
            }, 100);
        });

        // Track wheel events with throttling
        let wheelTimeout;
        document.addEventListener('wheel', (event) => {
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                this.logger.logAction('wheel_scroll', {
                    delta_x: event.deltaX,
                    delta_y: event.deltaY,
                    delta_z: event.deltaZ,
                    delta_mode: event.deltaMode,
                    ctrl_key: event.ctrlKey,
                    shift_key: event.shiftKey,
                    alt_key: event.altKey,
                    meta_key: event.metaKey
                });
            }, 50);
        });

        // Track selection changes
        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();
            if (selection.toString().length > 0) {
                this.logger.logAction('text_selection', {
                    selected_text: selection.toString().substring(0, 100),
                    selection_length: selection.toString().length,
                    range_count: selection.rangeCount,
                    is_collapsed: selection.isCollapsed
                });
            }
        });

        // Track copy/paste events
        document.addEventListener('copy', (event) => {
            this.logger.logAction('copy_action', {
                clipboard_types: event.clipboardData ? Array.from(event.clipboardData.types) : null,
                clipboard_files: event.clipboardData ? event.clipboardData.files.length : 0
            });
        });

        document.addEventListener('paste', (event) => {
            this.logger.logAction('paste_action', {
                clipboard_types: event.clipboardData ? Array.from(event.clipboardData.types) : null,
                clipboard_files: event.clipboardData ? event.clipboardData.files.length : 0
            });
        });

        document.addEventListener('cut', (event) => {
            this.logger.logAction('cut_action', {
                clipboard_types: event.clipboardData ? Array.from(event.clipboardData.types) : null,
                clipboard_files: event.clipboardData ? event.clipboardData.files.length : 0
            });
        });

        // Track drag and drop events
        document.addEventListener('dragstart', (event) => {
            this.logger.logAction('drag_start', {
                element_tag: event.target.tagName.toLowerCase(),
                element_class: event.target.className,
                element_id: event.target.id,
                data_transfer_types: Array.from(event.dataTransfer.types),
                data_transfer_files: event.dataTransfer.files.length
            });
        });

        document.addEventListener('drop', (event) => {
            this.logger.logAction('drop_action', {
                element_tag: event.target.tagName.toLowerCase(),
                element_class: event.target.className,
                element_id: event.target.id,
                data_transfer_types: Array.from(event.dataTransfer.types),
                data_transfer_files: event.dataTransfer.files.length
            });
        });

        // Track touch events (mobile)
        document.addEventListener('touchstart', (event) => {
            this.logger.logAction('touch_start', {
                touch_count: event.touches.length,
                changed_touches: event.changedTouches.length,
                element_tag: event.target.tagName.toLowerCase()
            });
        });

        document.addEventListener('touchend', (event) => {
            this.logger.logAction('touch_end', {
                touch_count: event.touches.length,
                changed_touches: event.changedTouches.length,
                element_tag: event.target.tagName.toLowerCase()
            });
        });

        // Track context menu events
        document.addEventListener('contextmenu', (event) => {
            this.logger.logAction('context_menu', {
                element_tag: event.target.tagName.toLowerCase(),
                element_class: event.target.className,
                element_id: event.target.id,
                mouse_x: event.clientX,
                mouse_y: event.clientY
            });
        });

        // Track fullscreen changes
        document.addEventListener('fullscreenchange', () => {
            this.logger.logAction('fullscreen_change', {
                is_fullscreen: !!document.fullscreenElement,
                element: document.fullscreenElement?.tagName.toLowerCase()
            });
        });

        // Track print events
        window.addEventListener('beforeprint', () => {
            this.logger.logAction('print_start', {
                print_time: Date.now(),
                page_url: window.location.href
            });
        });

        window.addEventListener('afterprint', () => {
            this.logger.logAction('print_end', {
                print_time: Date.now(),
                page_url: window.location.href
            });
        });
    }

    // Track mouse events
    trackMouseEvent(event, eventType) {
        try {
            const element = event.target;
            const elementData = this.getElementData(element);

            this.logger.logAction('mouse_event', {
                event_type: eventType,
                element_data: elementData,
                mouse_position: {
                    x: event.clientX || 0,
                    y: event.clientY || 0
                },
                mouse_buttons: event.buttons || 0,
                ctrl_key: event.ctrlKey || false,
                shift_key: event.shiftKey || false,
                alt_key: event.altKey || false,
                meta_key: event.metaKey || false
            });
        } catch (error) {
            console.warn('Mouse event tracking failed:', error);
        }
    }

    // Track keyboard events
    trackKeyboardEvent(event, eventType) {
        const element = event.target;
        const elementData = this.getElementData(element);

        this.logger.logAction('keyboard_event', {
            event_type: eventType,
            key: event.key,
            code: event.code,
            key_code: event.keyCode,
            char_code: event.charCode,
            element_data: elementData,
            ctrl_key: event.ctrlKey,
            shift_key: event.shiftKey,
            alt_key: event.altKey,
            meta_key: event.metaKey,
            repeat: event.repeat
        });
    }

    // Track touch events
    trackTouchEvent(event, eventType) {
        const element = event.target;
        const elementData = this.getElementData(element);

        this.logger.logAction('touch_event', {
            event_type: eventType,
            element_data: elementData,
            touch_count: event.touches.length,
            touches: Array.from(event.touches).map(touch => ({
                x: touch.clientX,
                y: touch.clientY,
                identifier: touch.identifier
            })),
            changed_touches: Array.from(event.changedTouches).map(touch => ({
                x: touch.clientX,
                y: touch.clientY,
                identifier: touch.identifier
            }))
        });
    }

    // Track drag events
    trackDragEvent(event, eventType) {
        const element = event.target;
        const elementData = this.getElementData(element);

        this.logger.logAction('drag_event', {
            event_type: eventType,
            element_data: elementData,
            data_transfer: event.dataTransfer ? {
                types: Array.from(event.dataTransfer.types),
                files: event.dataTransfer.files.length,
                items: event.dataTransfer.items.length
            } : null
        });
    }

    // Track selection events
    trackSelectionEvent(event, eventType) {
        try {
            const selection = window.getSelection();
            const element = event.target;
            const elementData = this.getElementData(element);

            this.logger.logAction('selection_event', {
                event_type: eventType,
                element_data: elementData,
                selection_text: selection ? selection.toString().substring(0, 100) : '',
                selection_length: selection ? selection.toString().length : 0,
                selection_range_count: selection ? selection.rangeCount : 0,
                is_collapsed: selection ? selection.isCollapsed : true
            });
        } catch (error) {
            console.warn('Selection event tracking failed:', error);
        }
    }

    // Track clipboard events
    trackClipboardEvent(event, eventType) {
        const element = event.target;
        const elementData = this.getElementData(element);

        this.logger.logAction('clipboard_event', {
            event_type: eventType,
            element_data: elementData,
            clipboard_types: event.clipboardData ? Array.from(event.clipboardData.types) : null,
            clipboard_files: event.clipboardData ? event.clipboardData.files.length : 0
        });
    }

    // Track wheel events
    trackWheelEvent(event) {
        const element = event.target;
        const elementData = this.getElementData(element);

        this.logger.logAction('wheel_event', {
            element_data: elementData,
            delta_x: event.deltaX,
            delta_y: event.deltaY,
            delta_z: event.deltaZ,
            delta_mode: event.deltaMode,
            ctrl_key: event.ctrlKey,
            shift_key: event.shiftKey,
            alt_key: event.altKey,
            meta_key: event.metaKey
        });
    }

    // Track resize events
    trackResizeEvent(event) {
        this.logger.logAction('window_resize', {
            window_width: window.innerWidth,
            window_height: window.innerHeight,
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            device_pixel_ratio: window.devicePixelRatio
        });
    }

    // Track orientation change
    trackOrientationChange(event) {
        this.logger.logAction('orientation_change', {
            orientation: window.screen.orientation?.type || 'unknown',
            angle: window.screen.orientation?.angle || 0,
            window_width: window.innerWidth,
            window_height: window.innerHeight
        });
    }

    // Track connection events
    trackConnectionEvent(event, eventType) {
        this.logger.logAction('connection_event', {
            event_type: eventType,
            online_status: navigator.onLine,
            connection_type: navigator.connection?.effectiveType || 'unknown',
            downlink: navigator.connection?.downlink || 0,
            rtt: navigator.connection?.rtt || 0
        });
    }

    // Track before unload
    trackBeforeUnload(event) {
        this.logger.logAction('before_unload', {
            session_duration: Date.now() - this.sessionStartTime,
            total_actions: this.logger.userActions.length,
            return_value: event.returnValue
        });
    }

    // Track hash change
    trackHashChange(event) {
        this.logger.logAction('hash_change', {
            old_url: event.oldURL,
            new_url: event.newURL,
            hash: window.location.hash
        });
    }

    // Track pop state
    trackPopState(event) {
        this.logger.logAction('pop_state', {
            state: event.state,
            url: window.location.href,
            pathname: window.location.pathname
        });
    }

    // Helper methods
    getElementData(element) {
        if (!element) {
            return {
                tag: 'unknown',
                text: '',
                className: '',
                id: '',
                location: 'unknown'
            };
        }

        return {
            tag: element.tagName ? element.tagName.toLowerCase() : 'unknown',
            text: element.textContent?.trim().substring(0, 100) || '',
            className: element.className || '',
            id: element.id || '',
            location: this.getElementLocation(element)
        };
    }

    getElementLocation(element) {
        if (!element || typeof element.getBoundingClientRect !== 'function') {
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
        }

        try {
            const rect = element.getBoundingClientRect();
            return {
                x: Math.round(rect.left),
                y: Math.round(rect.top),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
            };
        } catch (error) {
            return {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
        }
    }

    isExternalLink(url) {
        try {
            const link = new URL(url);
            return link.hostname !== window.location.hostname;
        } catch {
            return false;
        }
    }

    getFormData(form) {
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value.toString().substring(0, 100); // Truncate for privacy
        }

        return data;
    }

    // Get analytics report
    getReport() {
        return this.logger.getAnalyticsReport();
    }

    // Export analytics data
    exportData() {
        this.logger.exportAnalyticsData();
    }
}

// Create singleton instance
let autoAnalyticsInstance = null;

export const initializeAutoAnalytics = () => {
    if (!autoAnalyticsInstance) {
        autoAnalyticsInstance = new AutoAnalytics();
        autoAnalyticsInstance.initialize();
    }
    return autoAnalyticsInstance;
};

export const getAutoAnalytics = () => {
    return autoAnalyticsInstance;
};

export default AutoAnalytics;
