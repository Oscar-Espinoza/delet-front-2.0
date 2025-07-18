import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAllCompanies } from '@/features/companies/hooks/use-all-companies'

export function HeaderCompanyDropdown() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { company?: string }
  const { data: companies = [], isLoading, error } = useAllCompanies()

  const handleCompanyChange = (value: string) => {
    navigate({
      to: '.',
      search: {
        ...search,
        company: value === 'none' ? undefined : value,
      },
    })
  }

  if (error) {
    return null
  }

  return (
    <div className='hidden sm:block'>
      <Select
        value={search.company || 'none'}
        onValueChange={handleCompanyChange}
        disabled={isLoading}
      >
        <SelectTrigger className='w-[200px]'>
          <SelectValue
            placeholder={isLoading ? 'Loading companies...' : 'Company...'}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='none'>Company...</SelectItem>
          {companies.map((company) => (
            <SelectItem key={company._id} value={company._id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
