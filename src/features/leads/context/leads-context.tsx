import { createContext, useContext, useState, ReactNode } from 'react'
import { Lead } from '../types'

interface LeadsContextType {
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

const LeadsContext = createContext<LeadsContextType | undefined>(undefined)

export const useLeadsContext = () => {
  const context = useContext(LeadsContext)
  if (!context) {
    throw new Error('useLeadsContext must be used within a LeadsProvider')
  }
  return context
}

interface LeadsProviderProps {
  children: ReactNode
}

export function LeadsProvider({ children }: LeadsProviderProps) {
  // Create dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  
  // Edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  
  // View dialog
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewingLead, setViewingLead] = useState<Lead | null>(null)
  
  // Delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null)
  
  // Selected leads
  const [selectedLeads, setSelectedLeads] = useState<Lead[]>([])
  
  // Close all dialogs helper
  const closeAllDialogs = () => {
    setIsCreateDialogOpen(false)
    setIsEditDialogOpen(false)
    setIsViewDialogOpen(false)
    setIsDeleteDialogOpen(false)
    setEditingLead(null)
    setViewingLead(null)
    setDeletingLead(null)
  }
  
  const value: LeadsContextType = {
    isCreateDialogOpen,
    setIsCreateDialogOpen: (open) => {
      if (!open) closeAllDialogs()
      else setIsCreateDialogOpen(open)
    },
    isEditDialogOpen,
    setIsEditDialogOpen: (open) => {
      if (!open) {
        setIsEditDialogOpen(false)
        setEditingLead(null)
      } else {
        setIsEditDialogOpen(open)
      }
    },
    editingLead,
    setEditingLead,
    isViewDialogOpen,
    setIsViewDialogOpen: (open) => {
      if (!open) {
        setIsViewDialogOpen(false)
        setViewingLead(null)
      } else {
        setIsViewDialogOpen(open)
      }
    },
    viewingLead,
    setViewingLead,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen: (open) => {
      if (!open) {
        setIsDeleteDialogOpen(false)
        setDeletingLead(null)
      } else {
        setIsDeleteDialogOpen(open)
      }
    },
    deletingLead,
    setDeletingLead,
    selectedLeads,
    setSelectedLeads,
  }
  
  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>
}