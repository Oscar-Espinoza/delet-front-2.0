import { Company } from '../types'

export interface CompaniesContextType {
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  editingCompany: Company | null
  setEditingCompany: (company: Company | null) => void
}
