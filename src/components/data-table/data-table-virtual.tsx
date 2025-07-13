import {
  ColumnDef,
  Table as TanstackTable,
} from '@tanstack/react-table'

/**
 * Virtual Scrolling DataTable Component
 * 
 * This is a proof of concept for implementing virtual scrolling with TanStack Table.
 * To use this component, you need to install @tanstack/react-virtual:
 * 
 * pnpm add @tanstack/react-virtual
 * 
 * Then uncomment the import and implementation below.
 */

// import { useVirtualizer } from '@tanstack/react-virtual'

interface VirtualDataTableProps<TData, TValue> {
  table: TanstackTable<TData>
  columns: ColumnDef<TData, TValue>[]
  height?: number
  estimateSize?: number
  overscan?: number
  // Toolbar props
  searchColumn?: string
  searchPlaceholder?: string
  showToolbar?: boolean
}

export function DataTableVirtual<TData, TValue>({
  // Prefixed with underscore as they're unused in the placeholder implementation
  table: _table,
  columns: _columns,
  height: _height = 600,
  estimateSize: _estimateSize = 35,
  overscan: _overscan = 10,
  searchColumn: _searchColumn,
  searchPlaceholder: _searchPlaceholder,
  showToolbar: _showToolbar = true,
}: VirtualDataTableProps<TData, TValue>) {
  // Uncomment this implementation when @tanstack/react-virtual is installed
  
  /*
  const tableContainerRef = React.useRef<HTMLDivElement>(null)
  const { rows } = table.getRowModel()

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => estimateSize,
    overscan,
  })

  const virtualRows = rowVirtualizer.getVirtualItems()
  const totalSize = rowVirtualizer.getTotalSize()

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0

  return (
    <div className='space-y-4'>
      {showToolbar && (
        <DataTableToolbar
          table={table}
          searchColumn={searchColumn}
          searchPlaceholder={searchPlaceholder}
        />
      )}
      <div 
        ref={tableContainerRef}
        className='rounded-md border overflow-auto'
        style={{ height }}
      >
        <Table>
          <TableHeader className='sticky top-0 bg-background z-10'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index]
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ''}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
  */

  // Temporary implementation without virtual scrolling
  return (
    <div className='space-y-4'>
      <div className='rounded-md border p-8 text-center'>
        <h3 className='text-lg font-semibold mb-2'>Virtual Scrolling Ready</h3>
        <p className='text-muted-foreground mb-4'>
          To enable virtual scrolling for large datasets:
        </p>
        <code className='bg-muted px-2 py-1 rounded text-sm'>
          pnpm add @tanstack/react-virtual
        </code>
        <p className='text-sm text-muted-foreground mt-4'>
          Then uncomment the implementation in data-table-virtual.tsx
        </p>
      </div>
    </div>
  )
}

/**
 * Example usage:
 * 
 * import { DataTableVirtual, useDataTable } from '@/components/data-table'
 * 
 * function LargeDatasetTable({ data }) {
 *   const { table } = useDataTable({
 *     data, // thousands of rows
 *     columns,
 *   })
 * 
 *   return (
 *     <DataTableVirtual
 *       table={table}
 *       columns={columns}
 *       height={600}
 *       estimateSize={35}
 *       overscan={10}
 *     />
 *   )
 * }
 */