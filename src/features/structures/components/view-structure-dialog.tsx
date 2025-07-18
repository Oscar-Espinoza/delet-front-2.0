import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useStructure } from '../api'
import { useStructuresContext } from '../context/structures-context'
import { formatAddress, getStructureTypeColor } from '../types'

export function ViewStructureDialog() {
  const { isViewDialogOpen, setIsViewDialogOpen, selectedStructure } =
    useStructuresContext()
  const { data: structure, isLoading } = useStructure(
    selectedStructure?._id || ''
  )

  if (!selectedStructure) return null

  return (
    <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Structure Details</DialogTitle>
          <DialogDescription>
            View detailed information about the structure
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className='flex items-center justify-center py-6'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        ) : structure ? (
          <div className='space-y-6'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <h3 className='text-muted-foreground text-sm font-medium'>
                  Name
                </h3>
                <p className='mt-1 text-sm'>{structure.name || 'Unnamed'}</p>
              </div>

              <div>
                <h3 className='text-muted-foreground text-sm font-medium'>
                  Type
                </h3>
                <Badge
                  className={cn('mt-1', getStructureTypeColor(structure.type))}
                >
                  {structure.type}
                </Badge>
              </div>

              {structure.user && (
                <div>
                  <h3 className='text-muted-foreground text-sm font-medium'>
                    User
                  </h3>
                  <p className='mt-1 text-sm'>{structure.user.email}</p>
                  {structure.user.company && (
                    <p className='text-muted-foreground text-xs'>
                      {structure.user.company.name}
                    </p>
                  )}
                </div>
              )}

              {structure.company && (
                <div>
                  <h3 className='text-muted-foreground text-sm font-medium'>
                    Company
                  </h3>
                  <p className='mt-1 text-sm'>{structure.company.name}</p>
                </div>
              )}

              <div>
                <h3 className='text-muted-foreground text-sm font-medium'>
                  Parent Structure
                </h3>
                <p className='mt-1 text-sm'>
                  {structure.parentStructure?.name || (
                    <span className='text-muted-foreground'>None</span>
                  )}
                </p>
              </div>
            </div>

            <div>
              <h3 className='text-muted-foreground text-sm font-medium'>
                Address
              </h3>
              <p className='mt-1 text-sm'>{formatAddress(structure.address)}</p>
            </div>

            {structure.properties && structure.properties.length > 0 && (
              <div>
                <h3 className='text-muted-foreground mb-2 text-sm font-medium'>
                  Properties ({structure.properties.length})
                </h3>
                <div className='space-y-2'>
                  {structure.properties.map((property) => (
                    <div
                      key={property._id}
                      className='bg-muted rounded-md p-2 text-sm'
                    >
                      {property.address ||
                        `${property.shortAddress}${property.unit ? ` Unit ${property.unit}` : ''}`}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {structure.hardware && structure.hardware.length > 0 && (
              <div>
                <h3 className='text-muted-foreground mb-2 text-sm font-medium'>
                  Hardware ({structure.hardware.length})
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {structure.hardware.map((hw) => (
                    <Badge key={hw._id} variant='secondary'>
                      {hw.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>No structure data available</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
