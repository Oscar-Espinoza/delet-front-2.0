import { createFileRoute } from '@tanstack/react-router'
import Dashboard from '@/features/dashboard'

export const Route = createFileRoute('/_authenticated/')({
  component: Dashboard,
  staticData: {
    title: 'Dashboard',
    breadcrumb: 'Dashboard',
    description: 'Overview and analytics'
  },
  preload: true,
  preloadStaleTime: 1000 * 60 * 10 // 10 minutes - dashboard data can be cached longer
})
