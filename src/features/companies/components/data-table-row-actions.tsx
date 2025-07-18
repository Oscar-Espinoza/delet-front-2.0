import { useRouter } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'
import {
  MoreHorizontal,
  Pencil,
  Users,
  UserPlus,
  CalendarCheck,
  ShoppingCart,
  Home,
  Building,
  Package,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCompaniesContext } from '../context/use-companies-context'
import { Company } from '../types'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const company = row.original as Company
  const { setEditingCompany, setIsEditDialogOpen } = useCompaniesContext()
  const router = useRouter()

  const handleEdit = () => {
    setEditingCompany(company)
    setIsEditDialogOpen(true)
  }

  const handleNavigate = (path: string) => {
    router.navigate({
      to: path,
      search: { company: company._id },
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted h-8 w-8 p-0'
        >
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className='mr-2 h-4 w-4' />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleNavigate('/users')}>
          <Users className='mr-2 h-4 w-4' />
          Users
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('/leads')}>
          <UserPlus className='mr-2 h-4 w-4' />
          Leads
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('/bookings')}>
          <CalendarCheck className='mr-2 h-4 w-4' />
          Bookings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('/orders')}>
          <ShoppingCart className='mr-2 h-4 w-4' />
          Orders
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('/properties')}>
          <Home className='mr-2 h-4 w-4' />
          Properties
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('/structures')}>
          <Building className='mr-2 h-4 w-4' />
          Buildings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleNavigate('/kits')}>
          <Package className='mr-2 h-4 w-4' />
          Kits
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
