import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, User } from 'lucide-react'
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
import { useAuthStore } from '@/stores/authStore'

interface Agent {
  _id: string
  firstName: string
  lastName: string
  email?: string
  company?: {
    name: string
  }
}

export function AgentsFilter() {
  const { filters, setFilters } = useBookingsContext()
  const { user } = useAuthStore()
  const [open, setOpen] = useState(false)
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  
  const selectedAgents = filters.agents?.split(',').filter(Boolean) || []
  
  useEffect(() => {
    fetchAgents()
  }, [])
  
  const fetchAgents = async () => {
    setLoading(true)
    try {
      const response = await apiClient.post<{ agents: Agent[]; total: number }>('/api/users/admin/agents/all', {
        page: 1,
        limit: 100,
        select: 'firstName lastName email company'
      })
      setAgents(response.agents || [])
    } catch (_error) {
      // Handle error silently
    } finally {
      setLoading(false)
    }
  }
  
  const handleSelect = (agentId: string) => {
    const isSelected = selectedAgents.includes(agentId)
    let newSelection: string[]
    
    if (isSelected) {
      newSelection = selectedAgents.filter(id => id !== agentId)
    } else {
      newSelection = [...selectedAgents, agentId]
    }
    
    setFilters(prev => ({
      ...prev,
      agents: newSelection.join(','),
    }))
  }
  
  const handleSelectAll = () => {
    if (selectedAgents.length === agents.length) {
      setFilters(prev => ({ ...prev, agents: '' }))
    } else {
      setFilters(prev => ({
        ...prev,
        agents: agents.map(a => a._id).join(','),
      }))
    }
  }
  
  const handleClear = () => {
    setFilters(prev => ({ ...prev, agents: '' }))
  }
  
  const filteredAgents = agents.filter(agent =>
    `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    (agent.email && agent.email.toLowerCase().includes(search.toLowerCase()))
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
            <User className='h-4 w-4' />
            <span>Agents</span>
            {selectedAgents.length > 0 && (
              <Badge variant='secondary' className='ml-2'>
                {selectedAgents.length}
              </Badge>
            )}
          </div>
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[300px] p-0'>
        <Command>
          <CommandInput
            placeholder='Search agents...'
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading ? (
              <CommandEmpty>Loading...</CommandEmpty>
            ) : filteredAgents.length === 0 ? (
              <CommandEmpty>No agents found.</CommandEmpty>
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
                        selectedAgents.length === agents.length
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                </CommandGroup>
                <CommandGroup heading='Agents'>
                  <ScrollArea className='h-[200px]'>
                    {filteredAgents.map(agent => (
                      <CommandItem
                        key={agent._id}
                        onSelect={() => handleSelect(agent._id)}
                        className='justify-between'
                      >
                        <div className='flex flex-col'>
                          <span className='text-sm'>
                            {agent.firstName} {agent.lastName}
                            {agent._id === user?.id && (
                              <span className='ml-2 text-xs text-muted-foreground'>(You)</span>
                            )}
                          </span>
                          {agent.email && (
                            <span className='text-xs text-muted-foreground'>
                              {agent.email}
                            </span>
                          )}
                        </div>
                        <Check
                          className={cn(
                            'h-4 w-4',
                            selectedAgents.includes(agent._id)
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
          {selectedAgents.length > 0 && (
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