import { createFileRoute } from '@tanstack/react-router'
import Companies from '@/features/companies'

export const Route = createFileRoute('/_authenticated/companies')({
  component: CompaniesComponent,
  staticData: {
    title: 'Companies',
    breadcrumb: 'Companies',
    description: 'Manage company profiles and information',
  },
  preload: true,
  preloadStaleTime: 1000 * 60 * 5, // 5 minutes
})

function CompaniesComponent() {
  return <Companies />
}
