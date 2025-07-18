import { FormControl } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAllCompanies } from '@/features/companies/hooks/use-all-companies'

interface CompanySelectProps {
  value?: string | null
  onValueChange: (value: string | null) => void
  placeholder?: string
  includeNone?: boolean
  disabled?: boolean
  className?: string
}

export function CompanySelect({
  value,
  onValueChange,
  placeholder = 'Select company',
  includeNone = true,
  disabled = false,
  className,
}: CompanySelectProps) {
  const { data: companies = [], isLoading, error } = useAllCompanies()

  if (error) {
    return (
      <div className='text-destructive text-sm'>Failed to load companies</div>
    )
  }

  return (
    <Select
      value={value || (includeNone ? 'none' : undefined)}
      onValueChange={(val) => onValueChange(val === 'none' ? null : val)}
      disabled={disabled || isLoading}
    >
      <FormControl>
        <SelectTrigger className={className}>
          <SelectValue
            placeholder={isLoading ? 'Loading companies...' : placeholder}
          />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {includeNone && <SelectItem value='none'>None</SelectItem>}
        {companies.map((company) => (
          <SelectItem key={company._id} value={company._id}>
            {company.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Version without FormControl for use outside of forms
export function CompanySelectStandalone({
  value,
  onValueChange,
  placeholder = 'Select company',
  includeNone = true,
  disabled = false,
  className,
}: CompanySelectProps) {
  const { data: companies = [], isLoading, error } = useAllCompanies()

  if (error) {
    return (
      <div className='text-destructive text-sm'>Failed to load companies</div>
    )
  }

  return (
    <Select
      value={value || (includeNone ? 'none' : undefined)}
      onValueChange={(val) => onValueChange(val === 'none' ? null : val)}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className={className}>
        <SelectValue
          placeholder={isLoading ? 'Loading companies...' : placeholder}
        />
      </SelectTrigger>
      <SelectContent>
        {includeNone && <SelectItem value='none'>None</SelectItem>}
        {companies.map((company) => (
          <SelectItem key={company._id} value={company._id}>
            {company.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
