import { useState } from 'react'
import { Property } from '../types'
import { PropertiesContext } from './context'

interface PropertiesProviderProps {
  children: React.ReactNode
}

export function PropertiesProvider({ children }: PropertiesProviderProps) {
  // Create dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)

  // View dialog
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [viewingProperty, setViewingProperty] = useState<Property | null>(null)

  // Delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(
    null
  )

  // Selected properties
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([])

  const value = {
    isCreateDialogOpen,
    setIsCreateDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    editingProperty,
    setEditingProperty,
    isViewDialogOpen,
    setIsViewDialogOpen,
    viewingProperty,
    setViewingProperty,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    deletingProperty,
    setDeletingProperty,
    selectedProperties,
    setSelectedProperties,
  }

  return (
    <PropertiesContext.Provider value={value}>
      {children}
    </PropertiesContext.Provider>
  )
}
