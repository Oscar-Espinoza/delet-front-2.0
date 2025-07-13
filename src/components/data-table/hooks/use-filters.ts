import { useState, useCallback } from 'react'
import { ColumnFiltersState } from '@tanstack/react-table'

export interface UseFiltersProps {
  initialFilters?: ColumnFiltersState
  onFiltersChange?: (filters: ColumnFiltersState) => void
}

export interface UseFiltersReturn {
  columnFilters: ColumnFiltersState
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
  setFilter: (columnId: string, value: unknown) => void
  getFilter: (columnId: string) => unknown
  resetFilters: () => void
  isFiltered: boolean
}

export function useFilters({
  initialFilters = [],
  onFiltersChange,
}: UseFiltersProps = {}): UseFiltersReturn {
  const [columnFilters, setColumnFiltersState] = useState<ColumnFiltersState>(initialFilters)

  const setColumnFilters = useCallback((
    updater: React.SetStateAction<ColumnFiltersState>
  ) => {
    setColumnFiltersState((prev) => {
      const newFilters = typeof updater === 'function' ? updater(prev) : updater
      onFiltersChange?.(newFilters)
      return newFilters
    })
  }, [onFiltersChange])

  const setFilter = useCallback((columnId: string, value: unknown) => {
    setColumnFilters((prev) => {
      const existingFilter = prev.find((filter) => filter.id === columnId)
      
      if (value === undefined || value === null || value === '') {
        // Remove filter if value is empty
        return prev.filter((filter) => filter.id !== columnId)
      }
      
      if (existingFilter) {
        // Update existing filter
        return prev.map((filter) =>
          filter.id === columnId ? { ...filter, value } : filter
        )
      }
      
      // Add new filter
      return [...prev, { id: columnId, value }]
    })
  }, [setColumnFilters])

  const getFilter = useCallback((columnId: string) => {
    const filter = columnFilters.find((f) => f.id === columnId)
    return filter?.value
  }, [columnFilters])

  const resetFilters = useCallback(() => {
    setColumnFilters([])
  }, [setColumnFilters])

  const isFiltered = columnFilters.length > 0

  return {
    columnFilters,
    setColumnFilters,
    setFilter,
    getFilter,
    resetFilters,
    isFiltered,
  }
}