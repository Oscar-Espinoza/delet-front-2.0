import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface CreatePropertyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePropertyModal({
  open,
  onOpenChange,
}: CreatePropertyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Create Property</DialogTitle>
        </DialogHeader>
        <div className='py-4'>
          {/* TODO: Implement create property form */}
          <p className='text-muted-foreground'>Create property form will be implemented here.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}