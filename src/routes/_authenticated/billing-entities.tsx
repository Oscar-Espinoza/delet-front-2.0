import { createFileRoute } from '@tanstack/react-router'
import BillingEntities from '@/features/billing-entities'

export const Route = createFileRoute('/_authenticated/billing-entities')({
  component: BillingEntitiesComponent,
  staticData: {
    title: 'Billing Entities',
    breadcrumb: 'Billing Entities',
    description: 'Manage billing entities and payment information',
  },
  preload: true,
  preloadStaleTime: 1000 * 60 * 5, // 5 minutes
})

function BillingEntitiesComponent() {
  return <BillingEntities />
}
