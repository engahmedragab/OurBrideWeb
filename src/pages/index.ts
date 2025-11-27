/**
 * Pages Barrel Export
 * 
 * Export all page components from this file.
 * 
 * Note: Pages are typically imported directly in routing configuration,
 * but this barrel export can be useful for programmatic access.
 * 
 * Example usage:
 * import { Home, About, Contact } from '@/pages';
 */

// Core pages
export { default as Home } from './core/Home';
export { default as About } from './core/About';
export { default as Contact } from './core/Contact';
export { default as Explore } from './core/Explore';
export { default as DownloadApp } from './core/DownloadApp';

// Auth pages
export { default as Login } from './auth/Login';
export { default as Register } from './auth/Register';
export { default as DeleteAccount } from './auth/DeleteAccount';

// Marketplace pages (export as needed)
// export { default as ServicesHome } from './marketplace/ServicesHome';
// export { default as Services } from './marketplace/Services';

// Planner pages (export as needed)
// export { default as Planner } from './planner/Planner';

// Note: Import pages directly in routing for better tree-shaking
// This barrel export is optional and mainly for convenience
