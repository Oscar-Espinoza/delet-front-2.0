import { useContext } from 'react'
import { PropertiesContext } from './context'

export const usePropertiesContext = () => {
  const context = useContext(PropertiesContext)
  if (!context) {
    throw new Error(
      'usePropertiesContext must be used within a PropertiesProvider'
    )
  }
  return context
}
