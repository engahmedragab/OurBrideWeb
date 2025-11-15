/**
 * Facebook Pixel Optimizer
 * Prevents excessive requests to Facebook Pixel API
 */

class FacebookOptimizer {
    constructor() {
        this.eventQueue = [];
        this.lastFlushTime = 0;
        this.flushInterval = 5000; // 5 seconds
        this.maxQueueSize = 10;
        this.eventThrottle = new Map();
        this.isProcessing = false;

        // Throttle specific event types - only keeping used events
        this.eventThrottleTimes = {
            'PageView': 2000,              // 2 seconds
            'ViewContent': 3000,           // 3 seconds
            'AddToCart': 2000,             // 2 seconds
            'InitiateCheckout': 1000,      // 1 second
            'Purchase': 0,                 // No throttle for purchases
            'Search': 1000,                // 1 second
            'WhatsAppClick': 2000,         // 2 seconds
            'CompleteRegistration': 0,     // No throttle for registrations
            'Subscribe': 5000,             // 5 seconds
        };

        // Start the flush interval
        this.startFlushInterval();
    }

    /**
     * Check if an event should be throttled
     */
    shouldThrottle(eventType) {
        const throttleTime = this.eventThrottleTimes[eventType] || 1000;
        const now = Date.now();
        const lastEvent = this.eventThrottle.get(eventType) || 0;

        if (now - lastEvent < throttleTime) {
            return true;
        }

        this.eventThrottle.set(eventType, now);
        return false;
    }

    /**
     * Queue an event for batch processing
     */
    queueEvent(eventType, data) {
        // Don't queue if throttled
        if (this.shouldThrottle(eventType)) {
            return;
        }

        // Don't queue critical events (purchases, registrations)
        if (eventType === 'Purchase' || eventType === 'CompleteRegistration') {
            this.sendEventImmediately(eventType, data);
            return;
        }

        // Add to queue
        this.eventQueue.push({
            type: eventType,
            timestamp: Date.now(),
            data
        });

        // Flush if queue is full
        if (this.eventQueue.length >= this.maxQueueSize) {
            this.flushQueue();
        }
    }

    /**
     * Send event immediately (for critical events)
     */
    sendEventImmediately(eventType, data) {
        if (window.fbq) {
            try {
                if (eventType === 'PageView') {
                    window.fbq('track', 'PageView');
                } else if (eventType.startsWith('Custom') || eventType === 'WhatsAppClick') {
                    window.fbq('trackCustom', eventType, data);
                } else {
                    window.fbq('track', eventType, data);
                }
            } catch (error) {
                // Event failed silently
            }
        }
    }

    /**
     * Start the flush interval
     */
    startFlushInterval() {
        setInterval(() => {
            if (this.eventQueue.length > 0) {
                this.flushQueue();
            }
        }, this.flushInterval);
    }

    /**
     * Flush queued events
     */
    flushQueue() {
        if (this.isProcessing || this.eventQueue.length === 0) {
            return;
        }

        this.isProcessing = true;
        const eventsToProcess = [...this.eventQueue];
        this.eventQueue = [];
        this.lastFlushTime = Date.now();

        // Process events in batches
        this.processEventBatch(eventsToProcess);
    }

    /**
     * Process a batch of events
     */
    async processEventBatch(events) {
        try {
            // Group events by type to avoid duplicates
            const eventGroups = new Map();

            events.forEach(event => {
                if (!eventGroups.has(event.type)) {
                    eventGroups.set(event.type, []);
                }
                eventGroups.get(event.type).push(event);
            });

            // Send the most recent event of each type
            for (const [eventType, eventList] of eventGroups) {
                const latestEvent = eventList.reduce((latest, current) =>
                    current.timestamp > latest.timestamp ? current : latest
                );

                this.sendEventImmediately(eventType, latestEvent.data);

                // Small delay between events to prevent overwhelming the API
                await new Promise(resolve => setTimeout(resolve, 100));
            }

        } catch (error) {
            // Batch processing error handled silently
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Force flush all queued events
     */
    forceFlush() {
        this.flushQueue();
    }

    /**
     * Get queue status for debugging
     */
    getQueueStatus() {
        return {
            queueSize: this.eventQueue.length,
            isProcessing: this.isProcessing,
            lastFlush: this.lastFlushTime
        };
    }
}

// Create singleton instance
export const facebookOptimizer = new FacebookOptimizer();

// Export for debugging
export { FacebookOptimizer };

