import { Plus, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLeadsContext } from '../context/leads-context'
import { useExportLeads } from '../api'

interface LeadsPrimaryButtonsProps {
  filters?: any
  isAdmin?: boolean
}

export function LeadsPrimaryButtons({ filters, isAdmin }: LeadsPrimaryButtonsProps) {
  const { setIsCreateDialogOpen } = useLeadsContext()
  const exportLeads = useExportLeads()

  const handleExport = () => {
    exportLeads.mutate({
      page: 1,
      limit: 10000, // Export all
      filters,
      isAdmin
    })
  }

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='outline'
        size='sm'
        onClick={handleExport}
        disabled={exportLeads.isPending}
      >
        <Download className='mr-2 h-4 w-4' />
        Export CSV
      </Button>
      <Button
        size='sm'
        onClick={() => setIsCreateDialogOpen(true)}
      >
        <Plus className='mr-2 h-4 w-4' />
        Add Lead
      </Button>
    </div>
  )
}