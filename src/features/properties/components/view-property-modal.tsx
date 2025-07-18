import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Property } from '../types'

interface ViewPropertyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  property: Property
}

export function ViewPropertyModal({
  open,
  onOpenChange,
  property,
}: ViewPropertyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Property Details</DialogTitle>
        </DialogHeader>

        <div className='flex items-center justify-center py-8'>
          <p className='text-muted-foreground'>
            Property details for {property._id} will be implemented here.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
