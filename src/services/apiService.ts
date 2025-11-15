import { API_CONFIG, buildApiUrl, getAuthHeaders, API_STATUS, ERROR_MESSAGES } from '../config/api';

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
    // Provider Control endpoints (authentication required)
    getPublicSettings: (providerId) => apiService.get(API_CONFIG.ENDPOINTS.PROVIDER_CONTROL.GET_PUBLIC_SETTINGS, { providerId }),
    updatePublicSettings: (providerId, data) => apiService.put(API_CONFIG.ENDPOINTS.PROVIDER_CONTROL.UPDATE_PUBLIC_SETTINGS, data, { providerId }),
};

export const userService = {
    getProfile: () => apiService.get(API_CONFIG.ENDPOINTS.USERS.PROFILE),
    updateProfile: (data) => apiService.put(API_CONFIG.ENDPOINTS.USERS.UPDATE_PROFILE, data),
    changePassword: (data) => apiService.post(API_CONFIG.ENDPOINTS.USERS.CHANGE_PASSWORD, data),
};

// Preparations Service
export const preparationService = {
    getAll: () => apiService.get(API_CONFIG.ENDPOINTS.PREPARATIONS.GET_ALL),
    getFeatured: () => apiService.get(API_CONFIG.ENDPOINTS.PREPARATIONS.GET_FEATURED),
    getById: (preparationId) => apiService.get(API_CONFIG.ENDPOINTS.PREPARATIONS.GET_BY_ID, { preparationId }),
    getLastServices: () => apiService.get(API_CONFIG.ENDPOINTS.PREPARATIONS.GET_LAST_SERVICES),
    getServicesByPreparation: (preparationId) => apiService.get(API_CONFIG.ENDPOINTS.PREPARATIONS.GET_SERVICES_BY_PREPARATION, { preparationId }),
    getServicesByPreparationPaged: (preparationId, page = 1, pageSize = 10) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.PREPARATIONS.GET_SERVICES_BY_PREPARATION_PAGED, { preparationId });
        const queryParams = new URLSearchParams({ page: page.toString(), pageSize: pageSize.toString() });
        return apiRequest(`${url}?${queryParams.toString()}`, { method: 'GET' });
    },
    getStatistics: (preparationId) => apiService.get(API_CONFIG.ENDPOINTS.PREPARATIONS.GET_STATISTICS, { preparationId }),
    getProviderCount: (preparationId) => apiService.get(API_CONFIG.ENDPOINTS.PREPARATIONS.GET_PROVIDER_COUNT, { preparationId }),
};

// Services Service
export const serviceService = {
    getAll: (params = {}) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.SERVICES.GET_ALL);
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryParams.append(key, params[key].toString());
            }
        });
        const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
        return apiRequest(fullUrl, { method: 'GET' });
    },
    getById: (id) => apiService.get(API_CONFIG.ENDPOINTS.SERVICES.GET_BY_ID, { id }),
    search: (searchParams) => {
        // Support both GET and POST methods
        if (searchParams.usePost) {
            return apiService.post(API_CONFIG.ENDPOINTS.SERVICES.SEARCH, searchParams);
        }
        return serviceService.getAll(searchParams);
    },
    getReviews: (id, page = 1, pageSize = 10, sortBy = 'dateCreated', sortOrder = 'desc') => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.SERVICES.GET_REVIEWS, { id });
        const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
            sortBy,
            sortOrder,
        });
        return apiRequest(`${url}?${queryParams.toString()}`, { method: 'GET' });
    },
    getReviewSummary: (id) => apiService.get(API_CONFIG.ENDPOINTS.SERVICES.GET_REVIEW_SUMMARY, { id }),
    getPackages: (id) => apiService.get(API_CONFIG.ENDPOINTS.SERVICES.GET_PACKAGES, { id }),
    compare: (serviceIds) => apiService.post(API_CONFIG.ENDPOINTS.SERVICES.COMPARE, serviceIds),
    getMap: (params = {}) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.SERVICES.GET_MAP);
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryParams.append(key, params[key].toString());
            }
        });
        const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
        return apiRequest(fullUrl, { method: 'GET' });
    },
    getByCategory: (category) => apiService.get(API_CONFIG.ENDPOINTS.SERVICES.GET_BY_CATEGORY, { category }),
    getByProvider: (providerId) => apiService.get(API_CONFIG.ENDPOINTS.SERVICES.GET_BY_PROVIDER, { providerId }),
};

// Products Service
export const productService = {
    getById: (productId, params = {}) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.GET_BY_ID, { productId });
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryParams.append(key, params[key].toString());
            }
        });
        const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
        return apiRequest(fullUrl, { method: 'GET' });
    },
    getBySku: (sku, params = {}) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.PRODUCTS.GET_BY_SKU, { sku });
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryParams.append(key, params[key].toString());
            }
        });
        const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
        return apiRequest(fullUrl, { method: 'GET' });
    },
    getHeader: (productId) => apiService.get(API_CONFIG.ENDPOINTS.PRODUCTS.GET_HEADER, { productId }),
    getDetail: (id) => apiService.get(API_CONFIG.ENDPOINTS.PRODUCTS.GET_DETAIL, { id }),
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

// Statistics Service (public - no authentication required)
export const statisticsService = {
    getOverview: () => apiService.get(API_CONFIG.ENDPOINTS.STATISTICS.GET_OVERVIEW),
    getSummary: () => apiService.get(API_CONFIG.ENDPOINTS.STATISTICS.GET_SUMMARY),
    getProviders: () => apiService.get(API_CONFIG.ENDPOINTS.STATISTICS.GET_PROVIDERS),
};

// Featured Providers Service (public - no authentication required)
export const featuredProvidersService = {
    getFeatured: (count = 10) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.FEATURED_PROVIDERS.GET_FEATURED);
        const queryParams = new URLSearchParams({ count: count.toString() });
        return apiRequest(`${url}?${queryParams.toString()}`, { method: 'GET' });
    },
    getTopRated: (count = 10) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.FEATURED_PROVIDERS.GET_TOP_RATED);
        const queryParams = new URLSearchParams({ count: count.toString() });
        return apiRequest(`${url}?${queryParams.toString()}`, { method: 'GET' });
    },
    getPopular: (count = 10) => {
        const url = buildApiUrl(API_CONFIG.ENDPOINTS.FEATURED_PROVIDERS.GET_POPULAR);
        const queryParams = new URLSearchParams({ count: count.toString() });
        return apiRequest(`${url}?${queryParams.toString()}`, { method: 'GET' });
    },
};

export default apiService;
