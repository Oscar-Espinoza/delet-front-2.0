import { CreateLeadModal } from './create-lead-modal'
import { EditLeadModal } from './edit-lead-modal'
import { ViewLeadModal } from './view-lead-modal'
import { DeleteLeadDialog } from './delete-lead-dialog'
import { useLeadsContext } from '../context/use-leads-context'

export function LeadsDialogs() {
  const {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingLead,
    isViewDialogOpen,
    setIsViewDialogOpen,
    viewingLead,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deletingLead,
  } = useLeadsContext()

  return (
    <>
      <CreateLeadModal
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
      
      {editingLead && (
        <EditLeadModal
          open={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          lead={editingLead}
        />
      )}
      
      {viewingLead && (
        <ViewLeadModal
          open={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
          lead={viewingLead}
        />
      )}
      
      {deletingLead && (
        <DeleteLeadDialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          lead={deletingLead}
        />
      )}
    </>
  )
}