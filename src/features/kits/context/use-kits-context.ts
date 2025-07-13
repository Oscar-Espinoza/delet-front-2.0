import { useContext } from 'react'
import { KitsContext } from './kits-context'

export function useKitsContext() {
  const context = useContext(KitsContext)
  if (!context) {
    throw new Error('useKitsContext must be used within KitsProvider')
  }
  return context
}