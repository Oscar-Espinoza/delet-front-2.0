import type { Hardware } from '../types/hardware'

export interface HardwareContextValue {
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