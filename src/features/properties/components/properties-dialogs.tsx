import { usePropertiesContext } from '../context/use-properties-context'
import { CreatePropertyModal } from './create-property-modal'
import { EditPropertyModal } from './edit-property-modal'
import { ViewPropertyModal } from './view-property-modal'
import { DeletePropertyDialog } from './delete-property-dialog'

export function PropertiesDialogs() {
  const {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingProperty,
    isViewDialogOpen,
    setIsViewDialogOpen,
    viewingProperty,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deletingProperty,
  } = usePropertiesContext()

  return (
    <>
      <CreatePropertyModal 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
      
      {editingProperty && (
        <EditPropertyModal
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          property={editingProperty}
        />
      )}
      
      {viewingProperty && (
        <ViewPropertyModal
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          property={viewingProperty}
        />
      )}
      
      {deletingProperty && (
        <DeletePropertyDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          property={deletingProperty}
        />
      )}
    </>
  )
}