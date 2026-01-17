/**
 * Centralized mappers for all planning book types
 * Using namespace exports to avoid naming conflicts
 */

// Preparations (ServiceBook) mappers
export * as PreparationsMappers from './preparationsMappers'

// Events (EventBook) mappers
export * as EventsMappers from './eventsMappers'

// Todo (TodoBook) mappers
export * as TodoMappers from './todoMappers'

// Items (ItemBook) mappers
export * as ItemsMappers from './itemsMappers'

// Budget (BudgetBook) mappers
export * as BudgetMappers from './budgetMappers'

// Occasions (OccasionBook) mappers
export * as OccasionMappers from './occasionMappers'

// Invitations (GuestBook) mappers
export * as InvitationMappers from './invitationMappers'

// Notes (NoteBook) mappers
export * as NoteMappers from './noteMappers'

// Re-export types that don't conflict (unique to each mapper)
export type { EventBookWithCategories } from './eventsMappers'
export type { UiItem, UiCategory } from './itemsMappers'
export type { UiTodo, UiTodoCategory } from './todoMappers'
