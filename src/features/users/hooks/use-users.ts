import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsersList, getUser, updateUser, deleteUser, inviteUser } from '../api/users-api'
import { queryKeys } from '@/lib/query-keys'
import type { User, GetUsersListParams } from '../types'

export const useUsersList = (params: GetUsersListParams = {}) => {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => getUsersList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.users.detail(userId),
    queryFn: () => getUser(userId),
    enabled: !!userId,
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) => 
      updateUser(userId, data),
    onMutate: async ({ userId, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.users.detail(userId) })
      await queryClient.cancelQueries({ queryKey: queryKeys.users.lists() })

      // Snapshot the previous values
      const previousUser = queryClient.getQueryData(queryKeys.users.detail(userId))
      const previousLists = queryClient.getQueriesData({ queryKey: queryKeys.users.lists() })

      // Optimistically update the user detail
      queryClient.setQueryData(queryKeys.users.detail(userId), (old: User | undefined) => {
        if (!old) return old
        return { ...old, ...data }
      })

      // Optimistically update all user lists
      queryClient.setQueriesData({ queryKey: queryKeys.users.lists() }, (old: User[] | undefined) => {
        if (!old) return old
        return old.map(user => 
          user._id === userId ? { ...user, ...data } : user
        )
      })

      // Return context for rollback
      return { previousUser, previousLists }
    },
    onError: (_err, { userId }, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          queryKeys.users.detail(userId),
          context.previousUser
        )
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
    },
    onSettled: (_data, _error, { userId }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(userId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, userId) => {
      // Invalidate queries to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
      queryClient.removeQueries({ queryKey: queryKeys.users.detail(userId) })
    },
  })
}

export const useInviteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: inviteUser,
    onSuccess: () => {
      // Invalidate the users list to refetch with the new user
      queryClient.invalidateQueries({ queryKey: queryKeys.users.lists() })
    },
  })
}