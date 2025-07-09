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

#### State Management
- **Server State**: TanStack Query with caching strategies
- **Client State**: Zustand stores in `src/stores/`
- **UI State**: Context API for theme, font, search

#### Component Architecture
- Compound components pattern (e.g., DataTable)
- Controlled components with React Hook Form
- Accessibility via RadixUI primitives
- Consistent prop interfaces across UI components

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

### Current Features to Adapt

The template includes these features you can modify:
- Dashboard with charts and metrics
- User management with CRUD operations
- Task management system
- Settings module with appearance customization
- Chat interface (can be adapted for support/messaging)
- Complete authentication flow pages