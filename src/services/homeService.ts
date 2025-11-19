import { Api, HttpClient } from '@/common/api/gen/ourbride-api';
import { API_CONFIG } from '@/config/api';

// Helper function to extract data from ApiResult format
const extractData = (response: any) => {
    if (!response) return null;
    
    // Handle Axios response structure
    const data = response.data || response;
    
    if (!data) return null;
    
    // If response.data has a 'data' property and 'success' property, it's ApiResult format
    if (data.data !== undefined && data.success !== undefined) {
        return data.data;
    }
    
    // Otherwise, return the data directly
    return data;
};

// Create HTTP client instance with base URL configuration
const httpClient = new HttpClient({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: API_CONFIG.DEFAULT_HEADERS,
});

// Create API instance
const apiInstance = new Api(httpClient);

// Home API Service using generated API methods
export const homeService = {
    // Get Service Home data
    getServiceHome: async () => {
        try {
            // Use generated API method, override secure to false for public endpoint
            const response = await apiInstance.api.getHomeGetServiceHome({
                secure: false,
            });
            return extractData(response);
        } catch (error: any) {
            // Handle errors
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || error.message;
                throw new Error(message || `HTTP ${status}: ${error.response.statusText}`);
            }
            throw error;
        }
    },

    // Get Store Home data
    getStoreHome: async () => {
        try {
            // Use generated API method, override secure to false for public endpoint
            const response = await apiInstance.api.getHomeGetStoreHome({
                secure: false,
            });
            return extractData(response);
        } catch (error: any) {
            // Handle errors
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message || error.message;
                throw new Error(message || `HTTP ${status}: ${error.response.statusText}`);
            }
            throw error;
        }
    },
};

