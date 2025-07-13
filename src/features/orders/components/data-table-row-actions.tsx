import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { 
  Eye, 
  Package, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Trash2,
  Edit,
  FileText
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate } from '@tanstack/react-router'
import { useUpdateOrderStatus, useCancelOrder } from '../hooks/use-orders'
import { Order } from '../data/schema'
import { OrderStatus } from '../types'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const navigate = useNavigate()
  const order = row.original as Order
  const updateStatus = useUpdateOrderStatus()
  const cancelOrder = useCancelOrder()

  const handleStatusChange = (status: OrderStatus) => {
    updateStatus.mutate({ id: order._id, status })
  }

  const handleCancelOrder = () => {
    cancelOrder.mutate({ id: order._id })
  }

  const statusOptions: { value: OrderStatus; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { 
      value: 'waiting for payment information', 
      label: 'Waiting for Payment',
      icon: CreditCard
    },
    { 
      value: 'assembling kits', 
      label: 'Assembling Kits',
      icon: Package
    },
    { 
      value: 'paid', 
      label: 'Paid',
      icon: CheckCircle
    },
    { 
      value: 'complete', 
      label: 'Complete',
      icon: CheckCircle
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={() => navigate({ to: `/orders/${order._id}` })}>
          <Eye className='mr-2 h-4 w-4' />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Edit className='mr-2 h-4 w-4' />
          Edit Order
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FileText className='mr-2 h-4 w-4' />
          View Invoice
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Package className='mr-2 h-4 w-4' />
            Update Status
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup 
              value={order.status} 
              onValueChange={(value) => handleStatusChange(value as OrderStatus)}
            >
              {statusOptions.map((option) => (
                <DropdownMenuRadioItem 
                  key={option.value} 
                  value={option.value}
                  disabled={order.status === option.value}
                >
                  <option.icon className='mr-2 h-4 w-4' />
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleCancelOrder}
          disabled={order.status === 'cancelled' || order.status === 'complete'}
        >
          <XCircle className='mr-2 h-4 w-4' />
          Cancel Order
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className='text-red-600'>
          <Trash2 className='mr-2 h-4 w-4' />
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}