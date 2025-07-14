import { Property } from '../types'

export interface PropertiesContextType {
  // Create dialog
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  
  // Edit dialog
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  editingProperty: Property | null
  setEditingProperty: (property: Property | null) => void
  
  // View dialog
  isViewDialogOpen: boolean
  setIsViewDialogOpen: (open: boolean) => void
  viewingProperty: Property | null
  setViewingProperty: (property: Property | null) => void
  
  // Delete dialog
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void
  deletingProperty: Property | null
  setDeletingProperty: (property: Property | null) => void
  
  // Selected properties for bulk actions
  selectedProperties: Property[]
  setSelectedProperties: (properties: Property[]) => void
}