import { useCallback, useMemo } from 'react'
import { Table } from '@tanstack/react-table'

export interface FilterOption {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
}

export interface UseTableFiltersProps<TData> {
  table: Table<TData>
}

export interface UseTableFiltersReturn<_TData> {
  // Text filters
  setTextFilter: (columnId: string, value: string) => void
  getTextFilter: (columnId: string) => string

  // Faceted filters
  setFacetedFilter: (columnId: string, values: string[]) => void
  getFacetedFilter: (columnId: string) => string[]
  toggleFacetedFilter: (columnId: string, value: string) => void

  // Date range filters
  setDateRangeFilter: (
    columnId: string,
    range: { from?: Date; to?: Date }
  ) => void
  getDateRangeFilter: (columnId: string) => { from?: Date; to?: Date }

  // Utility functions
  resetFilter: (columnId: string) => void
  resetAllFilters: () => void
  isFiltered: boolean
  activeFilters: { id: string; value: unknown }[]
}

export function useTableFilters<TData>({
  table,
}: UseTableFiltersProps<TData>): UseTableFiltersReturn<TData> {
  // Text filter handlers
  const setTextFilter = useCallback(
    (columnId: string, value: string) => {
      const column = table.getColumn(columnId)
      column?.setFilterValue(value || undefined)
    },
    [table]
  )

  const getTextFilter = useCallback(
    (columnId: string): string => {
      const column = table.getColumn(columnId)
      return (column?.getFilterValue() as string) || ''
    },
    [table]
  )

  // Faceted filter handlers
  const setFacetedFilter = useCallback(
    (columnId: string, values: string[]) => {
      const column = table.getColumn(columnId)
      column?.setFilterValue(values.length ? values : undefined)
    },
    [table]
  )

  const getFacetedFilter = useCallback(
    (columnId: string): string[] => {
      const column = table.getColumn(columnId)
      return (column?.getFilterValue() as string[]) || []
    },
    [table]
  )

  const toggleFacetedFilter = useCallback(
    (columnId: string, value: string) => {
      const column = table.getColumn(columnId)
      const currentValues = new Set(
        (column?.getFilterValue() as string[]) || []
      )

      if (currentValues.has(value)) {
        currentValues.delete(value)
      } else {
        currentValues.add(value)
      }

      const newValues = Array.from(currentValues)
      column?.setFilterValue(newValues.length ? newValues : undefined)
    },
    [table]
  )

  // Date range filter handlers
  const setDateRangeFilter = useCallback(
    (columnId: string, range: { from?: Date; to?: Date }) => {
      const column = table.getColumn(columnId)
      column?.setFilterValue(range.from || range.to ? range : undefined)
    },
    [table]
  )

  const getDateRangeFilter = useCallback(
    (columnId: string): { from?: Date; to?: Date } => {
      const column = table.getColumn(columnId)
      return (column?.getFilterValue() as { from?: Date; to?: Date }) || {}
    },
    [table]
  )

  // Utility functions
  const resetFilter = useCallback(
    (columnId: string) => {
      const column = table.getColumn(columnId)
      column?.setFilterValue(undefined)
    },
    [table]
  )

  const resetAllFilters = useCallback(() => {
    table.resetColumnFilters()
  }, [table])

  const isFiltered = table.getState().columnFilters.length > 0

  const activeFilters = useMemo(() => {
    return table.getState().columnFilters.map((filter) => ({
      id: filter.id,
      value: filter.value,
    }))
  }, [table])

  return {
    setTextFilter,
    getTextFilter,
    setFacetedFilter,
    getFacetedFilter,
    toggleFacetedFilter,
    setDateRangeFilter,
    getDateRangeFilter,
    resetFilter,
    resetAllFilters,
    isFiltered,
    activeFilters,
  }
}
