import React, { createContext, useContext, useState } from 'react'
import { Structure } from '../types'

interface StructuresContextType {
  selectedStructure: Structure | null
  setSelectedStructure: (structure: Structure | null) => void
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  isViewDialogOpen: boolean
  setIsViewDialogOpen: (open: boolean) => void
}

const StructuresContext = createContext<StructuresContextType | undefined>(undefined)

export function StructuresProvider({ children }: { children: React.ReactNode }) {
  const [selectedStructure, setSelectedStructure] = useState<Structure | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  return (
    <StructuresContext.Provider
      value={{
        selectedStructure,
        setSelectedStructure,
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isViewDialogOpen,
        setIsViewDialogOpen,
      }}
    >
      {children}
    </StructuresContext.Provider>
  )
}

export function useStructuresContext() {
  const context = useContext(StructuresContext)
  if (context === undefined) {
    throw new Error('useStructuresContext must be used within a StructuresProvider')
  }
  return context
}