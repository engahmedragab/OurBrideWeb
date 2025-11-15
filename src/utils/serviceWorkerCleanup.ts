/**
 * Service Worker Cleanup Utility
 * Unregisters any existing service workers and clears caches
 * to prevent stale asset issues
 */

export const unregisterServiceWorkers = async () => {
    if ('serviceWorker' in navigator) {
        try {
            // Get all service worker registrations
            const registrations = await navigator.serviceWorker.getRegistrations();

            // Unregister each service worker
            for (let registration of registrations) {
                const unregistered = await registration.unregister();
                if (unregistered) {
                    // Service worker unregistered successfully
                }
            }

            // Also try to get the controller and unregister it
            if (navigator.serviceWorker.controller) {
                try {
                    await navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
                } catch (e) {
                    // Could not send message to controller
                }
            }
        } catch (error) {
            // Error unregistering service workers handled silently
        }
    }
};

export const clearAllCaches = async () => {
    if ('caches' in window) {
        try {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        } catch (error) {
            // Error clearing caches handled silently
        }
    }
};

// Force reload if service worker was active
export const handleServiceWorkerReload = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        // If there's an active service worker, reload to ensure fresh assets
        const shouldReload = sessionStorage.getItem('sw-reload-attempted');
        if (!shouldReload) {
            sessionStorage.setItem('sw-reload-attempted', 'true');
            setTimeout(() => {
                window.location.reload();
            }, 100);
            return true;
        } else {
            // Clear the flag after reload
            sessionStorage.removeItem('sw-reload-attempted');
        }
    }
    return false;
};

// Main cleanup function that runs on every page load
export const performCleanup = async () => {
    // First, unregister all service workers
    await unregisterServiceWorkers();

    // Then, clear all caches
    await clearAllCaches();

    // Check if we need to reload due to active service worker
    const reloaded = handleServiceWorkerReload();

    return !reloaded; // Return false if reload is needed
};

// Run cleanup immediately when module loads
if (typeof window !== 'undefined') {
    // Run cleanup asynchronously to not block page load
    performCleanup().catch(() => {
        // Cleanup failed, continue anyway
    });
}

