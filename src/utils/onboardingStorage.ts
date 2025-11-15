/**
 * Helper to store and retrieve onboarding data across steps
 */
const ONBOARDING_STORAGE_KEY = 'guider_onboarding_data';

export const saveOnboardingData = (data) => {
  try {
    const existing = getOnboardingData() || {};
    const updated = { ...existing, ...data };
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return null;
  }
};

export const getOnboardingData = () => {
  try {
    const data = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading onboarding data:', error);
    return null;
  }
};

export const clearOnboardingData = () => {
  try {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing onboarding data:', error);
  }
};

export default {
  saveOnboardingData,
  getOnboardingData,
  clearOnboardingData,
};

