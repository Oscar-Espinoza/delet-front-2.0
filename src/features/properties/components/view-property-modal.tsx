import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Property, formatAddress, getStatusLabel } from '../types'
import { MapPin, DollarSign, Link, Calendar, Users, Check, X } from 'lucide-react'
import { format } from 'date-fns'

interface ViewPropertyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  property: Property
}

export function ViewPropertyModal({
  open,
  onOpenChange,
  property,
}: ViewPropertyModalProps) {
  const address = formatAddress(property)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader>
          <DialogTitle>Property Details</DialogTitle>
        </DialogHeader>
        
        <div className='space-y-6'>
          {/* Images */}
          {(property.primaryImage || property.images?.length) && (
            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Images</h3>
              <div className='grid grid-cols-3 gap-2'>
                {property.primaryImage && (
                  <img
                    src={property.primaryImage}
                    alt='Primary'
                    className='h-24 w-full rounded-md object-cover'
                  />
                )}
                {property.images?.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index + 1}`}
                    className='h-24 w-full rounded-md object-cover'
                  />
                ))}
              </div>
            </div>
          )}

          {/* Address */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium'>Address</h3>
            <div className='flex items-start space-x-2'>
              <MapPin className='mt-0.5 h-4 w-4 text-muted-foreground' />
              <p className='text-sm'>{address}</p>
            </div>
          </div>

          {/* Property Info */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Type</h3>
              <p className='text-sm'>{property.propertyType || '-'}</p>
            </div>
            
            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Status</h3>
              <Badge variant='outline'>{getStatusLabel(property.status)}</Badge>
            </div>

            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Company</h3>
              <p className='text-sm'>{property.user?.company?.name || '-'}</p>
            </div>

            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Managed</h3>
              <div className='flex items-center'>
                {property.isManaged ? (
                  <Check className='h-4 w-4 text-green-600' />
                ) : (
                  <X className='h-4 w-4 text-muted-foreground' />
                )}
              </div>
            </div>
          </div>

          {/* Price */}
          {property.price && (
            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Price</h3>
              <div className='flex items-center space-x-2'>
                <DollarSign className='h-4 w-4 text-muted-foreground' />
                <p className='text-sm font-medium'>{property.price.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Redirect URL */}
          {property.redirectUrl && (
            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Redirect URL</h3>
              <a
                href={property.redirectUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center space-x-2 text-sm text-blue-600 hover:underline'
              >
                <Link className='h-4 w-4' />
                <span>{property.redirectUrl}</span>
              </a>
            </div>
          )}

          {/* Metrics */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Leads</h3>
              <div className='flex items-center space-x-2'>
                <Users className='h-4 w-4 text-muted-foreground' />
                <p className='text-sm'>{property.leadsCount || 0}</p>
              </div>
            </div>

            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Redirects</h3>
              <p className='text-sm'>{property.redirectCount || 0}</p>
            </div>
          </div>

          {/* Dates */}
          <div className='grid grid-cols-2 gap-4'>
            {property.listedDate && (
              <div className='space-y-2'>
                <h3 className='text-sm font-medium'>Listed Date</h3>
                <div className='flex items-center space-x-2'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <p className='text-sm'>{format(new Date(property.listedDate), 'MMM d, yyyy')}</p>
                </div>
              </div>
            )}

            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Created</h3>
              <div className='flex items-center space-x-2'>
                <Calendar className='h-4 w-4 text-muted-foreground' />
                <p className='text-sm'>{format(new Date(property.createdAt), 'MMM d, yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Owner */}
          <div className='space-y-2'>
            <h3 className='text-sm font-medium'>Owner</h3>
            <p className='text-sm'>
              {property.user.firstName} {property.user.lastName} ({property.user.email})
            </p>
          </div>

          {/* Kit */}
          {property.kit && (
            <div className='space-y-2'>
              <h3 className='text-sm font-medium'>Assigned Kit</h3>
              <p className='text-sm'>{property.kit.name}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}