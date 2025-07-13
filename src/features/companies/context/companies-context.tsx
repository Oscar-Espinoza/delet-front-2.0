import { createContext, useContext, useState, ReactNode } from 'react'
import { Company } from '../types'

interface CompaniesContextType {
  isCreateDialogOpen: boolean
  setIsCreateDialogOpen: (open: boolean) => void
  isEditDialogOpen: boolean
  setIsEditDialogOpen: (open: boolean) => void
  editingCompany: Company | null
  setEditingCompany: (company: Company | null) => void
}

export const CompaniesContext = createContext<CompaniesContextType | undefined>(undefined)

export function CompaniesProvider({ children }: { children: ReactNode }) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)

  return (
    <CompaniesContext.Provider
      value={{
        isCreateDialogOpen,
        setIsCreateDialogOpen,
        isEditDialogOpen,
        setIsEditDialogOpen,
        editingCompany,
        setEditingCompany,
      }}
    >
      {children}
    </CompaniesContext.Provider>
  )
}


export default CompaniesProvider