// Content ID Utilities for Analytics
// Ensures consistent content IDs across all analytics platforms

import { ANALYTICS_CONFIG } from '../config/analytics';

/**
 * Generate a consistent content ID for analytics tracking
 * @param {string|number} productId - The product ID
 * @param {string} prefix - Optional prefix (defaults to config prefix)
 * @returns {string} - Consistent content ID
 */
export const generateContentId = (productId, prefix = null) => {
    if (!productId) {
        return null;
    }

    const idPrefix = prefix || ANALYTICS_CONFIG.CONTENT_ID.PREFIX;
    const cleanId = String(productId).replace(/[^a-zA-Z0-9_-]/g, '_');

    return `${idPrefix}${cleanId}`;
};

/**
 * Transform product data for analytics with consistent content IDs
 * @param {Object} product - Product data object
 * @returns {Object} - Transformed product data for analytics
 */
export const transformProductForAnalytics = (product) => {
    if (!product) {
        return null;
    }

    const contentId = generateContentId(product.id);

    return {
        // GA4 format
        item_id: String(product.id),
        item_name: product.name || 'Unknown Product',
        item_category: product.category || 'General',
        item_brand: product.brand || 'OurBride',
        item_variant: product.variant || 'default',
        price: Number(product.price) || 0,
        quantity: Number(product.quantity) || 1,
        currency: product.currency || ANALYTICS_CONFIG.DEFAULT_CURRENCY,

        // Meta Pixel format
        content_id: contentId,
        content_name: product.name || 'Unknown Product',
        content_type: 'product',
        content_category: product.category || 'General',

        // TikTok Pixel format (same as Meta for consistency)
        content_id_tiktok: contentId,
        content_name_tiktok: product.name || 'Unknown Product',
        content_type_tiktok: 'product',
        content_category_tiktok: product.category || 'General',
    };
};

/**
 * Transform cart data for analytics
 * @param {Array} items - Array of cart items
 * @param {number} totalValue - Total cart value
 * @param {string} currency - Currency code
 * @returns {Object} - Transformed cart data for analytics
 */
export const transformCartForAnalytics = (items, totalValue, currency = ANALYTICS_CONFIG.DEFAULT_CURRENCY) => {
    if (!items || !Array.isArray(items)) {
        return null;
    }

    const transformedItems = items.map(item => transformProductForAnalytics(item));

    return {
        value: Number(totalValue) || 0,
        currency: currency,
        items: transformedItems,
        num_items: items.length,
        content_ids: transformedItems.map(item => item.content_id),
    };
};

/**
 * Transform purchase data for analytics
 * @param {Object} purchaseData - Purchase data object
 * @returns {Object} - Transformed purchase data for analytics
 */
export const transformPurchaseForAnalytics = (purchaseData) => {
    if (!purchaseData) {
        return null;
    }

    const transformedItems = purchaseData.items.map(item => transformProductForAnalytics(item));

    return {
        transaction_id: purchaseData.transaction_id || `txn_${Date.now()}`,
        value: Number(purchaseData.value) || 0,
        currency: purchaseData.currency || ANALYTICS_CONFIG.DEFAULT_CURRENCY,
        tax: Number(purchaseData.tax) || 0,
        shipping: Number(purchaseData.shipping) || 0,
        coupon: purchaseData.coupon || null,
        items: transformedItems,
        num_items: purchaseData.items.length,
        content_ids: transformedItems.map(item => item.content_id),
    };
};

/**
 * Log content ID issues in development mode
 * @param {Object} product - Product data
 * @param {string} context - Context where the issue occurred
 */
export const logContentIdIssue = (product, context) => {
    if (!ANALYTICS_CONFIG.DEBUG) return;

    const issues = [];

    if (!product) {
        issues.push('Product is null or undefined');
    } else {
        if (!product.id) {
            issues.push('Product ID is missing');
        }
        if (!product.name) {
            issues.push('Product name is missing');
        }
        if (!product.price || product.price <= 0) {
            issues.push('Product price is missing or invalid');
        }
    }

    if (issues.length > 0) {
        // Content ID issues detected silently
    }
};

/**
 * Generate event ID for TikTok tracking
 * @returns {string} - Unique event ID
 */
export const generateEventId = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Sanitize string for analytics (remove special characters)
 * @param {string} str - String to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeForAnalytics = (str) => {
    if (!str) return '';
    return String(str).replace(/[^a-zA-Z0-9\s\-_]/g, '').trim();
};

/**
 * Validate product data for analytics
 * @param {Object} product - Product data to validate
 * @returns {Object} - Validation result
 */
export const validateProductData = (product) => {
    const errors = [];
    const warnings = [];

    if (!product) {
        errors.push('Product data is required');
        return { isValid: false, errors, warnings };
    }

    if (!product.id) {
        errors.push('Product ID is required');
    }

    if (!product.name) {
        errors.push('Product name is required');
    }

    if (!product.price || product.price <= 0) {
        errors.push('Product price must be greater than 0');
    }

    if (!product.category) {
        warnings.push('Product category is recommended');
    }

    if (!product.brand) {
        warnings.push('Product brand is recommended');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings
    };
};

/**
 * Get consistent content ID for different platforms
 * @param {string|number} productId - Product ID
 * @param {string} platform - Platform ('ga4', 'meta', 'tiktok')
 * @returns {string} - Platform-specific content ID
 */
export const getPlatformContentId = (productId, platform = 'meta') => {
    const baseId = generateContentId(productId);

    switch (platform) {
        case 'ga4':
            return String(productId); // GA4 uses original ID
        case 'meta':
        case 'tiktok':
            return baseId; // Meta and TikTok use prefixed ID
        default:
            return baseId;
    }
};

/**
 * Create product data from minimal input
 * @param {string|number} id - Product ID
 * @param {string} name - Product name
 * @param {number} price - Product price
 * @param {Object} additionalData - Additional product data
 * @returns {Object} - Complete product data object
 */
export const createProductData = (id, name, price, additionalData = {}) => {
    return {
        id,
        name,
        price,
        category: additionalData.category || 'General',
        brand: additionalData.brand || 'OurBride',
        variant: additionalData.variant || 'default',
        quantity: additionalData.quantity || 1,
        currency: additionalData.currency || ANALYTICS_CONFIG.DEFAULT_CURRENCY,
        ...additionalData
    };
};

export default {
    generateContentId,
    transformProductForAnalytics,
    transformCartForAnalytics,
    transformPurchaseForAnalytics,
    logContentIdIssue,
    generateEventId,
    sanitizeForAnalytics,
    validateProductData,
    getPlatformContentId,
    createProductData
};
