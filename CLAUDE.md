# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `pnpm dev` - Start development server (Vite)
- `pnpm build` - Build for production (TypeScript check + Vite build)
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm knip` - Check for dead code/unused exports

### Testing
No test runner is currently configured. When implementing tests, consider adding Vitest which integrates well with Vite.

## Architecture Overview

### Tech Stack
- **React 19.1.0** with TypeScript 5.8.3
- **Vite 7.0.0** with React SWC plugin for fast HMR
- **TanStack Router** for file-based routing with code splitting
- **TanStack Query** for server state management
- **Zustand** for client state management
- **TailwindCSS v4** with CSS-in-JS approach
- **ShadcnUI** components built on RadixUI primitives
- **React Hook Form + Zod** for form handling and validation

### Project Structure
```
src/
├── features/         # Feature modules (auth, dashboard, tasks, users, etc.)
├── components/       # Reusable UI components
│   ├── layout/      # App shell (sidebar, header, footer)
│   └── ui/          # ShadcnUI primitive components
├── routes/          # TanStack Router route definitions
├── stores/          # Zustand stores (auth, UI state)
├── context/         # React Context providers (theme, font, search)
├── hooks/           # Custom React hooks
└── lib/             # Utilities (cn function, formatters)
```

### Key Patterns

#### Routing
- File-based routing in `src/routes/`
- Protected routes in `_authenticated/` directory
- Route components lazy-loaded for code splitting
- Error boundaries at route level
- Add route metadata (title, breadcrumb, description) for better navigation
- Configure preloading for frequently accessed routes

#### State Management
- **Server State**: TanStack Query with caching strategies
- **Client State**: Zustand stores in `src/stores/`
- **UI State**: Context API for theme, font, search

#### TanStack Query Patterns
- **Query Keys**: Use centralized query key factory from `@/lib/query-keys`
- **Optimistic Updates**: Implement for better UX on mutations
- **Pattern Example**:
  ```tsx
  import { queryKeys } from '@/lib/query-keys'
  
  // Use factory pattern for query keys
  useQuery({
    queryKey: queryKeys.companies.list(params),
    queryFn: () => companiesApi.getCompanies(params),
  })
  
  // Implement optimistic updates
  useMutation({
    mutationFn: updateCompany,
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.companies.all })
      const previous = queryClient.getQueryData(queryKeys.companies.detail(id))
      queryClient.setQueryData(queryKeys.companies.detail(id), newData)
      return { previous }
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(queryKeys.companies.detail(id), context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companies.all })
    }
  })
  ```

#### Component Architecture
- Compound components pattern (e.g., DataTable)
- Controlled components with React Hook Form
- Accessibility via RadixUI primitives
- Consistent prop interfaces across UI components

#### Data Tables
- Use shared DataTable components from `@/components/data-table/`
- Leverage reusable hooks: `useDataTable`, `usePagination`, `useFilters`
- Example implementation:
  ```tsx
  import { DataTable } from '@/components/data-table/data-table'
  import { columns } from './columns'
  
  <DataTable
    columns={columns}
    data={data}
    loading={isLoading}
    manualPagination
    pageCount={pageCount}
  />
  ```

#### Feature Page Structure
Every feature page should follow this structure:
```tsx
<FeatureProvider>
  <Header fixed>
    <Search />
    <div className='ml-auto flex items-center space-x-4'>
      <ThemeSwitch />
      <ProfileDropdown />
    </div>
  </Header>
  
  <Main>
    <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
      <div>
        <h2 className='text-2xl font-bold tracking-tight'>Feature Title</h2>
        <p className='text-muted-foreground'>Feature description</p>
      </div>
      <PrimaryButtons />
    </div>
    <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
      {/* Main content */}
    </div>
  </Main>
  
  <Dialogs />
</FeatureProvider>
```

#### Authentication
- Auth store in `src/stores/authStore.ts` manages JWT tokens
- Protected route wrapper checks auth state
- Clerk integration partially implemented (can be extended)

### Transforming to Admin Panel

When adapting this template for your admin panel:

1. **API Integration**
   - Update `src/lib/api-client.ts` with your backend URL
   - Implement actual API calls in feature modules
   - Configure TanStack Query default options

2. **Authentication**
   - Complete the auth flow in `src/stores/authStore.ts`
   - Update protected route logic if needed
   - Implement token refresh mechanism

3. **Feature Development**
   - Each feature should live in `src/features/[feature-name]/`
   - Include: components, hooks, types, and API calls
   - Follow existing patterns from users/tasks features

### Implementation Planning

When implementing new features:
1. **Create a TASK.md file** with clear milestones before starting implementation
2. **Use the TodoWrite tool** to track progress throughout development
3. **Update milestones** as you complete each phase
4. Structure milestones as:
   - API Integration Setup
   - Data Types & Interfaces
   - Feature Module Structure
   - UI Components
   - Routing
   - State Management
   - Testing & Polish

4. **Data Tables**
   - Use the existing DataTable component pattern
   - Define columns with proper TypeScript types
   - Implement server-side pagination/filtering if needed

5. **Forms**
   - Use React Hook Form with Zod schemas
   - Follow existing form patterns in the codebase
   - Leverage UI form components for consistency

### Important Conventions

- **Imports**: Use `@/` alias for src directory imports
- **Components**: Export as default from feature modules
- **Types**: Define in dedicated types files within features
- **API Calls**: Wrap in TanStack Query hooks for caching
- **Error Handling**: Use error boundaries and toast notifications
- **Loading States**: Leverage React Suspense with route-based code splitting

### Common Import Patterns

When implementing features, be aware of these import patterns:

1. **Toast Notifications**: Use `import { toast } from 'sonner'`
   - Use `toast.success('message')` for success messages
   - Use `toast.error('message')` for error messages
   - DO NOT import from `@/hooks/use-toast` (doesn't exist)

2. **Routing**: 
   - DO NOT use `useSearchParams` from TanStack Router
   - Use `useState` for pagination state management
   - Follow the pattern in existing features (companies, users)

3. **Layout Components**: All feature pages should use:
   ```tsx
   import { Header } from '@/components/layout/header'
   import { Main } from '@/components/layout/main'
   import { ProfileDropdown } from '@/components/profile-dropdown'
   import { Search } from '@/components/search'
   import { ThemeSwitch } from '@/components/theme-switch'
   ```

4. **Check Existing Patterns**: Before importing, always check how similar functionality is imported in existing features to maintain consistency

### Troubleshooting Common Issues

#### Import Errors
When encountering import errors:
1. **Check if the component exists** - Some components might be referenced but not created (e.g., PageHeader)
2. **Verify import paths** - Use existing features as reference
3. **Check library exports** - Not all functions are exported from all libraries
4. **Follow established patterns** - Don't introduce new patterns without checking existing code

#### Pattern Consistency
- Always examine 2-3 similar features before implementing
- Copy the structure from existing features and adapt
- Don't assume common patterns from other projects apply here

### Current Features to Adapt

The template includes these features you can modify:
- Dashboard with charts and metrics
- User management with CRUD operations
- Task management system
- Settings module with appearance customization
- Chat interface (can be adapted for support/messaging)
- Complete authentication flow pages