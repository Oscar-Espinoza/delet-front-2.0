import { useState, ReactNode } from 'react'
import { Company } from '../types'
import { CompaniesContext } from './context'

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

