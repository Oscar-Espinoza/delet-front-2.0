import { toast } from 'sonner'
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
import { useDeleteKit } from '../api'
import { useKitsContext } from '../context/kits-context'

export function DeleteKitDialog() {
  const { isDeleteDialogOpen, setIsDeleteDialogOpen, selectedKit } =
    useKitsContext()
  const deleteKit = useDeleteKit()

  const handleDelete = async () => {
    if (!selectedKit) return

    try {
      await deleteKit.mutateAsync(selectedKit._id)
      setIsDeleteDialogOpen(false)
    } catch (_error) {
      toast.error('Failed to delete kit')
    }
  }

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the kit
            {selectedKit?.name && ` "${selectedKit.name}"`} and remove it from
            our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteKit.isPending}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {deleteKit.isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
