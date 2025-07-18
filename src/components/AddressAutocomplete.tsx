import { useEffect, useRef, useState, useCallback } from 'react'
import type { Address } from '@/types/common'
import { MapPin } from 'lucide-react'
import { loadGoogleMapsScript } from '@/lib/google-maps-loader'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'

interface AddressAutocompleteProps {
  value?: Address
  onChange: (address: Address) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

interface Prediction {
  description: string
  place_id: string
  structured_formatting?: {
    main_text: string
    secondary_text: string
  }
}

export function AddressAutocomplete({
  value,
  onChange,
  placeholder = 'Start typing an address...',
  disabled = false,
  className,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [inputValue, setInputValue] = useState(value?.street || '')

  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(value?.street || '')
  }, [value?.street])

  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null)
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null)
  const sessionTokenRef = useRef<
    google.maps.places.AutocompleteSessionToken | undefined
  >(undefined)
  const debounceTimerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Initialize Google Maps services
  useEffect(() => {
    let mounted = true

    loadGoogleMapsScript()
      .then(() => {
        if (!mounted) return

        // Create services
        autocompleteServiceRef.current =
          new google.maps.places.AutocompleteService()

        // Create a dummy div for PlacesService (required by API)
        const dummyDiv = document.createElement('div')
        placesServiceRef.current = new google.maps.places.PlacesService(
          dummyDiv
        )

        // Create session token for billing optimization
        sessionTokenRef.current =
          new google.maps.places.AutocompleteSessionToken()

        setIsLoading(false)
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message)
          setIsLoading(false)
        }
      })

    return () => {
      mounted = false
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Fetch predictions from Google Places API
  const fetchPredictions = useCallback((input: string) => {
    if (!autocompleteServiceRef.current || !input.trim()) {
      setPredictions([])
      return
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Debounce API calls
    debounceTimerRef.current = setTimeout(() => {
      if (!autocompleteServiceRef.current) return

      autocompleteServiceRef.current.getPlacePredictions(
        {
          input,
          types: ['address'],
          componentRestrictions: { country: ['us', 'ca'] },
          sessionToken: sessionTokenRef.current,
        },
        (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setPredictions(
              predictions.map((p) => ({
                description: p.description,
                place_id: p.place_id,
                structured_formatting: p.structured_formatting,
              }))
            )
            setShowDropdown(true)
          } else {
            setPredictions([])
          }
        }
      )
    }, 300) // 300ms debounce
  }, [])

  // Handle place selection
  const selectPlace = useCallback(
    (placeId: string) => {
      if (!placesServiceRef.current) return

      placesServiceRef.current.getDetails(
        {
          placeId,
          fields: [
            'address_components',
            'formatted_address',
            'name',
            'geometry',
          ],
          sessionToken: sessionTokenRef.current,
        },
        (place, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place?.address_components
          ) {
            const newAddress: Address = {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              country: '',
            }

            let streetNumber = ''
            let route = ''

            // Parse address components with fallback logic
            place.address_components.forEach((component) => {
              const types = component.types
              const longName = component.long_name
              const shortName = component.short_name

              if (types.includes('street_number')) {
                streetNumber = longName
              } else if (types.includes('route')) {
                route = longName
              } else if (types.includes('locality')) {
                newAddress.city = longName
              } else if (
                types.includes('sublocality_level_1') &&
                !newAddress.city
              ) {
                // Fallback for city
                newAddress.city = longName
              } else if (
                types.includes('administrative_area_level_2') &&
                !newAddress.city
              ) {
                // Another fallback for city (county level)
                newAddress.city = longName
              } else if (types.includes('administrative_area_level_1')) {
                newAddress.state = shortName
              } else if (types.includes('postal_code')) {
                newAddress.zipCode = longName
              } else if (
                types.includes('postal_code_prefix') &&
                !newAddress.zipCode
              ) {
                // Fallback for zip code
                newAddress.zipCode = longName
              } else if (types.includes('country')) {
                newAddress.country = longName
              }
            })

            // Combine street number and route
            newAddress.street = streetNumber
              ? `${streetNumber} ${route}`
              : route

            setInputValue(newAddress.street)
            onChange(newAddress)
            setShowDropdown(false)
            setPredictions([])
            setSelectedIndex(-1)

            // Create new session token after place selection
            sessionTokenRef.current =
              new google.maps.places.AutocompleteSessionToken()
          }
        }
      )
    },
    [onChange]
  )

  // Handle input changes
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)

      if (newValue.trim()) {
        fetchPredictions(newValue)
      } else {
        setPredictions([])
        setShowDropdown(false)
      }
    },
    [fetchPredictions]
  )

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showDropdown || predictions.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < predictions.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && predictions[selectedIndex]) {
            selectPlace(predictions[selectedIndex].place_id)
          }
          break
        case 'Escape':
          setShowDropdown(false)
          setSelectedIndex(-1)
          break
      }
    },
    [showDropdown, predictions, selectedIndex, selectPlace]
  )

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const clickedInInput =
        inputRef.current && inputRef.current.contains(target)
      const clickedInDropdown =
        dropdownRef.current && dropdownRef.current.contains(target)

      if (!clickedInInput && !clickedInDropdown) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (error) {
    return (
      <div className={className}>
        <Input
          disabled
          placeholder='Error loading address autocomplete'
          className='border-destructive mt-2'
        />
        <p className='text-destructive mt-1 text-sm'>{error}</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className='relative'>
        <Input
          ref={inputRef}
          type='text'
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (predictions.length > 0) {
              setShowDropdown(true)
            }
          }}
          placeholder={isLoading ? 'Loading...' : placeholder}
          disabled={disabled || isLoading}
          className={cn('mt-2', isLoading && 'opacity-50')}
          autoComplete='off'
        />

        {showDropdown && predictions.length > 0 && (
          <div ref={dropdownRef} className='absolute z-50 mt-1 w-full'>
            <Command className='rounded-lg border shadow-md'>
              <CommandList>
                <CommandGroup>
                  {predictions.map((prediction, index) => (
                    <CommandItem
                      key={prediction.place_id}
                      value={prediction.description}
                      onSelect={() => selectPlace(prediction.place_id)}
                      onClick={() => selectPlace(prediction.place_id)}
                      className={cn(
                        'cursor-pointer',
                        selectedIndex === index && 'bg-accent'
                      )}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <MapPin className='text-muted-foreground mr-2 h-4 w-4' />
                      <div className='flex-1'>
                        {prediction.structured_formatting ? (
                          <div>
                            <p className='font-medium'>
                              {prediction.structured_formatting.main_text}
                            </p>
                            <p className='text-muted-foreground text-sm'>
                              {prediction.structured_formatting.secondary_text}
                            </p>
                          </div>
                        ) : (
                          <p>{prediction.description}</p>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
      </div>

      {value?.street && (
        <div className='bg-muted/50 mt-3 grid gap-2 rounded-lg p-4'>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <span className='text-muted-foreground text-sm'>City:</span>
              <p className='font-medium'>{value.city || '-'}</p>
            </div>
            <div>
              <span className='text-muted-foreground text-sm'>State:</span>
              <p className='font-medium'>{value.state || '-'}</p>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <span className='text-muted-foreground text-sm'>Zip Code:</span>
              <p className='font-medium'>{value.zipCode || '-'}</p>
            </div>
            <div>
              <span className='text-muted-foreground text-sm'>Country:</span>
              <p className='font-medium'>{value.country || '-'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
