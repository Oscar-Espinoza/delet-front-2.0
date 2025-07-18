import { useState, ReactNode } from 'react'
import { Lead } from '../types'
import { LeadsContext } from './context'
import { LeadsContextType } from './types'

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
