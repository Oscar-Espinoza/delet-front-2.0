import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/bookings')({
  component: () => <BookingsLazy />,
})

import { lazy, Suspense } from 'react'

const Bookings = lazy(() => import('@/features/bookings'))

function BookingsLazy() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Bookings />
    </Suspense>
  )
}