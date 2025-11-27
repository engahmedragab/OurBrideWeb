/**
 * Services Barrel Export
 * 
 * Export all API services from this file.
 * 
 * Example usage:
 * import { serviceService, authService } from '@/services';
 * or
 * import { serviceService, authService } from '../services';
 */

// Export all services
export { serviceService } from './serviceService';
export { authService } from './authService';
export { communityService } from './communityService';
export { contactService } from './contactService';
export { guiderService } from './guiderService';
export { homeService } from './homeService';
export { invitationService } from './invitationService';
export { itemService } from './itemService';
export { plannerService } from './plannerService';
export { preparationService } from './preparationService';
export { productService } from './productService';
export { providerService } from './providerService';
export { publicProviderService } from './publicProviderService';
export { purchaseService } from './purchaseService';
export { statisticsService } from './statisticsService';

// Re-export API client if needed
export * from './api';

