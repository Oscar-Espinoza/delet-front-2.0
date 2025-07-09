import { createFileRoute } from '@tanstack/react-router'
import { lazy } from 'react'

const Hardware = lazy(() => import('@/features/hardware'))

export const Route = createFileRoute('/_authenticated/hardware/')({
  component: Hardware,
})