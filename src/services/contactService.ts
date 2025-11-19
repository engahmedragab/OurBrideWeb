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
 * Contact Service
 * All API calls related to contact
 */
export const contactService = {
  // Create contact
  create: async (data: any) => {
    const response = await OurbrideApi.api.postContactCreateContact(data);
    return extractData(response);
  },

  // Get contact by ID
  getById: async (contactId: number) => {
    const response = await OurbrideApi.api.getContactGetContactById(contactId);
    return extractData(response);
  },

  // Delete contact
  delete: async (contactId: number) => {
    const response = await OurbrideApi.api.deleteContactDeleteContact(contactId);
    return extractData(response);
  },

  // Get contacts by source
  getBySource: async (source: string) => {
    const response = await OurbrideApi.api.getContactGetContactsBySource({ source });
    return extractData(response);
  },

  // Get contacts by date range
  getByDateRange: async (startDate: string, endDate: string) => {
    const response = await OurbrideApi.api.getContactGetContactsByDateRange({
      startDate,
      endDate,
    });
    return extractData(response);
  },

  // Get pending contacts
  getPending: async () => {
    const response = await OurbrideApi.api.getContactGetPendingContacts();
    return extractData(response);
  },

  // Get my contacts
  getMyContacts: async () => {
    const response = await OurbrideApi.api.getContactGetMyContacts();
    return extractData(response);
  },

  // Get contact statistics
  getStatistics: async () => {
    const response = await OurbrideApi.api.getContactGetContactStatistics();
    return extractData(response);
  },
};

export default contactService;

