import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBillingEntitiesContext } from '../context/use-billing-entities-context'

export function BillingEntitiesPrimaryButtons() {
  const { setIsCreateDialogOpen } = useBillingEntitiesContext()

  return (
    <Button size='sm' onClick={() => setIsCreateDialogOpen(true)}>
      <Plus className='mr-2 h-4 w-4' />
      Add Billing Entity
    </Button>
  )
}
