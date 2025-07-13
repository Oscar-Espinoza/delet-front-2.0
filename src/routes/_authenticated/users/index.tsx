import { createFileRoute } from '@tanstack/react-router'
import Users from '@/features/users'

export const Route = createFileRoute('/_authenticated/users/')({
  component: Users,
  staticData: {
    title: 'Users',
    breadcrumb: 'Users',
    description: 'Manage user accounts and permissions'
  },
  preload: true,
  preloadStaleTime: 1000 * 60 * 5 // 5 minutes
})
