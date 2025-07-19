import { Control, FieldErrors } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface RentalApplicationFormProps {
  control: Control<any>
  errors: FieldErrors<any>
  watch: (name: string) => any
}

export function RentalApplicationForm({ 
  control, 
  errors: _errors,
  watch
}: RentalApplicationFormProps) {
  const applicationEnabled = watch('rentalApplicationForm.enable')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rental Application</CardTitle>
        <CardDescription>
          Configure online rental application settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="rentalApplicationForm.enable"
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
                  Enable Online Application
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {applicationEnabled && (
          <>
            <FormField
              control={control}
              name="rentalApplicationForm.url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application URL</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://example.com/apply"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="rentalApplicationForm.fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Fee</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="rentalApplicationForm.instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide instructions for completing the rental application (e.g., required documents, processing time, etc.)"
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}