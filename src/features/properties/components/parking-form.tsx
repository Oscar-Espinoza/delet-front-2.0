import { Control, FieldErrors } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getParkingTypeLabel, PARKING_TYPE } from '../types'

interface ParkingFormProps {
  control: Control<any>
  errors: FieldErrors<any>
}

export function ParkingForm({ control, errors: _errors }: ParkingFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parking</CardTitle>
        <CardDescription>
          Configure parking options and availability
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="parking.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parking Type</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value || 'streetStandard'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select parking type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(PARKING_TYPE).map((type) => (
                      <SelectItem key={type} value={type}>
                        {getParkingTypeLabel(type)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={control}
            name="parking.spacesNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Spaces</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 2"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="parking.monthlyCostPerSpace"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Cost per Space</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 150"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="parking.included"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Parking Included in Rent
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="parking.notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parking Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional parking information (e.g., tandem parking details, restrictions, etc.)"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  )
}