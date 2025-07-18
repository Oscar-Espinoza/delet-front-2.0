import { useState, ReactNode } from 'react'
import { BillingEntity } from '../types'
import { BillingEntitiesContext } from './context'

export function BillingEntitiesProvider({ children }: { children: ReactNode }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingEntity, setEditingEntity] = useState<BillingEntity | null>(null)
  const [viewingEntity, setViewingEntity] = useState<BillingEntity | null>(null)
  const [deletingEntity, setDeletingEntity] = useState<BillingEntity | null>(
    null
  )

  return (
    <BillingEntitiesContext.Provider
      value={{
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isViewDialogOpen,
        setIsViewDialogOpen,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        editingEntity,
        setEditingEntity,
        viewingEntity,
        setViewingEntity,
        deletingEntity,
        setDeletingEntity,
      }}
    >
      {children}
    </BillingEntitiesContext.Provider>
  )
}
