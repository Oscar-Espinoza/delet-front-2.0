import { useContext } from 'react'
import { CompaniesContext } from './companies-context'

export function useCompaniesContext() {
  const context = useContext(CompaniesContext)
  if (!context) {
    throw new Error('useCompaniesContext must be used within CompaniesProvider')
  }
  return context
}