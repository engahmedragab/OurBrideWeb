/**
 * UI Store
 * 
 * Zustand store for UI state management (modals, sidebars, etc.).
 * 
 * @example
 * ```tsx
 * const { isModalOpen, openModal, closeModal } = useUIStore();
 * ```
 */

import { create } from 'zustand';
import type { ReactNode } from 'react';

interface UIState {
  // Modal state
  isModalOpen: boolean;
  modalContent: ReactNode | null;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;

  // Sidebar state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Modal
  isModalOpen: false,
  modalContent: null,
  openModal: (content) => set({ isModalOpen: true, modalContent: content }),
  closeModal: () => set({ isModalOpen: false, modalContent: null }),

  // Sidebar
  isSidebarOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // Theme
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));

