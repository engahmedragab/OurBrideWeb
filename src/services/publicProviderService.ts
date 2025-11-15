import { API_CONFIG, buildApiUrl, API_STATUS, ERROR_MESSAGES } from '../config/api';

// Public API request function (no authentication required)
const publicApiRequest = async (url, options = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                ...API_CONFIG.DEFAULT_HEADERS,
                ...options.headers,
            },
        });

        clearTimeout(timeoutId);

        // Handle different response statuses
        if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            return await response.text();
        }

        // Handle specific error statuses
        switch (response.status) {
            case API_STATUS.NOT_FOUND:
                const notFoundData = await response.json().catch(() => ({}));
                throw new Error(notFoundData.message || ERROR_MESSAGES.NOT_FOUND);

            case API_STATUS.BAD_REQUEST:
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || ERROR_MESSAGES.VALIDATION_ERROR);

            case API_STATUS.INTERNAL_SERVER_ERROR:
                throw new Error(ERROR_MESSAGES.SERVER_ERROR);

            default:
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
        }

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
        }

        throw error;
    }
};

// Public Provider API Service (no authentication required)
export const publicProviderService = {
    // Get public profile by provider ID
    getProfileById: async (providerId) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.PUBLIC_PROVIDERS.GET_BY_ID, { providerId });
        const response = await publicApiRequest(url, { method: 'GET' });
        return response.data || response;
    },

    // Get public profile by unique code
    getProfileByCode: async (uniqueCode) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.PUBLIC_PROVIDERS.GET_BY_CODE, { uniqueCode });
        const response = await publicApiRequest(url, { method: 'GET' });
        return response.data || response;
    },

    // Get public profile by slug
    getProfileBySlug: async (slug) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.PUBLIC_PROVIDERS.GET_BY_SLUG, { slug });
        const response = await publicApiRequest(url, { method: 'GET' });
        return response.data || response;
    },

    // Get public product store
    getStore: async (providerId, page = 1, pageSize = 20) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.PUBLIC_PROVIDERS.GET_STORE, { providerId });
        const queryParams = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
        const fullUrl = `${url}?${queryParams.toString()}`;
        const response = await publicApiRequest(fullUrl, { method: 'GET' });
        return response.data || response;
    },
};

export default publicProviderService;


