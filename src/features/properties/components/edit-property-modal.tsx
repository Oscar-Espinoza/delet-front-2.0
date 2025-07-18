import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Property } from '../types'

interface EditPropertyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  property: Property
}

export function EditPropertyModal({
  open,
  onOpenChange,
  property,
}: EditPropertyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          {/* TODO: Implement edit property form */}
          <p className='text-muted-foreground'>
            Edit property form for {property._id} will be implemented here.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
