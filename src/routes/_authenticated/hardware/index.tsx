import { createFileRoute } from '@tanstack/react-router'
import Hardware from '@/features/hardware'

export const Route = createFileRoute('/_authenticated/hardware/')({
  component: Hardware,
})
