// Mock Server-side Analytics Utilities
// These are placeholder functions that don't perform actual server-side tracking

/**
 * Mock function for server-side page view tracking
 * @param {string} pageUrl - Page URL
 * @param {string} pageTitle - Page title
 * @param {Object} additionalData - Additional tracking data
 * @returns {Promise<Object>} - Mock response
 */
export const trackServerPageView = async (pageUrl, pageTitle, additionalData = {}) => {
    return Promise.resolve({ status: 'success', event: 'page_view', data: { pageUrl, pageTitle } });
};

/**
 * Mock function for server-side view content tracking
 * @param {Object} product - Product data
 * @param {string} pageUrl - Current page URL
 * @param {Object} additionalData - Additional tracking data
 * @returns {Promise<Object>} - Mock response
 */
export const trackServerViewContent = async (product, pageUrl, additionalData = {}) => {
    return Promise.resolve({ status: 'success', event: 'view_content', data: { product, pageUrl } });
};

/**
 * Mock function for server-side add to cart tracking
 * @param {Object} product - Product data
 * @param {string} pageUrl - Current page URL
 * @param {Object} additionalData - Additional tracking data
 * @returns {Promise<Object>} - Mock response
 */
export const trackServerAddToCart = async (product, pageUrl, additionalData = {}) => {
    return Promise.resolve({ status: 'success', event: 'add_to_cart', data: { product, pageUrl } });
};

/**
 * Mock function for server-side purchase tracking
 * @param {Array} items - Array of purchased items
 * @param {number} totalValue - Total purchase value
 * @param {string} pageUrl - Current page URL
 * @param {string} transactionId - Transaction ID
 * @param {Object} additionalData - Additional tracking data
 * @returns {Promise<Object>} - Mock response
 */
export const trackServerPurchase = async (items, totalValue, pageUrl, transactionId, additionalData = {}) => {
    return Promise.resolve({ status: 'success', event: 'purchase', data: { items, totalValue, transactionId } });
};

export default {
    trackServerPageView,
    trackServerViewContent,
    trackServerAddToCart,
    trackServerPurchase
};
