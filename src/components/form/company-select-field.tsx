import { Control, FieldErrors } from 'react-hook-form'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { CompanySelect } from './company-select'

interface CompanySelectFieldProps {
  control: Control<any>
  errors: FieldErrors<any>
  required?: boolean
  disabled?: boolean
}

export default function CompanySelectField({
  control,
  errors: _errors,
  required = false,
  disabled = false,
}: CompanySelectFieldProps) {
  return (
    <FormField
      control={control}
      name="company"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Company{required && <span className="text-destructive"> *</span>}
          </FormLabel>
          <FormControl>
            <CompanySelect
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Select a company"
              includeNone={!required}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}