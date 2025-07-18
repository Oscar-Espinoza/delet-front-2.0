# Shared Data Table Components

This directory contains reusable TanStack Table components and hooks to reduce code duplication across features.

## Benefits

- **Reduced Code Duplication**: Shared components eliminate repetitive table implementations
- **Consistent UX**: All tables behave the same way across the application
- **Easy Maintenance**: Bug fixes and improvements apply to all tables
- **Type Safety**: Full TypeScript support with generics
- **Flexible**: Can be customized per feature while maintaining shared functionality

## Quick Start

### Basic Table with Client-Side Data

```tsx
import { DataTable, useDataTable } from '@/components/data-table'
import { columns } from './columns'

function MyTable({ data, isLoading }) {
  const { table } = useDataTable({
    data,
    columns,
  })

  return (
    <DataTable
      table={table}
      columns={columns}
      isLoading={isLoading}
      searchColumn='name'
      searchPlaceholder='Search by name...'
    />
  )
}
```

### Server-Side Pagination

```tsx
import { DataTable, useDataTable } from '@/components/data-table'
import { columns } from './columns'

function MyServerTable({ data, isLoading, pageCount, onPaginationChange }) {
  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    manualPagination: true,
    onPaginationChange,
  })

  return <DataTable table={table} columns={columns} isLoading={isLoading} />
}
```

## Components

### DataTable

The main table component with built-in toolbar, pagination, and loading states.

Props:

- `table`: TanStack table instance
- `columns`: Column definitions
- `isLoading`: Loading state
- `searchColumn`: Column to search by
- `searchPlaceholder`: Search input placeholder
- `showToolbar`: Show/hide toolbar
- `showPagination`: Show/hide pagination
- `emptyState`: Custom empty state component
- `loadingState`: Custom loading state component

### DataTableColumnHeader

Sortable column header with dropdown menu.

```tsx
import { DataTableColumnHeader } from '@/components/data-table'

const columns = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
  },
]
```

### DataTableFacetedFilter

Multi-select filter for categorical data.

```tsx
import { DataTableFacetedFilter } from '@/components/data-table'

;<DataTableFacetedFilter
  column={table.getColumn('status')}
  title='Status'
  options={[
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ]}
/>
```

## Hooks

### useDataTable

Main hook for table state management.

```tsx
const { table, rowSelection, columnFilters, sorting } = useDataTable({
  data,
  columns,
  pageCount, // for server-side pagination
  manualPagination: true, // enable server-side pagination
  onPaginationChange, // callback for pagination changes
})
```

### usePagination

Standalone pagination hook for custom implementations.

```tsx
const { pagination, setPageIndex, setPageSize } = usePagination({
  defaultPageSize: 20,
  onPaginationChange: (pagination) => {
    // Handle pagination change
  },
})
```

### useFilters

Standalone filters hook for custom implementations.

```tsx
const { columnFilters, setFilter, resetFilters, isFiltered } = useFilters({
  initialFilters: [],
  onFiltersChange: (filters) => {
    // Handle filter changes
  },
})
```

## Migration Guide

To migrate existing tables:

1. Replace table state management with `useDataTable` hook
2. Replace table JSX with `DataTable` component
3. Update column imports to use shared components
4. Remove local DataTablePagination, DataTableToolbar components

### Before:

```tsx
const [rowSelection, setRowSelection] = useState({})
const [columnVisibility, setColumnVisibility] = useState({})
// ... more state

const table = useReactTable({
  // ... configuration
})

return (
  <div className='space-y-4'>
    <DataTableToolbar table={table} />
    <Table>...</Table>
    <DataTablePagination table={table} />
  </div>
)
```

### After:

```tsx
const { table } = useDataTable({ data, columns })

return (
  <DataTable
    table={table}
    columns={columns}
    searchColumn='name'
  />
)
```
