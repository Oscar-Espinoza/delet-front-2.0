import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CompanySelectStandalone } from '@/components/form/company-select'
import {
  PROPERTY_STATUS,
  PROPERTY_TYPE,
  getStatusLabel,
  getTypeLabel,
} from '../types'

interface PropertiesFiltersProps {
  onSearchChange: (search: string) => void
  onStatusChange: (status: string) => void
  onTypeChange: (type: string) => void
  onCompanyChange: (company: string) => void
  searchValue?: string
  statusValue?: string
  typeValue?: string
  companyValue?: string
}

export function PropertiesFilters({
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onCompanyChange,
  searchValue = '',
  statusValue = 'all',
  typeValue = 'all',
  companyValue = 'all',
}: PropertiesFiltersProps) {
  const [searchInput, setSearchInput] = useState(searchValue)

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchChange(searchInput)
    }
  }

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
      {/* Search Input */}
      <div className='relative flex-1'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
        <Input
          placeholder='Search properties by address...'
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleSearchKeyPress}
          className='pl-9'
        />
      </div>

      {/* Company Filter */}
      <CompanySelectStandalone
        value={companyValue === 'all' ? null : companyValue}
        onValueChange={(value) => onCompanyChange(value || 'all')}
        placeholder='All Companies'
        includeNone={true}
        className='w-full sm:w-[180px]'
      />

      {/* Type Filter */}
      <Select value={typeValue} onValueChange={onTypeChange}>
        <SelectTrigger className='w-full sm:w-[150px]'>
          <SelectValue placeholder='All Types' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Types</SelectItem>
          {Object.entries(PROPERTY_TYPE).map(([key, value]) => (
            <SelectItem key={key} value={value}>
              {getTypeLabel(value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status Filter */}
      <Select value={statusValue} onValueChange={onStatusChange}>
        <SelectTrigger className='w-full sm:w-[150px]'>
          <SelectValue placeholder='All Status' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Status</SelectItem>
          {Object.entries(PROPERTY_STATUS).map(([key, value]) => (
            <SelectItem key={key} value={value}>
              {getStatusLabel(value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
