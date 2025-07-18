import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query-keys'
import { getCurrentUser } from '../api/users-api'

export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.users.current,
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  })
}
