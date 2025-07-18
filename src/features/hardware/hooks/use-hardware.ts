import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/query-keys'
import { hardwareApi } from '../api/hardware-api'
import type { Hardware, HardwareFilters } from '../types/hardware'

export function useHardwareList(filters?: HardwareFilters) {
  return useQuery({
    queryKey: queryKeys.hardware.list(filters),
    queryFn: () => hardwareApi.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useHardware(id: string) {
  return useQuery({
    queryKey: queryKeys.hardware.detail(id),
    queryFn: () => hardwareApi.get(id),
    enabled: !!id,
  })
}

export function useCreateHardware() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Hardware>) => hardwareApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hardware.all })
      toast.success('Hardware created successfully')
    },
    onError: () => {
      toast.error('Failed to create hardware')
    },
  })
}

export function useUpdateHardware() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Hardware> }) =>
      hardwareApi.update(id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.hardware.detail(id),
      })

      const previousHardware = queryClient.getQueryData<Hardware>(
        queryKeys.hardware.detail(id)
      )

      if (previousHardware) {
        queryClient.setQueryData<Hardware>(queryKeys.hardware.detail(id), {
          ...previousHardware,
          ...data,
        })
      }

      return { previousHardware }
    },
    onError: (_error, variables, context) => {
      if (context?.previousHardware) {
        queryClient.setQueryData(
          queryKeys.hardware.detail(variables.id),
          context.previousHardware
        )
      }
      toast.error('Failed to update hardware')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hardware.all })
      toast.success('Hardware updated successfully')
    },
  })
}

export function useDeleteHardware() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => hardwareApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hardware.all })
      toast.success('Hardware deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete hardware')
    },
  })
}

export function useAugustLocks() {
  return useQuery({
    queryKey: ['august-locks'],
    queryFn: () => hardwareApi.getLocksList(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: false, // Only fetch when explicitly enabled
  })
}

export function useAugustSerialNumbers() {
  return useQuery({
    queryKey: ['august-serial-numbers'],
    queryFn: () => hardwareApi.getSNList(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: false, // Only fetch when explicitly enabled
  })
}
