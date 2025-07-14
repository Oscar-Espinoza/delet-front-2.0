import { useSearch } from '@tanstack/react-router'
import { PropertiesProvider } from './context/properties-provider'
import { PropertiesTable } from './components/properties-table'
import { PropertiesDialogs } from './components/properties-dialogs'
import { PropertiesPrimaryButtons } from './components/properties-primary-buttons'

export default function PropertiesFeature() {
  const search = useSearch({ strict: false }) as { company?: string }
  
  return (
    <PropertiesProvider>
      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Properties</h2>
            <p className='text-muted-foreground'>
              Manage your property listings and details.
            </p>
          </div>
          <PropertiesPrimaryButtons />
        </div>
        
        <PropertiesTable companyId={search.company} />
      </div>
      
      <PropertiesDialogs />
    </PropertiesProvider>
  )
}