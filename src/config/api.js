// API Configuration
export const API_CONFIG = {
    // Base URL for all API calls
    BASE_URL: 'https://api.our-bride.com/api/v1',

    // API Endpoints
    ENDPOINTS: {
        // Authentication endpoints
        AUTH: {
            REGISTER: '/identity/register',
            LOGIN: '/identity/login',
            LOGOUT: '/identity/logout',
            REFRESH_TOKEN: '/identity/refresh-token',
            LANDING_SIGNIN: '/identity/landing-signin',
        },

        // Provider endpoints
        PROVIDERS: {
            REGISTER: '/services/providers/registration',
            GET_ALL: '/providers',
            GET_BY_ID: '/providers/:id',
            UPDATE: '/providers/:id',
            DELETE: '/providers/:id',
        },

        // User endpoints
        USERS: {
            PROFILE: '/users/profile',
            UPDATE_PROFILE: '/users/profile',
            CHANGE_PASSWORD: '/users/change-password',
        },

        // Wedding services endpoints
        SERVICES: {
            GET_ALL: '/services',
            GET_BY_CATEGORY: '/services/category/:category',
            GET_BY_PROVIDER: '/services/provider/:providerId',
        },

        // Invitations endpoints
        INVITATIONS: {
            CREATE: '/invitations',
            GET_BY_USER: '/invitations/user/:userId',
            UPDATE: '/invitations/:id',
            DELETE: '/invitations/:id',
            GET_BY_SLUG: '/invitations/slug/:slug',
        },

        // Items/Products endpoints
        ITEMS: {
            GET_ALL: '/items',
            GET_BY_CATEGORY: '/items/category/:category',
            GET_BY_ID: '/items/:id',
        },

        // Contact endpoints
        CONTACT: {
            CREATE: '/contact',
        },
    },

    // Request timeout (in milliseconds)
    TIMEOUT: 30000,

    // Default headers
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
};

// Helper function to build full API URL
export const buildApiUrl = (endpoint, params = {}) => {
    let url = `${API_CONFIG.BASE_URL}${endpoint}`;

    // Replace URL parameters
    Object.keys(params).forEach(key => {
        url = url.replace(`:${key}`, params[key]);
    });

    return url;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
    const token = localStorage.getItem('userToken');
    return {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

// API Response status codes
export const API_STATUS = {
    SUCCESS: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
};

// Common error messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    TIMEOUT_ERROR: 'Request timeout. Please try again.',
};

export default API_CONFIG;
