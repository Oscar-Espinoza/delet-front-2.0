import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { useOrdersContext } from '../context/use-orders-context'
import {
  getOrderStatusLabel,
  getOrderStatusColor,
  getOrderTypeLabel,
} from '../data/schema'
import type { Address } from '@/types/common'

export function ViewOrderDialog() {
  const { isViewDialogOpen, setIsViewDialogOpen, viewingOrder, setViewingOrder } =
    useOrdersContext()

  if (!viewingOrder) return null

  const handleClose = () => {
    setIsViewDialogOpen(false)
    setViewingOrder(null)
  }

  const formatAddress = (address: Address | null | undefined) => {
    if (!address) return 'No address provided'

    const parts = [
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.country,
    ].filter(Boolean)

    return parts.join(', ')
  }

  const getCompanyName = () => {
    if (typeof viewingOrder.company === 'string') {
      return viewingOrder.company
    }
    return viewingOrder.company?.name || 'Unknown Company'
  }

  const getUserName = () => {
    if (typeof viewingOrder.user === 'string') {
      return viewingOrder.user
    }
    const user = viewingOrder.user
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`
    }
    return user?.email || 'Unknown User'
  }

  const getUserEmail = () => {
    if (typeof viewingOrder.user === 'string') {
      return ''
    }
    return viewingOrder.user?.email || ''
  }

  const getDiscountInfo = () => {
    if (!viewingOrder.discount) return null
    if (typeof viewingOrder.discount === 'string') {
      return viewingOrder.discount
    }
    return `${viewingOrder.discount.code} (${viewingOrder.discount.percentage}%)`
  }

  return (
    <Dialog open={isViewDialogOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>
            View detailed information about the order
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                Order ID
              </h3>
              <p className='mt-1 font-mono text-sm'>{viewingOrder._id}</p>
            </div>

            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                Status
              </h3>
              <Badge className={`mt-1 ${getOrderStatusColor(viewingOrder.status)}`}>
                {getOrderStatusLabel(viewingOrder.status)}
              </Badge>
            </div>

            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                Type
              </h3>
              <Badge className='mt-1' variant='secondary'>
                {getOrderTypeLabel(viewingOrder.type)}
              </Badge>
            </div>

            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                Quantity
              </h3>
              <p className='mt-1 text-sm font-medium'>{viewingOrder.quantity}</p>
            </div>

            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                Company
              </h3>
              <p className='mt-1 text-sm'>{getCompanyName()}</p>
            </div>

            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                Customer
              </h3>
              <div className='mt-1 text-sm'>
                <p className='font-medium'>{getUserName()}</p>
                {getUserEmail() && (
                  <p className='text-muted-foreground text-xs'>{getUserEmail()}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {viewingOrder.deliveryAddresses && viewingOrder.deliveryAddresses.length > 0 && (
            <div>
              <h3 className='text-muted-foreground mb-3 text-sm font-medium'>
                Delivery Addresses ({viewingOrder.deliveryAddresses.length})
              </h3>
              <div className='space-y-3'>
                {viewingOrder.deliveryAddresses.map((delivery, index) => (
                  <div key={index} className='border rounded-lg p-3'>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <h4 className='text-muted-foreground text-xs font-medium'>
                          Address
                        </h4>
                        <p className='mt-1 text-sm'>{formatAddress(delivery.address)}</p>
                      </div>
                      <div>
                        <h4 className='text-muted-foreground text-xs font-medium'>
                          Quantity
                        </h4>
                        <p className='mt-1 text-sm'>{delivery.quantity}</p>
                      </div>
                      {delivery.assignedKits && (
                        <div>
                          <h4 className='text-muted-foreground text-xs font-medium'>
                            Assigned Kits
                          </h4>
                          <p className='mt-1 text-sm'>{delivery.assignedKits}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {getDiscountInfo() && (
            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                Discount
              </h3>
              <p className='mt-1 text-sm'>{getDiscountInfo()}</p>
            </div>
          )}

          {viewingOrder.notes && (
            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                Notes
              </h3>
              <p className='mt-1 text-sm whitespace-pre-wrap'>{viewingOrder.notes}</p>
            </div>
          )}

          <Separator />

          <div className='text-muted-foreground text-xs'>
            <h3 className='font-medium'>Created</h3>
            <p>{new Date(viewingOrder.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}