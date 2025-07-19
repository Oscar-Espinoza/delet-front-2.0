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

interface PropertyAccessCodesFormProps {
  control: Control<any>
  errors: FieldErrors<any>
  watch: (name: string) => any
}

export function PropertyAccessCodesForm({ 
  control, 
  errors: _errors,
  watch
}: PropertyAccessCodesFormProps) {
  const accessCodesEnabled = watch('propertyAccessCodes.enable')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Access Codes</CardTitle>
        <CardDescription>
          Configure building and elevator access codes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="propertyAccessCodes.enable"
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
                  Enable Access Codes
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {accessCodesEnabled && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={control}
                name="propertyAccessCodes.buildingCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Building Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., #1234"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="propertyAccessCodes.elevatorCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Elevator Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 5678"
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
              name="propertyAccessCodes.instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Access Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed instructions for accessing the property (e.g., gate codes, lockbox location, parking instructions, etc.)"
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