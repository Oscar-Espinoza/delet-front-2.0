import * as React from 'react'
import { Kit } from '../types'

interface KitsContextType {
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

const KitsContext = React.createContext<KitsContextType | undefined>(undefined)

export function KitsProvider({ children }: { children: React.ReactNode }) {
  const [selectedKit, setSelectedKit] = React.useState<Kit | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)

  return (
    <KitsContext.Provider
      value={{
        selectedKit,
        setSelectedKit,
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isViewDialogOpen,
        setIsViewDialogOpen,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
      }}
    >
      {children}
    </KitsContext.Provider>
  )
}

export function useKitsContext() {
  const context = React.useContext(KitsContext)
  if (context === undefined) {
    throw new Error('useKitsContext must be used within a KitsProvider')
  }
  return context
}