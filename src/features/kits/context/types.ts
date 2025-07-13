import { Kit } from '../types'

export interface KitsContextType {
  selectedKit: Kit | null
  setSelectedKit: (kit: Kit | null) => void
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  isViewDialogOpen: boolean
  setIsViewDialogOpen: (open: boolean) => void
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void
}