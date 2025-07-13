import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/leads')({
  component: () => <LeadsComponent />,
})

import Leads from '@/features/leads'

function LeadsComponent() {
  return <Leads />
}