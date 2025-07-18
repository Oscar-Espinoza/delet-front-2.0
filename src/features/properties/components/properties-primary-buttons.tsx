import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePropertiesContext } from '../context/use-properties-context'

export function PropertiesPrimaryButtons() {
  const { setIsCreateDialogOpen } = usePropertiesContext()

  return (
    <div className='flex items-center gap-2'>
      <Button onClick={() => setIsCreateDialogOpen(true)}>
        <Plus className='mr-2 h-4 w-4' />
        Add Property
      </Button>
    </div>
  )
}
