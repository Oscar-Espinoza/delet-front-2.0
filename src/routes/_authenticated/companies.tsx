import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/companies')({
  component: () => <CompaniesComponent />,
})

import Companies from '@/features/companies'

function CompaniesComponent() {
  return <Companies />
}