import React, { useState } from 'react'
import { Structure } from '../types'
import { StructuresContext } from './context'

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