import { createFileRoute } from '@tanstack/react-router'
import Bookings from '@/features/bookings'

export const Route = createFileRoute('/_authenticated/bookings')({
  component: Bookings,
  staticData: {
    title: 'Bookings',
    breadcrumb: 'Bookings',
    description: 'Manage bookings and reservations',
  },
  preload: true,
  preloadStaleTime: 1000 * 60 * 3, // 3 minutes - bookings data changes more frequently
})
