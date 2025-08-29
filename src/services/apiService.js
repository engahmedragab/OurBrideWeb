import API_CONFIG, { buildApiUrl, getAuthHeaders, API_STATUS, ERROR_MESSAGES } from '../config/api.js';

// Generic API request function
const apiRequest = async (url, options = {}) => {
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
            case API_STATUS.UNAUTHORIZED:
                // Clear token and redirect to login
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

// HTTP Methods
export const apiService = {
    // GET request
    get: async (endpoint, params = {}) => {
        const url = buildApiUrl(endpoint, params);
        return apiRequest(url, { method: 'GET' });
    },

    // POST request
    post: async (endpoint, data = {}, params = {}) => {
        const url = buildApiUrl(endpoint, params);
        return apiRequest(url, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    // PUT request
    put: async (endpoint, data = {}, params = {}) => {
        const url = buildApiUrl(endpoint, params);
        return apiRequest(url, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    // PATCH request
    patch: async (endpoint, data = {}, params = {}) => {
        const url = buildApiUrl(endpoint, params);
        return apiRequest(url, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    // DELETE request
    delete: async (endpoint, params = {}) => {
        const url = buildApiUrl(endpoint, params);
        return apiRequest(url, { method: 'DELETE' });
    },

    // Upload file
    upload: async (endpoint, formData, params = {}) => {
        const url = buildApiUrl(endpoint, params);
        const headers = getAuthHeaders();
        delete headers['Content-Type']; // Let browser set content-type for FormData

        return apiRequest(url, {
            method: 'POST',
            body: formData,
            headers,
        });
    },
};

// Specific API services
export const authService = {
    register: (userData) => apiService.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData),
    login: (credentials) => apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials),
    logout: () => apiService.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT),
    refreshToken: (refreshToken) => apiService.post(API_CONFIG.ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken }),
    landingSignIn: (email, phone) => apiService.post(API_CONFIG.ENDPOINTS.AUTH.LANDING_SIGNIN, { email, phone }),
};

export const providerService = {
    register: (providerData) => apiService.post(API_CONFIG.ENDPOINTS.PROVIDERS.REGISTER, providerData),
    getAll: () => apiService.get(API_CONFIG.ENDPOINTS.PROVIDERS.GET_ALL),
    getById: (id) => apiService.get(API_CONFIG.ENDPOINTS.PROVIDERS.GET_BY_ID, { id }),
    update: (id, data) => apiService.put(API_CONFIG.ENDPOINTS.PROVIDERS.UPDATE, data, { id }),
    delete: (id) => apiService.delete(API_CONFIG.ENDPOINTS.PROVIDERS.DELETE, { id }),
};

export const userService = {
    getProfile: () => apiService.get(API_CONFIG.ENDPOINTS.USERS.PROFILE),
    updateProfile: (data) => apiService.put(API_CONFIG.ENDPOINTS.USERS.UPDATE_PROFILE, data),
    changePassword: (data) => apiService.post(API_CONFIG.ENDPOINTS.USERS.CHANGE_PASSWORD, data),
};

export const serviceService = {
    getAll: () => apiService.get(API_CONFIG.ENDPOINTS.SERVICES.GET_ALL),
    getByCategory: (category) => apiService.get(API_CONFIG.ENDPOINTS.SERVICES.GET_BY_CATEGORY, { category }),
    getByProvider: (providerId) => apiService.get(API_CONFIG.ENDPOINTS.SERVICES.GET_BY_PROVIDER, { providerId }),
};

export const invitationService = {
    create: (data) => apiService.post(API_CONFIG.ENDPOINTS.INVITATIONS.CREATE, data),
    getByUser: (userId) => apiService.get(API_CONFIG.ENDPOINTS.INVITATIONS.GET_BY_USER, { userId }),
    update: (id, data) => apiService.put(API_CONFIG.ENDPOINTS.INVITATIONS.UPDATE, data, { id }),
    delete: (id) => apiService.delete(API_CONFIG.ENDPOINTS.INVITATIONS.DELETE, { id }),
    getBySlug: (slug) => apiService.get(API_CONFIG.ENDPOINTS.INVITATIONS.GET_BY_SLUG, { slug }),
};

export const itemService = {
    getAll: () => apiService.get(API_CONFIG.ENDPOINTS.ITEMS.GET_ALL),
    getByCategory: (category) => apiService.get(API_CONFIG.ENDPOINTS.ITEMS.GET_BY_CATEGORY, { category }),
    getById: (id) => apiService.get(API_CONFIG.ENDPOINTS.ITEMS.GET_BY_ID, { id }),
};

export const contactService = {
    create: (contactData) => apiService.post(API_CONFIG.ENDPOINTS.CONTACT.CREATE, contactData),
};

export default apiService;
