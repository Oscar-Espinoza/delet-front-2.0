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
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface UtilitiesFormProps {
  control: Control<any>
  errors: FieldErrors<any>
}

const utilities = [
  { key: 'water', label: 'Water' },
  { key: 'electricity', label: 'Electricity' },
  { key: 'gas', label: 'Gas' },
  { key: 'trash', label: 'Trash' },
  { key: 'sewage', label: 'Sewage' },
]

const responsibilityOptions = [
  { value: 'tenant', label: 'Tenant' },
  { value: 'landlord', label: 'Landlord' },
  { value: 'shared', label: 'Shared' },
]

export function UtilitiesForm({ control, errors: _errors }: UtilitiesFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilities</CardTitle>
        <CardDescription>
          Specify who is responsible for each utility
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {utilities.map((utility) => (
            <FormField
              key={utility.key}
              control={control}
              name={`utilities.${utility.key}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{utility.label}</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value || 'tenant'}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select responsibility" />
                      </SelectTrigger>
                      <SelectContent>
                        {responsibilityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <FormField
          control={control}
          name="utilities.notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information about utilities..."
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