import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { hardwareApi } from '../api/hardware-api'
import type { Hardware, HardwareFilters } from '../types/hardware'
import { toast } from 'sonner'

const HARDWARE_QUERY_KEY = 'hardware'

export function useHardwareList(filters?: HardwareFilters) {
  return useQuery({
    queryKey: [HARDWARE_QUERY_KEY, 'list', filters],
    queryFn: () => hardwareApi.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useHardware(id: string) {
  return useQuery({
    queryKey: [HARDWARE_QUERY_KEY, id],
    queryFn: () => hardwareApi.get(id),
    enabled: !!id,
  })
}

export function useCreateHardware() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Hardware>) => hardwareApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HARDWARE_QUERY_KEY, 'list'] })
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
      await queryClient.cancelQueries({ queryKey: [HARDWARE_QUERY_KEY, id] })
      
      const previousHardware = queryClient.getQueryData<Hardware>([
        HARDWARE_QUERY_KEY,
        id,
      ])

      if (previousHardware) {
        queryClient.setQueryData<Hardware>([HARDWARE_QUERY_KEY, id], {
          ...previousHardware,
          ...data,
        })
      }

      return { previousHardware }
    },
    onError: (error, variables, context) => {
      if (context?.previousHardware) {
        queryClient.setQueryData(
          [HARDWARE_QUERY_KEY, variables.id],
          context.previousHardware
        )
      }
      toast.error('Failed to update hardware')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HARDWARE_QUERY_KEY] })
      toast.success('Hardware updated successfully')
    },
  })
}

export function useDeleteHardware() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => hardwareApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HARDWARE_QUERY_KEY, 'list'] })
      toast.success('Hardware deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete hardware')
    },
  })
}