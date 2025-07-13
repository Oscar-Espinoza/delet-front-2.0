import { createFileRoute } from '@tanstack/react-router'
import Settings from '@/features/settings'

export const Route = createFileRoute('/_authenticated/settings')({
  component: Settings,
  staticData: {
    title: 'Settings',
    breadcrumb: 'Settings',
    description: 'Configure application settings and preferences'
  }
})
