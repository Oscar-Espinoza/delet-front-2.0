import { createFileRoute } from '@tanstack/react-router'
import KitsPage from '@/features/kits'

export const Route = createFileRoute('/_authenticated/kits')({
  component: KitsPage,
})