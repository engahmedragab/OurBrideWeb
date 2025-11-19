import { OurbrideApi } from '../common/api/ourbride-http-client';

/**
 * Helper function to extract data from ApiResult format
 */
const extractData = (response: any) => {
  if (!response || !response.data) return null;
  // If response.data has a 'data' property and 'success' property, it's ApiResult format
  if (response.data.data !== undefined && response.data.success !== undefined) {
    return response.data.data;
  }
  // Otherwise, return the data directly
  return response.data;
};

/**
 * Planner Service
 * All API calls related to wedding planning books and events
 */
export const plannerService = {
  // ==================== WEDDING EVENTS ====================
  weddingEvents: {
    // Create a wedding event
    create: (data: any) =>
      OurbrideApi.postWeddingEventCreateEvent(data).then(extractData),
    
    // Get all wedding events
    getAll: () =>
      OurbrideApi.getWeddingEventGetAllEvents().then(extractData),
    
    // Get wedding event by ID
    getById: (eventId: number) =>
      OurbrideApi.getWeddingEventGetEventById(eventId).then(extractData),
    
    // Update wedding event
    update: (eventId: number, data: any) =>
      OurbrideApi.putWeddingEventUpdateEvent(eventId, data).then(extractData),
    
    // Delete wedding event
    delete: (eventId: number) =>
      OurbrideApi.deleteWeddingEventDeleteEvent(eventId).then(extractData),
    
    // Get default wedding event
    getDefault: () =>
      OurbrideApi.getWeddingEventGetDefaultEvent().then(extractData),
    
    // Create default wedding event
    createDefault: (weddingDate?: string) =>
      OurbrideApi.postWeddingEventCreateDefaultEvent({ weddingDate }).then(extractData),
    
    // Set default wedding event
    setDefault: (eventId: number) =>
      OurbrideApi.postWeddingEventSetDefaultEvent(eventId).then(extractData),
  },

  // ==================== BUDGET BOOKS ====================
  budgetBooks: {
    // Initialize budget book
    init: (clientId?: string, userType?: string) =>
      OurbrideApi.postBudgetBooksInit({ clientId, userType }).then(extractData),
    
    // Sync budget book
    sync: (data: any, clientId?: string, userType?: string) =>
      OurbrideApi.postBudgetBooksSyncBook(data, { clientId, userType }).then(extractData),
    
    // Get budget book with lines
    getBook: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getBudgetBooksGetBook({ clientId, userType, eventId }).then(extractData),
    
    // Get all budget lines
    getAll: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getBudgetBooksGetAll({ clientId, userType, eventId }).then(extractData),
    
    // Get filtered budget lines
    getFiltered: (isDeleted: boolean, isDone: boolean, isFavorite: boolean, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getBudgetBooksGetAllCustom(isDeleted, isDone, isFavorite, { clientId, userType, eventId }).then(extractData),
    
    // Get done budget lines
    getDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getBudgetBooksGetAllDone({ clientId, userType }).then(extractData),
    
    // Get not done budget lines
    getNotDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getBudgetBooksGetAllNotDone({ clientId, userType }).then(extractData),
    
    // Get favorite budget lines
    getFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getBudgetBooksGetAllFavorite({ clientId, userType }).then(extractData),
    
    // Get not favorite budget lines
    getNotFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getBudgetBooksGetAllNotFavorite({ clientId, userType }).then(extractData),
    
    // Get deleted budget lines
    getDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getBudgetBooksGetAllDelete({ clientId, userType }).then(extractData),
    
    // Get not deleted budget lines
    getNotDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getBudgetBooksGetAllNotDelete({ clientId, userType }).then(extractData),
    
    // Get single budget line
    get: (eventLineId: number, budgetlineId: string, clientId?: string) =>
      OurbrideApi.getBudgetBooksGet(eventLineId, budgetlineId, { clientId }).then(extractData),
    
    // Create budget line
    create: (data: any, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postBudgetBooksCreate(data, { clientId, userType, eventId }).then(extractData),
    
    // Update budget line
    update: (eventLineId: number, budgetlineId: string, data: any, clientId?: string, userType?: string) =>
      OurbrideApi.putBudgetBooksUpdate(eventLineId, budgetlineId, data, { clientId, userType }).then(extractData),
    
    // Delete budget line
    delete: (eventLineId: number, budgetlineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.deleteBudgetBooksDelete(eventLineId, budgetlineId, { clientId, userType }).then(extractData),
    
    // Mark budget line as done
    markDone: (eventLineId: number, budgetlineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putBudgetBooksDone(eventLineId, budgetlineId, { clientId, userType }).then(extractData),
    
    // Mark budget line as favorite
    markFavorite: (eventLineId: number, budgetlineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putBudgetBooksFavorite(eventLineId, budgetlineId, { clientId, userType }).then(extractData),
    
    // Create multiple budget lines
    createAll: (data: any[], clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postBudgetBooksCreateAll(data, { clientId, userType, eventId }).then(extractData),
    
    // Update multiple budget lines
    updateAll: (data: any[], clientId?: string, userType?: string) =>
      OurbrideApi.putBudgetBooksUpdateAll(data, { clientId, userType }).then(extractData),
    
    // Delete multiple budget lines
    deleteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.deleteBudgetBooksDeleteAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple budget lines as done
    markDoneAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putBudgetBooksDoneAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple budget lines as favorite
    markFavoriteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putBudgetBooksFavoriteAll(data, { value, clientId, userType }).then(extractData),
    
    // Categories
    getCategories: (clientId?: string) =>
      OurbrideApi.getBudgetBooksGetAllCategories({ clientId }).then(extractData),
    
    getCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.getBudgetBooksGetCategory(lineCategoryId, { clientId }).then(extractData),
    
    createCategory: (data: any, clientId?: string) =>
      OurbrideApi.postBudgetBooksCreateCategory(data, { clientId }).then(extractData),
    
    updateCategory: (lineCategoryId: number, data: any, clientId?: string) =>
      OurbrideApi.putBudgetBooksUpdateCategory(lineCategoryId, data, { clientId }).then(extractData),
    
    deleteCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.deleteBudgetBooksDeleteCategory(lineCategoryId, { clientId }).then(extractData),
  },

  // ==================== EVENT BOOKS ====================
  eventBooks: {
    // Initialize event book
    init: (clientId?: string, userType?: string) =>
      OurbrideApi.postEventBooksInit({ clientId, userType }).then(extractData),
    
    // Sync event book
    sync: (data: any, clientId?: string, userType?: string) =>
      OurbrideApi.postEventBooksSyncBook(data, { clientId, userType }).then(extractData),
    
    // Get event book with lines
    getBook: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getEventBooksGetBook({ clientId, userType, eventId }).then(extractData),
    
    // Get all event lines
    getAll: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getEventBooksGetAll({ clientId, userType, eventId }).then(extractData),
    
    // Get filtered event lines
    getFiltered: (isDeleted: boolean, isDone: boolean, isFavorite: boolean, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getEventBooksGetAllCustom(isDeleted, isDone, isFavorite, { clientId, userType, eventId }).then(extractData),
    
    // Get done event lines
    getDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getEventBooksGetAllDone({ clientId, userType }).then(extractData),
    
    // Get not done event lines
    getNotDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getEventBooksGetAllNotDone({ clientId, userType }).then(extractData),
    
    // Get favorite event lines
    getFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getEventBooksGetAllFavorite({ clientId, userType }).then(extractData),
    
    // Get not favorite event lines
    getNotFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getEventBooksGetAllNotFavorite({ clientId, userType }).then(extractData),
    
    // Get deleted event lines
    getDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getEventBooksGetAllDelete({ clientId, userType }).then(extractData),
    
    // Get not deleted event lines
    getNotDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getEventBooksGetAllNotDelete({ clientId, userType }).then(extractData),
    
    // Get single event line
    get: (eventLineId: number, eventlineId: string, clientId?: string) =>
      OurbrideApi.getEventBooksGet(eventLineId, eventlineId, { clientId }).then(extractData),
    
    // Create event line
    create: (data: any, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postEventBooksCreate(data, { clientId, userType, eventId }).then(extractData),
    
    // Update event line
    update: (eventLineId: number, eventlineId: string, data: any, clientId?: string, userType?: string) =>
      OurbrideApi.putEventBooksUpdate(eventLineId, eventlineId, data, { clientId, userType }).then(extractData),
    
    // Delete event line
    delete: (eventLineId: number, eventlineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.deleteEventBooksDelete(eventLineId, eventlineId, { clientId, userType }).then(extractData),
    
    // Mark event line as done
    markDone: (eventLineId: number, eventlineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putEventBooksDone(eventLineId, eventlineId, { clientId, userType }).then(extractData),
    
    // Mark event line as favorite
    markFavorite: (eventLineId: number, eventlineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putEventBooksFavorite(eventLineId, eventlineId, { clientId, userType }).then(extractData),
    
    // Create multiple event lines
    createAll: (data: any[], clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postEventBooksCreateAll(data, { clientId, userType, eventId }).then(extractData),
    
    // Update multiple event lines
    updateAll: (data: any[], clientId?: string, userType?: string) =>
      OurbrideApi.putEventBooksUpdateAll(data, { clientId, userType }).then(extractData),
    
    // Delete multiple event lines
    deleteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.deleteEventBooksDeleteAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple event lines as done
    markDoneAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putEventBooksDoneAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple event lines as favorite
    markFavoriteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putEventBooksFavoriteAll(data, { value, clientId, userType }).then(extractData),
    
    // Categories
    getCategories: (clientId?: string) =>
      OurbrideApi.getEventBooksGetAllCategories({ clientId }).then(extractData),
    
    getCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.getEventBooksGetCategory(lineCategoryId, { clientId }).then(extractData),
    
    createCategory: (data: any, clientId?: string) =>
      OurbrideApi.postEventBooksCreateCategory(data, { clientId }).then(extractData),
    
    updateCategory: (lineCategoryId: number, data: any, clientId?: string) =>
      OurbrideApi.putEventBooksUpdateCategory(lineCategoryId, data, { clientId }).then(extractData),
    
    deleteCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.deleteEventBooksDeleteCategory(lineCategoryId, { clientId }).then(extractData),
  },

  // ==================== GUEST BOOKS ====================
  guestBooks: {
    // Initialize guest book
    init: (clientId?: string, userType?: string) =>
      OurbrideApi.postGuestBooksInit({ clientId, userType }).then(extractData),
    
    // Sync guest book
    sync: (data: any, clientId?: string, userType?: string) =>
      OurbrideApi.postGuestBooksSyncBook(data, { clientId, userType }).then(extractData),
    
    // Get guest book with lines
    getBook: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getGuestBooksGetBook({ clientId, userType, eventId }).then(extractData),
    
    // Get all guest lines
    getAll: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getGuestBooksGetAll({ clientId, userType, eventId }).then(extractData),
    
    // Get filtered guest lines
    getFiltered: (isDeleted: boolean, isDone: boolean, isFavorite: boolean, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getGuestBooksGetAllCustom(isDeleted, isDone, isFavorite, { clientId, userType, eventId }).then(extractData),
    
    // Get done guest lines
    getDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getGuestBooksGetAllDone({ clientId, userType }).then(extractData),
    
    // Get not done guest lines
    getNotDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getGuestBooksGetAllNotDone({ clientId, userType }).then(extractData),
    
    // Get favorite guest lines
    getFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getGuestBooksGetAllFavorite({ clientId, userType }).then(extractData),
    
    // Get not favorite guest lines
    getNotFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getGuestBooksGetAllNotFavorite({ clientId, userType }).then(extractData),
    
    // Get deleted guest lines
    getDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getGuestBooksGetAllDelete({ clientId, userType }).then(extractData),
    
    // Get not deleted guest lines
    getNotDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getGuestBooksGetAllNotDelete({ clientId, userType }).then(extractData),
    
    // Get single guest line
    get: (guestLineId: number, guestlineId: string, clientId?: string) =>
      OurbrideApi.getGuestBooksGet(guestLineId, guestlineId, { clientId }).then(extractData),
    
    // Create guest line
    create: (data: any, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postGuestBooksCreate(data, { clientId, userType, eventId }).then(extractData),
    
    // Update guest line
    update: (guestLineId: number, guestlineId: string, data: any, clientId?: string, userType?: string) =>
      OurbrideApi.putGuestBooksUpdate(guestLineId, guestlineId, data, { clientId, userType }).then(extractData),
    
    // Delete guest line
    delete: (guestLineId: number, guestlineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.deleteGuestBooksDelete(guestLineId, guestlineId, { clientId, userType }).then(extractData),
    
    // Mark guest line as done
    markDone: (guestLineId: number, guestlineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putGuestBooksDone(guestLineId, guestlineId, { clientId, userType }).then(extractData),
    
    // Mark guest line as favorite
    markFavorite: (guestLineId: number, guestlineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putGuestBooksFavorite(guestLineId, guestlineId, { clientId, userType }).then(extractData),
    
    // Create multiple guest lines
    createAll: (data: any[], clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postGuestBooksCreateAll(data, { clientId, userType, eventId }).then(extractData),
    
    // Update multiple guest lines
    updateAll: (data: any[], clientId?: string, userType?: string) =>
      OurbrideApi.putGuestBooksUpdateAll(data, { clientId, userType }).then(extractData),
    
    // Delete multiple guest lines
    deleteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.deleteGuestBooksDeleteAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple guest lines as done
    markDoneAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putGuestBooksDoneAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple guest lines as favorite
    markFavoriteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putGuestBooksFavoriteAll(data, { value, clientId, userType }).then(extractData),
    
    // Categories
    getCategories: (clientId?: string) =>
      OurbrideApi.getGuestBooksGetAllCategories({ clientId }).then(extractData),
    
    getCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.getGuestBooksGetCategory(lineCategoryId, { clientId }).then(extractData),
    
    createCategory: (data: any, clientId?: string) =>
      OurbrideApi.postGuestBooksCreateCategory(data, { clientId }).then(extractData),
    
    updateCategory: (lineCategoryId: number, data: any, clientId?: string) =>
      OurbrideApi.putGuestBooksUpdateCategory(lineCategoryId, data, { clientId }).then(extractData),
    
    deleteCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.deleteGuestBooksDeleteCategory(lineCategoryId, { clientId }).then(extractData),
  },

  // ==================== ITEM BOOKS ====================
  itemBooks: {
    // Initialize item book
    init: (clientId?: string, userType?: string) =>
      OurbrideApi.postItemBooksInit({ clientId, userType }).then(extractData),
    
    // Sync item book
    sync: (data: any, clientId?: string, userType?: string) =>
      OurbrideApi.postItemBooksSyncBook(data, { clientId, userType }).then(extractData),
    
    // Get item book with lines
    getBook: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getItemBooksGetBook({ clientId, userType, eventId }).then(extractData),
    
    // Get all item lines
    getAll: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getItemBooksGetAll({ clientId, userType, eventId }).then(extractData),
    
    // Get filtered item lines
    getFiltered: (isDeleted: boolean, isDone: boolean, isFavorite: boolean, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getItemBooksGetAllCustom(isDeleted, isDone, isFavorite, { clientId, userType, eventId }).then(extractData),
    
    // Get done item lines
    getDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getItemBooksGetAllDone({ clientId, userType }).then(extractData),
    
    // Get not done item lines
    getNotDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getItemBooksGetAllNotDone({ clientId, userType }).then(extractData),
    
    // Get favorite item lines
    getFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getItemBooksGetAllFavorite({ clientId, userType }).then(extractData),
    
    // Get not favorite item lines
    getNotFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getItemBooksGetAllNotFavorite({ clientId, userType }).then(extractData),
    
    // Get deleted item lines
    getDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getItemBooksGetAllDelete({ clientId, userType }).then(extractData),
    
    // Get not deleted item lines
    getNotDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getItemBooksGetAllNotDelete({ clientId, userType }).then(extractData),
    
    // Get single item line
    get: (itemLineId: number, itemlineId: string, clientId?: string) =>
      OurbrideApi.getItemBooksGet(itemLineId, itemlineId, { clientId }).then(extractData),
    
    // Create item line
    create: (data: any, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postItemBooksCreate(data, { clientId, userType, eventId }).then(extractData),
    
    // Update item line
    update: (itemLineId: number, itemlineId: string, data: any, clientId?: string, userType?: string) =>
      OurbrideApi.putItemBooksUpdate(itemLineId, itemlineId, data, { clientId, userType }).then(extractData),
    
    // Delete item line
    delete: (itemLineId: number, itemlineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.deleteItemBooksDelete(itemLineId, itemlineId, { clientId, userType }).then(extractData),
    
    // Mark item line as done
    markDone: (itemLineId: number, itemlineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putItemBooksDone(itemLineId, itemlineId, { clientId, userType }).then(extractData),
    
    // Mark item line as favorite
    markFavorite: (itemLineId: number, itemlineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putItemBooksFavorite(itemLineId, itemlineId, { clientId, userType }).then(extractData),
    
    // Create multiple item lines
    createAll: (data: any[], clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postItemBooksCreateAll(data, { clientId, userType, eventId }).then(extractData),
    
    // Update multiple item lines
    updateAll: (data: any[], clientId?: string, userType?: string) =>
      OurbrideApi.putItemBooksUpdateAll(data, { clientId, userType }).then(extractData),
    
    // Delete multiple item lines
    deleteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.deleteItemBooksDeleteAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple item lines as done
    markDoneAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putItemBooksDoneAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple item lines as favorite
    markFavoriteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putItemBooksFavoriteAll(data, { value, clientId, userType }).then(extractData),
    
    // Categories
    getCategories: (clientId?: string) =>
      OurbrideApi.getItemBooksGetAllCategories({ clientId }).then(extractData),
    
    getCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.getItemBooksGetCategory(lineCategoryId, { clientId }).then(extractData),
    
    createCategory: (data: any, clientId?: string) =>
      OurbrideApi.postItemBooksCreateCategory(data, { clientId }).then(extractData),
    
    updateCategory: (lineCategoryId: number, data: any, clientId?: string) =>
      OurbrideApi.putItemBooksUpdateCategory(lineCategoryId, data, { clientId }).then(extractData),
    
    deleteCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.deleteItemBooksDeleteCategory(lineCategoryId, { clientId }).then(extractData),
  },

  // ==================== NOTE BOOKS ====================
  noteBooks: {
    // Initialize note book
    init: (clientId?: string, userType?: string) =>
      OurbrideApi.postNoteBooksInit({ clientId, userType }).then(extractData),
    
    // Sync note book
    sync: (data: any, clientId?: string, userType?: string) =>
      OurbrideApi.postNoteBooksSyncBook(data, { clientId, userType }).then(extractData),
    
    // Get note book with lines
    getBook: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getNoteBooksGetBook({ clientId, userType, eventId }).then(extractData),
    
    // Get all note lines
    getAll: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getNoteBooksGetAll({ clientId, userType, eventId }).then(extractData),
    
    // Get filtered note lines
    getFiltered: (isDeleted: boolean, isDone: boolean, isFavorite: boolean, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getNoteBooksGetAllCustom(isDeleted, isDone, isFavorite, { clientId, userType, eventId }).then(extractData),
    
    // Get done note lines
    getDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getNoteBooksGetAllDone({ clientId, userType }).then(extractData),
    
    // Get not done note lines
    getNotDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getNoteBooksGetAllNotDone({ clientId, userType }).then(extractData),
    
    // Get favorite note lines
    getFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getNoteBooksGetAllFavorite({ clientId, userType }).then(extractData),
    
    // Get not favorite note lines
    getNotFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getNoteBooksGetAllNotFavorite({ clientId, userType }).then(extractData),
    
    // Get deleted note lines
    getDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getNoteBooksGetAllDelete({ clientId, userType }).then(extractData),
    
    // Get not deleted note lines
    getNotDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getNoteBooksGetAllNotDelete({ clientId, userType }).then(extractData),
    
    // Get single note line
    get: (noteLineId: number, notelineId: string, clientId?: string) =>
      OurbrideApi.getNoteBooksGet(noteLineId, notelineId, { clientId }).then(extractData),
    
    // Create note line
    create: (data: any, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postNoteBooksCreate(data, { clientId, userType, eventId }).then(extractData),
    
    // Update note line
    update: (noteLineId: number, notelineId: string, data: any, clientId?: string, userType?: string) =>
      OurbrideApi.putNoteBooksUpdate(noteLineId, notelineId, data, { clientId, userType }).then(extractData),
    
    // Delete note line
    delete: (noteLineId: number, notelineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.deleteNoteBooksDelete(noteLineId, notelineId, { clientId, userType }).then(extractData),
    
    // Mark note line as done
    markDone: (noteLineId: number, notelineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putNoteBooksDone(noteLineId, notelineId, { clientId, userType }).then(extractData),
    
    // Mark note line as favorite
    markFavorite: (noteLineId: number, notelineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putNoteBooksFavorite(noteLineId, notelineId, { clientId, userType }).then(extractData),
    
    // Create multiple note lines
    createAll: (data: any[], clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postNoteBooksCreateAll(data, { clientId, userType, eventId }).then(extractData),
    
    // Update multiple note lines
    updateAll: (data: any[], clientId?: string, userType?: string) =>
      OurbrideApi.putNoteBooksUpdateAll(data, { clientId, userType }).then(extractData),
    
    // Delete multiple note lines
    deleteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.deleteNoteBooksDeleteAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple note lines as done
    markDoneAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putNoteBooksDoneAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple note lines as favorite
    markFavoriteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putNoteBooksFavoriteAll(data, { value, clientId, userType }).then(extractData),
    
    // Categories
    getCategories: (clientId?: string) =>
      OurbrideApi.getNoteBooksGetAllCategories({ clientId }).then(extractData),
    
    getCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.getNoteBooksGetCategory(lineCategoryId, { clientId }).then(extractData),
    
    createCategory: (data: any, clientId?: string) =>
      OurbrideApi.postNoteBooksCreateCategory(data, { clientId }).then(extractData),
    
    updateCategory: (lineCategoryId: number, data: any, clientId?: string) =>
      OurbrideApi.putNoteBooksUpdateCategory(lineCategoryId, data, { clientId }).then(extractData),
    
    deleteCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.deleteNoteBooksDeleteCategory(lineCategoryId, { clientId }).then(extractData),
  },

  // ==================== OCCASION BOOKS ====================
  occasionBooks: {
    // Initialize occasion book
    init: (clientId?: string, userType?: string) =>
      OurbrideApi.postOccasionsBooksInit({ clientId, userType }).then(extractData),
    
    // Sync occasion book
    sync: (data: any, clientId?: string, userType?: string) =>
      OurbrideApi.postOccasionsBooksSyncBook(data, { clientId, userType }).then(extractData),
    
    // Get occasion book with lines
    getBook: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getOccasionsBooksGetBook({ clientId, userType, eventId }).then(extractData),
    
    // Get all occasion lines
    getAll: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getOccasionsBooksGetAll({ clientId, userType, eventId }).then(extractData),
    
    // Get filtered occasion lines
    getFiltered: (isDeleted: boolean, isDone: boolean, isFavorite: boolean, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getOccasionsBooksGetAllCustom(isDeleted, isDone, isFavorite, { clientId, userType, eventId }).then(extractData),
    
    // Get done occasion lines
    getDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getOccasionsBooksGetAllDone({ clientId, userType }).then(extractData),
    
    // Get not done occasion lines
    getNotDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getOccasionsBooksGetAllNotDone({ clientId, userType }).then(extractData),
    
    // Get favorite occasion lines
    getFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getOccasionsBooksGetAllFavorite({ clientId, userType }).then(extractData),
    
    // Get not favorite occasion lines
    getNotFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getOccasionsBooksGetAllNotFavorite({ clientId, userType }).then(extractData),
    
    // Get deleted occasion lines
    getDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getOccasionsBooksGetAllDelete({ clientId, userType }).then(extractData),
    
    // Get not deleted occasion lines
    getNotDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getOccasionsBooksGetAllNotDelete({ clientId, userType }).then(extractData),
    
    // Get single occasion line
    get: (occasionLineId: number, occasionlineId: string, clientId?: string) =>
      OurbrideApi.getOccasionsBooksGet(occasionLineId, occasionlineId, { clientId }).then(extractData),
    
    // Create occasion line
    create: (data: any, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postOccasionsBooksCreate(data, { clientId, userType, eventId }).then(extractData),
    
    // Update occasion line
    update: (occasionLineId: number, occasionlineId: string, data: any, clientId?: string, userType?: string) =>
      OurbrideApi.putOccasionsBooksUpdate(occasionLineId, occasionlineId, data, { clientId, userType }).then(extractData),
    
    // Delete occasion line
    delete: (occasionLineId: number, occasionlineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.deleteOccasionsBooksDelete(occasionLineId, occasionlineId, { clientId, userType }).then(extractData),
    
    // Mark occasion line as done
    markDone: (occasionLineId: number, occasionlineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putOccasionsBooksDone(occasionLineId, occasionlineId, { clientId, userType }).then(extractData),
    
    // Mark occasion line as favorite
    markFavorite: (occasionLineId: number, occasionlineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putOccasionsBooksFavorite(occasionLineId, occasionlineId, { clientId, userType }).then(extractData),
    
    // Create multiple occasion lines
    createAll: (data: any[], clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postOccasionsBooksCreateAll(data, { clientId, userType, eventId }).then(extractData),
    
    // Update multiple occasion lines
    updateAll: (data: any[], clientId?: string, userType?: string) =>
      OurbrideApi.putOccasionsBooksUpdateAll(data, { clientId, userType }).then(extractData),
    
    // Delete multiple occasion lines
    deleteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.deleteOccasionsBooksDeleteAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple occasion lines as done
    markDoneAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putOccasionsBooksDoneAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple occasion lines as favorite
    markFavoriteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putOccasionsBooksFavoriteAll(data, { value, clientId, userType }).then(extractData),
    
    // Categories
    getCategories: (clientId?: string) =>
      OurbrideApi.getOccasionsBooksGetAllCategories({ clientId }).then(extractData),
    
    getCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.getOccasionsBooksGetCategory(lineCategoryId, { clientId }).then(extractData),
    
    createCategory: (data: any, clientId?: string) =>
      OurbrideApi.postOccasionsBooksCreateCategory(data, { clientId }).then(extractData),
    
    updateCategory: (lineCategoryId: number, data: any, clientId?: string) =>
      OurbrideApi.putOccasionsBooksUpdateCategory(lineCategoryId, data, { clientId }).then(extractData),
    
    deleteCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.deleteOccasionsBooksDeleteCategory(lineCategoryId, { clientId }).then(extractData),
    
    // Special occasion endpoints
    getAllForGroom: (groomId: number) =>
      OurbrideApi.getOccasionsBooksGetAllForGroom(groomId).then(extractData),
    
    getAllForBride: (brideId: number) =>
      OurbrideApi.getOccasionsBooksGetAllForBride(brideId).then(extractData),
    
    getWeddingOccasion: () =>
      OurbrideApi.getOccasionsBooksGetWeddingOccassionForBride().then(extractData),
    
    getWeddingOccasionForBride: (brideId: number) =>
      OurbrideApi.getOccasionsBooksGetWeddingOccassionForBrideByBrideId(brideId).then(extractData),
    
    getWeddingOccasionForGroom: (groomId: number) =>
      OurbrideApi.getOccasionsBooksGetWeddingOccassionForGroom(groomId).then(extractData),
  },

  // ==================== SERVICE BOOKS ====================
  serviceBooks: {
    // Initialize service book
    init: (clientId?: string, userType?: string) =>
      OurbrideApi.postServiceBooksInit({ clientId, userType }).then(extractData),
    
    // Sync service book
    sync: (data: any, clientId?: string, userType?: string) =>
      OurbrideApi.postServiceBooksSyncBook(data, { clientId, userType }).then(extractData),
    
    // Get service book with lines
    getBook: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getServiceBooksGetBook({ clientId, userType, eventId }).then(extractData),
    
    // Get all service lines
    getAll: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getServiceBooksGetAll({ clientId, userType, eventId }).then(extractData),
    
    // Get filtered service lines
    getFiltered: (isDeleted: boolean, isDone: boolean, isFavorite: boolean, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getServiceBooksGetAllCustom(isDeleted, isDone, isFavorite, { clientId, userType, eventId }).then(extractData),
    
    // Get done service lines
    getDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getServiceBooksGetAllDone({ clientId, userType }).then(extractData),
    
    // Get not done service lines
    getNotDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getServiceBooksGetAllNotDone({ clientId, userType }).then(extractData),
    
    // Get favorite service lines
    getFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getServiceBooksGetAllFavorite({ clientId, userType }).then(extractData),
    
    // Get not favorite service lines
    getNotFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getServiceBooksGetAllNotFavorite({ clientId, userType }).then(extractData),
    
    // Get deleted service lines
    getDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getServiceBooksGetAllDelete({ clientId, userType }).then(extractData),
    
    // Get not deleted service lines
    getNotDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getServiceBooksGetAllNotDelete({ clientId, userType }).then(extractData),
    
    // Get single service line
    get: (serviceLineId: number, servicelineId: string, clientId?: string) =>
      OurbrideApi.getServiceBooksGet(serviceLineId, servicelineId, { clientId }).then(extractData),
    
    // Create service line
    create: (data: any, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postServiceBooksCreate(data, { clientId, userType, eventId }).then(extractData),
    
    // Update service line
    update: (serviceLineId: number, servicelineId: string, data: any, clientId?: string, userType?: string) =>
      OurbrideApi.putServiceBooksUpdate(serviceLineId, servicelineId, data, { clientId, userType }).then(extractData),
    
    // Delete service line
    delete: (serviceLineId: number, servicelineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.deleteServiceBooksDelete(serviceLineId, servicelineId, { clientId, userType }).then(extractData),
    
    // Mark service line as done
    markDone: (serviceLineId: number, servicelineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putServiceBooksDone(serviceLineId, servicelineId, { clientId, userType }).then(extractData),
    
    // Mark service line as favorite
    markFavorite: (serviceLineId: number, servicelineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putServiceBooksFavorite(serviceLineId, servicelineId, { clientId, userType }).then(extractData),
    
    // Create multiple service lines
    createAll: (data: any[], clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postServiceBooksCreateAll(data, { clientId, userType, eventId }).then(extractData),
    
    // Update multiple service lines
    updateAll: (data: any[], clientId?: string, userType?: string) =>
      OurbrideApi.putServiceBooksUpdateAll(data, { clientId, userType }).then(extractData),
    
    // Delete multiple service lines
    deleteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.deleteServiceBooksDeleteAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple service lines as done
    markDoneAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putServiceBooksDoneAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple service lines as favorite
    markFavoriteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putServiceBooksFavoriteAll(data, { value, clientId, userType }).then(extractData),
    
    // Link/Unlink operations
    linkProvider: (serviceLineId: number, providerId: number, servicelineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.postServiceBooksLinkProvider(serviceLineId, providerId, servicelineId, { clientId, userType }).then(extractData),
    
    unlinkProvider: (serviceLineId: number, servicelineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.deleteServiceBooksUnlinkProvider(serviceLineId, servicelineId, { clientId, userType }).then(extractData),
    
    linkPreparation: (serviceLineId: number, preparationId: number, servicelineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.postServiceBooksLinkPreparation(serviceLineId, preparationId, servicelineId, { clientId, userType }).then(extractData),
    
    unlinkPreparation: (serviceLineId: number, servicelineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.deleteServiceBooksUnlinkPreparation(serviceLineId, servicelineId, { clientId, userType }).then(extractData),
    
    linkService: (serviceLineId: number, serviceId: number, servicelineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.postServiceBooksLinkService(serviceLineId, serviceId, servicelineId, { clientId, userType }).then(extractData),
    
    unlinkService: (serviceLineId: number, servicelineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.deleteServiceBooksUnlinkService(serviceLineId, servicelineId, { clientId, userType }).then(extractData),
    
    linkReservation: (serviceLineId: number, reservationId: number, servicelineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.postServiceBooksLinkReservation(serviceLineId, reservationId, servicelineId, { clientId, userType }).then(extractData),
    
    unlinkReservation: (serviceLineId: number, servicelineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.deleteServiceBooksUnlinkReservation(serviceLineId, servicelineId, { clientId, userType }).then(extractData),
    
    updateRelationships: (serviceLineId: number, servicelineId: string, data: any, clientId?: string, userType?: string) =>
      OurbrideApi.putServiceBooksUpdateRelationships(serviceLineId, servicelineId, data, { clientId, userType }).then(extractData),
    
    // Categories
    getCategories: (clientId?: string) =>
      OurbrideApi.getServiceBooksGetAllCategories({ clientId }).then(extractData),
    
    getCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.getServiceBooksGetCategory(lineCategoryId, { clientId }).then(extractData),
    
    createCategory: (data: any, clientId?: string) =>
      OurbrideApi.postServiceBooksCreateCategory(data, { clientId }).then(extractData),
    
    updateCategory: (lineCategoryId: number, data: any, clientId?: string) =>
      OurbrideApi.putServiceBooksUpdateCategory(lineCategoryId, data, { clientId }).then(extractData),
    
    deleteCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.deleteServiceBooksDeleteCategory(lineCategoryId, { clientId }).then(extractData),
  },

  // ==================== TODO BOOKS ====================
  todoBooks: {
    // Initialize todo book
    init: (clientId?: string, userType?: string) =>
      OurbrideApi.postTodoBooksInit({ clientId, userType }).then(extractData),
    
    // Sync todo book
    sync: (data: any, clientId?: string, userType?: string) =>
      OurbrideApi.postTodoBooksSyncBook(data, { clientId, userType }).then(extractData),
    
    // Get todo book with lines
    getBook: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getTodoBooksGetBook({ clientId, userType, eventId }).then(extractData),
    
    // Get all todo lines
    getAll: (clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getTodoBooksGetAll({ clientId, userType, eventId }).then(extractData),
    
    // Get filtered todo lines
    getFiltered: (isDeleted: boolean, isDone: boolean, isFavorite: boolean, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.getTodoBooksGetAllCustom(isDeleted, isDone, isFavorite, { clientId, userType, eventId }).then(extractData),
    
    // Get done todo lines
    getDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getTodoBooksGetAllDone({ clientId, userType }).then(extractData),
    
    // Get not done todo lines
    getNotDone: (clientId?: string, userType?: string) =>
      OurbrideApi.getTodoBooksGetAllNotDone({ clientId, userType }).then(extractData),
    
    // Get favorite todo lines
    getFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getTodoBooksGetAllFavorite({ clientId, userType }).then(extractData),
    
    // Get not favorite todo lines
    getNotFavorite: (clientId?: string, userType?: string) =>
      OurbrideApi.getTodoBooksGetAllNotFavorite({ clientId, userType }).then(extractData),
    
    // Get deleted todo lines
    getDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getTodoBooksGetAllDelete({ clientId, userType }).then(extractData),
    
    // Get not deleted todo lines
    getNotDeleted: (clientId?: string, userType?: string) =>
      OurbrideApi.getTodoBooksGetAllNotDelete({ clientId, userType }).then(extractData),
    
    // Get single todo line
    get: (todoLineId: number, todolineId: string, clientId?: string) =>
      OurbrideApi.getTodoBooksGet(todoLineId, todolineId, { clientId }).then(extractData),
    
    // Create todo line
    create: (data: any, clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postTodoBooksCreate(data, { clientId, userType, eventId }).then(extractData),
    
    // Update todo line
    update: (todoLineId: number, todolineId: string, data: any, clientId?: string, userType?: string) =>
      OurbrideApi.putTodoBooksUpdate(todoLineId, todolineId, data, { clientId, userType }).then(extractData),
    
    // Delete todo line
    delete: (todoLineId: number, todolineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.deleteTodoBooksDelete(todoLineId, todolineId, { clientId, userType }).then(extractData),
    
    // Mark todo line as done
    markDone: (todoLineId: number, todolineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putTodoBooksDone(todoLineId, todolineId, { clientId, userType }).then(extractData),
    
    // Mark todo line as favorite
    markFavorite: (todoLineId: number, todolineId: string, clientId?: string, userType?: string) =>
      OurbrideApi.putTodoBooksFavorite(todoLineId, todolineId, { clientId, userType }).then(extractData),
    
    // Create multiple todo lines
    createAll: (data: any[], clientId?: string, userType?: string, eventId?: number) =>
      OurbrideApi.postTodoBooksCreateAll(data, { clientId, userType, eventId }).then(extractData),
    
    // Update multiple todo lines
    updateAll: (data: any[], clientId?: string, userType?: string) =>
      OurbrideApi.putTodoBooksUpdateAll(data, { clientId, userType }).then(extractData),
    
    // Delete multiple todo lines
    deleteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putTodoBooksDeleteAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple todo lines as done
    markDoneAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putTodoBooksDoneAll(data, { value, clientId, userType }).then(extractData),
    
    // Mark multiple todo lines as favorite
    markFavoriteAll: (data: number[], value?: boolean, clientId?: string, userType?: string) =>
      OurbrideApi.putTodoBooksFavoriteAll(data, { value, clientId, userType }).then(extractData),
    
    // Categories
    getCategories: (clientId?: string) =>
      OurbrideApi.getTodoBooksGetAllCategories({ clientId }).then(extractData),
    
    getCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.getTodoBooksGetCategory(lineCategoryId, { clientId }).then(extractData),
    
    createCategory: (data: any, clientId?: string) =>
      OurbrideApi.postTodoBooksCreateCategory(data, { clientId }).then(extractData),
    
    updateCategory: (lineCategoryId: number, data: any, clientId?: string) =>
      OurbrideApi.putTodoBooksUpdateCategory(lineCategoryId, data, { clientId }).then(extractData),
    
    deleteCategory: (lineCategoryId: number, clientId?: string) =>
      OurbrideApi.postTodoBooksDeleteCategory(lineCategoryId, { clientId }).then(extractData),
  },
};

export default plannerService;

