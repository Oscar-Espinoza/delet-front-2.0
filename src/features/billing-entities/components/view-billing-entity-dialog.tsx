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
import { useBillingEntitiesContext } from '../context/use-billing-entities-context'

export function ViewBillingEntityDialog() {
  const {
    isViewDialogOpen,
    setIsViewDialogOpen,
    viewingEntity,
    setViewingEntity,
    setIsEditDialogOpen,
    setEditingEntity,
  } = useBillingEntitiesContext()

  if (!viewingEntity) return null

  const handleEdit = () => {
    setEditingEntity(viewingEntity)
    setIsEditDialogOpen(true)
    setIsViewDialogOpen(false)
  }

  const handleClose = () => {
    setIsViewDialogOpen(false)
    setViewingEntity(null)
  }

  const formatAddress = (address: typeof viewingEntity.billingAddress) => {
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

  return (
    <Dialog open={isViewDialogOpen} onOpenChange={handleClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Billing Entity Details</DialogTitle>
          <DialogDescription>
            View detailed information about the billing entity
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                Entity Name
              </h3>
              <p className='mt-1 text-sm font-medium'>
                {viewingEntity.entityName}
              </p>
            </div>

            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                Entity Type
              </h3>
              <Badge
                className='mt-1'
                variant={
                  viewingEntity.entityType === 'business'
                    ? 'default'
                    : 'secondary'
                }
              >
                {viewingEntity.entityType === 'business'
                  ? 'Business'
                  : 'Individual'}
              </Badge>
            </div>

            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                Email
              </h3>
              <p className='mt-1 text-sm'>
                <a
                  href={`mailto:${viewingEntity.email}`}
                  className='text-blue-600 hover:underline'
                >
                  {viewingEntity.email}
                </a>
              </p>
            </div>

            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                Phone
              </h3>
              <p className='mt-1 text-sm'>{viewingEntity.phone}</p>
            </div>

            {viewingEntity.taxId && (
              <div>
                <h3 className='text-muted-foreground text-sm font-medium'>
                  Tax ID
                </h3>
                <p className='mt-1 text-sm'>{viewingEntity.taxId}</p>
              </div>
            )}

            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                Status
              </h3>
              <Badge
                className='mt-1'
                variant={viewingEntity.isActive ? 'default' : 'destructive'}
              >
                {viewingEntity.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className='text-muted-foreground text-sm font-medium'>
              Billing Address
            </h3>
            <p className='mt-1 text-sm'>
              {formatAddress(viewingEntity.billingAddress)}
            </p>
          </div>

          {viewingEntity.qbCustomerId && (
            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                QuickBooks Customer ID
              </h3>
              <p className='mt-1 font-mono text-sm'>
                {viewingEntity.qbCustomerId}
              </p>
            </div>
          )}

          {viewingEntity.notes && (
            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                Notes
              </h3>
              <p className='mt-1 text-sm whitespace-pre-wrap'>
                {viewingEntity.notes}
              </p>
            </div>
          )}

          <Separator />

          <div className='text-muted-foreground grid grid-cols-2 gap-4 text-xs'>
            <div>
              <h3 className='font-medium'>Created</h3>
              <p>{new Date(viewingEntity.createdAt).toLocaleDateString()}</p>
            </div>

            <div>
              <h3 className='font-medium'>Last Updated</h3>
              <p>{new Date(viewingEntity.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleEdit}>Edit Entity</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
