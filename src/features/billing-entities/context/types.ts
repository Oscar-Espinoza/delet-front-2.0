import { BillingEntity } from '../types'

export interface BillingEntitiesContextType {
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  isViewDialogOpen: boolean
  setIsViewDialogOpen: (open: boolean) => void
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void
  editingEntity: BillingEntity | null
  setEditingEntity: (entity: BillingEntity | null) => void
  viewingEntity: BillingEntity | null
  setViewingEntity: (entity: BillingEntity | null) => void
  deletingEntity: BillingEntity | null
  setDeletingEntity: (entity: BillingEntity | null) => void
}
