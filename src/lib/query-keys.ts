/**
 * Centralized query key factory for TanStack Query
 * This ensures consistent query key patterns across the application
 * 
 * Usage examples:
 * - queryKeys.companies.list({ page: 1, limit: 10 })
 * - queryKeys.users.detail('user-id')
 * - queryKeys.leads.all
 * 
 * Benefits:
 * - Type-safe query keys
 * - Consistent patterns across the app
 * - Easy to refactor and maintain
 * - Prevents typos and inconsistencies
 */

export const queryKeys = {
  // Companies
  companies: {
    all: ['companies'] as const,
    lists: () => [...queryKeys.companies.all, 'list'] as const,
    list: (params?: unknown) => [...queryKeys.companies.lists(), params] as const,
    details: () => [...queryKeys.companies.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.companies.details(), id] as const,
  },

  // Users
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (params?: unknown) => [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    avatar: (userId: string) => [...queryKeys.users.all, 'avatar', userId] as const,
  },

  // Leads
  leads: {
    all: ['leads'] as const,
    lists: () => [...queryKeys.leads.all, 'list'] as const,
    list: (params?: unknown) => [...queryKeys.leads.lists(), params] as const,
    details: () => [...queryKeys.leads.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.leads.details(), id] as const,
  },

  // Bookings
  bookings: {
    all: ['bookings'] as const,
    lists: () => [...queryKeys.bookings.all, 'list'] as const,
    list: (params?: unknown) => [...queryKeys.bookings.lists(), params] as const,
    details: () => [...queryKeys.bookings.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.bookings.details(), id] as const,
  },

  // Hardware
  hardware: {
    all: ['hardware'] as const,
    lists: () => [...queryKeys.hardware.all, 'list'] as const,
    list: (params?: unknown) => [...queryKeys.hardware.lists(), params] as const,
    details: () => [...queryKeys.hardware.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.hardware.details(), id] as const,
  },

  // Kits
  kits: {
    all: ['kits'] as const,
    lists: () => [...queryKeys.kits.all, 'list'] as const,
    list: (params?: unknown) => [...queryKeys.kits.lists(), params] as const,
    details: () => [...queryKeys.kits.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.kits.details(), id] as const,
  },

  // Structures
  structures: {
    all: ['structures'] as const,
    lists: () => [...queryKeys.structures.all, 'list'] as const,
    list: (params?: unknown) => [...queryKeys.structures.lists(), params] as const,
    details: () => [...queryKeys.structures.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.structures.details(), id] as const,
  },

  // Orders
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (params?: unknown) => [...queryKeys.orders.lists(), params] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
  },

  // Agents
  agents: {
    all: ['agents'] as const,
    lists: () => [...queryKeys.agents.all, 'list'] as const,
    list: (params?: unknown) => [...queryKeys.agents.lists(), params] as const,
    details: () => [...queryKeys.agents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.agents.details(), id] as const,
  },

  // Properties
  properties: {
    all: ['properties'] as const,
    lists: () => [...queryKeys.properties.all, 'list'] as const,
    list: (params?: unknown) => [...queryKeys.properties.lists(), params] as const,
    details: () => [...queryKeys.properties.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.properties.details(), id] as const,
  },
} as const