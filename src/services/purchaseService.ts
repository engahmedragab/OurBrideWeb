import { OurbrideApi } from '../common/api/ourbride-http-client';

/**
 * Helper function to extract data from ApiResult format
 */
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

/**
 * Purchase Service
 * All API calls related to purchases, cart, orders, and checkout
 */
export const purchaseService = {
  // Purchase CRUD Operations
  purchase: {
    // Create a purchase
    create: (data: any) => 
      OurbrideApi.api.postPurchasePurchase(data).then(extractData),
    
    // Get all purchases
    getAll: () => 
      OurbrideApi.api.getPurchaseGetAll().then(extractData),
    
    // Get purchase by ID
    getById: (id: number) => 
      OurbrideApi.api.getPurchaseGetById(id).then(extractData),
    
    // Update a purchase
    update: (id: string, data: any) => 
      OurbrideApi.api.putPurchaseUpdatePurchase(id, data).then(extractData),
    
    // Remove/Delete a purchase
    remove: (id: string, data: any) => 
      OurbrideApi.api.deletePurchaseRemovePurchase(id, data).then(extractData),
  },

  // Cart Operations
  cart: {
    // Get current user's cart
    get: () => 
      OurbrideApi.api.getPurchaseGetCart().then(extractData),
    
    // Get purchases by cart
    getPurchases: () => 
      OurbrideApi.api.getPurchaseGetPurchasesByCart().then(extractData),
    
    // Get all carts with providers (grouped by provider)
    getAllWithProviders: () => 
      OurbrideApi.api.getPurchaseGetAllCartsWithProviders().then(extractData),
    
    // Clear entire cart
    clear: () => 
      OurbrideApi.api.deletePurchaseClearCart().then(extractData),
    
    // Get cart by provider ID
    getByProvider: (providerId: number) => 
      OurbrideApi.api.getPurchaseGetCartByProvider(providerId).then(extractData),
    
    // Clear cart for specific provider
    clearByProvider: (providerId: number) => 
      OurbrideApi.api.deletePurchaseClearCartByProvider(providerId).then(extractData),
    
    // Get purchases by provider cart
    getPurchasesByProvider: (providerId: number) => 
      OurbrideApi.api.getPurchaseGetPurchasesByProviderCart(providerId).then(extractData),
  },

  // Order Operations
  order: {
    // Create an order from cart
    create: (data: any) => 
      OurbrideApi.api.postPurchaseCreateOrder(data).then(extractData),
    
    // Get orders with pagination/search
    search: (data: any) => 
      OurbrideApi.api.postPurchaseGetOrdersPaginated(data).then(extractData),
  },

  // Checkout Operations
  checkout: {
    // Process checkout
    process: (data: any) => 
      OurbrideApi.api.postPurchaseCheckout(data).then(extractData),
  },

  // Coupon Operations
  coupon: {
    // Validate a coupon code
    validate: (couponCode: string) => 
      OurbrideApi.api.postPurchaseValidateCoupon(couponCode).then(extractData),
  },

  // Reservation Operations
  reservation: {
    // Get purchases by reservation ID
    getPurchasesByReservationId: (reservationId: string) => 
      OurbrideApi.api.getPurchaseGetPurchasesByReservationId(reservationId).then(extractData),
  },
};

export default purchaseService;

