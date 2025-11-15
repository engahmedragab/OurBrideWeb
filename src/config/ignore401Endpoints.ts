// Configuration for endpoints that should ignore 401 errors and return mock data
interface Ignore401Config {
	shouldIgnore: boolean;
	mockData?: any;
}

// Map of endpoint patterns to their mock data
const ignore401Endpoints: Record<string, any> = {
	'/users/profile': {
		// Mock user profile data
		data: null,
		success: false,
		message: 'User not authenticated',
	},
	// Add more endpoints as needed
	// '/some/endpoint': { ...mockData }
};

/**
 * Check if an endpoint should ignore 401 errors and return mock data
 * @param url - The request URL
 * @returns Configuration object with shouldIgnore flag and optional mockData
 */
export function shouldIgnore401Error(url: string): Ignore401Config {
	// Check if the URL matches any ignore pattern
	for (const [pattern, mockData] of Object.entries(ignore401Endpoints)) {
		if (url.includes(pattern)) {
			return {
				shouldIgnore: true,
				mockData,
			};
		}
	}

	return {
		shouldIgnore: false,
	};
}

