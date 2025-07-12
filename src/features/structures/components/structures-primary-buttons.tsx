import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStructuresContext } from '../context/structures-context'

export function StructuresPrimaryButtons() {
  const { setIsCreateDialogOpen } = useStructuresContext()

  return (
    <Button onClick={() => setIsCreateDialogOpen(true)}>
      <Plus className='mr-2 h-4 w-4' />
      Add Structure
    </Button>
  )
}