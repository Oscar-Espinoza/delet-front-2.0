import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useExportLeads } from '../api'
import { LeadFilters } from '../types'

interface LeadsPrimaryButtonsProps {
  filters?: LeadFilters
  isAdmin?: boolean
}

export function LeadsPrimaryButtons({
  filters,
  isAdmin,
}: LeadsPrimaryButtonsProps) {
  const exportLeads = useExportLeads()

  const handleExport = () => {
    exportLeads.mutate({
      page: 1,
      limit: 10000, // Export all
      filters,
      isAdmin,
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
    </div>
  )
}
