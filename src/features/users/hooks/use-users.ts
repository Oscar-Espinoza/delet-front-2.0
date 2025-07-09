import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsersList, getUser, updateUser, deleteUser, inviteUser } from '../api/users-api'
import type { User, GetUsersListParams } from '../types'

export const USERS_QUERY_KEY = 'users'

export const useUsersList = (params: GetUsersListParams = {}) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, 'list', params],
    queryFn: () => getUsersList(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) => 
      updateUser(userId, data),
    onSuccess: (updatedUser) => {
      // Update the user in the list cache
      queryClient.setQueryData(
        [USERS_QUERY_KEY],
        (oldData: User[] | undefined) => {
          if (!oldData) return oldData
          return oldData.map(user => 
            user._id === updatedUser._id ? updatedUser : user
          )
        }
      )
      // Update the individual user cache
      queryClient.setQueryData([USERS_QUERY_KEY, updatedUser._id], updatedUser)
    },
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: (_, userId) => {
      // Remove user from the list cache
      queryClient.setQueryData(
        [USERS_QUERY_KEY],
        (oldData: User[] | undefined) => {
          if (!oldData) return oldData
          return oldData.filter(user => user._id !== userId)
        }
      )
      // Invalidate the users list query
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY, 'list'] })
    },
  })
}

export const useInviteUser = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: inviteUser,
    onSuccess: () => {
      // Invalidate the users list to refetch with the new user
      queryClient.invalidateQueries({ queryKey: [USERS_QUERY_KEY, 'list'] })
    },
  })
}