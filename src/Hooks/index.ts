/**
 * Hooks Barrel Export
 * 
 * Export all custom React hooks from this file.
 * 
 * Example usage:
 * import { useAuth, useApi, useLocalStorage } from '@/hooks';
 */

// Export existing hooks
export { useAuth } from './useAuth';
export { useAnalytics } from './useAnalytics';
export { useCountDown } from './useCountDown';

// Export new hooks
export { useApi, type UseApiReturn, type UseApiState } from './useApi';
export { useLocalStorage } from './useLocalStorage';

// TODO: Export additional hooks as they are created
// export { useDebounce } from './useDebounce';
// export { useMediaQuery } from './useMediaQuery';

