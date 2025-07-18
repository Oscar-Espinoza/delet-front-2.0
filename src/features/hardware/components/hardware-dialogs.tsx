import { showSubmittedData } from '@/utils/show-submitted-data'
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
import { useHardwareContext } from '../contexts/use-hardware-context'
import { CreateHardwareModal } from './create-hardware-modal'
import { EditHardwareModal } from './edit-hardware-modal'

export function HardwareDialogs() {
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deletingHardware,
    setDeletingHardware,
  } = useHardwareContext()

  const handleDelete = () => {
    if (deletingHardware) {
      // For now, just show the data that would be sent
      showSubmittedData({
        action: 'delete',
        hardwareId: deletingHardware._id,
        hardwareName: deletingHardware.name,
      })

      // Uncomment when API is ready
      // deleteHardwareMutation.mutate(deletingHardware._id)

      setIsDeleteDialogOpen(false)
      setDeletingHardware(null)
    }
  }

  return (
    <>
      <CreateHardwareModal />
      <EditHardwareModal />
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              hardware
              {deletingHardware?.name && (
                <>
                  {' '}
                  <span className='font-semibold'>{deletingHardware.name}</span>
                </>
              )}{' '}
              from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingHardware(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
