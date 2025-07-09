import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCompaniesContext } from '../context/companies-context'

export function CompaniesPrimaryButtons() {
  const { setIsCreateDialogOpen } = useCompaniesContext()

  return (
    <Button size='sm' onClick={() => setIsCreateDialogOpen(true)}>
      <Plus className='mr-2 h-4 w-4' />
      Add Company
    </Button>
  )
}