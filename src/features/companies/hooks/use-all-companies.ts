import { useQuery } from '@tanstack/react-query'
import { companiesApi } from '../api'
import { Company } from '../types'

/**
 * Hook to fetch all companies without pagination
 * Useful for select dropdowns and other UI components that need the full list
 */
export function useAllCompanies() {
  return useQuery<Company[]>({
    queryKey: ['companies', 'all'],
    queryFn: async () => {
      const response = await companiesApi.getCompanies({
        page: 0,
        limit: 1000, // Large limit to get all companies
        isAdmin: true,
      })
      return response.companies
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
