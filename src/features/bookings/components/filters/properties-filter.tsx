import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useBookingsContext } from '../../context/use-bookings-context'
import { apiClient } from '@/lib/api-client'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Property {
  _id: string
  address: string
  city?: string
  state?: string
}

export function PropertiesFilter() {
  const { filters, setFilters } = useBookingsContext()
  const [open, setOpen] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  
  const selectedProperties = filters.properties?.split(',').filter(Boolean) || []
  
  useEffect(() => {
    fetchProperties()
  }, [])
  
  const fetchProperties = async () => {
    setLoading(true)
    try {
      const response = await apiClient.post<{ properties: Property[]; total: number }>('/api/property/admin/search', {
        page: 1,
        limit: 100,
        searchTerm: ''
      })
      setProperties(response.properties || [])
    } catch (_error) {
      // Handle error silently
    } finally {
      setLoading(false)
    }
  }
  
  const handleSelect = (propertyId: string) => {
    const isSelected = selectedProperties.includes(propertyId)
    let newSelection: string[]
    
    if (isSelected) {
      newSelection = selectedProperties.filter(id => id !== propertyId)
    } else {
      newSelection = [...selectedProperties, propertyId]
    }
    
    setFilters({
      ...filters,
      properties: newSelection.join(','),
    })
  }
  
  const handleSelectAll = () => {
    if (selectedProperties.length === properties.length) {
      setFilters({ ...filters, properties: '' })
    } else {
      setFilters({
        ...filters,
        properties: properties.map(p => p._id).join(','),
      })
    }
  }
  
  const handleClear = () => {
    setFilters({ ...filters, properties: '' })
  }
  
  const filteredProperties = properties.filter(property =>
    property.address.toLowerCase().includes(search.toLowerCase()) ||
    property.city?.toLowerCase().includes(search.toLowerCase())
  )
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='justify-between'
        >
          <div className='flex items-center gap-2'>
            <Building className='h-4 w-4' />
            <span>Properties</span>
            {selectedProperties.length > 0 && (
              <Badge variant='secondary' className='ml-2'>
                {selectedProperties.length}
              </Badge>
            )}
          </div>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-0'>
        <Command>
          <CommandInput
            placeholder='Search properties...'
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : filteredProperties.length === 0 ? (
              <CommandEmpty>No properties found.</CommandEmpty>
            ) : (
              <>
                <CommandGroup>
                  <CommandItem
                    onSelect={handleSelectAll}
                    className='justify-between'
                  >
                    <span>Select All</span>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        selectedProperties.length === properties.length
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                </CommandGroup>
                <CommandGroup heading='Properties'>
                  <ScrollArea className='h-[200px]'>
                    {filteredProperties.map(property => (
                      <CommandItem
                        key={property._id}
                        onSelect={() => handleSelect(property._id)}
                        className='justify-between'
                      >
                        <div className='flex flex-col'>
                          <span className='text-sm'>{property.address}</span>
                          {property.city && (
                            <span className='text-xs text-muted-foreground'>
                              {property.city}, {property.state}
                            </span>
                          )}
                        </div>
                        <Check
                          className={cn(
                            'h-4 w-4',
                            selectedProperties.includes(property._id)
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </>
            )}
          </CommandList>
          {selectedProperties.length > 0 && (
            <div className='border-t p-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleClear}
                className='w-full'
              >
                Clear selection
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}