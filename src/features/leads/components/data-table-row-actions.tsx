import { Row } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Trash, Eye, PhoneCall, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Lead } from '../types'
import { useLeadsContext } from '../context/leads-context'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const lead = row.original as Lead
  const { setEditingLead, setIsEditDialogOpen, setViewingLead, setIsViewDialogOpen } = useLeadsContext()

  const handleEdit = () => {
    setEditingLead(lead)
    setIsEditDialogOpen(true)
  }

  const handleView = () => {
    setViewingLead(lead)
    setIsViewDialogOpen(true)
  }

  const handleCall = () => {
    if (lead.contact.phone) {
      window.location.href = `tel:${lead.contact.phone}`
    }
  }

  const handleEmail = () => {
    if (lead.contact.email) {
      window.location.href = `mailto:${lead.contact.email}`
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleView}>
          <Eye className='mr-2 h-4 w-4' />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className='mr-2 h-4 w-4' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {lead.contact.phone && (
          <DropdownMenuItem onClick={handleCall}>
            <PhoneCall className='mr-2 h-4 w-4' />
            Call
          </DropdownMenuItem>
        )}
        {lead.contact.email && (
          <DropdownMenuItem onClick={handleEmail}>
            <Mail className='mr-2 h-4 w-4' />
            Email
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}