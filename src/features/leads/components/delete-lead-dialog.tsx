import { Loader2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteLead } from '../api'
import { Lead } from '../types'

interface DeleteLeadDialogProps {
  open: boolean
  onClose: () => void
  lead: Lead
}

export function DeleteLeadDialog({
  open,
  onClose,
  lead,
}: DeleteLeadDialogProps) {
  const deleteLead = useDeleteLead()

  const handleDelete = async () => {
    try {
      await deleteLead.mutateAsync(lead._id)
      onClose()
    } catch (_error) {
      // Error is handled by the mutation
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the lead
            <span className='font-semibold'>
              {' '}
              {lead.contact.firstName} {lead.contact.lastName}
            </span>{' '}
            and all associated bookings from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteLead.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteLead.isPending}
            className='bg-red-600 hover:bg-red-700'
          >
            {deleteLead.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Delete Lead
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
