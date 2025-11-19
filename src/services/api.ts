// src/services/api.ts

/**
 * Placeholder API service functions. Replace the base URL and endpoints with real ones.
 */
const API_BASE_URL = "https://api.ourbride.com"; // TODO: update with actual base URL

/**
 * Fetch user carts grouped by provider.
 * Expected response shape:
 * [{ providerId: string, providerName: string, carts: Array<{ cartId: string, items: any[] }> }]
 */
export async function getUserCartsGroupedByProvider(userId: string) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/carts/grouped`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user carts: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch categories (services, products, gift‑cards, memberships).
 * Returns an array of category objects.
 */
export async function getCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch items for a given category type.
 * @param type - one of "services", "products", "gift-cards", "memberships"
 */
export async function getItemsByCategory(type: string) {
  const response = await fetch(`${API_BASE_URL}/${type}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type}: ${response.status}`);
  }
  return response.json();
}
