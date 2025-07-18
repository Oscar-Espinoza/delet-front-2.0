import { createFileRoute } from '@tanstack/react-router'
import SettingsAccount from '@/features/settings/account'

export const Route = createFileRoute('/_authenticated/settings/account')({
  component: SettingsAccount,
  staticData: {
    title: 'Account Settings',
    breadcrumb: 'Account',
    description: 'Manage your account details and security',
  },
})
