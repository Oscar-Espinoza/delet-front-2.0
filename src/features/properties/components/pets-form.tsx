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
import { Separator } from '@/components/ui/separator'

interface PetsFormProps {
  control: Control<any>
  errors: FieldErrors<any>
  watch: (name: string) => any
}

export function PetsForm({ control, errors: _errors, watch }: PetsFormProps) {
  const petsAllowed = watch('pets.allowed')
  const dogsAllowed = watch('pets.dogs.allowed')
  const catsAllowed = watch('pets.cats.allowed')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pet Policy</CardTitle>
        <CardDescription>
          Configure pet policies and restrictions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
          name="pets.allowed"
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
                  Pets Allowed
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {petsAllowed && (
          <>
            <Separator />
            
            {/* Dogs Section */}
            <div className="space-y-4">
              <FormField
                control={control}
                name="pets.dogs.allowed"
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
                        Dogs Allowed
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {dogsAllowed && (
                <div className="grid gap-4 sm:grid-cols-2 ml-6">
                  <FormField
                    control={control}
                    name="pets.dogs.weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Weight (lbs)</FormLabel>
                        <FormControl>
                          <Input
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
                    name="pets.dogs.maxAllowed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Number Allowed</FormLabel>
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
                </div>
              )}
            </div>

            <Separator />

            {/* Cats Section */}
            <div className="space-y-4">
              <FormField
                control={control}
                name="pets.cats.allowed"
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
                        Cats Allowed
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {catsAllowed && (
                <div className="grid gap-4 sm:grid-cols-2 ml-6">
                  <FormField
                    control={control}
                    name="pets.cats.weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Weight (lbs)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., 20"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="pets.cats.maxAllowed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Number Allowed</FormLabel>
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
                </div>
              )}
            </div>

            <Separator />

            {/* Pet Fees */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={control}
                name="pets.deposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet Deposit</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="pets.monthlyPetRent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Pet Rent</FormLabel>
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
            </div>

            <FormField
              control={control}
              name="pets.notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet Policy Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional pet policy information (e.g., breed restrictions, registration requirements, etc.)"
                      className="resize-none"
                      rows={3}
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