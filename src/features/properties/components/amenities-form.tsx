import { Control, FieldErrors } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AmenitiesFormProps {
  control: Control<any>
  errors: FieldErrors<any>
  watch: (name: string) => any
}

const floorPlanHighlightOptions = [
  'Open Floor Plan',
  'High Ceilings',
  'Hardwood Floors',
  'Carpet',
  'Tile Floors',
  'Crown Molding',
  'Built-in Storage',
  'Walk-in Closet',
  'Bay Windows',
  'Skylights',
  'Fireplace',
  'Balcony',
  'Patio',
  'Deck',
]

const kitchenFeatureOptions = [
  'Granite Countertops',
  'Stainless Steel Appliances',
  'Dishwasher',
  'Garbage Disposal',
  'Microwave',
  'Gas Stove',
  'Electric Stove',
  'Island',
  'Breakfast Bar',
  'Pantry',
  'Wine Cooler',
  'Double Oven',
  'Ice Maker',
  'Water Filter',
]

const buildingFeatureOptions = [
  'Elevator',
  'Doorman',
  'Concierge',
  'Gym/Fitness Center',
  'Pool',
  'Hot Tub',
  'Sauna',
  'Rooftop Access',
  'Bike Storage',
  'Storage Unit',
  'Laundry In Unit',
  'Laundry In Building',
  'Security System',
  'Controlled Access',
  'Package Room',
  'Business Center',
  'Community Room',
  'Playground',
  'Dog Park',
  'BBQ Area',
]

export function AmenitiesForm({ control, errors: _errors, watch }: AmenitiesFormProps) {
  const floorPlanHighlights = watch('amenitiesAndFeatures.floorPlanHighlights') || []
  const kitchenFeatures = watch('amenitiesAndFeatures.kitchenFeatures') || []
  const buildingFeatures = watch('amenitiesAndFeatures.buildingFeatures') || []

  const handleCheckboxChange = (
    _fieldName: string,
    currentValues: string[],
    value: string,
    checked: boolean,
    onChange: (values: string[]) => void
  ) => {
    if (checked) {
      onChange([...currentValues, value])
    } else {
      onChange(currentValues.filter((v: string) => v !== value))
    }
  }

  return (
    <div className="space-y-6">
      {/* Floor Plan Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Floor Plan Highlights</CardTitle>
          <CardDescription>
            Select features that highlight the property layout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="amenitiesAndFeatures.floorPlanHighlights"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {floorPlanHighlightOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        checked={floorPlanHighlights.includes(option)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            'floorPlanHighlights',
                            floorPlanHighlights,
                            option,
                            checked as boolean,
                            field.onChange
                          )
                        }
                      />
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {floorPlanHighlights.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {floorPlanHighlights.map((feature: string) => (
                <Badge key={feature} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Kitchen Features */}
      <Card>
        <CardHeader>
          <CardTitle>Kitchen Features</CardTitle>
          <CardDescription>
            Select available kitchen amenities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="amenitiesAndFeatures.kitchenFeatures"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {kitchenFeatureOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        checked={kitchenFeatures.includes(option)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            'kitchenFeatures',
                            kitchenFeatures,
                            option,
                            checked as boolean,
                            field.onChange
                          )
                        }
                      />
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {kitchenFeatures.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {kitchenFeatures.map((feature: string) => (
                <Badge key={feature} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Building Features */}
      <Card>
        <CardHeader>
          <CardTitle>Building Features</CardTitle>
          <CardDescription>
            Select building and community amenities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="amenitiesAndFeatures.buildingFeatures"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {buildingFeatureOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        checked={buildingFeatures.includes(option)}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            'buildingFeatures',
                            buildingFeatures,
                            option,
                            checked as boolean,
                            field.onChange
                          )
                        }
                      />
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {buildingFeatures.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {buildingFeatures.map((feature: string) => (
                <Badge key={feature} variant="secondary">
                  {feature}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}