import * as React from 'react'
import { Kit } from '../types'
import { KitsContext } from './context'

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