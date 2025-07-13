import { useState, useCallback } from 'react'
import { PaginationState } from '@tanstack/react-table'

export interface UsePaginationProps {
  defaultPageSize?: number
  defaultPageIndex?: number
  onPaginationChange?: (pagination: PaginationState) => void
}

export interface UsePaginationReturn {
  pagination: PaginationState
  setPagination: (pagination: PaginationState) => void
  setPageIndex: (pageIndex: number) => void
  setPageSize: (pageSize: number) => void
  nextPage: () => void
  previousPage: () => void
  canNextPage: (pageCount: number) => boolean
  canPreviousPage: () => boolean
}

export function usePagination({
  defaultPageSize = 10,
  defaultPageIndex = 0,
  onPaginationChange,
}: UsePaginationProps = {}): UsePaginationReturn {
  const [pagination, setPaginationState] = useState<PaginationState>({
    pageIndex: defaultPageIndex,
    pageSize: defaultPageSize,
  })

  const setPagination = useCallback((newPagination: PaginationState) => {
    setPaginationState(newPagination)
    onPaginationChange?.(newPagination)
  }, [onPaginationChange])

  const setPageIndex = useCallback((pageIndex: number) => {
    setPagination({ ...pagination, pageIndex })
  }, [pagination, setPagination])

  const setPageSize = useCallback((pageSize: number) => {
    setPagination({ pageIndex: 0, pageSize })
  }, [setPagination])

  const nextPage = useCallback(() => {
    setPageIndex(pagination.pageIndex + 1)
  }, [pagination.pageIndex, setPageIndex])

  const previousPage = useCallback(() => {
    setPageIndex(Math.max(0, pagination.pageIndex - 1))
  }, [pagination.pageIndex, setPageIndex])

  const canNextPage = useCallback((pageCount: number) => {
    return pagination.pageIndex < pageCount - 1
  }, [pagination.pageIndex])

  const canPreviousPage = useCallback(() => {
    return pagination.pageIndex > 0
  }, [pagination.pageIndex])

  return {
    pagination,
    setPagination,
    setPageIndex,
    setPageSize,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
  }
}