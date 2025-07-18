import { CircleIcon, CrossCircledIcon } from '@radix-ui/react-icons'
import { Package, CreditCard, CheckCircle } from 'lucide-react'

export const orderStatuses = [
  {
    value: 'waiting for payment information',
    label: 'Waiting for Payment',
    icon: CreditCard,
    color: 'text-yellow-600',
  },
  {
    value: 'assembling kits',
    label: 'Assembling Kits',
    icon: Package,
    color: 'text-blue-600',
  },
  {
    value: 'paid',
    label: 'Paid',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    value: 'complete',
    label: 'Complete',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  {
    value: 'cancelled',
    label: 'Cancelled',
    icon: CrossCircledIcon,
    color: 'text-red-600',
  },
]

export const orderTypes = [
  {
    value: 'purchase',
    label: 'Purchase',
    icon: Package,
  },
  {
    value: 'service',
    label: 'Service',
    icon: CircleIcon,
  },
]

export const dateRangeOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'Last 7 days', value: 'last7days' },
  { label: 'Last 30 days', value: 'last30days' },
  { label: 'This month', value: 'thisMonth' },
  { label: 'Last month', value: 'lastMonth' },
  { label: 'Custom range', value: 'custom' },
]
