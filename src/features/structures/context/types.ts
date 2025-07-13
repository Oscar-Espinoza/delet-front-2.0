import { Structure } from '../types'

export interface StructuresContextType {
  selectedStructure: Structure | null
  setSelectedStructure: (structure: Structure | null) => void
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  isViewDialogOpen: boolean
  setIsViewDialogOpen: (open: boolean) => void
}