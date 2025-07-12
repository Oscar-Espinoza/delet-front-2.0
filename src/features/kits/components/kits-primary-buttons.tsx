import { PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useKitsContext } from '../context/kits-context'

export function KitsPrimaryButtons() {
  const { setIsCreateDialogOpen } = useKitsContext()

  return (
    <Button onClick={() => setIsCreateDialogOpen(true)}>
      <PlusCircle className='mr-2 h-4 w-4' />
      Add Kit
    </Button>
  )
}