import { ConfirmDialog } from '@/components/confirm-dialog'
import { useBillingEntitiesContext } from '../context/use-billing-entities-context'
import { useDeleteBillingEntity } from '../hooks/use-billing-entities'

export function DeleteBillingEntityDialog() {
  const { deletingEntity, isDeleteDialogOpen, setIsDeleteDialogOpen } =
    useBillingEntitiesContext()
  const deleteBillingEntity = useDeleteBillingEntity()

  const handleDelete = async () => {
    if (!deletingEntity) return

    try {
      await deleteBillingEntity.mutateAsync(deletingEntity._id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      // Error handling is done in the hook with more detail
    }
  }

  return (
    <ConfirmDialog
      open={isDeleteDialogOpen}
      onOpenChange={setIsDeleteDialogOpen}
      title='Delete Billing Entity'
      desc={`Are you sure you want to delete "${deletingEntity?.entityName}"? This action cannot be undone.`}
      confirmText='Delete'
      destructive={true}
      isLoading={deleteBillingEntity.isPending}
      handleConfirm={handleDelete}
    />
  )
}
