import {
  ColumnDef,
  flexRender,
  Table as TanstackTable,
} from '@tanstack/react-table'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'

interface DataTableProps<TData, TValue> {
  table: TanstackTable<TData>
  columns: ColumnDef<TData, TValue>[]
  isLoading?: boolean
  // Toolbar props
  searchColumn?: string
  searchPlaceholder?: string
  toolbarChildren?: React.ReactNode
  showToolbar?: boolean
  // Pagination props
  showPagination?: boolean
  pageSizeOptions?: number[]
  showSelectedRows?: boolean
  // Custom components
  toolbar?: React.ReactNode
  emptyState?: React.ReactNode
  loadingState?: React.ReactNode
}

export function DataTable<TData, TValue>({
  table,
  columns,
  isLoading = false,
  searchColumn,
  searchPlaceholder,
  toolbarChildren,
  showToolbar = true,
  showPagination = true,
  pageSizeOptions,
  showSelectedRows,
  toolbar,
  emptyState,
  loadingState,
}: DataTableProps<TData, TValue>) {
  const defaultLoadingState = (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={`skeleton-${index}`}>
          {columns.map((column, colIndex) => (
            <TableCell
              key={`skeleton-${index}-${colIndex}`}
              className={column.meta?.className ?? ''}
            >
              <Skeleton className='h-4 w-full' />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )

  const defaultEmptyState = (
    <TableRow>
      <TableCell
        colSpan={columns.length}
        className='h-[400px] text-center align-middle'
      >
        <div className='flex flex-col items-center justify-center'>
          <p className='text-muted-foreground'>No results found</p>
        </div>
      </TableCell>
    </TableRow>
  )

  return (
    <div className='space-y-4'>
      {showToolbar &&
        (toolbar || (
          <DataTableToolbar
            table={table}
            searchColumn={searchColumn}
            searchPlaceholder={searchPlaceholder}
          >
            {toolbarChildren}
          </DataTableToolbar>
        ))}
      <div className='min-h-[500px] rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={header.column.columnDef.meta?.className ?? ''}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading
              ? loadingState || defaultLoadingState
              : table.getRowModel().rows?.length
                ? table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className='group/row'
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className={
                            cell.column.columnDef.meta?.className ?? ''
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                : emptyState || defaultEmptyState}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
          showSelectedRows={showSelectedRows}
        />
      )}
    </div>
  )
}
