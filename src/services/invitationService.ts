import { API_CONFIG, buildApiUrl, getAuthHeaders, API_STATUS, ERROR_MESSAGES } from '../config/api';

/**
 * Generic API request function (legacy - for backward compatibility)
 */
const apiRequest = async (url: string, options: any = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                ...getAuthHeaders(),
                ...options.headers,
            },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            return await response.text();
        }

        switch (response.status) {
            case API_STATUS.UNAUTHORIZED:
                localStorage.removeItem('userToken');
                window.location.href = '/login';
                throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
            case API_STATUS.NOT_FOUND:
                throw new Error(ERROR_MESSAGES.NOT_FOUND);
            case API_STATUS.BAD_REQUEST:
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || ERROR_MESSAGES.VALIDATION_ERROR);
            case API_STATUS.INTERNAL_SERVER_ERROR:
                throw new Error(ERROR_MESSAGES.SERVER_ERROR);
            default:
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error: any) {
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

/**
 * Invitation Service
 * Invitation-related API calls
 * Note: This service still uses legacy API methods until invitation endpoints are available in generated API
 */
export const invitationService = {
    create: (data: any) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.INVITATIONS.CREATE);
        return apiRequest(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    getByUser: (userId: string) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.INVITATIONS.GET_BY_USER, { userId });
        return apiRequest(url, { method: 'GET' });
    },
    update: (id: string, data: any) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.INVITATIONS.UPDATE, { id });
        return apiRequest(url, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    delete: (id: string) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.INVITATIONS.DELETE, { id });
        return apiRequest(url, { method: 'DELETE' });
    },
    getBySlug: (slug: string) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.INVITATIONS.GET_BY_SLUG, { slug });
        return apiRequest(url, { method: 'GET' });
    },
};

export default invitationService;

