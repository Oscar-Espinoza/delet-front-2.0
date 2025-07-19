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
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield } from 'lucide-react'

interface IdVerificationFormProps {
  control: Control<any>
  errors: FieldErrors<any>
  watch: (name: string) => any
}

const verificationProfiles = [
  { value: 'none', label: 'No Verification', description: 'No ID verification required' },
  { value: 'basic', label: 'Basic Verification', description: 'Front and back of ID' },
  { value: 'enhanced', label: 'Enhanced Verification', description: 'ID plus facial recognition' },
]

export function IdVerificationForm({ 
  control, 
  errors: _errors,
  watch
}: IdVerificationFormProps) {
  const verificationActive = watch('idVerification.active')
  const verificationProfile = watch('idVerification.profile')

  return (
    <Card>
      <CardHeader>
        <CardTitle>ID Verification</CardTitle>
        <CardDescription>
          Configure identity verification requirements for property access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
          name="idVerification.active"
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
                  Enable ID Verification
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {verificationActive && (
          <>
            <FormField
              control={control}
              name="idVerification.profile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Level</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value || 'none'}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select verification level" />
                      </SelectTrigger>
                      <SelectContent>
                        {verificationProfiles.map((profile) => (
                          <SelectItem key={profile.value} value={profile.value}>
                            <div>
                              <div className="font-medium">{profile.label}</div>
                              <div className="text-sm text-muted-foreground">
                                {profile.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {verificationProfile !== 'none' && (
              <>
                <FormField
                  control={control}
                  name="idVerification.frontbackID"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value !== false}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Require Front and Back of ID
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {verificationProfile === 'enhanced' && (
                  <FormField
                    control={control}
                    name="idVerification.requireFace"
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
                            Require Facial Recognition
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                )}

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    ID verification helps ensure secure property access and validates visitor identity.
                  </AlertDescription>
                </Alert>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}