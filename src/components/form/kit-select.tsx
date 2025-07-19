import { Control, FieldErrors } from 'react-hook-form'
import { useKits } from '@/features/kits/api'
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
import { Kit } from '@/features/kits/types'
import { Loader2 } from 'lucide-react'

interface KitSelectProps {
  control: Control<any>
  errors: FieldErrors<any>
  company?: string
  required?: boolean
  disabled?: boolean
}

export default function KitSelect({
  control,
  errors: _errors,
  company,
  required = false,
  disabled = false,
}: KitSelectProps) {
  const { data: kits = [], isLoading } = useKits(company ? { company } : undefined)

  // Format kit display text
  const formatKitDisplay = (kit: Kit) => {
    if (kit.property) {
      const address = [
        kit.property.shortAddress,
        kit.property.unit,
        kit.property.city,
        kit.property.state,
      ]
        .filter(Boolean)
        .join(', ')
      return `${kit.name} - ${address}`
    }
    return `${kit.name} - Available`
  }

  return (
    <FormField
      control={control}
      name="kit"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Kit{required && <span className="text-destructive"> *</span>}
          </FormLabel>
          <FormControl>
            <Select
              onValueChange={(value) => field.onChange(value === 'none' ? null : value)}
              value={field.value || (!required ? 'none' : undefined)}
              disabled={disabled || isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading kits..." : "Select a kit"}>
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {!required && (
                  <SelectItem value="none">
                    <span className="text-muted-foreground">None</span>
                  </SelectItem>
                )}
                {kits.map((kit) => (
                  <SelectItem key={kit._id} value={kit._id}>
                    {formatKitDisplay(kit)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}