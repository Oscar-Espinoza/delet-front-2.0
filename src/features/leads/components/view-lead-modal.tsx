import { format } from 'date-fns'
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  Building,
  Tag,
  FileText,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Lead, getStatusColor, getStatusLabel } from '../types'

interface ViewLeadModalProps {
  open: boolean
  onClose: () => void
  lead: Lead
}

export function ViewLeadModal({ open, onClose, lead }: ViewLeadModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[625px]'>
        <DialogHeader>
          <DialogTitle>Lead Details</DialogTitle>
          <DialogDescription>
            Complete information about this lead
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6'>
          {/* Contact Information */}
          <div>
            <h3 className='mb-3 text-lg font-semibold'>Contact Information</h3>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <div className='flex items-center space-x-2 text-sm'>
                  <User className='text-muted-foreground h-4 w-4' />
                  <span className='font-medium'>Name:</span>
                  <span>
                    {lead.contact.firstName} {lead.contact.lastName}
                  </span>
                </div>

                {lead.contact.email && (
                  <div className='flex items-center space-x-2 text-sm'>
                    <Mail className='text-muted-foreground h-4 w-4' />
                    <span className='font-medium'>Email:</span>
                    <a
                      href={`mailto:${lead.contact.email}`}
                      className='text-blue-600 hover:underline'
                    >
                      {lead.contact.email}
                    </a>
                  </div>
                )}

                {lead.contact.phone && (
                  <div className='flex items-center space-x-2 text-sm'>
                    <Phone className='text-muted-foreground h-4 w-4' />
                    <span className='font-medium'>Phone:</span>
                    <a
                      href={`tel:${lead.contact.phone}`}
                      className='text-blue-600 hover:underline'
                    >
                      {lead.contact.phone}
                    </a>
                  </div>
                )}
              </div>

              <div className='space-y-2'>
                {lead.contact.address && (
                  <div className='flex items-start space-x-2 text-sm'>
                    <MapPin className='text-muted-foreground mt-0.5 h-4 w-4' />
                    <div>
                      <span className='font-medium'>Address:</span>
                      <p className='text-muted-foreground'>
                        {lead.contact.address}
                      </p>
                    </div>
                  </div>
                )}

                <div className='flex items-center space-x-2 text-sm'>
                  <Calendar className='text-muted-foreground h-4 w-4' />
                  <span className='font-medium'>Created:</span>
                  <span>
                    {format(new Date(lead.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Status and Verification */}
          <div>
            <h3 className='mb-3 text-lg font-semibold'>Status Information</h3>
            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Lead Status:</span>
                <Badge
                  variant='secondary'
                  className={getStatusColor(lead.contact.status)}
                >
                  {getStatusLabel(lead.contact.status)}
                </Badge>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Booking Complete:</span>
                {!lead.incomplete ? (
                  <div className='flex items-center space-x-1 text-green-600'>
                    <CheckCircle className='h-4 w-4' />
                    <span className='text-sm'>Yes</span>
                  </div>
                ) : (
                  <div className='text-muted-foreground flex items-center space-x-1'>
                    <XCircle className='h-4 w-4' />
                    <span className='text-sm'>No</span>
                  </div>
                )}
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Verified:</span>
                {lead.isVerified ? (
                  <Badge
                    variant='secondary'
                    className='bg-green-50 text-green-700'
                  >
                    Verified
                  </Badge>
                ) : (
                  <Badge
                    variant='secondary'
                    className='bg-gray-50 text-gray-700'
                  >
                    Unverified
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Property Information */}
          {lead.property && (
            <>
              <div>
                <h3 className='mb-3 text-lg font-semibold'>
                  Property Information
                </h3>
                <div className='space-y-2'>
                  <div className='flex items-start space-x-2 text-sm'>
                    <MapPin className='text-muted-foreground mt-0.5 h-4 w-4' />
                    <div>
                      <p className='font-medium'>
                        {lead.property.shortAddress || lead.property.address}
                      </p>
                      {lead.property.unit && (
                        <p className='text-muted-foreground'>
                          Unit {lead.property.unit}
                        </p>
                      )}
                      <p className='text-muted-foreground'>
                        {lead.property.city}, {lead.property.state}
                      </p>
                    </div>
                  </div>

                  {lead.startTime && (
                    <div className='flex items-center space-x-2 text-sm'>
                      <Calendar className='text-muted-foreground h-4 w-4' />
                      <span className='font-medium'>Showing Date:</span>
                      <span>
                        {format(new Date(lead.startTime), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Agent Information */}
          {lead.user && (
            <>
              <div>
                <h3 className='mb-3 text-lg font-semibold'>
                  Agent Information
                </h3>
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2 text-sm'>
                    <User className='text-muted-foreground h-4 w-4' />
                    <span className='font-medium'>Name:</span>
                    <span>
                      {lead.user.firstName} {lead.user.lastName}
                    </span>
                  </div>

                  <div className='flex items-center space-x-2 text-sm'>
                    <Mail className='text-muted-foreground h-4 w-4' />
                    <span className='font-medium'>Email:</span>
                    <a
                      href={`mailto:${lead.user.email}`}
                      className='text-blue-600 hover:underline'
                    >
                      {lead.user.email}
                    </a>
                  </div>

                  {lead.user.company && (
                    <div className='flex items-center space-x-2 text-sm'>
                      <Building className='text-muted-foreground h-4 w-4' />
                      <span className='font-medium'>Company:</span>
                      <span>{lead.user.company.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Additional Information */}
          <div>
            <h3 className='mb-3 text-lg font-semibold'>
              Additional Information
            </h3>
            <div className='space-y-3'>
              {lead.contact.notes && (
                <div className='space-y-1'>
                  <div className='flex items-center space-x-2 text-sm font-medium'>
                    <FileText className='text-muted-foreground h-4 w-4' />
                    <span>Notes:</span>
                  </div>
                  <p className='text-muted-foreground pl-6 text-sm'>
                    {lead.contact.notes}
                  </p>
                </div>
              )}

              {lead.contact.tags && lead.contact.tags.length > 0 && (
                <div className='space-y-1'>
                  <div className='flex items-center space-x-2 text-sm font-medium'>
                    <Tag className='text-muted-foreground h-4 w-4' />
                    <span>Tags:</span>
                  </div>
                  <div className='flex flex-wrap gap-2 pl-6'>
                    {lead.contact.tags.map((tag, index) => (
                      <Badge key={index} variant='outline'>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Document indicators */}
              <div className='space-y-1'>
                <span className='text-sm font-medium'>Documents:</span>
                <div className='flex flex-wrap gap-2 pl-6'>
                  {lead.contact.idImage && (
                    <Badge variant='secondary'>ID Image</Badge>
                  )}
                  {lead.contact.document && (
                    <Badge variant='secondary'>Document</Badge>
                  )}
                  {lead.contact.documentBack && (
                    <Badge variant='secondary'>Document Back</Badge>
                  )}
                  {lead.contact.face && (
                    <Badge variant='secondary'>Face Photo</Badge>
                  )}
                  {!lead.contact.idImage &&
                    !lead.contact.document &&
                    !lead.contact.documentBack &&
                    !lead.contact.face && (
                      <span className='text-muted-foreground text-sm'>
                        No documents uploaded
                      </span>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
