import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Hardware } from '../types/hardware'

interface HardwareContextType {
  selectedHardware: Hardware[]
  setSelectedHardware: (hardware: Hardware[]) => void
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  isDeleteDialogOpen: boolean
  setIsDeleteDialogOpen: (open: boolean) => void
  editingHardware: Hardware | null
  setEditingHardware: (hardware: Hardware | null) => void
  deletingHardware: Hardware | null
  setDeletingHardware: (hardware: Hardware | null) => void
}

export const HardwareContext = createContext<HardwareContextType | undefined>(undefined)

export function HardwareProvider({ children }: { children: ReactNode }) {
  const [selectedHardware, setSelectedHardware] = useState<Hardware[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingHardware, setEditingHardware] = useState<Hardware | null>(null)
  const [deletingHardware, setDeletingHardware] = useState<Hardware | null>(null)

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

