import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { DatePicker } from '@/components/ui/date-picker'
import { PropertyAddressAutocomplete } from '@/components/PropertyAddressAutocomplete'
import { useUpdateProperty } from '../api'
import {
  updatePropertySchema,
  UpdatePropertyFormData,
  Property,
  PROPERTY_STATUS,
  PROPERTY_TYPE,
  PROPERTY_CATEGORY,
  PROPERTY_CLASSIFICATION,
  getTypeLabel,
  getStatusLabel,
  getCategoryLabel,
  getClassificationLabel,
} from '../types'
import CompanySelectField from '@/components/form/company-select-field'
import KitSelect from '@/components/form/kit-select'
import ImageUpload from '@/components/form/image-upload'
import { UtilitiesForm } from './utilities-form'
import { ParkingForm } from './parking-form'
import { PetsForm } from './pets-form'
import { ContactPersonForm } from './contact-person-form'
import { PropertyAccessCodesForm } from './property-access-codes-form'
import { IdVerificationForm } from './id-verification-form'
import { RentalApplicationForm } from './rental-application-form'
import { AmenitiesForm } from './amenities-form'
import { Loader2, ScrollText } from 'lucide-react'

interface EditPropertyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  property: Property
}

export function EditPropertyModal({
  open,
  onOpenChange,
  property,
}: EditPropertyModalProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const updateProperty = useUpdateProperty()

  const form = useForm<UpdatePropertyFormData>({
    resolver: zodResolver(updatePropertySchema) as any,
    defaultValues: {
      _id: property._id,
      shortAddress: property.shortAddress || '',
      street: property.street || '',
      unit: property.unit || '',
      city: property.city || '',
      state: property.state || '',
      zipCode: property.zipCode || '',
      type: property.propertyType as typeof PROPERTY_TYPE[keyof typeof PROPERTY_TYPE] || PROPERTY_TYPE.OTHER,
      classification: property.classification as typeof PROPERTY_CLASSIFICATION[keyof typeof PROPERTY_CLASSIFICATION] || undefined,
      category: property.category as typeof PROPERTY_CATEGORY[keyof typeof PROPERTY_CATEGORY] || PROPERTY_CATEGORY.RENT,
      status: property.status,
      price: property.price,
      deposit: property.deposit,
      dateAvailableTs: property.dateAvailableTs ? new Date(property.dateAvailableTs) : null,
      leaseTermOptions: property.leaseTermOptions || '',
      sqft: property.sqft,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      yearBuilt: property.yearBuilt,
      lot: property.lot,
      description: property.description || '',
      googleMap: property.googleMap || { latitude: null, longitude: null },
      amenitiesAndFeatures: property.amenitiesAndFeatures || {
        floorPlanHighlights: [],
        kitchenFeatures: [],
        buildingFeatures: [],
      },
      utilities: property.utilities || {
        water: 'tenant',
        electricity: 'tenant',
        gas: 'tenant',
        trash: 'tenant',
        sewage: 'tenant',
        notes: '',
      },
      parking: property.parking || {
        type: 'streetStandard',
        spacesNumber: '',
        monthlyCostPerSpace: '',
        included: false,
        notes: '',
        tandem: [],
      },
      pets: property.pets || {
        allowed: false,
        dogs: { allowed: false, weight: '', maxAllowed: '' },
        cats: { allowed: false, weight: '', maxAllowed: '' },
        deposit: '',
        monthlyPetRent: '',
        notes: '',
      },
      leasingAgent: property.leasingAgent || {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        contactInformation: false,
      },
      propertyManager: property.propertyManager || {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        contactInformation: false,
        onSite: false,
      },
      maintenanceManager: property.maintenanceManager || {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        contactInformation: false,
        onSite: false,
      },
      propertyAccessCodes: property.propertyAccessCodes || {
        buildingCode: '',
        elevatorCode: '',
        instructions: '',
        enable: false,
      },
      idVerification: property.idVerification || {
        active: false,
        frontbackID: true,
        requireFace: false,
        profile: 'none',
      },
      rentalApplicationForm: property.rentalApplicationForm || {
        url: '',
        fee: '',
        instructions: '',
        enable: false,
      },
      doorUnlockLink: property.doorUnlockLink || false,
      isManaged: property.isManaged,
      redirectUrl: property.redirectUrl || '',
      userEmail: property.userEmail || '',
      userPhone: property.userPhone || '',
      company: property.user.company?._id || undefined,
      kit: property.kit?._id || undefined,
      images: [],
      instructionsFiles: [],
    },
  })

  // Reset form when property changes
  useEffect(() => {
    form.reset({
      _id: property._id,
      shortAddress: property.shortAddress || '',
      street: property.street || '',
      unit: property.unit || '',
      city: property.city || '',
      state: property.state || '',
      zipCode: property.zipCode || '',
      type: property.propertyType as typeof PROPERTY_TYPE[keyof typeof PROPERTY_TYPE] || PROPERTY_TYPE.OTHER,
      classification: property.classification as typeof PROPERTY_CLASSIFICATION[keyof typeof PROPERTY_CLASSIFICATION] || undefined,
      category: property.category as typeof PROPERTY_CATEGORY[keyof typeof PROPERTY_CATEGORY] || PROPERTY_CATEGORY.RENT,
      status: property.status,
      price: property.price,
      deposit: property.deposit,
      dateAvailableTs: property.dateAvailableTs ? new Date(property.dateAvailableTs) : null,
      leaseTermOptions: property.leaseTermOptions || '',
      sqft: property.sqft,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      yearBuilt: property.yearBuilt,
      lot: property.lot,
      description: property.description || '',
      googleMap: property.googleMap || { latitude: null, longitude: null },
      amenitiesAndFeatures: property.amenitiesAndFeatures || {
        floorPlanHighlights: [],
        kitchenFeatures: [],
        buildingFeatures: [],
      },
      utilities: property.utilities || {
        water: 'tenant',
        electricity: 'tenant',
        gas: 'tenant',
        trash: 'tenant',
        sewage: 'tenant',
        notes: '',
      },
      parking: property.parking || {
        type: 'streetStandard',
        spacesNumber: '',
        monthlyCostPerSpace: '',
        included: false,
        notes: '',
        tandem: [],
      },
      pets: property.pets || {
        allowed: false,
        dogs: { allowed: false, weight: '', maxAllowed: '' },
        cats: { allowed: false, weight: '', maxAllowed: '' },
        deposit: '',
        monthlyPetRent: '',
        notes: '',
      },
      leasingAgent: property.leasingAgent || {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        contactInformation: false,
      },
      propertyManager: property.propertyManager || {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        contactInformation: false,
        onSite: false,
      },
      maintenanceManager: property.maintenanceManager || {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        contactInformation: false,
        onSite: false,
      },
      propertyAccessCodes: property.propertyAccessCodes || {
        buildingCode: '',
        elevatorCode: '',
        instructions: '',
        enable: false,
      },
      idVerification: property.idVerification || {
        active: false,
        frontbackID: true,
        requireFace: false,
        profile: 'none',
      },
      rentalApplicationForm: property.rentalApplicationForm || {
        url: '',
        fee: '',
        instructions: '',
        enable: false,
      },
      doorUnlockLink: property.doorUnlockLink || false,
      isManaged: property.isManaged,
      redirectUrl: property.redirectUrl || '',
      userEmail: property.userEmail || '',
      userPhone: property.userPhone || '',
      company: property.user.company?._id || undefined,
      kit: property.kit?._id || undefined,
      images: [],
      instructionsFiles: [],
    })
  }, [property, form])

  const onSubmit = async (data: UpdatePropertyFormData) => {
    try {
      // Transform address data if using autocomplete
      const submitData = {
        ...data,
        googleMap: data.googleMap || {
          latitude: null,
          longitude: null
        }
      }
      await updateProperty.mutateAsync(submitData)
      form.reset()
      setActiveTab('basic')
      onOpenChange(false)
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const handleCancel = () => {
    form.reset()
    setActiveTab('basic')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-hidden flex flex-col'>
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className='flex flex-col flex-1 overflow-hidden'>
            <Tabs value={activeTab} onValueChange={setActiveTab} className='flex-1 flex flex-col'>
              <TabsList className='flex w-full overflow-x-auto'>
                <TabsTrigger value='basic' className='min-w-fit'>Basic Info</TabsTrigger>
                <TabsTrigger value='details' className='min-w-fit'>Details</TabsTrigger>
                <TabsTrigger value='location' className='min-w-fit'>Location</TabsTrigger>
                <TabsTrigger value='amenities' className='min-w-fit'>Amenities</TabsTrigger>
                <TabsTrigger value='specifications' className='min-w-fit'>Specifications</TabsTrigger>
                <TabsTrigger value='images' className='min-w-fit'>Images & Files</TabsTrigger>
                <TabsTrigger value='management' className='min-w-fit'>Management</TabsTrigger>
                <TabsTrigger value='access' className='min-w-fit'>Access & Security</TabsTrigger>
              </TabsList>

              <div className='flex-1 overflow-y-auto px-1'>
                <TabsContent value='basic' className='space-y-4 mt-4'>
                  <FormField
                    control={form.control}
                    name='shortAddress'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder='e.g., Sunset Boulevard Apartment' 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='type'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Property Type <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder='Select a property type' />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(PROPERTY_TYPE).map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {getTypeLabel(type)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='classification'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Classification</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder='Select classification' />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(PROPERTY_CLASSIFICATION).map((classification) => (
                                  <SelectItem key={classification} value={classification}>
                                    {getClassificationLabel(classification)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='category'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder='Select category' />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(PROPERTY_CATEGORY).map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {getCategoryLabel(category)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='status'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder='Select status' />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(PROPERTY_STATUS).map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {getStatusLabel(status)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='price'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Enter monthly rent or sale price'
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='deposit'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Security Deposit</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='Enter security deposit'
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='dateAvailableTs'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Date</FormLabel>
                          <FormControl>
                            <DatePicker
                              value={field.value || undefined}
                              onChange={field.onChange}
                              placeholder='Select available date'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='leaseTermOptions'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lease Term Options</FormLabel>
                          <FormControl>
                            <Input
                              placeholder='e.g., 6 months, 12 months, month-to-month'
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value='details' className='space-y-4 mt-4'>
                  <div className='grid gap-4 sm:grid-cols-2'>
                    <FormField
                      control={form.control}
                      name='sqft'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Square Feet</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='e.g., 1200'
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='lot'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lot Size (sq ft)</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='e.g., 5000'
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className='grid gap-4 sm:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='bedrooms'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='e.g., 3'
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='bathrooms'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              step='0.5'
                              placeholder='e.g., 2.5'
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='yearBuilt'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year Built</FormLabel>
                          <FormControl>
                            <Input
                              type='number'
                              placeholder='e.g., 2005'
                              {...field}
                              value={field.value ?? ''}
                              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='Describe the property features, neighborhood, and any other relevant details...'
                            className='resize-none'
                            rows={6}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value='location' className='space-y-4 mt-4'>
                  <PropertyAddressAutocomplete
                    value={{
                      street: form.watch('street') || '',
                      city: form.watch('city') || '',
                      state: form.watch('state') || '',
                      zipCode: form.watch('zipCode') || '',
                      country: '',
                      coordinates: form.watch('googleMap') ? {
                        latitude: form.watch('googleMap.latitude') ?? null,
                        longitude: form.watch('googleMap.longitude') ?? null
                      } : undefined
                    }}
                    onChange={(address) => {
                      form.setValue('street', address.street)
                      form.setValue('city', address.city)
                      form.setValue('state', address.state)
                      form.setValue('zipCode', address.zipCode)
                      if (address.coordinates) {
                        form.setValue('googleMap', {
                          latitude: address.coordinates.latitude,
                          longitude: address.coordinates.longitude
                        })
                      }
                    }}
                  />

                  <FormField
                    control={form.control}
                    name='unit'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit/Apt Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder='e.g., 4B' 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value='amenities' className='mt-4'>
                  <AmenitiesForm
                    control={form.control as any}
                    errors={form.formState.errors}
                    watch={form.watch}
                  />
                </TabsContent>

                <TabsContent value='specifications' className='space-y-6 mt-4'>
                  <UtilitiesForm
                    control={form.control as any}
                    errors={form.formState.errors}
                  />
                  <ParkingForm
                    control={form.control as any}
                    errors={form.formState.errors}
                  />
                  <PetsForm
                    control={form.control as any}
                    errors={form.formState.errors}
                    watch={form.watch}
                  />
                </TabsContent>

                <TabsContent value='images' className='space-y-4 mt-4'>
                  {property.images && property.images.length > 0 && (
                    <div className='space-y-2'>
                      <p className='text-sm text-muted-foreground'>
                        Current images: {property.images.length} image(s)
                      </p>
                      <div className='grid grid-cols-4 gap-2'>
                        {property.images.slice(0, 4).map((url, index) => (
                          <div key={index} className='aspect-square relative rounded-md overflow-hidden border'>
                            <img
                              src={url}
                              alt={`Current image ${index + 1}`}
                              className='w-full h-full object-cover'
                            />
                            {property.primaryImage === url && (
                              <div className='absolute top-1 right-1 bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-xs'>
                                Primary
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <ImageUpload
                    control={form.control as any}
                    errors={form.formState.errors}
                    setValue={form.setValue as any}
                    watch={form.watch as any}
                    name='images'
                    label='Upload New Images'
                    description='Upload new property images to replace existing ones. The first image will be set as the primary image.'
                    multiple={true}
                    maxFiles={10}
                    maxSize={5}
                    primarySelectable={true}
                  />
                  
                  <div className='border-t pt-4'>
                    <div className='flex items-center gap-2 mb-2'>
                      <ScrollText className='h-4 w-4' />
                      <h3 className='font-medium'>Instruction Files</h3>
                    </div>
                    {property.instructionsFiles && property.instructionsFiles.length > 0 && (
                      <p className='text-sm text-muted-foreground mb-2'>
                        Current files: {property.instructionsFiles.length} file(s)
                      </p>
                    )}
                    <ImageUpload
                      control={form.control as any}
                      errors={form.formState.errors}
                      setValue={form.setValue as any}
                      watch={form.watch as any}
                      name='instructionsFiles'
                      label='Upload Documents'
                      description='Upload instruction files, floor plans, or other relevant documents (PDF, DOC, etc.)'
                      multiple={true}
                      maxFiles={5}
                      maxSize={10}
                      primarySelectable={false}
                    />
                  </div>
                </TabsContent>

                <TabsContent value='management' className='space-y-6 mt-4'>
                  <div className='space-y-4'>
                    <CompanySelectField
                      control={form.control}
                      errors={form.formState.errors}
                    />

                    <KitSelect
                      control={form.control as any}
                      errors={form.formState.errors}
                      company={form.watch('company')}
                    />

                    <FormField
                      control={form.control}
                      name='isManaged'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className='space-y-1 leading-none'>
                            <FormLabel>
                              Is Managed Property
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  <ContactPersonForm
                    control={form.control as any}
                    errors={form.formState.errors}
                    fieldPrefix='leasingAgent'
                    title='Leasing Agent'
                    description='Primary contact for property inquiries'
                  />

                  <ContactPersonForm
                    control={form.control as any}
                    errors={form.formState.errors}
                    fieldPrefix='propertyManager'
                    title='Property Manager'
                    description='Manages day-to-day property operations'
                    showOnSite={true}
                  />

                  <ContactPersonForm
                    control={form.control as any}
                    errors={form.formState.errors}
                    fieldPrefix='maintenanceManager'
                    title='Maintenance Manager'
                    description='Handles property maintenance and repairs'
                    showOnSite={true}
                  />
                </TabsContent>

                <TabsContent value='access' className='space-y-6 mt-4'>
                  <PropertyAccessCodesForm
                    control={form.control as any}
                    errors={form.formState.errors}
                    watch={form.watch}
                  />

                  <IdVerificationForm
                    control={form.control as any}
                    errors={form.formState.errors}
                    watch={form.watch}
                  />

                  <RentalApplicationForm
                    control={form.control as any}
                    errors={form.formState.errors}
                    watch={form.watch}
                  />

                  <div className='space-y-4'>
                    <FormField
                      control={form.control}
                      name='doorUnlockLink'
                      render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className='space-y-1 leading-none'>
                            <FormLabel>
                              Enable Door Unlock Link
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name='redirectUrl'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Redirect URL</FormLabel>
                          <FormControl>
                            <Input 
                              type='url'
                              placeholder='https://example.com' 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className='grid gap-4 sm:grid-cols-2'>
                      <FormField
                        control={form.control}
                        name='userEmail'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl>
                              <Input
                                type='email'
                                placeholder='contact@example.com'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='userPhone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone</FormLabel>
                            <FormControl>
                              <Input
                                type='tel'
                                placeholder='+1 (555) 000-0000'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <DialogFooter className='mt-6'>
              <Button type='button' variant='outline' onClick={handleCancel}>
                Cancel
              </Button>
              <Button type='submit' disabled={updateProperty.isPending}>
                {updateProperty.isPending && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                Update Property
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
