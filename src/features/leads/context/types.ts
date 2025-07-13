import { Lead } from '../types'

export interface LeadsContextType {
  // Create dialog
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  
  // Edit dialog
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  editingLead: Lead | null
  setEditingLead: (lead: Lead | null) => void
  
  // View dialog
  isViewDialogOpen: boolean
  setIsViewDialogOpen: (open: boolean) => void
  viewingLead: Lead | null
  setViewingLead: (lead: Lead | null) => void
  
  // Delete dialog
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void
  deletingLead: Lead | null
  setDeletingLead: (lead: Lead | null) => void
  
  // Selected leads for bulk actions
  selectedLeads: Lead[]
  setSelectedLeads: (leads: Lead[]) => void
}