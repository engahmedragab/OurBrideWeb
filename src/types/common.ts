/**
 * Common Types
 * 
 * Shared types used across the application.
 */

export interface ApiResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BaseEntity {
  id: number | string;
  createdAt?: string;
  updatedAt?: string;
}

export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

