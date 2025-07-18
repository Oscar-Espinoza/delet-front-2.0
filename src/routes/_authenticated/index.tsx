import { createFileRoute } from '@tanstack/react-router'
import Companies from '@/features/companies'

export const Route = createFileRoute('/_authenticated/')({
  component: Companies,
  staticData: {
    title: 'Companies',
    breadcrumb: 'Companies',
    description: 'Manage your companies and their information',
  },
  preload: true,
  preloadStaleTime: 1000 * 60 * 5, // 5 minutes - company data cache
})
