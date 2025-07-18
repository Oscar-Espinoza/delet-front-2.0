import { useState, type ReactNode } from 'react'
import type { Hardware } from '../types/hardware'
import { HardwareContext } from './context'

export function HardwareProvider({ children }: { children: ReactNode }) {
  const [selectedHardware, setSelectedHardware] = useState<Hardware[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingHardware, setEditingHardware] = useState<Hardware | null>(null)
  const [deletingHardware, setDeletingHardware] = useState<Hardware | null>(
    null
  )

  return (
    <HardwareContext.Provider
      value={{
        selectedHardware,
        setSelectedHardware,
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        isDeleteDialogOpen,
        setIsDeleteDialogOpen,
        editingHardware,
        setEditingHardware,
        deletingHardware,
        setDeletingHardware,
      }}
    >
      {children}
    </HardwareContext.Provider>
  )
}
