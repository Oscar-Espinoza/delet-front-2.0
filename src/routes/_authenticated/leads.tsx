import { createFileRoute } from '@tanstack/react-router'
import Leads from '@/features/leads'

export const Route = createFileRoute('/_authenticated/leads')({
  component: LeadsComponent,
  staticData: {
    title: 'Leads',
    breadcrumb: 'Leads',
    description: 'Manage leads and prospects',
  },
  preload: true,
  preloadStaleTime: 1000 * 60 * 5, // 5 minutes
})

function LeadsComponent() {
  return <Leads />
}
