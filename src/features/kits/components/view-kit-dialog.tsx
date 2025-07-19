import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useKitsContext } from '../context/kits-context'
import {
  formatShippingAddress,
} from '../types'
import { HardwareStatusCell } from './hardware-status-cell'

export function ViewKitDialog() {
  const { isViewDialogOpen, setIsViewDialogOpen, selectedKit } =
    useKitsContext()

  if (!selectedKit) return null

  return (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Kit Details</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Name
            </h4>
            <p className='text-sm'>{selectedKit.name}</p>
          </div>

          {selectedKit.description && (
            <div>
              <h4 className='text-muted-foreground text-sm font-medium'>
                Description
              </h4>
              <p className='text-sm'>{selectedKit.description}</p>
            </div>
          )}

          {selectedKit.notes && (
            <div>
              <h4 className='text-muted-foreground text-sm font-medium'>
                Notes
              </h4>
              <p className='text-sm'>{selectedKit.notes}</p>
            </div>
          )}

          {selectedKit.tags && selectedKit.tags.length > 0 && (
            <div>
              <h4 className='text-muted-foreground mb-2 text-sm font-medium'>
                Tags
              </h4>
              <div className='flex flex-wrap gap-2'>
                {selectedKit.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant='secondary'>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className='text-muted-foreground text-sm font-medium'>
              Company
            </h4>
            <p className='text-sm'>{selectedKit.company?.name || '-'}</p>
          </div>

          {selectedKit.billingEntity && (
            <div>
              <h4 className='text-muted-foreground text-sm font-medium'>
                Billed To
              </h4>
              <p className='text-sm'>{selectedKit.billingEntity.entityName}</p>
            </div>
          )}

          {selectedKit.property && (
            <div>
              <h4 className='text-muted-foreground text-sm font-medium'>
                Property
              </h4>
              <p className='text-sm'>
                {selectedKit.property.shortAddress}
                {selectedKit.property.unit &&
                  ` Unit ${selectedKit.property.unit}`}
                {selectedKit.property.city &&
                  selectedKit.property.state &&
                  ` - ${selectedKit.property.city}, ${selectedKit.property.state}`}
              </p>
            </div>
          )}

          {selectedKit.shippingAddress && (
            <div>
              <h4 className='text-muted-foreground text-sm font-medium'>
                Shipping Address
              </h4>
              <p className='text-sm'>
                {formatShippingAddress(selectedKit.shippingAddress)}
              </p>
            </div>
          )}

          {selectedKit.hardware && selectedKit.hardware.length > 0 && (
            <div>
              <h4 className='text-muted-foreground mb-2 text-sm font-medium'>
                Hardware Status
              </h4>
              <HardwareStatusCell hardware={selectedKit.hardware} />
            </div>
          )}

          {selectedKit.assignedDate && (
            <div>
              <h4 className='text-muted-foreground text-sm font-medium'>
                Assigned Date
              </h4>
              <p className='text-sm'>
                {new Date(selectedKit.assignedDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {selectedKit.device_id && (
            <div>
              <h4 className='text-muted-foreground text-sm font-medium'>
                Device ID
              </h4>
              <p className='font-mono text-sm'>{selectedKit.device_id}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
