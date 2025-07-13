import { useContext } from 'react'
import { StructuresContext } from './structures-context'

export function useStructuresContext() {
  const context = useContext(StructuresContext)
  if (!context) {
    throw new Error('useStructuresContext must be used within StructuresProvider')
  }
  return context
}