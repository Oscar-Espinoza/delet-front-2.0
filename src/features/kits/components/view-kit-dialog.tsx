import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useKitsContext } from '../context/kits-context'
import { getKitStateColor, formatShippingAddress } from '../types'

export function ViewKitDialog() {
  const { isViewDialogOpen, setIsViewDialogOpen, selectedKit } = useKitsContext()

  if (!selectedKit) return null

  return (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className='sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Kit Details</DialogTitle>
          <DialogDescription>
            View detailed information about the kit.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>Name</h4>
              <p className='text-sm'>{selectedKit.name}</p>
            </div>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>State</h4>
              <Badge className={getKitStateColor(selectedKit.state)}>
                {selectedKit.state}
              </Badge>
            </div>
          </div>

          {selectedKit.description && (
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>Description</h4>
              <p className='text-sm'>{selectedKit.description}</p>
            </div>
          )}

          {selectedKit.notes && (
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>Notes</h4>
              <p className='text-sm'>{selectedKit.notes}</p>
            </div>
          )}

          {selectedKit.tags && selectedKit.tags.length > 0 && (
            <div>
              <h4 className='text-sm font-medium text-muted-foreground mb-2'>Tags</h4>
              <div className='flex flex-wrap gap-2'>
                {selectedKit.tags.map((tag, index) => (
                  <Badge key={index} variant='secondary'>
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>Company</h4>
              <p className='text-sm'>{selectedKit.company?.name || '-'}</p>
            </div>
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>User</h4>
              {selectedKit.user ? (
                <div className='text-sm'>
                  <p>
                    {selectedKit.user.firstName && selectedKit.user.lastName
                      ? `${selectedKit.user.firstName} ${selectedKit.user.lastName}`
                      : selectedKit.user.email}
                  </p>
                  <p className='text-muted-foreground'>{selectedKit.user.email}</p>
                </div>
              ) : (
                <p className='text-sm'>-</p>
              )}
            </div>
          </div>

          {selectedKit.property && (
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>Property</h4>
              <p className='text-sm'>
                {selectedKit.property.shortAddress}
                {selectedKit.property.unit && ` Unit ${selectedKit.property.unit}`}
                {selectedKit.property.city && selectedKit.property.state && 
                  ` - ${selectedKit.property.city}, ${selectedKit.property.state}`}
              </p>
            </div>
          )}

          {selectedKit.shippingAddress && (
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>Shipping Address</h4>
              <p className='text-sm'>{formatShippingAddress(selectedKit.shippingAddress)}</p>
            </div>
          )}

          {selectedKit.hardware && selectedKit.hardware.length > 0 && (
            <div>
              <h4 className='text-sm font-medium text-muted-foreground mb-2'>Hardware ({selectedKit.hardware.length})</h4>
              <div className='space-y-1'>
                {selectedKit.hardware.map((hw) => (
                  <div key={hw._id} className='text-sm'>
                    {hw.name} {hw.category && <span className='text-muted-foreground'>({hw.category})</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedKit.assignedDate && (
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>Assigned Date</h4>
              <p className='text-sm'>{new Date(selectedKit.assignedDate).toLocaleDateString()}</p>
            </div>
          )}

          {selectedKit.device_id && (
            <div>
              <h4 className='text-sm font-medium text-muted-foreground'>Device ID</h4>
              <p className='text-sm font-mono'>{selectedKit.device_id}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}